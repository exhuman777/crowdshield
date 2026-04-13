'use client';

import { CoverType } from '@/lib/types';
import { XCircle, Clock, UserX, CloudRain, MapPin, Check, Users } from 'lucide-react';

const coverLabels: Record<CoverType, string> = {
  cancellation: 'Event Cancelled',
  delay: 'Delayed 2+ Hours',
  headliner_changed: 'Headliner Replaced',
  weather_rain: 'Rain at Venue',
  venue_changed: 'Venue Changed',
};

const coverIcons: Record<CoverType, React.ComponentType<{ className?: string }>> = {
  cancellation: XCircle,
  delay: Clock,
  headliner_changed: UserX,
  weather_rain: CloudRain,
  venue_changed: MapPin,
};

interface CoverSelectorProps {
  coverType: CoverType;
  currentPremium: number;
  payoutAmount: number;
  covered: boolean;
  coverCount: number;
  onBuy?: () => void;
}

export default function CoverSelector({
  coverType,
  currentPremium,
  payoutAmount,
  covered,
  coverCount,
  onBuy,
}: CoverSelectorProps) {
  const Icon = coverIcons[coverType];
  const label = coverLabels[coverType];
  const impliedProb = ((currentPremium / payoutAmount) * 100).toFixed(1);

  return (
    <div className={`group/cover rounded-xl border p-4 transition-all duration-200 ${
      covered
        ? 'border-emerald-500/30 bg-emerald-500/5'
        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/80 hover:scale-[1.005]'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`rounded-lg p-2 ${covered ? 'bg-emerald-500/10' : 'bg-zinc-800'}`}>
            <Icon className={`h-5 w-5 ${covered ? 'text-emerald-400' : 'text-zinc-400'}`} />
          </div>
          <div>
            <h4 className="font-medium text-white">{label}</h4>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span className="text-zinc-400">
                Premium: <span className="font-medium text-white">{currentPremium.toFixed(2)} USDC</span>
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">
                Payout: <span className="font-medium text-emerald-400">{payoutAmount.toFixed(2)} USDC</span>
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
              <span>Implied prob: {impliedProb}%</span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {coverCount.toLocaleString()} fans covered
              </span>
            </div>
          </div>
        </div>

        {covered ? (
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
            <Check className="h-4 w-4" />
            Covered
          </div>
        ) : (
          <button
            onClick={onBuy}
            className="rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600 active:bg-emerald-700"
          >
            Add Cover
          </button>
        )}
      </div>
    </div>
  );
}
