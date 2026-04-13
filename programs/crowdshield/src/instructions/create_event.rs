use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::errors::CrowdShieldError;
use crate::state::{CoverPool, Event};

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateEvent<'info> {
    #[account(mut)]
    pub organizer: Signer<'info>,

    #[account(
        init,
        payer = organizer,
        space = 8 + Event::INIT_SPACE,
        seeds = [b"event", organizer.key().as_ref(), name.as_bytes()],
        bump,
    )]
    pub event: Account<'info, Event>,

    #[account(
        init,
        payer = organizer,
        space = 8 + CoverPool::INIT_SPACE,
        seeds = [b"pool", event.key().as_ref()],
        bump,
    )]
    pub cover_pool: Account<'info, CoverPool>,

    /// Bond vault PDA, holds organizer's staked bond
    #[account(
        init,
        payer = organizer,
        token::mint = usdc_mint,
        token::authority = bond_authority,
        seeds = [b"bond_vault", event.key().as_ref()],
        bump,
    )]
    pub bond_vault: Account<'info, TokenAccount>,

    /// Bond vault authority PDA
    /// CHECK: PDA derived from seeds, no data stored
    #[account(
        seeds = [b"bond_authority", event.key().as_ref()],
        bump,
    )]
    pub bond_authority: AccountInfo<'info>,

    /// Pool vault PDA, holds LP deposits + premiums
    #[account(
        init,
        payer = organizer,
        token::mint = usdc_mint,
        token::authority = pool_authority,
        seeds = [b"pool_vault", event.key().as_ref()],
        bump,
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    /// Pool vault authority PDA
    /// CHECK: PDA derived from seeds, no data stored
    #[account(
        seeds = [b"pool_authority", event.key().as_ref()],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    /// Ticket vault PDA, holds ticket revenue for organizer
    #[account(
        init,
        payer = organizer,
        token::mint = usdc_mint,
        token::authority = ticket_vault_authority,
        seeds = [b"ticket_vault", event.key().as_ref()],
        bump,
    )]
    pub ticket_vault: Account<'info, TokenAccount>,

    /// Ticket vault authority PDA
    /// CHECK: PDA derived from seeds, no data stored
    #[account(
        seeds = [b"ticket_vault_authority", event.key().as_ref()],
        bump,
    )]
    pub ticket_vault_authority: AccountInfo<'info>,

    /// Organizer's USDC token account (source of bond)
    #[account(
        mut,
        constraint = organizer_usdc.owner == organizer.key(),
        constraint = organizer_usdc.mint == usdc_mint.key(),
    )]
    pub organizer_usdc: Account<'info, TokenAccount>,

    /// USDC mint
    /// CHECK: validated by token account constraints
    pub usdc_mint: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_event(
    ctx: Context<CreateEvent>,
    name: String,
    event_date: i64,
    ticket_price: u64,
    max_tickets: u32,
    bond_amount: u64,
) -> Result<()> {
    // Min bond = 2% of gross ticket revenue
    let min_bond = (ticket_price as u128)
        .checked_mul(max_tickets as u128)
        .unwrap()
        .checked_mul(2)
        .unwrap()
        .checked_div(100)
        .unwrap() as u64;

    require!(bond_amount >= min_bond, CrowdShieldError::BondTooLow);

    // Transfer bond from organizer to vault
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.organizer_usdc.to_account_info(),
                to: ctx.accounts.bond_vault.to_account_info(),
                authority: ctx.accounts.organizer.to_account_info(),
            },
        ),
        bond_amount,
    )?;

    // Init event
    let event = &mut ctx.accounts.event;
    event.authority = ctx.accounts.organizer.key();
    event.name = name;
    event.event_date = event_date;
    event.ticket_price = ticket_price;
    event.tickets_sold = 0;
    event.max_tickets = max_tickets;
    event.bond_amount = bond_amount;
    event.controversy_score = 0;
    event.is_resolved = false;
    event.bump = ctx.bumps.event;

    // Init cover pool with 80% max coverage ratio
    let pool = &mut ctx.accounts.cover_pool;
    pool.event = event.key();
    pool.total_liquidity = 0;
    pool.total_premiums = 0;
    pool.covers_sold = 0;
    pool.max_coverage_ratio = 80;
    pool.pool_capacity = 0;
    pool.total_exposure = 0;
    pool.bump = ctx.bumps.cover_pool;

    msg!("Event created: {} | bond: {}", event.name, bond_amount);
    Ok(())
}
