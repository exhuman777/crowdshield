'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ControversyGauge from '@/components/ControversyGauge';
import CoverSelector from '@/components/CoverSelector';
import CoverNFTCard from '@/components/CoverNFTCard';
import PollWidget from '@/components/PollWidget';
import SocialFeed from '@/components/SocialFeed';
import ResolutionSimulator from '@/components/ResolutionSimulator';
import { events, wirelessPolls, wirelessFeed, userCover, userState, coverCounts, priceHistory, defaultPayouts } from '@/lib/mock-data';
import { calculateCoverPremium } from '@/lib/cover-pricing';
import { CoverType } from '@/lib/types';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ShieldCheck,
  Ticket,
  TrendingUp,
  Users,
  DollarSign,
  BadgeCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Beaker,
  Clock,
  UserCheck,
  Lightbulb,
} from 'lucide-react';

const trustColors: Record<string, string> = {
  unverified: 'text-zinc-400 bg-zinc-800',
  standard: 'text-amber-400 bg-amber-500/10',
  trusted: 'text-emerald-400 bg-emerald-500/10',
  guaranteed: 'text-blue-400 bg-blue-500/10',
};

function formatNumber(n: number) {
  return n.toLocaleString('en-US');
}

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = events.find((e) => e.id === id);

  const [boughtCovers, setBoughtCovers] = useState<CoverType[]>(['cancellation']);
  const [backstoryOpen, setBackstoryOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  if (!event) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">Event not found</p>
          <Link href="/" className="mt-4 inline-block text-emerald-400 hover:underline">
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  const isWireless = event.id === 'wireless-2026';
  const isRockTheCountry = event.id === 'rock-the-country-2026';
  const isCancelled = event.isResolved && (isWireless || isRockTheCountry);
  const isCritical = event.controversyScore >= 85;
  const isHighRisk = event.controversyScore >= 60;

  const daysToEvent = isCancelled ? 0 : 95;
  const coverRate = Math.round((coverCounts.cancellation / event.ticketsSold) * 100);

  const coverPremiums: Record<CoverType, number> = {} as Record<CoverType, number>;
  event.coverTypes.forEach((ct) => {
    const payout = defaultPayouts[ct] || 300;
    coverPremiums[ct] = calculateCoverPremium({
      coverType: ct,
      payoutAmount: payout,
      controversyScore: event.controversyScore,
      coversSold: coverCounts[ct] || 0,
      maxTickets: event.maxTickets,
      daysToEvent: isCancelled ? 1 : daysToEvent,
    });
  });

  const handleBuyCover = (coverType: CoverType) => {
    setBoughtCovers((prev) => [...prev, coverType]);
  };

  // Price chart dimensions
  const chartW = 320;
  const chartH = 100;
  const maxPrice = Math.max(...priceHistory.map((p) => p.price));
  const minPrice = Math.min(...priceHistory.map((p) => p.price));
  const maxDay = Math.max(...priceHistory.map((p) => p.day));
  const points = priceHistory
    .map((p) => {
      const x = ((maxDay - p.day) / maxDay) * (chartW - 16) + 8;
      const y = chartH - 12 - ((p.price - minPrice) / (maxPrice - minPrice)) * (chartH - 24);
      return `${x},${y}`;
    })
    .join(' ');
  const areaPath = `M ${points.split(' ')[0]} ${points} ${chartW - 8},${chartH - 12} 8,${chartH - 12} Z`;

  return (
    <div className={`min-h-screen bg-zinc-950 ${isCritical ? 'bg-gradient-to-b from-red-950/10 to-zinc-950' : ''}`}>
      <Navbar />

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="bg-red-500/10 border-b border-red-500/20">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-400">
                  {isWireless && 'This event was cancelled on April 7, 2026'}
                  {isRockTheCountry && 'This event was cancelled in February 2026'}
                </p>
                <p className="text-xs text-red-400/70 mt-0.5">
                  {isWireless && 'UK Home Office banned headliner Ye from entering the country. All cover holders have been paid out.'}
                  {isRockTheCountry && 'Artists including Shinedown withdrew over political concerns. All cover holders have been paid out.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High Risk Banner (non-cancelled, high controversy) */}
      {!isCancelled && isHighRisk && (
        <div className={`border-b ${isCritical ? 'bg-red-500/8 border-red-500/15' : 'bg-amber-500/5 border-amber-500/15'}`}>
          <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${isCritical ? 'text-red-400' : 'text-amber-400'}`} />
              <p className={`text-xs font-medium ${isCritical ? 'text-red-400' : 'text-amber-400'}`}>
                {isCritical ? 'Critical controversy level, cancellation risk elevated' : 'Elevated controversy, monitor closely'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Event Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                    {tag}
                  </span>
                ))}
                {isCancelled && (
                  <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
                    Cancelled
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{event.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {event.venue}, {event.city}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${trustColors[event.organizerTrustTier]}`}>
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {event.organizerTrustTier.charAt(0).toUpperCase() + event.organizerTrustTier.slice(1)} Organizer
                </span>
              </div>
            </div>

            {/* Controversy Gauge - critical border pulse when high */}
            <div className={isCritical ? 'critical-border rounded-2xl border-2' : ''}>
              <ControversyGauge score={event.controversyScore} />
            </div>

            {/* Cover Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  {isCancelled ? 'Cover Payouts (Resolved)' : 'Protect Yourself'}
                </h2>
              </div>
              <div className="space-y-3">
                {event.coverTypes.map((ct) => (
                  <CoverSelector
                    key={ct}
                    coverType={ct}
                    currentPremium={coverPremiums[ct]}
                    payoutAmount={defaultPayouts[ct] || 300}
                    covered={boughtCovers.includes(ct)}
                    coverCount={coverCounts[ct] || 0}
                    onBuy={isCancelled ? undefined : () => handleBuyCover(ct)}
                  />
                ))}
              </div>
            </div>

            {/* User's Covers */}
            {userState.hasTicket && isWireless && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Your Covers</h2>
                <CoverNFTCard cover={userCover} />
              </div>
            )}

            {/* Resolution Simulator */}
            <ResolutionSimulator />

            {/* Event Backstory */}
            {event.backstory && (
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/80 overflow-hidden">
                <button
                  onClick={() => setBackstoryOpen(!backstoryOpen)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="h-5 w-5 text-emerald-400" />
                    <h2 className="text-lg font-semibold text-white">Event Backstory</h2>
                  </div>
                  {backstoryOpen ? (
                    <ChevronUp className="h-5 w-5 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-zinc-500" />
                  )}
                </button>
                {backstoryOpen && (
                  <div className="px-5 pb-5 border-t border-zinc-800/30 space-y-5">
                    {/* Summary */}
                    <div className="pt-4">
                      <p className="text-sm text-zinc-300 leading-relaxed">{event.backstory.summary}</p>
                    </div>

                    {/* Why Controversial */}
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">Why controversial</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{event.backstory.whyControversial}</p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">Timeline</p>
                      <div className="relative space-y-0">
                        {event.backstory.timeline.map((entry, i) => (
                          <div key={i} className="relative flex gap-4 pb-4 last:pb-0">
                            {/* Vertical line */}
                            {i < event.backstory!.timeline.length - 1 && (
                              <div className="absolute left-[7px] top-3 bottom-0 w-px bg-zinc-700/50" />
                            )}
                            {/* Dot */}
                            <div className={`relative mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 ${
                              i === event.backstory!.timeline.length - 1
                                ? 'border-red-400 bg-red-400/20'
                                : 'border-zinc-600 bg-zinc-800'
                            }`} />
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] text-zinc-600 font-mono">{entry.date}</p>
                              <p className="text-sm text-zinc-300 mt-0.5">{entry.event}</p>
                              <p className="text-xs text-zinc-500 mt-0.5">{entry.impact}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stakeholders */}
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Stakeholders</p>
                      <div className="flex flex-wrap gap-2">
                        {event.backstory.stakeholders.map((s, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 px-3 py-1 text-xs text-zinc-400">
                            <UserCheck className="h-3 w-3 text-zinc-500" />
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Current Status */}
                    <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-3.5">
                      <p className="text-xs font-medium text-zinc-500 mb-1">Current Status</p>
                      <p className="text-sm text-zinc-300">{event.backstory.currentStatus}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Methodology */}
            {event.methodology && (
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/80 overflow-hidden">
                <button
                  onClick={() => setMethodologyOpen(!methodologyOpen)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Beaker className="h-5 w-5 text-emerald-400" />
                    <h2 className="text-lg font-semibold text-white">How Pricing & Resolution Works</h2>
                  </div>
                  {methodologyOpen ? (
                    <ChevronUp className="h-5 w-5 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-zinc-500" />
                  )}
                </button>
                {methodologyOpen && (
                  <div className="px-5 pb-5 border-t border-zinc-800/30 space-y-4 pt-4">
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">Controversy Score</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{event.methodology.controversyScoreExplainer}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">Cover Pricing</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{event.methodology.coverPricingExplainer}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">Resolution Process</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{event.methodology.resolutionExplainer}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5" />
                        What you can do
                      </p>
                      <ul className="space-y-2">
                        {event.methodology.whatYouCanDo.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/60" />
                            <span className="text-sm text-zinc-400 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900 p-5">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Quick Stats</h3>

              {/* Tickets sold bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Ticket className="h-4 w-4" />
                    Tickets Sold
                  </span>
                  <span className="font-medium text-white">
                    {formatNumber(event.ticketsSold)} / {formatNumber(event.maxTickets)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800">
                  <div
                    className="h-2 rounded-full bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${(event.ticketsSold / event.maxTickets) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-zinc-800/50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                    <ShieldCheck className="h-3 w-3" />
                    Cover Rate
                  </div>
                  <p className="text-lg font-bold text-white">{coverRate}%</p>
                  <p className="text-xs text-zinc-500">of ticket holders</p>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                    <DollarSign className="h-3 w-3" />
                    Pool
                  </div>
                  <p className="text-lg font-bold text-white">Demo Pool</p>
                  <p className="text-xs text-zinc-500">simulation mode</p>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                    <Users className="h-3 w-3" />
                    Organizer Bond
                  </div>
                  <p className="text-lg font-bold text-white">${formatNumber(event.organizerBond)}</p>
                  <p className="text-xs text-zinc-500">staked by organizer</p>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                    <TrendingUp className="h-3 w-3" />
                    Ticket Price
                  </div>
                  <p className="text-lg font-bold text-white">{event.ticketPrice} USDC</p>
                  <p className="text-xs text-zinc-500">face value</p>
                </div>
              </div>
            </div>

            {/* Cover Price Chart */}
            {isWireless && (
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                    Cancellation Cover Price
                  </h3>
                  <span className="text-xs text-emerald-400 font-medium">+563%</span>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-2xl font-bold text-white">21.20</span>
                  <span className="text-sm text-zinc-500 mb-0.5">USDC</span>
                </div>
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-24">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon points={areaPath.replace('M ', '').replace(' Z', '')} fill="url(#chartGrad)" />
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx={points.split(' ').pop()?.split(',')[0]}
                    cy={points.split(' ').pop()?.split(',')[1]}
                    r="3"
                    fill="#22c55e"
                  />
                </svg>
                <div className="flex justify-between text-xs text-zinc-600 mt-1">
                  <span>90 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            )}

            {/* Live Polls */}
            {isWireless && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-3">
                  {isCancelled ? 'Polls (Closed)' : 'Live Polls'}
                </h3>
                <div className="space-y-3">
                  {wirelessPolls.map((poll) => (
                    <PollWidget
                      key={poll.id}
                      poll={poll}
                      hasVoted={userState.votedPolls.includes(poll.id)}
                      userVote={userState.votedPolls.includes(poll.id) ? 1 : undefined}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Social Feed */}
            {isWireless && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-3">Activity</h3>
                <SocialFeed items={wirelessFeed} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
