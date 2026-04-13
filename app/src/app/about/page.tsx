import Navbar from '@/components/Navbar';
import { Shield, Zap, AlertTriangle, TrendingUp, Ban, ExternalLink, BookOpen, Globe, Calculator } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Why CrowdShield Exists</h1>
        <p className="mt-4 text-lg text-zinc-500">Parametric event insurance on Solana. No claims, no waiting, no paperwork.</p>

        {/* The Problem */}
        <section className="mt-14">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h2 className="text-xl font-semibold text-white">The Problem</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              In 2025, over 40 music festivals were cancelled. Pitchfork, a 20-year Chicago institution, shut down.
              Music Midtown in Atlanta folded. Sick New World in Vegas cancelled.
            </p>
            <p>
              On April 7, 2026, Wireless Festival was cancelled after the UK Home Office banned headliner Ye from
              entering the country. 50,000 fans had already booked flights and hotels.
            </p>
            <p>
              Rock the Country, headlined by Kid Rock, was cancelled in February 2026 after artists including
              Shinedown withdrew over political concerns.
            </p>
            <p className="text-zinc-300 font-medium">
              When events get cancelled, ticket refunds come through. But flights, hotels, and vacation days
              don&apos;t come back. That&apos;s the collateral damage.
            </p>
          </div>
        </section>

        {/* The Market */}
        <section className="mt-14">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">The Market</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              The ticket refund insurance market reached $6.5 billion in 2025, projected to grow to $23.3 billion
              by 2035 at 13.6% CAGR.
              <span className="text-zinc-600 ml-1">(Source: market.us)</span>
            </p>
            <p>
              The event cancellation insurance market was worth $3.2 billion in 2024.
              <span className="text-zinc-600 ml-1">(Source: Growth Market Reports)</span>
            </p>
            <p>
              In January 2026, Allianz launched event ticket protection for the Milano Cortina Winter Olympics.
            </p>
            <p>
              Every incumbent operates in traditional finance: paper claims, 7-30 day processing, static pricing,
              zero transparency.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-14">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">How CrowdShield Works</h2>
          </div>
          <ul className="space-y-3 text-sm leading-relaxed text-zinc-400">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Fans choose how much coverage they need (100-1000 USDC)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Premiums follow a dynamic bonding curve based on real-time controversy signals</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Binary resolution: event cancelled YES or NO. Oracle confirms, payout in seconds.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Cover positions are NFTs, tradeable on secondary market</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Built on Solana: sub-cent fees, 400ms finality, compressed NFT tickets</span>
            </li>
          </ul>
        </section>

        {/* Academic Foundations */}
        <section className="mt-14">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Academic Foundations</h2>
          </div>
          <p className="text-sm text-zinc-400 mb-4">
            CrowdShield&apos;s mechanism design draws from peer-reviewed research in economics, computer science, and insurance theory.
          </p>
          <div className="space-y-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="font-medium text-blue-400 text-sm">Cover Pricing</p>
              <p className="mt-1 text-sm text-zinc-400">
                Hanson, R. (2007). &ldquo;Logarithmic Market Scoring Rules for Modular Combinatorial Information Aggregation.&rdquo;
                <span className="text-zinc-500"> Journal of Prediction Markets, 1(1), 3-15. George Mason University.</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500">Informs our bonding curve pricing mechanism with bounded-loss market making properties.</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="font-medium text-blue-400 text-sm">Parametric Triggers</p>
              <p className="mt-1 text-sm text-zinc-400">
                IAIS (2018). &ldquo;Issues Paper on Index-based Insurances, Particularly in Inclusive Insurance Markets.&rdquo;
              </p>
              <p className="mt-1 text-xs text-zinc-500">Binary triggers reduce moral hazard. Payout is unaffected by total loss, so insured retains incentive to minimize losses.</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="font-medium text-blue-400 text-sm">Oracle Design</p>
              <p className="mt-1 text-sm text-zinc-400">
                Witkowski, J. &amp; Parkes, D. (2012). &ldquo;A Robust Bayesian Truth Serum for Small Populations.&rdquo;
                <span className="text-zinc-500"> AAAI Conference on Artificial Intelligence.</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500">Informs participant signal weighting in the controversy oracle. Strict incentive compatibility for truthful reporting.</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="font-medium text-blue-400 text-sm">Bonding Curve Theory</p>
              <p className="mt-1 text-sm text-zinc-400">
                Cartea, Drissi, S&aacute;nchez-Betancourt, Siska, Szpruch (2024). &ldquo;Strategic Bonding Curves in Automated Market Makers.&rdquo;
                <span className="text-zinc-500"> SSRN.</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500">Informs demand-curve pricing component and pool capacity self-regulation.</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="font-medium text-blue-400 text-sm">Index-Based Insurance</p>
              <p className="mt-1 text-sm text-zinc-400">
                World Bank Global Index Insurance Facility (GIIF).
                Gao et al., The Geneva Papers on Risk and Insurance.
              </p>
              <p className="mt-1 text-xs text-zinc-500">Basis risk is a &ldquo;manageable, programmable feature&rdquo; of parametric triggers. Well-designed products pay within 24-72h of verification.</p>
            </div>
          </div>
        </section>

        {/* Pack Economics */}
        <section className="mt-14">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-semibold text-white">How Pack Economics Work</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              Shield Packs work like insurance pools wrapped in collectible mechanics. The expected payout value
              of cards in a pack sits below the pack price. This &ldquo;house edge&rdquo; funds the payout pool.
            </p>
            <p>
              Example: A $25 pack contains 5 cards. Each card has a trigger probability (3-5% for Commons, lower for rarer).
              The probability-weighted expected payout per pack is ~$7-10. The remaining $15-18 funds the pool that pays
              out when events actually trigger.
            </p>
            <p>
              Most cards expire without triggering (same as most insurance policies never claim). When major events hit,
              the pool pays card holders instantly. Pool solvency maintained because aggregate premiums exceed aggregate payouts
              over time, same fundamental math as traditional insurance.
            </p>
            <p className="text-zinc-500">
              Research note: Variable ratio reinforcement (PMC, 2021: &ldquo;Rare Loot Box Rewards Trigger Larger Arousal
              and Reward Responses&rdquo;) drives pack engagement. Critical distinction from cosmetic loot boxes:
              Shield Cards carry real insurance utility, not just visual value.
            </p>
          </div>
        </section>

        {/* Real-World Validation */}
        <section className="mt-14">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-semibold text-white">Real-World Validation</h2>
          </div>
          <p className="text-sm text-zinc-500 mb-5">
            Every trigger condition in CrowdShield maps to events that already happened. This product would have paid out.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Wireless Festival 2026</p>
                <p className="mt-1 text-xs text-zinc-400">Cancelled after UK Home Office banned headliner Ye. 50,000 fans with non-refundable flights and hotels.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Rock the Country 2026</p>
                <p className="mt-1 text-xs text-zinc-400">Artists withdrew over political concerns. Cancellation left ticket holders with sunk travel costs.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">40+ US Festivals (2025)</p>
                <p className="mt-1 text-xs text-zinc-400">Pitchfork (20-year institution), Music Midtown, Sick New World, and dozens more shut down.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What It Is NOT */}
        <section className="mt-14">
          <div className="flex items-center gap-2 mb-4">
            <Ban className="h-5 w-5 text-red-400" />
            <h2 className="text-xl font-semibold text-white">What CrowdShield is NOT</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-zinc-400">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="font-medium text-zinc-300">Not a betting platform.</p>
              <p className="mt-1">Fans protect their real travel costs, not speculate on outcomes.</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="font-medium text-zinc-300">Not Polymarket.</p>
              <p className="mt-1">We require ticket ownership for cover minting (insurable interest).</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="font-medium text-zinc-300">Not traditional insurance.</p>
              <p className="mt-1">On-chain, instant, transparent, tradeable.</p>
            </div>
          </div>
        </section>

        {/* Open Source */}
        <section className="mt-14 mb-16">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink className="h-5 w-5 text-zinc-400" />
            <h2 className="text-xl font-semibold text-white">Open Source</h2>
          </div>
          <a
            href="https://github.com/exhuman777/crowdshield"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ExternalLink className="h-4 w-4" />
            github.com/exhuman777/crowdshield
          </a>
        </section>
      </div>
    </div>
  );
}
