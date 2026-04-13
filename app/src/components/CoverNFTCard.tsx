'use client';

import { Cover, CoverType } from '@/lib/types';
import { XCircle, Clock, UserX, CloudRain, MapPin, TrendingUp, ExternalLink } from 'lucide-react';

const coverLabels: Record<CoverType, string> = {
  cancellation: 'Event Cancelled Cover',
  delay: 'Delay Cover',
  headliner_changed: 'Headliner Replaced Cover',
  weather_rain: 'Weather Cover',
  venue_changed: 'Venue Changed Cover',
};

const coverIcons: Record<CoverType, React.ComponentType<{ className?: string }>> = {
  cancellation: XCircle,
  delay: Clock,
  headliner_changed: UserX,
  weather_rain: CloudRain,
  venue_changed: MapPin,
};

export default function CoverNFTCard({ cover }: { cover: Cover }) {
  const Icon = coverIcons[cover.coverType];
  const label = coverLabels[cover.coverType];
  const gainPct = ((cover.currentMarketValue - cover.premiumPaid) / cover.premiumPaid * 100).toFixed(0);
  const isPositive = cover.currentMarketValue > cover.premiumPaid;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-emerald-500/10 p-2">
          <Icon className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h4 className="font-medium text-white">{label}</h4>
          <span className="inline-flex items-center gap-1 mt-0.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
            Active
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-zinc-500">Paid</p>
          <p className="mt-0.5 text-sm font-medium text-zinc-300">{cover.premiumPaid.toFixed(2)} USDC</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Payout</p>
          <p className="mt-0.5 text-sm font-medium text-emerald-400">{cover.payoutAmount.toFixed(2)} USDC</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Market Value</p>
          <div className="mt-0.5 flex items-center gap-1">
            <p className="text-sm font-medium text-white">{cover.currentMarketValue.toFixed(2)}</p>
            <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              <TrendingUp className="h-3 w-3 mr-0.5" />
              {isPositive ? '+' : ''}{gainPct}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700">
          Sell on Secondary
        </button>
        <button className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700">
          <ExternalLink className="h-3.5 w-3.5" />
          View NFT
        </button>
      </div>
    </div>
  );
}
