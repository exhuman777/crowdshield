use anchor_lang::prelude::*;

#[error_code]
pub enum CrowdShieldError {
    #[msg("Event has reached max ticket capacity")]
    EventFull,

    #[msg("Pool lacks sufficient liquidity for this cover")]
    InsufficientLiquidity,

    #[msg("Cover would exceed pool capacity")]
    PoolCapacityExceeded,

    #[msg("Event has not been resolved yet")]
    EventNotResolved,

    #[msg("This cover payout was already claimed")]
    AlreadyClaimed,

    #[msg("Cover outcome was NO, no payout due")]
    CoverNotWon,

    #[msg("Caller lacks authority for this action")]
    Unauthorized,

    #[msg("Event already resolved for this cover type")]
    EventAlreadyResolved,

    #[msg("Controversy score must be 0-100")]
    InvalidControversyScore,

    #[msg("Bond below minimum 2% of gross ticket revenue")]
    BondTooLow,

    #[msg("Cover has expired")]
    CoverExpired,
}
