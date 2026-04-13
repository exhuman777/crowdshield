'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ShieldCard from '@/components/ShieldCard';
import { allShieldCards } from '@/lib/card-data';
import { CardCategory, CardRarity } from '@/lib/types';
import { Shield, Filter } from 'lucide-react';

type CategoryFilter = 'all' | CardCategory;
type RarityFilter = 'all' | CardRarity;

const categoryLabels: Record<CategoryFilter, string> = {
  all: 'All',
  natural_disaster: 'Disasters',
  travel: 'Travel',
  event: 'Events',
  health: 'Health',
  geopolitical: 'Geopolitical',
  crypto: 'Crypto',
};

const rarityOrder: Record<CardRarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

export default function CardsPage() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [rarity, setRarity] = useState<RarityFilter>('all');

  const filtered = useMemo(() => {
    let cards = [...allShieldCards];
    if (category !== 'all') cards = cards.filter((c) => c.category === category);
    if (rarity !== 'all') cards = cards.filter((c) => c.rarity === rarity);
    cards.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
    return cards;
  }, [category, rarity]);

  const triggeredCount = allShieldCards.filter((c) => c.isTriggered).length;
  const totalPayout = allShieldCards.reduce((s, c) => s + c.payoutAmount, 0);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-purple-500/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex items-center gap-3">
            <Shield className="h-7 w-7 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Season 1: All Shield Cards</h1>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            {allShieldCards.length} cards in season &middot; {triggeredCount} triggered &middot; {totalPayout.toLocaleString()} USDC total payout potential
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(categoryLabels) as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === cat ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-zinc-600" />
            <span className="text-xs text-zinc-600">Rarity:</span>
            {(['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'] as RarityFilter[]).map((r) => (
              <button
                key={r}
                onClick={() => setRarity(r)}
                className={`rounded-md px-2 py-1 text-xs capitalize transition-colors ${
                  rarity === r ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {filtered.map((card) => (
            <Link key={card.id} href={`/card/${card.id}`}>
              <ShieldCard card={card} size="sm" />
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-zinc-600">No cards match these filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
