'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShieldCard as ShieldCardType } from '@/lib/types';
import { userCollection } from '@/lib/card-data';
import ShieldCard from './ShieldCard';

type Filter = 'all' | 'active' | 'triggered' | 'expired';
type SortBy = 'rarity' | 'expiry' | 'payout';

const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };

export default function CardCollection() {
  const [filter, setFilter] = useState<Filter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('rarity');

  const filtered = useMemo(() => {
    let cards = [...userCollection];

    if (filter === 'active') cards = cards.filter((c) => !c.isTriggered && !c.isExpired);
    if (filter === 'triggered') cards = cards.filter((c) => c.isTriggered);
    if (filter === 'expired') cards = cards.filter((c) => c.isExpired && !c.isTriggered);

    if (sortBy === 'rarity') cards.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
    if (sortBy === 'expiry') cards.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    if (sortBy === 'payout') cards.sort((a, b) => b.payoutAmount - a.payoutAmount);

    return cards;
  }, [filter, sortBy]);

  const triggeredCount = userCollection.filter((c) => c.isTriggered).length;
  const totalPayouts = userCollection.filter((c) => c.isTriggered).reduce((s, c) => s + c.payoutAmount, 0);
  const collectionValue = userCollection.reduce((s, c) => s + c.currentMarketValue, 0);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'triggered', label: 'Triggered' },
    { key: 'expired', label: 'Expired' },
  ];

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Cards', value: String(userCollection.length) },
          { label: 'Triggered', value: String(triggeredCount) },
          { label: 'Payouts Earned', value: `${totalPayouts} USDC` },
          { label: 'Collection Value', value: `${collectionValue.toFixed(0)} USDC` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-3 text-center">
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="mt-0.5 text-lg font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.key ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600">Sort:</span>
          {(['rarity', 'expiry', 'payout'] as SortBy[]).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`rounded-md px-2 py-1 text-xs transition-colors ${
                sortBy === s ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s === 'expiry' ? 'Expiry' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {filtered.map((card, i) => (
          <Link key={`${card.id}-${i}`} href={`/card/${card.id}`}>
            <ShieldCard card={card} size="sm" />
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-zinc-600">No cards match this filter.</p>
        )}
      </div>
    </div>
  );
}
