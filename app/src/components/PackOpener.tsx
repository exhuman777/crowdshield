'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Sparkles, RotateCcw, Plus, Trophy } from 'lucide-react';
import { BoosterPack, ShieldCard as ShieldCardType, CardRarity } from '@/lib/types';
import { demoPackResult } from '@/lib/card-data';
import ShieldCard from './ShieldCard';

type OpenerState = 'closed' | 'opening' | 'revealing' | 'revealed';

const rarityOrder: Record<CardRarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

const rarityFlashColor: Record<CardRarity, string> = {
  common: 'bg-zinc-400/10',
  uncommon: 'bg-emerald-400/15',
  rare: 'bg-blue-400/20',
  epic: 'bg-purple-400/25',
  legendary: 'bg-amber-400/30',
};

interface Props {
  pack: BoosterPack;
  onClose: () => void;
}

export default function PackOpener({ pack, onClose }: Props) {
  const [state, setState] = useState<OpenerState>('closed');
  const [revealedCount, setRevealedCount] = useState(0);
  const [flashRarity, setFlashRarity] = useState<CardRarity | null>(null);
  const cards = demoPackResult.slice(0, pack.cardCount);

  const startOpening = useCallback(() => {
    setState('opening');
    setTimeout(() => {
      setState('revealing');
      let count = 0;
      const interval = setInterval(() => {
        const card = cards[count];
        // Flash on rare+ cards
        if (card && rarityOrder[card.rarity] >= 2) {
          setFlashRarity(card.rarity);
          setTimeout(() => setFlashRarity(null), 600);
        }
        count++;
        setRevealedCount(count);
        if (count >= cards.length) {
          clearInterval(interval);
          setTimeout(() => setState('revealed'), 600);
        }
      }, 700);
    }, 2000);
  }, [cards]);

  const totalValue = cards.reduce((sum, c) => sum + c.currentMarketValue, 0);
  const bestPull = useMemo(() => {
    return cards.reduce((best, c) =>
      rarityOrder[c.rarity] > rarityOrder[best.rarity] ? c : best
    , cards[0]);
  }, [cards]);
  const hasTriggered = cards.some((c) => c.isTriggered);

  return (
    <div className="relative rounded-2xl border border-zinc-800/50 bg-zinc-900/80 p-6 overflow-hidden">
      {/* Screen flash overlay for rare+ reveals */}
      <AnimatePresence>
        {flashRarity && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`screen-flash pointer-events-none absolute inset-0 z-20 ${rarityFlashColor[flashRarity]}`}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* CLOSED - Show sealed pack */}
        {state === 'closed' && (
          <motion.div
            key="closed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center py-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="relative cursor-pointer"
              onClick={startOpening}
              style={{ perspective: 800 }}
            >
              <div className="relative flex h-64 w-48 flex-col items-center justify-center rounded-2xl border-2 border-zinc-600/50 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 shadow-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/10 via-transparent to-purple-500/10" />
                <Package className="h-16 w-16 text-emerald-400/60" />
                <p className="mt-3 text-lg font-bold text-white">{pack.name}</p>
                <p className="text-xs text-zinc-500">{pack.cardCount} cards</p>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
                </div>
              </div>
            </motion.div>

            <button
              onClick={startOpening}
              className="mt-6 rounded-xl bg-emerald-500 px-8 py-3 text-base font-bold text-black transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]"
            >
              Open Pack
            </button>
            <p className="mt-2 text-xs text-zinc-600">Click the pack or button to open</p>
          </motion.div>
        )}

        {/* OPENING - Pack shakes, glows, and tears */}
        {state === 'opening' && (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-12"
          >
            <motion.div
              animate={{
                rotate: [0, -3, 3, -3, 3, -2, 2, -1, 1, 0],
                scale: [1, 1.01, 1, 1.02, 1, 1.03, 1.05, 1.08, 1.12, 1.2],
              }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="pack-glow relative flex h-64 w-48 flex-col items-center justify-center rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 shadow-2xl shadow-emerald-500/20">
                <motion.div
                  animate={{ opacity: [0.1, 0.3, 0.1, 0.5, 0.2, 0.7, 0.9, 1] }}
                  transition={{ duration: 1.8 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/30 via-transparent to-purple-500/30"
                />
                {/* Tear line effect */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 0, 0.3, 0.5, 0.7, 1] }}
                  transition={{ duration: 1.8, ease: 'easeIn' }}
                  className="absolute left-2 right-2 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent"
                />
                <Package className="h-16 w-16 text-emerald-400" />
                <p className="mt-3 text-lg font-bold text-white">{pack.name}</p>
              </div>
            </motion.div>
            <p className="mt-6 text-sm text-zinc-400 animate-pulse">Opening...</p>
          </motion.div>
        )}

        {/* REVEALING - Cards flip one by one with 3D perspective */}
        {(state === 'revealing' || state === 'revealed') && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">
                {state === 'revealed' ? 'Pack Opened!' : 'Revealing cards...'}
              </h3>
              {state === 'revealed' && hasTriggered && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-1 text-sm font-semibold text-amber-400"
                >
                  You pulled a TRIGGERED card!
                </motion.p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {cards.map((card, i) => (
                <div key={card.id} className="relative" style={{ perspective: 800 }}>
                  <AnimatePresence>
                    {i < revealedCount ? (
                      <motion.div
                        initial={{ rotateY: 180, opacity: 0, scale: 0.8 }}
                        animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.6,
                          ease: [0.23, 1, 0.32, 1],
                          scale: { duration: 0.4 },
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <ShieldCard card={card} size="sm" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex aspect-[2.5/3.5] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-800/50"
                      >
                        <span className="text-2xl text-zinc-700">?</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Summary + actions */}
            {state === 'revealed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-4 border-t border-zinc-800 pt-4"
              >
                {/* Pack value summary */}
                <div className="w-full max-w-md rounded-xl border border-zinc-800/80 bg-zinc-800/30 p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-zinc-500">Pack Value</p>
                      <p className="mt-0.5 text-lg font-bold text-emerald-400">{totalValue.toFixed(1)} USDC</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Pack Cost</p>
                      <p className="mt-0.5 text-lg font-bold text-zinc-300">${pack.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Best Pull</p>
                      <div className="mt-0.5 flex items-center justify-center gap-1">
                        <Trophy className="h-3.5 w-3.5 text-amber-400" />
                        <p className="text-sm font-bold text-white truncate">{bestPull.name}</p>
                      </div>
                      <p className="text-[10px] text-zinc-500 capitalize">{bestPull.rarity}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setState('closed');
                      setRevealedCount(0);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Open Another
                  </button>
                  <button className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="h-4 w-4" />
                    Add to Collection
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Back to store
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
