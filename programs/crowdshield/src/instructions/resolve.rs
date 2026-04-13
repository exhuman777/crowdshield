use anchor_lang::prelude::*;

use crate::errors::CrowdShieldError;
use crate::state::{Cover, CoverType, Event};

#[derive(Accounts)]
#[instruction(cover_type: CoverType, outcome: bool)]
pub struct Resolve<'info> {
    /// Authority (organizer or oracle) resolving the cover
    pub authority: Signer<'info>,

    #[account(
        mut,
        constraint = event.authority == authority.key() @ CrowdShieldError::Unauthorized,
    )]
    pub event: Account<'info, Event>,

    /// Cover to resolve
    #[account(
        mut,
        constraint = cover.event == event.key(),
        constraint = !cover.is_resolved @ CrowdShieldError::EventAlreadyResolved,
    )]
    pub cover: Account<'info, Cover>,
}

pub fn resolve(
    ctx: Context<Resolve>,
    _cover_type: CoverType,
    outcome: bool,
) -> Result<()> {
    let cover = &mut ctx.accounts.cover;

    cover.is_resolved = true;
    cover.outcome = outcome;

    // Mark event as resolved (simplified: once any cover resolves, event marked)
    let event = &mut ctx.accounts.event;
    event.is_resolved = true;

    msg!(
        "Cover resolved: type={:?} outcome={}",
        cover.cover_type,
        if outcome { "YES" } else { "NO" },
    );
    Ok(())
}
