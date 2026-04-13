'use client';

import { FeedItem } from '@/lib/types';

const actionColors: Record<string, string> = {
  'bought': 'bg-emerald-500/20 text-emerald-400',
  'voted': 'bg-blue-500/20 text-blue-400',
  'listed': 'bg-amber-500/20 text-amber-400',
  'flagged': 'bg-red-500/20 text-red-400',
  'posted': 'bg-purple-500/20 text-purple-400',
  'created': 'bg-cyan-500/20 text-cyan-400',
};

function getAvatarColor(action: string): string {
  const key = Object.keys(actionColors).find(k => action.includes(k));
  return key ? actionColors[key] : 'bg-zinc-700 text-zinc-300';
}

export default function SocialFeed({ items }: { items: FeedItem[] }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" />
        <span className="text-sm font-medium text-zinc-300">Live Activity</span>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 border-b border-zinc-800/50 px-4 py-3 last:border-0">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(item.action)}`}>
              {item.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-medium text-white">{item.user}</span>{' '}
                <span className="text-zinc-400">{item.action}</span>
              </p>
              <p className="text-xs text-zinc-500 truncate">{item.detail}</p>
            </div>
            <span className="shrink-0 text-xs text-zinc-600 whitespace-nowrap">{item.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
