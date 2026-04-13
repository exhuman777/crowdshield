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
        constraint = !event.is_cover_type_resolved(&cover_type) @ CrowdShieldError::EventAlreadyResolved,
    )]
    pub event: Account<'info, Event>,

    /// Cover to resolve
    #[account(
        mut,
        constraint = cover.event == event.key(),
        constraint = !cover.is_resolved @ CrowdShieldError::EventAlreadyResolved,
        constraint = cover.cover_type == cover_type,
    )]
    pub cover: Account<'info, Cover>,
}

pub fn resolve(
    ctx: Context<Resolve>,
    cover_type: CoverType,
    outcome: bool,
) -> Result<()> {
    let cover = &mut ctx.accounts.cover;

    cover.is_resolved = true;
    cover.outcome = outcome;

    // Mark this specific cover type as resolved on the event
    let event = &mut ctx.accounts.event;
    event.resolve_cover_type(&cover_type, outcome);

    msg!(
        "Cover resolved: type={:?} outcome={} | event resolved_mask={}",
        cover.cover_type,
        if outcome { "YES" } else { "NO" },
        event.resolved_mask,
    );
    Ok(())
}
