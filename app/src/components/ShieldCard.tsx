'use client';

import { ShieldCard as ShieldCardType, CardRarity, CardCategory } from '@/lib/types';
import { Flame, Plane, Music, Heart, Globe, Cpu } from 'lucide-react';

const rarityColors: Record<CardRarity, string> = {
  common: 'text-zinc-400 border-zinc-400 bg-zinc-400/10',
  uncommon: 'text-emerald-400 border-emerald-400 bg-emerald-400/10',
  rare: 'text-blue-400 border-blue-400 bg-blue-400/10',
  epic: 'text-purple-400 border-purple-400 bg-purple-400/10',
  legendary: 'text-amber-400 border-amber-400 bg-amber-400/10',
};

const rarityBorder: Record<CardRarity, string> = {
  common: 'border-zinc-700/50',
  uncommon: 'border-emerald-500/30',
  rare: 'border-blue-500/30',
  epic: 'border-purple-500/40',
  legendary: 'border-amber-500/50',
};

const rarityGlowClass: Record<CardRarity, string> = {
  common: '',
  uncommon: 'glow-uncommon',
  rare: 'glow-rare',
  epic: 'glow-epic',
  legendary: 'glow-legendary',
};

const categoryIcons: Record<CardCategory, typeof Flame> = {
  natural_disaster: Flame,
  travel: Plane,
  event: Music,
  health: Heart,
  geopolitical: Globe,
  crypto: Cpu,
};

interface Props {
  card: ShieldCardType;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function ShieldCard({ card, size = 'md', onClick }: Props) {
  const Icon = categoryIcons[card.category];
  const rColor = rarityColors[card.rarity];
  const rBorder = rarityBorder[card.rarity];
  const rGlow = rarityGlowClass[card.rarity];
  const isLegendary = card.rarity === 'legendary';
  const isTriggered = card.isTriggered;
  const isExpired = card.isExpired && !card.isTriggered;

  const cardClasses = `group relative overflow-hidden bg-zinc-900 text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${rGlow} ${
    isLegendary ? 'legendary-shimmer' : ''
  } ${isTriggered ? 'glow-triggered' : ''}`;

  if (size === 'sm') {
    return (
      <button
        onClick={onClick}
        className={`${cardClasses} w-full rounded-xl border ${
          isTriggered ? 'border-amber-500/60' : rBorder
        }`}
        style={{ perspective: '600px' }}
      >
        {/* Gradient art with noise */}
        <div className={`card-noise relative h-20 bg-gradient-to-br ${card.artGradient} p-3`}>
          <Icon className="h-5 w-5 text-white/80" />
          {isTriggered && (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-500/20 backdrop-blur-[1px]">
              <span className="rotate-[-12deg] text-xs font-black tracking-wider text-amber-300 drop-shadow-lg">
                TRIGGERED
              </span>
            </div>
          )}
          {isExpired && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50">
              <span className="text-[10px] font-bold tracking-wider text-zinc-500">EXPIRED</span>
            </div>
          )}
        </div>

        <div className={`p-2.5 ${isExpired ? 'opacity-50' : ''}`}>
          <p className="text-xs font-semibold text-white truncate">{card.name}</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-400">{card.payoutAmount} USDC</span>
            <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-medium capitalize ${rColor}`}>
              {card.rarity}
            </span>
          </div>
        </div>
      </button>
    );
  }

  // md + lg
  const isLg = size === 'lg';

  return (
    <button
      onClick={onClick}
      className={`${cardClasses} rounded-2xl border-2 ${
        isTriggered ? 'border-amber-500/70 shadow-amber-500/20' : rBorder
      } hover:scale-[1.02] hover:shadow-xl ${
        isLg ? 'w-full max-w-sm' : 'w-full max-w-xs'
      }`}
      style={{ perspective: '800px' }}
    >
      {/* Top gradient art area with noise texture */}
      <div className={`card-noise relative bg-gradient-to-br ${card.artGradient} ${isLg ? 'h-44' : 'h-32'} p-4`}>
        <Icon className={`${isLg ? 'h-8 w-8' : 'h-6 w-6'} text-white/70`} />

        {/* Edition badge - embossed */}
        <div className="text-embossed absolute bottom-3 right-3 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-mono text-white/70 backdrop-blur-sm">
          #{card.editionNumber} / {card.totalEditions}
        </div>

        {/* Card name over gradient */}
        <h3
          className={`absolute bottom-3 left-4 font-bold text-white drop-shadow-lg ${
            isLg ? 'text-xl' : 'text-base'
          }`}
        >
          {card.name}
        </h3>

        {/* Triggered overlay */}
        {isTriggered && (
          <div className="absolute inset-0 flex items-center justify-center bg-amber-500/15 backdrop-blur-[2px]">
            <span className="rotate-[-15deg] rounded-lg border-2 border-amber-400/60 bg-amber-500/20 px-4 py-1.5 text-lg font-black tracking-widest text-amber-300 drop-shadow-lg backdrop-blur-sm">
              TRIGGERED
            </span>
          </div>
        )}

        {/* Expired overlay */}
        {isExpired && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/60">
            <span className="rotate-[-15deg] text-lg font-black tracking-widest text-zinc-500">EXPIRED</span>
          </div>
        )}

        {/* Legendary sparkle particles */}
        {isLegendary && !isExpired && (
          <div className="sparkle-container">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-amber-300"
                style={{
                  top: `${15 + Math.random() * 70}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animation: `sparkle ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info section */}
      <div className={`space-y-3 bg-zinc-950/80 p-4 ${isExpired ? 'opacity-50' : ''}`}>
        {/* Trigger condition */}
        <p className={`text-zinc-300 leading-snug ${isLg ? 'text-sm' : 'text-xs'}`}>{card.triggerCondition}</p>

        {/* Region + Window */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>{card.region}</span>
          <span>{card.activeWindow}</span>
        </div>

        {/* Payout */}
        <div className="flex items-center justify-between">
          <span className={`font-bold text-emerald-400 ${isLg ? 'text-2xl' : 'text-lg'}`}>
            {card.payoutAmount} USDC
          </span>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${rColor}`}>
            {card.rarity}
          </span>
        </div>

        {/* Oracle + market value */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-2 text-[10px] text-zinc-600">
          <span>Oracle: {card.oracleSource}</span>
          <span>Mkt: {card.currentMarketValue} USDC</span>
        </div>
      </div>
    </button>
  );
}
