use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::errors::CrowdShieldError;
use crate::state::{Cover, CoverPool, CoverType, Event, Ticket};

#[derive(Accounts)]
#[instruction(cover_type: CoverType)]
pub struct BuyCover<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub event: Account<'info, Event>,

    #[account(
        mut,
        seeds = [b"pool", event.key().as_ref()],
        bump = cover_pool.bump,
    )]
    pub cover_pool: Account<'info, CoverPool>,

    /// Buyer must hold a valid ticket for this event
    #[account(
        seeds = [
            b"ticket",
            event.key().as_ref(),
            ticket.ticket_id.to_le_bytes().as_ref(),
        ],
        bump = ticket.bump,
        constraint = ticket.owner == buyer.key(),
        constraint = ticket.event == event.key(),
    )]
    pub ticket: Account<'info, Ticket>,

    /// Cover PDA seeded by pool + buyer + cover_type byte
    #[account(
        init,
        payer = buyer,
        space = 8 + Cover::INIT_SPACE,
        seeds = [
            b"cover",
            cover_pool.key().as_ref(),
            buyer.key().as_ref(),
            &[cover_type_to_u8(&cover_type)],
        ],
        bump,
    )]
    pub cover: Account<'info, Cover>,

    /// Pool vault receives premium
    #[account(
        mut,
        seeds = [b"pool_vault", event.key().as_ref()],
        bump,
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    /// Buyer's USDC account
    #[account(
        mut,
        constraint = buyer_usdc.owner == buyer.key(),
    )]
    pub buyer_usdc: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

/// Convert CoverType to a u8 for PDA seed
pub fn cover_type_to_u8(ct: &CoverType) -> u8 {
    match ct {
        CoverType::Cancellation => 0,
        CoverType::DelayOver2Hours => 1,
        CoverType::HeadlinerChanged => 2,
        CoverType::WeatherRain => 3,
        CoverType::VenueChanged => 4,
    }
}

/// Calculate premium using bonding curve
/// premium = base_rate * payout_amount * controversy_mult * demand_curve * time_decay
///
/// All math done in fixed-point with 1e6 precision to avoid floats.
fn calculate_premium(
    cover_type: &CoverType,
    payout_amount: u64,
    controversy_score: u8,
    covers_sold: u32,
    max_tickets: u32,
    event_date: i64,
    now: i64,
) -> u64 {
    // Precision multiplier (1e6)
    let precision: u128 = 1_000_000;

    // base_rate * 1e6
    let base_rate: u128 = match cover_type {
        CoverType::Cancellation => 30_000,     // 0.03 * 1e6
        CoverType::DelayOver2Hours => 15_000,  // 0.015 * 1e6
        _ => 20_000,                           // 0.02 * 1e6
    };

    // controversy_mult = 1 + (score/100)^2
    // In fixed point: precision + (score^2 * precision / 10000)
    let score = controversy_score as u128;
    let controversy_mult = precision + (score * score * precision / 10_000);

    // demand_curve = 1 + (covers_sold / max_tickets)^3
    // In fixed point: precision + (sold^3 * precision / tickets^3)
    let sold = covers_sold as u128;
    let tickets = std::cmp::max(max_tickets as u128, 1);
    let demand_curve = precision + (sold * sold * sold * precision / (tickets * tickets * tickets));

    // time_decay = 1 + 1/sqrt(days_to_event)
    // days_to_event = max((event_date - now) / 86400, 1)
    let days_to_event = std::cmp::max((event_date - now) / 86400, 1) as u128;
    // isqrt approximation: integer sqrt
    let sqrt_days = isqrt(days_to_event * precision * precision); // sqrt(days * 1e12) for precision
    let time_decay = if sqrt_days > 0 {
        precision + (precision * precision / sqrt_days)
    } else {
        precision * 2 // fallback: 2x
    };

    // premium = payout * base_rate * controversy * demand * time_decay / precision^4
    // (each factor has one precision multiplied in)
    let payout = payout_amount as u128;
    let premium = payout
        .checked_mul(base_rate).unwrap()
        .checked_mul(controversy_mult).unwrap()
        .checked_mul(demand_curve).unwrap()
        .checked_mul(time_decay).unwrap()
        / (precision * precision * precision * precision);

    // Minimum premium: 1000 lamports (0.001 USDC)
    std::cmp::max(premium as u64, 1_000)
}

/// Integer square root (Newton's method)
fn isqrt(n: u128) -> u128 {
    if n == 0 {
        return 0;
    }
    let mut x = n;
    let mut y = (x + 1) / 2;
    while y < x {
        x = y;
        y = (x + n / x) / 2;
    }
    x
}

pub fn buy_cover(
    ctx: Context<BuyCover>,
    cover_type: CoverType,
    payout_amount: u64,
) -> Result<()> {
    let event = &ctx.accounts.event;
    let pool = &mut ctx.accounts.cover_pool;

    // Check pool capacity
    let new_exposure = pool.total_exposure.checked_add(payout_amount).unwrap();
    require!(
        new_exposure <= pool.pool_capacity,
        CrowdShieldError::PoolCapacityExceeded
    );

    let now = Clock::get()?.unix_timestamp;

    // Calculate premium via bonding curve
    let premium = calculate_premium(
        &cover_type,
        payout_amount,
        event.controversy_score,
        pool.covers_sold,
        event.max_tickets,
        event.event_date,
        now,
    );

    // Transfer premium from buyer to pool vault
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.buyer_usdc.to_account_info(),
                to: ctx.accounts.pool_vault.to_account_info(),
                authority: ctx.accounts.buyer.to_account_info(),
            },
        ),
        premium,
    )?;

    // Init cover
    let cover = &mut ctx.accounts.cover;
    cover.owner = ctx.accounts.buyer.key();
    cover.event = event.key();
    cover.cover_type = cover_type;
    cover.premium_paid = premium;
    cover.payout_amount = payout_amount;
    cover.is_resolved = false;
    cover.outcome = false;
    cover.is_claimed = false;
    cover.purchased_at = now;
    cover.bump = ctx.bumps.cover;

    // Update pool
    pool.covers_sold = pool.covers_sold.checked_add(1).unwrap();
    pool.total_premiums = pool.total_premiums.checked_add(premium).unwrap();
    pool.total_exposure = new_exposure;

    msg!(
        "Cover purchased: premium={} payout={} type={:?}",
        premium,
        payout_amount,
        cover.cover_type,
    );
    Ok(())
}
