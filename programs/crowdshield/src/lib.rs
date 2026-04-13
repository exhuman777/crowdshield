use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;
use state::CoverType;

declare_id!("CShd1111111111111111111111111111111111111111");

#[program]
pub mod crowdshield {
    use super::*;

    /// Create a new event with organizer bond
    pub fn create_event(
        ctx: Context<CreateEvent>,
        name: String,
        event_date: i64,
        ticket_price: u64,
        max_tickets: u32,
        bond_amount: u64,
    ) -> Result<()> {
        instructions::create_event::create_event(
            ctx,
            name,
            event_date,
            ticket_price,
            max_tickets,
            bond_amount,
        )
    }

    /// LP deposits USDC into cover pool
    pub fn deposit_liquidity(ctx: Context<DepositLiquidity>, amount: u64) -> Result<()> {
        instructions::deposit_liquidity::deposit_liquidity(ctx, amount)
    }

    /// Fan buys a ticket (cNFT placeholder, PDA for MVP)
    pub fn mint_ticket(ctx: Context<MintTicket>) -> Result<()> {
        instructions::mint_ticket::mint_ticket(ctx)
    }

    /// Fan buys cover protection — requires valid ticket
    pub fn buy_cover(
        ctx: Context<BuyCover>,
        cover_type: CoverType,
        payout_amount: u64,
    ) -> Result<()> {
        instructions::buy_cover::buy_cover(ctx, cover_type, payout_amount)
    }

    /// Authority resolves a cover type for an event
    pub fn resolve(
        ctx: Context<Resolve>,
        cover_type: CoverType,
        outcome: bool,
    ) -> Result<()> {
        instructions::resolve::resolve(ctx, cover_type, outcome)
    }

    /// Cover holder claims payout after YES resolution
    pub fn claim_payout(ctx: Context<ClaimPayout>) -> Result<()> {
        instructions::claim_payout::claim_payout(ctx)
    }

    /// Authority updates event controversy score (0-100)
    pub fn update_controversy(ctx: Context<UpdateControversy>, new_score: u8) -> Result<()> {
        instructions::update_controversy::update_controversy(ctx, new_score)
    }

    /// LP withdraws share after event resolution
    pub fn withdraw_liquidity(ctx: Context<WithdrawLiquidity>) -> Result<()> {
        instructions::withdraw_liquidity::withdraw_liquidity(ctx)
    }

    /// Organizer claims bond back (or gets slashed)
    pub fn claim_bond(ctx: Context<ClaimBond>, cancellation_resolved_yes: bool) -> Result<()> {
        instructions::claim_bond::claim_bond(ctx, cancellation_resolved_yes)
    }
}
