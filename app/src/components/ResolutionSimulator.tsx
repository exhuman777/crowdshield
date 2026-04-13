'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2, CheckCircle2, RotateCcw, PartyPopper } from 'lucide-react';

type SimState = 'idle' | 'resolving' | 'payout' | 'complete';

export default function ResolutionSimulator() {
  const [state, setState] = useState<SimState>('idle');
  const [payoutCount, setPayoutCount] = useState(0);

  const runSimulation = () => {
    setState('resolving');

    setTimeout(() => {
      setState('payout');
      let count = 0;
      const target = 300.0;
      const interval = setInterval(() => {
        count += 7.50;
        if (count >= target) {
          count = target;
          clearInterval(interval);
          setTimeout(() => setState('complete'), 400);
        }
        setPayoutCount(Math.round(count * 100) / 100);
      }, 30);
    }, 1800);
  };

  const reset = () => {
    setState('idle');
    setPayoutCount(0);
  };

  return (
    <div className={`relative rounded-2xl border bg-zinc-900 p-6 overflow-hidden transition-all duration-500 ${
      state === 'resolving'
        ? 'border-amber-500/30 bg-gradient-to-b from-amber-950/10 to-zinc-900'
        : state === 'payout' || state === 'complete'
          ? 'border-emerald-500/30 bg-gradient-to-b from-emerald-950/10 to-zinc-900'
          : 'border-zinc-800/50'
    }`}>
      {/* Background flash on payout start */}
      <AnimatePresence>
        {state === 'payout' && payoutCount < 50 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-emerald-400 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">
        Resolution Simulator
      </h3>
      <p className="text-xs text-zinc-500 mb-5">
        Demo: see what happens when an event gets cancelled
      </p>

      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button
              onClick={runSimulation}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-4 text-base font-semibold text-white transition-all hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/20"
            >
              <Zap className="h-5 w-5" />
              Simulate: Event Cancelled
            </button>
          </motion.div>
        )}

        {state === 'resolving' && (
          <motion.div
            key="resolving"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-3 py-4"
          >
            <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
            <p className="text-sm font-medium text-amber-400">Oracle confirming resolution...</p>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="h-1.5 w-8 rounded-full bg-amber-400/30"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {(state === 'payout' || state === 'complete') && (
          <motion.div
            key="payout"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-4"
          >
            {state === 'complete' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 className="h-14 w-14 text-emerald-400" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="h-14 w-14 rounded-full border-2 border-emerald-400/30 flex items-center justify-center"
              >
                <span className="text-emerald-400 text-xl font-bold">$</span>
              </motion.div>
            )}

            <motion.p
              className="text-4xl font-bold text-emerald-400 tabular-nums"
              animate={state === 'complete' ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              {payoutCount.toFixed(2)} USDC
            </motion.p>

            {state === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full text-center"
              >
                <p className="text-base font-medium text-white">Deposited to your wallet</p>
                <div className="mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
                  <div className="flex items-center justify-center gap-1.5 text-sm text-emerald-400">
                    <PartyPopper className="h-4 w-4" />
                    <span>Your cover saved you from losing your flight + hotel costs</span>
                  </div>
                  <p className="mt-2 text-xs text-emerald-400/60">Paid 10.86 USDC premium, received 300 USDC payout. 27.6x return.</p>
                </div>
                <button
                  onClick={reset}
                  className="mt-4 flex items-center gap-1.5 mx-auto rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Demo
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
