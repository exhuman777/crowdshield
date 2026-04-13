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
    /// Bitmask of resolved cover types (bit 0=Cancellation, 1=Delay, 2=Headliner, 3=Weather, 4=Venue)
    pub resolved_mask: u8,
    /// Bitmask of cover types resolved YES (same bit layout)
    pub outcome_mask: u8,
    /// PDA bump
    pub bump: u8,
}

impl Event {
    pub fn is_cover_type_resolved(&self, ct: &CoverType) -> bool {
        self.resolved_mask & (1 << cover_type_index(ct)) != 0
    }

    pub fn cover_type_outcome(&self, ct: &CoverType) -> bool {
        self.outcome_mask & (1 << cover_type_index(ct)) != 0
    }

    pub fn resolve_cover_type(&mut self, ct: &CoverType, outcome: bool) {
        let bit = 1 << cover_type_index(ct);
        self.resolved_mask |= bit;
        if outcome {
            self.outcome_mask |= bit;
        }
    }

    /// All 5 cover types resolved
    pub fn is_fully_resolved(&self) -> bool {
        self.resolved_mask == 0b11111
    }
}

pub fn cover_type_index(ct: &CoverType) -> u8 {
    match ct {
        CoverType::Cancellation => 0,
        CoverType::DelayOver2Hours => 1,
        CoverType::HeadlinerChanged => 2,
        CoverType::WeatherRain => 3,
        CoverType::VenueChanged => 4,
    }
}

#[account]
#[derive(InitSpace)]
pub struct CoverPool {
    /// Event this pool covers
    pub event: Pubkey,
    /// Total USDC in pool (deposits + premiums)
    pub total_liquidity: u64,
    /// Sum of all LP original deposits (for pro-rata withdrawal calc)
    pub total_deposits: u64,
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
    /// Amount deposited in USDC (tracks original deposits for pro-rata share)
    pub deposited: u64,
    /// PDA bump
    pub bump: u8,
}
