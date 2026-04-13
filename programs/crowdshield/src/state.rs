use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Event {
    /// Organizer who created the event
    pub authority: Pubkey,
    /// Event name (max 64 chars)
    #[max_len(64)]
    pub name: String,
    /// Unix timestamp of event date
    pub event_date: i64,
    /// Ticket price in USDC (6 decimals)
    pub ticket_price: u64,
    /// Number of tickets sold so far
    pub tickets_sold: u32,
    /// Maximum tickets available
    pub max_tickets: u32,
    /// Organizer's staked bond in USDC
    pub bond_amount: u64,
    /// Controversy score 0-100, set by authority/oracle
    pub controversy_score: u8,
    /// Whether the event has been resolved
    pub is_resolved: bool,
    /// PDA bump
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct CoverPool {
    /// Event this pool covers
    pub event: Pubkey,
    /// Total USDC deposited by LPs
    pub total_liquidity: u64,
    /// Total premiums collected from cover sales
    pub total_premiums: u64,
    /// Number of covers sold
    pub covers_sold: u32,
    /// Max % of pool allocatable (e.g. 80)
    pub max_coverage_ratio: u8,
    /// total_liquidity * max_coverage_ratio / 100
    pub pool_capacity: u64,
    /// Sum of all outstanding cover payout amounts
    pub total_exposure: u64,
    /// PDA bump
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq, InitSpace)]
pub enum CoverType {
    Cancellation,
    DelayOver2Hours,
    HeadlinerChanged,
    WeatherRain,
    VenueChanged,
}

#[account]
#[derive(InitSpace)]
pub struct Cover {
    /// Cover holder
    pub owner: Pubkey,
    /// Event this cover protects against
    pub event: Pubkey,
    /// Type of risk covered
    pub cover_type: CoverType,
    /// Premium paid by fan in USDC
    pub premium_paid: u64,
    /// Payout if resolved YES
    pub payout_amount: u64,
    /// Whether this cover has been resolved
    pub is_resolved: bool,
    /// Resolution outcome: true = YES (payout), false = NO
    pub outcome: bool,
    /// Whether payout has been claimed
    pub is_claimed: bool,
    /// Timestamp of purchase
    pub purchased_at: i64,
    /// PDA bump
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Ticket {
    /// Ticket holder
    pub owner: Pubkey,
    /// Event this ticket belongs to
    pub event: Pubkey,
    /// Sequential ticket ID
    pub ticket_id: u32,
    /// Timestamp of purchase
    pub purchased_at: i64,
    /// PDA bump
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct LpPosition {
    /// LP who deposited
    pub owner: Pubkey,
    /// Pool this position belongs to
    pub pool: Pubkey,
    /// Amount deposited in USDC
    pub deposited: u64,
    /// Basis points of pool owned (0-10000)
    pub share_bps: u16,
    /// PDA bump
    pub bump: u8,
}
