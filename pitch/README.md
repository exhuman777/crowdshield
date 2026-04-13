# CrowdShield

**Insurance for the chaos era. Collect shields. Protect against real-world events.**

## What is CrowdShield?

CrowdShield makes insurance collectible. Two products, one ecosystem:

### Shield Packs (TCG Insurance)
- **Buy booster packs** ($5-$100) containing random Shield Cards
- Each card = parametric micro-insurance on a real-world event (wildfires, flight cancellations, pandemics, earthquakes)
- **Rarity system**: Common, Uncommon, Rare, Epic, Legendary
- Binary trigger: oracle confirms event → instant payout to card holders
- **Cards are NFTs**: tradeable on secondary market, price moves with real-world risk
- Collect, trade, hold for payout. Insurance that feels like opening Pokemon packs.

### Event Shields (Event Protection)
- **Browse events** with live Controversy Scores (0-100)
- **Buy tickets** + add specific covers for YOUR event
- Configurable payout (100-1000 USDC)
- **Cover NFTs** tradeable on secondary market
- Fan communities: polls, social feeds, group covers

Both products share the same cover pools, oracle system, and Solana infrastructure.

## The Problem

On April 7, 2026, Wireless Festival was cancelled after the UK Home Office banned headliner Ye (Kanye West) from entering the country. 50,000 fans had already booked flights and hotels. Ticket refunds were issued, but travel costs were not.

In 2025, over 40 music festivals were cancelled, including Pitchfork (a 20-year Chicago institution), Music Midtown (Atlanta), and Sick New World (Vegas). In February 2026, Kid Rock's Rock the Country festival was cancelled after artists including Shinedown withdrew.

When events fail, ticket refunds come through. Flights, hotels, and vacation days do not come back. That collateral damage has no protection today.

**$6.5B ticket refund insurance market (2025, source: market.us).** All TradFi. Slow claims (7-30 days). Static pricing. Zero transparency.

## How It Works

```
Fan pays premium ───→ COVER POOL ←─── LP provides capital
                          │
Oracle triggers ──→ Binary Resolution (YES/NO)
                          │
                    Auto-payout (3 seconds)
```

### Cover Types (all binary YES/NO)
- Event Cancelled
- Delayed 2+ Hours
- Headliner Replaced
- Rain at Venue
- Venue Changed

### Dynamic Pricing (Bonding Curve)
```
Premium = BaseRate × PayoutAmount × ControversyMult × DemandCurve × TimeDecay
```
Covers get more expensive as controversy rises, demand increases, and event date approaches. Early buyers are rewarded.

### Configurable Payout
Fans choose how much coverage they need: 100 / 300 / 500 / 1000 USDC. Premium scales proportionally.

Example (Cancellation cover, 300 USDC payout):
- Low controversy (score 30), 90 days out: ~11 USDC premium (3.6% of payout)
- High controversy (score 92), 30 days out: ~21 USDC premium (7%)
- Comparable to traditional travel insurance (5-10%), but instant payout and tradeable.

### Cover NFT Secondary Market
Cover = tradeable NFT. Controversy rises = your cover becomes more valuable. Sell it on secondary or hold for payout.

### Liquidity
Cover pools are funded by LPs (liquidity providers) who deposit USDC and earn premiums from cover sales. If events go normally (majority of cases), LPs keep all premiums. If events fail, pool pays out to cover holders. Organizer bonds (optional) add additional pool collateral. Idle pool capital earns DeFi yield via Kamino/MarginFi.

## Architecture

```
┌─────────────────── USER LAYER ──────────────────────┐
│  Apple Pay / Card / USDC  │  Email / Google Login    │
├─────────────────── ABSTRACTION ─────────────────────┤
│  Squads Passkeys  │  Session Keys  │  Gasless TX     │
├─────────────────── PROTOCOL ────────────────────────┤
│  Ticket Program   │  Cover Pool AMM  │  Controversy  │
│  (cNFT mint)      │  (pricing +      │  Oracle       │
│                   │   payout)        │               │
│  Bond Vault       │  Yield Router    │  Resolution   │
│  (organizer)      │  (idle→Kamino)   │  Engine       │
├─────────────────── SOLANA ──────────────────────────┤
│  cNFTs  │  SPL Tokens  │  Anchor  │  Switchboard    │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Smart Contracts | Anchor (Rust) on Solana |
| Ticket NFTs | Compressed NFTs (state compression) |
| Cover NFTs | SPL Token / Metaplex |
| Account Abstraction | Squads Protocol (passkeys + session keys) |
| Oracles | Switchboard (custom feeds) |
| Idle Yield | Kamino / MarginFi |
| Frontend | Next.js 16 + Tailwind CSS |
| Distribution | Solana Blinks / Actions |

## File Map

```
crowdshield/
├── programs/
│   └── crowdshield/
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs                    # Program entry point
│           ├── state.rs                  # Account structures
│           ├── errors.rs                 # Custom errors
│           └── instructions/
│               ├── mod.rs                # Instruction exports
│               ├── create_event.rs       # Organizer creates event + stakes bond
│               ├── deposit_liquidity.rs  # LP deposits USDC to cover pool
│               ├── mint_ticket.rs        # Fan buys ticket (cNFT)
│               ├── buy_cover.rs          # Fan buys cover (bonding curve pricing)
│               ├── resolve.rs            # Oracle resolves cover type (YES/NO)
│               ├── claim_payout.rs       # Fan claims payout after YES resolution
│               ├── update_controversy.rs # Update controversy score
│               ├── withdraw_liquidity.rs # LP withdraws after resolution
│               └── claim_bond.rs         # Organizer claims bond back
├── app/                                  # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx               # Root layout (dark theme)
│   │   │   ├── page.tsx                  # Home: dual product (packs + events)
│   │   │   ├── packs/page.tsx            # Pack store + opener + collection
│   │   │   ├── about/page.tsx            # About: facts, market data, how it works
│   │   │   └── event/[id]/page.tsx       # Event detail (main demo page)
│   │   ├── components/
│   │   │   ├── Navbar.tsx                # Top navigation
│   │   │   ├── ShieldCard.tsx            # TCG card component (rarity, art, triggers)
│   │   │   ├── PackStore.tsx             # Booster pack shop
│   │   │   ├── PackOpener.tsx            # Pack opening animation (framer-motion)
│   │   │   ├── CardCollection.tsx        # User's card collection grid
│   │   │   ├── EventCard.tsx             # Event grid card
│   │   │   ├── ControversyGauge.tsx      # Animated controversy score gauge
│   │   │   ├── CoverSelector.tsx         # Cover purchase card
│   │   │   ├── CoverNFTCard.tsx          # User's cover display
│   │   │   ├── PollWidget.tsx            # Interactive poll
│   │   │   ├── SocialFeed.tsx            # Live activity feed
│   │   │   └── ResolutionSimulator.tsx   # Demo: simulate payout
│   │   └── lib/
│   │       ├── types.ts                  # TypeScript types + card types
│   │       ├── card-data.ts              # Shield Card + Pack mock data
│   │       ├── mock-data.ts              # Event demo data (Wireless Festival)
│   │       └── cover-pricing.ts          # Bonding curve implementation
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.mjs
├── pitch/
│   ├── PITCH.md                          # Full pitch deck content (15 slides)
│   ├── GAME_THEORY.md                    # Game theory deep dive
│   └── DEMO_SCRIPT.md                    # 5-min demo walkthrough
├── tests/                                # Anchor tests (TODO)
├── Anchor.toml
├── Cargo.toml
└── README.md                             # This file
```

## Running the Demo

### Frontend (demo mode, no blockchain required)
```bash
cd app
npm install
npm run dev
# Open http://localhost:3000
```

### Smart Contracts (requires Anchor CLI + Solana CLI)
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --force
avm install latest
avm use latest

# Build
anchor build

# Test (devnet)
anchor test
```

## Game Theory Summary

Four actors, aligned incentives:

| Actor | Action | Reward | Risk |
|-------|--------|--------|------|
| Fan | Buys cover (chooses payout 100-1000 USDC) | Payout on event failure, cover value appreciation on secondary | Loses premium if event goes well |
| Organizer (optional) | Stakes bond for trust badge | Lower cover prices, more ticket sales, bond yield, cover revenue share | Bond slashed if event cancelled by fault |
| LP | Provides USDC to cover pools | Premiums + DeFi yield on idle capital | Proportional loss if events fail (mitigated by diversification) |
| Oracle | Reports event outcomes | System integrity | Replaced if inaccurate |

Key mechanisms:
- **Bonding curve**: cover price self-regulates based on demand, controversy, and time
- **Organizer bond** (optional): skin in the game, trust signal, lowers cover prices
- **Ticket-gated minting**: only ticket holders can mint new covers (insurable interest)
- **Open secondary market**: anyone can buy existing Cover NFTs (liquidity)
- **Binary resolution**: YES/NO only, no disputes, oracle confirms
- **Configurable payout**: fan chooses coverage amount based on their actual travel costs

## Market (all data from public sources)

- Ticket Refund Insurance: $6.5B (2025) → $23.3B (2035), CAGR 13.6% (source: market.us)
- Event Cancellation Insurance: $3.2B (2024) (source: Growth Market Reports)
- Sports & Event Cancellation: $286M → $866M (2034), CAGR 11.7% (source: market.us)
- 40+ festivals cancelled in 2025 alone (source: Music Festival Wizard)
- Allianz launched ticket protection for Milano Cortina 2026 Olympics (source: allianz.com, Jan 2026)
- Wireless Festival 2026 cancelled April 7, 2026 (source: multiple news outlets)
- Rock the Country 2026 cancelled February 2026 (source: AXS TV, Complex)

Incumbents (Allianz, AXA XL, Cover Genius, Arch Insurance): all TradFi, slow (7-30 day claims), static pricing, no social layer, no dynamic risk assessment, no tradeable positions.

## Why Solana

- cNFTs: ~$110 for 1M ticket mints
- Sub-cent fees: micro-covers ($1-3 USDC) viable
- 400ms finality: instant payouts
- Squads: passkeys + session keys for non-crypto UX
- Switchboard: custom oracle feeds for event data
- Blinks: viral poll distribution on X/Twitter

## Status

- [x] Smart contract architecture (Anchor/Rust)
- [x] Cover pricing engine (bonding curve)
- [x] Frontend demo (Next.js + Tailwind)
- [x] Controversy gauge visualization
- [x] Resolution simulator
- [x] Pitch deck + demo script
- [ ] Devnet deployment
- [ ] Oracle integration (Switchboard)
- [ ] Account abstraction (Squads)
- [ ] LP pool management UI
- [ ] Cover NFT secondary market integration
- [ ] Mobile app

## Team

Built by [exhuman](https://github.com/exhuman777)

## License

MIT
