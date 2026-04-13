'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface ControversyEvent {
  text: string;
  time: string;
}

function getLabel(score: number) {
  if (score >= 85) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 30) return 'MODERATE';
  if (score >= 10) return 'LOW';
  return 'CALM';
}

function getLabelColor(score: number) {
  if (score >= 85) return 'text-red-400';
  if (score >= 60) return 'text-red-400';
  if (score >= 30) return 'text-amber-400';
  return 'text-emerald-400';
}

function getArcColor(score: number) {
  if (score >= 85) return '#ef4444';
  if (score >= 60) return '#f97316';
  if (score >= 30) return '#f59e0b';
  return '#22c55e';
}

const controversyEvents: ControversyEvent[] = [
  { text: 'PayPal withdraws sponsorship', time: '3h ago' },
  { text: 'UK PM condemns booking', time: '2 days ago' },
  { text: 'Pepsi pulls sponsorship', time: '5 days ago' },
];

export default function ControversyGauge({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 60;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (frame >= totalFrames) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  const radius = 80;
  const circumference = Math.PI * radius;
  const sweepLength = (animatedScore / 100) * circumference;
  const arcColor = getArcColor(animatedScore);
  const isCritical = animatedScore >= 85;

  return (
    <div className={`rounded-2xl border bg-zinc-900 p-6 transition-all duration-500 ${
      isCritical
        ? 'border-red-500/30 bg-gradient-to-b from-red-950/20 to-zinc-900'
        : animatedScore >= 60
          ? 'border-amber-500/20 bg-gradient-to-b from-amber-950/10 to-zinc-900'
          : 'border-zinc-800/50'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className={`h-5 w-5 ${isCritical ? 'text-red-400 animate-pulse' : 'text-red-400'}`} />
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Controversy Index</h3>
        {isCritical && (
          <span className="ml-auto rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-400 animate-pulse">
            CRITICAL
          </span>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className={`relative ${isCritical ? 'gauge-critical' : ''}`}>
          <svg width="200" height="120" viewBox="0 0 200 120">
            {/* Background arc */}
            <path
              d="M 10 110 A 80 80 0 0 1 190 110"
              fill="none"
              stroke="#27272a"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Colored arc */}
            <path
              d="M 10 110 A 80 80 0 0 1 190 110"
              fill="none"
              stroke={arcColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${sweepLength} ${circumference}`}
              style={{ filter: isCritical ? `drop-shadow(0 0 8px ${arcColor})` : undefined }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <span className="text-4xl font-bold text-white tabular-nums">{animatedScore}</span>
            <span className={`text-xs font-bold tracking-widest ${getLabelColor(animatedScore)}`}>
              {getLabel(animatedScore)}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-5 space-y-2">
        {controversyEvents.map((evt, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1.5 flex flex-col items-center">
              <div className="h-2 w-2 rounded-full bg-red-500/60" />
              {i < controversyEvents.length - 1 && <div className="h-5 w-px bg-zinc-700" />}
            </div>
            <div className="flex flex-1 items-center justify-between">
              <span className="text-sm text-zinc-300">{evt.text}</span>
              <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">{evt.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500">
        <TrendingUp className="h-3 w-3" />
        <span>+14 points in last 7 days</span>
      </div>
    </div>
  );
}
