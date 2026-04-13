use anchor_lang::prelude::*;

use crate::errors::CrowdShieldError;
use crate::state::Event;

#[derive(Accounts)]
pub struct UpdateControversy<'info> {
    /// Authority (organizer or oracle)
    pub authority: Signer<'info>,

    #[account(
        mut,
        constraint = event.authority == authority.key() @ CrowdShieldError::Unauthorized,
    )]
    pub event: Account<'info, Event>,
}

pub fn update_controversy(ctx: Context<UpdateControversy>, new_score: u8) -> Result<()> {
    require!(new_score <= 100, CrowdShieldError::InvalidControversyScore);

    let event = &mut ctx.accounts.event;
    let old_score = event.controversy_score;
    event.controversy_score = new_score;

    msg!("Controversy score updated: {} -> {}", old_score, new_score);
    Ok(())
}
