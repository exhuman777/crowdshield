use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::errors::CrowdShieldError;
use crate::state::{Cover, CoverPool, Event};

#[derive(Accounts)]
pub struct ClaimPayout<'info> {
    #[account(mut)]
    pub claimant: Signer<'info>,

    pub event: Account<'info, Event>,

    #[account(
        mut,
        seeds = [b"pool", event.key().as_ref()],
        bump = cover_pool.bump,
    )]
    pub cover_pool: Account<'info, CoverPool>,

    #[account(
        mut,
        constraint = cover.owner == claimant.key() @ CrowdShieldError::Unauthorized,
        constraint = cover.is_resolved @ CrowdShieldError::EventNotResolved,
        constraint = cover.outcome @ CrowdShieldError::CoverNotWon,
        constraint = !cover.is_claimed @ CrowdShieldError::AlreadyClaimed,
    )]
    pub cover: Account<'info, Cover>,

    /// Pool vault — source of payout
    #[account(
        mut,
        seeds = [b"pool_vault", event.key().as_ref()],
        bump,
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    /// Pool vault authority PDA (signs the transfer)
    /// CHECK: PDA derived from seeds, no data
    #[account(
        seeds = [b"pool_authority", event.key().as_ref()],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    /// Claimant's USDC account
    #[account(
        mut,
        constraint = claimant_usdc.owner == claimant.key(),
    )]
    pub claimant_usdc: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn claim_payout(ctx: Context<ClaimPayout>) -> Result<()> {
    let cover = &mut ctx.accounts.cover;
    let payout = cover.payout_amount;

    // Transfer payout from pool vault to claimant
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
                to: ctx.accounts.claimant_usdc.to_account_info(),
                authority: ctx.accounts.pool_authority.to_account_info(),
            },
            signer_seeds,
        ),
        payout,
    )?;

    // Mark claimed
    cover.is_claimed = true;

    // Reduce pool exposure
    let pool = &mut ctx.accounts.cover_pool;
    pool.total_exposure = pool.total_exposure.saturating_sub(payout);

    msg!("Payout claimed: {} USDC", payout);
    Ok(())
}
