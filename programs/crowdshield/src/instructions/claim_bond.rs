use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::errors::CrowdShieldError;
use crate::state::Event;

#[derive(Accounts)]
pub struct ClaimBond<'info> {
    #[account(mut)]
    pub organizer: Signer<'info>,

    #[account(
        constraint = event.authority == organizer.key() @ CrowdShieldError::Unauthorized,
        constraint = event.is_resolved @ CrowdShieldError::EventNotResolved,
    )]
    pub event: Account<'info, Event>,

    /// Bond vault holds organizer's staked bond
    #[account(
        mut,
        seeds = [b"bond_vault", event.key().as_ref()],
        bump,
    )]
    pub bond_vault: Account<'info, TokenAccount>,

    /// Bond vault authority PDA
    /// CHECK: PDA derived from seeds, no data
    #[account(
        seeds = [b"bond_authority", event.key().as_ref()],
        bump,
    )]
    pub bond_authority: AccountInfo<'info>,

    /// Pool vault — receives slashed bond if cancellation=YES
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

    /// Organizer's USDC account — receives returned bond
    #[account(
        mut,
        constraint = organizer_usdc.owner == organizer.key(),
    )]
    pub organizer_usdc: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn claim_bond(ctx: Context<ClaimBond>, cancellation_resolved_yes: bool) -> Result<()> {
    let event = &ctx.accounts.event;
    let bond = event.bond_amount;
    let event_key = event.key();

    let bond_seeds = &[
        b"bond_authority".as_ref(),
        event_key.as_ref(),
        &[ctx.bumps.bond_authority],
    ];
    let bond_signer = &[&bond_seeds[..]];

    if cancellation_resolved_yes {
        // Organizer caused cancellation — bond slashed to pool vault
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.bond_vault.to_account_info(),
                    to: ctx.accounts.pool_vault.to_account_info(),
                    authority: ctx.accounts.bond_authority.to_account_info(),
                },
                bond_signer,
            ),
            bond,
        )?;
        msg!("Bond slashed: {} USDC sent to cover pool", bond);
    } else {
        // No cancellation — full bond returned to organizer
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.bond_vault.to_account_info(),
                    to: ctx.accounts.organizer_usdc.to_account_info(),
                    authority: ctx.accounts.bond_authority.to_account_info(),
                },
                bond_signer,
            ),
            bond,
        )?;
        msg!("Bond returned: {} USDC to organizer", bond);
    }

    Ok(())
}
