'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ShieldCard from '@/components/ShieldCard';
import { allShieldCards, userCollection } from '@/lib/card-data';
import { CardNews } from '@/lib/types';
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Newspaper,
  Target,
  BarChart3,
  Shield,
  Gift,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const trendIcons = {
  increasing: TrendingUp,
  stable: Minus,
  decreasing: TrendingDown,
};

const trendLabels = {
  increasing: 'Increasing',
  stable: 'Stable',
  decreasing: 'Decreasing',
};

const trendColors = {
  increasing: 'text-red-400',
  stable: 'text-zinc-400',
  decreasing: 'text-emerald-400',
};

const impactColors: Record<string, string> = {
  bullish: 'bg-red-500/10 text-red-400 border-red-500/20',
  bearish: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  neutral: 'bg-zinc-700/30 text-zinc-400 border-zinc-600/20',
};

const impactLabels: Record<string, string> = {
  bullish: 'More likely',
  bearish: 'Less likely',
  neutral: 'Neutral',
};

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: typeof Shield;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/80 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">{title}</h3>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-zinc-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        )}
      </button>
      {open && <div className="px-5 pb-5 border-t border-zinc-800/30 pt-4">{children}</div>}
    </div>
  );
}

function NewsItem({ item }: { item: CardNews }) {
  return (
    <div className="rounded-lg border border-zinc-800/50 bg-zinc-800/20 p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white leading-snug">{item.headline}</p>
          <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">{item.snippet}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-zinc-600">
            <span>{item.source}</span>
            <span>{item.date}</span>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${impactColors[item.impact]}`}
        >
          {impactLabels[item.impact]}
        </span>
      </div>
    </div>
  );
}

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const card = allShieldCards.find((c) => c.id === id);
  const owned = userCollection.find((c) => c.id === id);

  if (!card) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">Card not found</p>
          <Link href="/packs" className="mt-4 inline-block text-emerald-400 hover:underline">
            Back to packs
          </Link>
        </div>
      </div>
    );
  }

  const TrendIcon = trendIcons[card.odds.trend];
  const probPct = Math.round(card.odds.estimatedProbability * 100);

  // Mock position data for owned cards
  const premiumPaid = owned ? +(card.currentMarketValue * 0.35).toFixed(2) : 0;
  const currentVal = owned ? card.currentMarketValue : 0;
  const pnl = owned ? +(((currentVal - premiumPaid) / premiumPaid) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <Link
          href="/cards"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Cards
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[55%_45%]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Large Card */}
            <div className="flex justify-center">
              <ShieldCard card={card} size="lg" />
            </div>

            {/* Your Position */}
            {owned && (
              <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/80 p-5">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Your Position</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500">Premium Paid</p>
                    <p className="text-lg font-bold text-white">{premiumPaid} USDC</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Current Value</p>
                    <p className="text-lg font-bold text-white">{currentVal} USDC</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">P/L</p>
                    <p className={`text-lg font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {pnl >= 0 ? '+' : ''}{pnl}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!owned && (
                <button className="flex-1 rounded-xl bg-emerald-500 px-6 py-3.5 text-base font-bold text-black transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]">
                  Buy on Secondary
                </button>
              )}
              {owned && !card.isTriggered && (
                <>
                  <button className="flex-1 rounded-xl bg-emerald-500 px-6 py-3.5 text-base font-bold text-black transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]">
                    Buy More
                  </button>
                  <button className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/80 px-6 py-3.5 text-base font-medium text-zinc-200 transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98]">
                    Sell
                  </button>
                </>
              )}
              {owned && card.isTriggered && (
                <div className="flex-1 rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-3.5 text-center">
                  <p className="text-base font-bold text-amber-400">Payout Received: {card.payoutAmount} USDC</p>
                  <p className="text-xs text-amber-400/70 mt-1">Collectible edition, tradeable on secondary</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - scrollable content */}
          <div className="space-y-4 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 scrollbar-hide">
            {/* Backstory */}
            <Section title="Backstory" icon={Shield}>
              <div className="space-y-3">
                <p className="text-sm text-zinc-300 leading-relaxed">{card.backstory.summary}</p>
                <div>
                  <p className="text-xs font-medium text-zinc-500 mb-1">Why this matters</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{card.backstory.whyItMatters}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 mb-1">Historical context</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{card.backstory.historicalContext}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 mb-1">Current situation</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{card.backstory.currentSituation}</p>
                </div>
              </div>
            </Section>

            {/* Resolution Criteria */}
            <Section title="Resolution Criteria" icon={Target}>
              <div className="space-y-3">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5">
                  <p className="text-xs font-medium text-emerald-400 mb-1">Trigger Condition</p>
                  <p className="text-sm font-semibold text-white">{card.resolution.trigger}</p>
                </div>
                <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-3.5">
                  <p className="text-xs font-medium text-zinc-500 mb-1">Binary Question</p>
                  <p className="text-sm text-zinc-300 italic">{card.resolution.binaryQuestion}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-zinc-500 mb-0.5">Oracle Source</p>
                    <a
                      href={card.resolution.oracleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {card.resolution.oracleSource}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-0.5">Resolution Window</p>
                    <p className="text-sm text-zinc-300">{card.resolution.resolutionWindow}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-0.5">Verification Method</p>
                  <p className="text-sm text-zinc-400">{card.resolution.verificationMethod}</p>
                </div>
              </div>
            </Section>

            {/* Odds & Probability */}
            <Section title="Odds & Probability" icon={BarChart3}>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-700/50 bg-zinc-800/50">
                    <span className="text-2xl font-black text-white">{probPct}%</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-zinc-500 mb-1">Estimated Probability</p>
                    <div className="h-3 w-full rounded-full bg-zinc-800">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                        style={{ width: `${probPct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-0.5">Methodology</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{card.odds.methodology}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-zinc-800/30 p-3">
                    <p className="text-xs text-zinc-500">Historical Rate</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{card.odds.historicalRate}</p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/30 p-3">
                    <p className="text-xs text-zinc-500">Trend</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <TrendIcon className={`h-4 w-4 ${trendColors[card.odds.trend]}`} />
                      <span className={`text-sm font-semibold ${trendColors[card.odds.trend]}`}>
                        {trendLabels[card.odds.trend]}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{card.odds.trendNote}</p>
              </div>
            </Section>

            {/* Risk Factors */}
            <Section title="Risk Factors" icon={AlertTriangle}>
              <ul className="space-y-2">
                {card.riskFactors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/60" />
                    <span className="text-sm text-zinc-400 leading-relaxed">{factor}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Latest News */}
            <Section title="Latest News" icon={Newspaper}>
              <div className="space-y-3">
                {card.news.map((item, i) => (
                  <NewsItem key={i} item={item} />
                ))}
              </div>
            </Section>

            {/* What You Get */}
            <Section title="What You Get" icon={Gift}>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-sm text-emerald-300 leading-relaxed">{card.benefitExplainer}</p>
              </div>
            </Section>

            {/* Market Data */}
            <Section title="Market Data" icon={Activity} defaultOpen={false}>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-zinc-800/30 p-3">
                  <p className="text-xs text-zinc-500">Secondary Price</p>
                  <p className="text-lg font-bold text-white mt-0.5">{card.currentMarketValue} USDC</p>
                </div>
                <div className="rounded-lg bg-zinc-800/30 p-3">
                  <p className="text-xs text-zinc-500">Edition</p>
                  <p className="text-lg font-bold text-white mt-0.5">#{card.editionNumber}</p>
                </div>
                <div className="rounded-lg bg-zinc-800/30 p-3">
                  <p className="text-xs text-zinc-500">Total Supply</p>
                  <p className="text-lg font-bold text-white mt-0.5">{card.totalEditions.toLocaleString()}</p>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
