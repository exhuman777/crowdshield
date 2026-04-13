'use client';

import { useState } from 'react';
import { Poll } from '@/lib/types';
import { BarChart3, Check } from 'lucide-react';

interface PollWidgetProps {
  poll: Poll;
  hasVoted?: boolean;
  userVote?: number;
}

export default function PollWidget({ poll, hasVoted: initialVoted = false, userVote: initialVote }: PollWidgetProps) {
  const [hasVoted, setHasVoted] = useState(initialVoted);
  const [userVote, setUserVote] = useState<number | undefined>(initialVote);
  const [options, setOptions] = useState(poll.options);
  const [totalVotes, setTotalVotes] = useState(poll.totalVotes);

  const handleVote = (index: number) => {
    if (hasVoted) return;
    setHasVoted(true);
    setUserVote(index);
    const newTotal = totalVotes + 1;
    setTotalVotes(newTotal);
    const newOptions = options.map((opt, i) => {
      const newVotes = i === index ? opt.votes + 1 : opt.votes;
      return { ...opt, votes: newVotes, percentage: Math.round((newVotes / newTotal) * 100) };
    });
    setOptions(newOptions);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="h-4 w-4 text-blue-400" />
        <h4 className="text-sm font-medium text-white">{poll.question}</h4>
      </div>

      <div className="space-y-2">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleVote(i)}
            disabled={hasVoted}
            className={`relative w-full overflow-hidden rounded-lg border text-left transition-all ${
              hasVoted
                ? userVote === i
                  ? 'border-emerald-500/30 bg-zinc-800'
                  : 'border-zinc-800 bg-zinc-800/50'
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600 cursor-pointer'
            }`}
          >
            {hasVoted && (
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                  userVote === i ? 'bg-emerald-500/15' : 'bg-zinc-700/30'
                }`}
                style={{ width: `${option.percentage}%` }}
              />
            )}
            <div className="relative flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                {hasVoted && userVote === i && (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                )}
                <span className={`text-sm ${userVote === i ? 'font-medium text-white' : 'text-zinc-300'}`}>
                  {option.label}
                </span>
              </div>
              {hasVoted && (
                <span className="text-sm font-medium text-zinc-400">{option.percentage}%</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <p className="mt-2 text-xs text-zinc-500">
        {totalVotes.toLocaleString()} votes
      </p>
    </div>
  );
}
