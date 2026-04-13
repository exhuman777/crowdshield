'use client';

import Link from 'next/link';
import { EventData } from '@/lib/types';
import { Calendar, MapPin, ArrowRight, Ticket } from 'lucide-react';

const categoryGradients: Record<string, string> = {
  Music: 'from-purple-600 to-pink-600',
  Sport: 'from-blue-600 to-cyan-500',
  Conference: 'from-emerald-600 to-teal-500',
  Local: 'from-amber-500 to-orange-500',
};

const categoryEmojis: Record<string, string> = {
  Music: '🎵',
  Sport: '⚽',
  Conference: '💻',
  Local: '🎷',
  Country: '🤠',
  Political: '🏛️',
};

function getControversyColor(score: number) {
  if (score < 30) return 'bg-emerald-500';
  if (score < 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function getControversyWidth(score: number) {
  return `${Math.max(score, 3)}%`;
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export default function EventCard({ event }: { event: EventData }) {
  const primaryTag = event.tags[0] || 'Music';
  const gradient = categoryGradients[primaryTag] || categoryGradients.Music;
  const emoji = categoryEmojis[primaryTag] || '🎤';
  const remaining = event.maxTickets - event.ticketsSold;

  return (
    <Link href={`/event/${event.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900 transition-all duration-300 hover:scale-[1.02] hover:border-zinc-700/50 hover:shadow-xl hover:shadow-zinc-900/50 active:scale-[0.99]">
        {/* Gradient header */}
        <div className={`relative h-32 bg-gradient-to-br ${gradient} p-5`}>
          <span className="text-4xl">{emoji}</span>
          {event.isResolved ? (
            <span className="absolute right-4 top-4 rounded-full bg-red-500/30 px-2 py-0.5 text-xs font-medium text-red-200 backdrop-blur-sm">
              Cancelled
            </span>
          ) : event.controversyScore > 60 ? (
            <span className="absolute right-4 top-4 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-200 backdrop-blur-sm">
              High Risk
            </span>
          ) : null}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
            {event.name}
          </h3>

          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <Calendar className="h-3.5 w-3.5" />
              {event.date}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <MapPin className="h-3.5 w-3.5" />
              {event.venue}, {event.city}
            </div>
          </div>

          {/* Controversy bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Controversy</span>
              <span>{event.controversyScore}/100</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-800">
              <div
                className={`h-1.5 rounded-full ${getControversyColor(event.controversyScore)} transition-all duration-700`}
                style={{ width: getControversyWidth(event.controversyScore) }}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4">
            <div>
              <p className="text-lg font-semibold text-white">{event.ticketPrice} USDC</p>
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Ticket className="h-3 w-3" />
                {formatNumber(remaining)} left
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
              View Event
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
