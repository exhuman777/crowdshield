'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PackStore from '@/components/PackStore';
import PackOpener from '@/components/PackOpener';
import CardCollection from '@/components/CardCollection';
import { BoosterPack } from '@/lib/types';
import { Shield, Clock, Zap } from 'lucide-react';

const triggeredTicker = [
  { card: 'Wireless Cancelled', rarity: 'Rare', payout: '300 USDC', time: '2h ago' },
  { card: 'EU Flight Chaos', rarity: 'Uncommon', payout: '100 USDC', time: '5h ago' },
  { card: 'Greece Wildfire', rarity: 'Common', payout: '50 USDC', time: '1d ago' },
  { card: 'Heathrow Shutdown', rarity: 'Epic', payout: '400 USDC', time: '2d ago' },
  { card: 'Wireless Cancelled', rarity: 'Rare', payout: '300 USDC', time: '3d ago' },
  { card: 'Festival Cancelled EU', rarity: 'Rare', payout: '300 USDC', time: '4d ago' },
];

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function PacksPage() {
  const [selectedPack, setSelectedPack] = useState<BoosterPack | null>(null);
  const countdown = useCountdown('2026-09-30T23:59:59Z');

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Recently Triggered Ticker */}
      <div className="border-b border-zinc-800/30 bg-zinc-900/50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center h-9 gap-3 overflow-hidden">
            <div className="flex items-center gap-1.5 shrink-0">
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Recently Triggered</span>
            </div>
            <div className="relative flex-1 overflow-hidden">
              <div className="ticker-scroll flex items-center gap-6 whitespace-nowrap">
                {/* Double the items for seamless loop */}
                {[...triggeredTicker, ...triggeredTicker].map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-medium text-white">{item.card}</span>
                    <span className="text-emerald-400 font-semibold">{item.payout}</span>
                    <span className="text-zinc-600">{item.time}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header with season countdown */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-emerald-500/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Shield className="h-7 w-7 text-emerald-400" />
                <h1 className="text-3xl font-bold text-white">Shield Packs</h1>
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                Season 1: Chaos Season &middot; 52 unique cards &middot; 12 categories
              </p>
            </div>

            {/* Season Countdown */}
            <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/80 px-5 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Season 1 Ends In</span>
              </div>
              <div className="flex gap-3">
                {[
                  { val: countdown.days, label: 'days' },
                  { val: countdown.hours, label: 'hrs' },
                  { val: countdown.minutes, label: 'min' },
                  { val: countdown.seconds, label: 'sec' },
                ].map((unit) => (
                  <div key={unit.label} className="text-center">
                    <p className="text-xl font-bold tabular-nums text-white">{String(unit.val).padStart(2, '0')}</p>
                    <p className="text-[9px] uppercase text-zinc-600">{unit.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Pack Store or Opener */}
        <section className="section-animate">
          {selectedPack ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Opening: {selectedPack.name}</h2>
                <button
                  onClick={() => setSelectedPack(null)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Back to store
                </button>
              </div>
              <PackOpener pack={selectedPack} onClose={() => setSelectedPack(null)} />
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Buy Packs</h2>
                <p className="text-xs text-zinc-600">Cards remaining in Season 1: 48,200 / 52,000</p>
              </div>
              <PackStore onOpenPack={setSelectedPack} />
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="my-12 border-t border-zinc-800/50" />

        {/* Collection */}
        <section className="section-animate" style={{ animationDelay: '0.1s' }}>
          <h2 className="mb-4 text-xl font-bold text-white">Your Collection</h2>
          <CardCollection />
        </section>
      </div>
    </div>
  );
}
