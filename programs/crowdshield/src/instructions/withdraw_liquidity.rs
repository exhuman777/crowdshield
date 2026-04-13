use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::errors::CrowdShieldError;
use crate::state::{CoverPool, Event, LpPosition};

#[derive(Accounts)]
pub struct WithdrawLiquidity<'info> {
    #[account(mut)]
    pub lp: Signer<'info>,

    /// Event must be fully resolved (all cover types) before LP withdrawal
    #[account(
        constraint = event.is_fully_resolved() @ CrowdShieldError::EventNotResolved,
    )]
    pub event: Account<'info, Event>,

    #[account(
        mut,
        seeds = [b"pool", event.key().as_ref()],
        bump = cover_pool.bump,
    )]
    pub cover_pool: Account<'info, CoverPool>,

    #[account(
        mut,
        seeds = [b"lp_position", cover_pool.key().as_ref(), lp.key().as_ref()],
        bump = lp_position.bump,
        constraint = lp_position.owner == lp.key() @ CrowdShieldError::Unauthorized,
        constraint = lp_position.deposited > 0 @ CrowdShieldError::InsufficientLiquidity,
    )]
    pub lp_position: Account<'info, LpPosition>,

    /// Pool vault, source of withdrawal
    #[account(
        mut,
        seeds = [b"pool_vault", event.key().as_ref()],
        bump,
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    /// Pool vault authority PDA
    /// CHECK: PDA derived from seeds, no data
    #[account(
        seeds = [b"pool_authority", event.key().as_ref()],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    /// LP's USDC account
    #[account(
        mut,
        constraint = lp_usdc.owner == lp.key(),
    )]
    pub lp_usdc: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn withdraw_liquidity(ctx: Context<WithdrawLiquidity>) -> Result<()> {
    let pool = &ctx.accounts.cover_pool;
    let pos = &ctx.accounts.lp_position;

    // Pro-rata share: (lp_deposited / total_deposits) * vault_balance
    // This correctly distributes premiums earned AND losses from payouts
    let vault_balance = ctx.accounts.pool_vault.amount;
    let withdraw_amount = (vault_balance as u128)
        .checked_mul(pos.deposited as u128)
        .unwrap()
        .checked_div(pool.total_deposits as u128)
        .unwrap() as u64;

    require!(withdraw_amount > 0, CrowdShieldError::InsufficientLiquidity);

    // Transfer from pool vault to LP
    let event_key = ctx.accounts.event.key();
    let seeds = &[
        b"pool_authority".as_ref(),
        event_key.as_ref(),
        &[ctx.bumps.pool_authority],
    ];
    let signer_seeds = &[&seeds[..]];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.pool_vault.to_account_info(),
                to: ctx.accounts.lp_usdc.to_account_info(),
                authority: ctx.accounts.pool_authority.to_account_info(),
            },
            signer_seeds,
        ),
        withdraw_amount,
    )?;

    // Update pool state
    let pool = &mut ctx.accounts.cover_pool;
    pool.total_liquidity = pool.total_liquidity.saturating_sub(withdraw_amount);
    pool.total_deposits = pool.total_deposits.saturating_sub(pos.deposited);
    pool.pool_capacity = (pool.total_liquidity as u128)
        .checked_mul(pool.max_coverage_ratio as u128)
        .unwrap()
        .checked_div(100)
        .unwrap() as u64;

    // Zero out LP position
    let pos = &mut ctx.accounts.lp_position;
    pos.deposited = 0;

    msg!("LP withdrew {} USDC", withdraw_amount);
    Ok(())
}
