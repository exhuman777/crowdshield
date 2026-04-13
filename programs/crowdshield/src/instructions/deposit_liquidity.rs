use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{CoverPool, Event, LpPosition};

#[derive(Accounts)]
pub struct DepositLiquidity<'info> {
    #[account(mut)]
    pub lp: Signer<'info>,

    pub event: Account<'info, Event>,

    #[account(
        mut,
        seeds = [b"pool", event.key().as_ref()],
        bump = cover_pool.bump,
    )]
    pub cover_pool: Account<'info, CoverPool>,

    /// LP position PDA — one per LP per pool
    #[account(
        init_if_needed,
        payer = lp,
        space = 8 + LpPosition::INIT_SPACE,
        seeds = [b"lp_position", cover_pool.key().as_ref(), lp.key().as_ref()],
        bump,
    )]
    pub lp_position: Account<'info, LpPosition>,

    /// Pool vault holds LP deposits + premiums
    #[account(
        mut,
        seeds = [b"pool_vault", event.key().as_ref()],
        bump,
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    /// LP's USDC token account
    #[account(
        mut,
        constraint = lp_usdc.owner == lp.key(),
    )]
    pub lp_usdc: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn deposit_liquidity(ctx: Context<DepositLiquidity>, amount: u64) -> Result<()> {
    let pool = &mut ctx.accounts.cover_pool;
    let pos = &mut ctx.accounts.lp_position;

    // Transfer USDC from LP to pool vault
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.lp_usdc.to_account_info(),
                to: ctx.accounts.pool_vault.to_account_info(),
                authority: ctx.accounts.lp.to_account_info(),
            },
        ),
        amount,
    )?;

    // Calculate share in basis points
    // New total after deposit
    let new_total = pool.total_liquidity.checked_add(amount).unwrap();

    if pool.total_liquidity == 0 {
        // First depositor gets 10000 bps (100%)
        pos.share_bps = 10_000;
    } else {
        // Recalculate all shares proportionally
        // This LP's new share = (their total deposit / new pool total) * 10000
        let lp_total = pos.deposited.checked_add(amount).unwrap();
        pos.share_bps = ((lp_total as u128)
            .checked_mul(10_000)
            .unwrap()
            .checked_div(new_total as u128)
            .unwrap()) as u16;
    }

    // Update LP position
    pos.owner = ctx.accounts.lp.key();
    pos.pool = pool.key();
    pos.deposited = pos.deposited.checked_add(amount).unwrap();
    pos.bump = ctx.bumps.lp_position;

    // Update pool
    pool.total_liquidity = new_total;
    pool.pool_capacity = (new_total as u128)
        .checked_mul(pool.max_coverage_ratio as u128)
        .unwrap()
        .checked_div(100)
        .unwrap() as u64;

    msg!(
        "LP deposited {} USDC | pool total: {} | capacity: {}",
        amount,
        pool.total_liquidity,
        pool.pool_capacity,
    );
    Ok(())
}
