'use client';

import { BoosterPack, CardRarity } from '@/lib/types';
import { boosterPacks } from '@/lib/card-data';
import { Package, Sparkles } from 'lucide-react';

const packGradients: Record<string, string> = {
  'pack-starter': 'from-zinc-700 via-zinc-600 to-zinc-800',
  'pack-standard': 'from-emerald-700 via-teal-600 to-emerald-800',
  'pack-premium': 'from-blue-700 via-indigo-600 to-blue-800',
  'pack-legendary': 'from-amber-600 via-yellow-500 to-orange-700',
};

const rarityLabel: Record<CardRarity, string> = {
  common: 'Common+',
  uncommon: '1 Uncommon+',
  rare: '1 Rare+',
  epic: '1 Epic+',
  legendary: '1 Legendary+',
};

interface Props {
  onOpenPack: (pack: BoosterPack) => void;
}

export default function PackStore({ onOpenPack }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {boosterPacks.map((pack) => (
        <div
          key={pack.id}
          className="group overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900 transition-all duration-200 hover:border-zinc-700/50 hover:shadow-xl hover:scale-[1.02]"
        >
          {/* Pack art */}
          <div className={`relative flex h-40 flex-col items-center justify-center bg-gradient-to-br ${packGradients[pack.id] || 'from-zinc-700 to-zinc-800'}`}>
            <Package className="h-12 w-12 text-white/60" />
            <p className="mt-2 text-lg font-bold text-white">{pack.name}</p>
            {pack.guaranteedMinRarity === 'epic' && (
              <Sparkles className="absolute right-3 top-3 h-5 w-5 text-amber-400 animate-pulse" />
            )}
          </div>

          <div className="p-4 space-y-3">
            <p className="text-xs text-zinc-400">{pack.description}</p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">{pack.cardCount} cards</span>
              <span className="text-zinc-400 font-medium">{rarityLabel[pack.guaranteedMinRarity]}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-white">${pack.price}</span>
              <button
                onClick={() => onOpenPack(pack)}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:scale-[1.05] active:scale-[0.95]"
              >
                Open Pack
              </button>
            </div>

            <p className="text-[10px] text-zinc-600 text-center">{pack.season}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
