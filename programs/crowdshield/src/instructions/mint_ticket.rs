use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::errors::CrowdShieldError;
use crate::state::{Event, Ticket};

#[derive(Accounts)]
pub struct MintTicket<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub event: Account<'info, Event>,

    /// Ticket PDA — seeded by event + ticket_id
    #[account(
        init,
        payer = buyer,
        space = 8 + Ticket::INIT_SPACE,
        seeds = [
            b"ticket",
            event.key().as_ref(),
            (event.tickets_sold + 1).to_le_bytes().as_ref(),
        ],
        bump,
    )]
    pub ticket: Account<'info, Ticket>,

    /// Organizer's vault receives ticket revenue
    #[account(
        mut,
        seeds = [b"ticket_vault", event.key().as_ref()],
        bump,
    )]
    pub ticket_vault: Account<'info, TokenAccount>,

    /// Buyer's USDC account
    #[account(
        mut,
        constraint = buyer_usdc.owner == buyer.key(),
    )]
    pub buyer_usdc: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn mint_ticket(ctx: Context<MintTicket>) -> Result<()> {
    let event = &mut ctx.accounts.event;

    require!(
        event.tickets_sold < event.max_tickets,
        CrowdShieldError::EventFull
    );

    // Transfer ticket price from buyer to organizer vault
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.buyer_usdc.to_account_info(),
                to: ctx.accounts.ticket_vault.to_account_info(),
                authority: ctx.accounts.buyer.to_account_info(),
            },
        ),
        event.ticket_price,
    )?;

    // Increment tickets sold
    event.tickets_sold = event.tickets_sold.checked_add(1).unwrap();

    // Init ticket
    let ticket = &mut ctx.accounts.ticket;
    ticket.owner = ctx.accounts.buyer.key();
    ticket.event = event.key();
    ticket.ticket_id = event.tickets_sold; // already incremented
    ticket.purchased_at = Clock::get()?.unix_timestamp;
    ticket.bump = ctx.bumps.ticket;

    msg!(
        "Ticket #{} minted for event {}",
        ticket.ticket_id,
        event.name
    );
    Ok(())
}
