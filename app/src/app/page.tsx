import Link from 'next/link';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import ShieldCard from '@/components/ShieldCard';
import { events } from '@/lib/mock-data';
import { allShieldCards, boosterPacks } from '@/lib/card-data';
import { AlertTriangle, TrendingUp, Zap, ArrowRight, Package, Shield, Layers, DollarSign } from 'lucide-react';

const facts = [
  { label: '40+ festivals cancelled in 2025', sublabel: 'musicfestivalwizard.com', value: '40+', icon: AlertTriangle },
  { label: '$6.5B insurance market', sublabel: 'market.us', value: '$6.5B', icon: TrendingUp },
  { label: '3 second payouts on Solana', sublabel: '', value: '3s', icon: Zap },
];

const featuredCards = [
  allShieldCards.find((c) => c.id === 'card-wireless-cancelled')!,
  allShieldCards.find((c) => c.id === 'card-hurricane-atlantic')!,
  allShieldCards.find((c) => c.id === 'card-pandemic-alert')!,
  allShieldCards.find((c) => c.id === 'card-heathrow-shutdown')!,
  allShieldCards.find((c) => c.id === 'card-california-quake')!,
];

const previewPacks = boosterPacks.slice(0, 2);

const howItWorks = [
  {
    icon: Package,
    title: 'Buy Packs',
    desc: 'Grab booster packs containing random Shield Cards, each a real parametric insurance contract.',
  },
  {
    icon: Layers,
    title: 'Collect Shields',
    desc: 'Build a portfolio of coverage. Trade cards on secondary markets. Stack protection.',
  },
  {
    icon: DollarSign,
    title: 'Get Paid',
    desc: 'When a trigger hits, oracle confirms, payout lands in your wallet. 3 seconds on Solana.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/50">
        <div className="hero-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950/80" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium text-emerald-400">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Season 1: Chaos Season Live
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Insurance for the{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                chaos era
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400 sm:text-xl">
              Collect Shield Cards. Protect against real-world events.
              <br className="hidden sm:block" />
              Get instant payouts when disasters strike.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/packs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-bold text-black transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
              >
                <Package className="h-5 w-5" />
                Open Packs
              </Link>
              <Link
                href="/event/wireless-2026"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-8 py-3.5 text-base font-medium text-zinc-200 transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98]"
              >
                Protect an Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Shield Cards - horizontal snap scroll */}
      <section className="border-b border-zinc-800/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Featured Shield Cards</h2>
            <Link href="/cards" className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x-mandatory scrollbar-hide">
            {featuredCards.map((card) => (
              <Link key={card.id} href={`/card/${card.id}`} className="w-56 shrink-0 snap-start">
                <ShieldCard card={card} size="sm" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="border-b border-zinc-800/50 bg-zinc-900/50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col items-center gap-1 px-4 py-6">
              <fact.icon className="h-5 w-5 text-emerald-400 mb-1" />
              <p className="text-2xl font-bold text-white sm:text-3xl">{fact.value}</p>
              <p className="text-xs text-zinc-500 text-center">{fact.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-zinc-800/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">How CrowdShield Works</h2>
            <p className="mt-2 text-sm text-zinc-500">Three steps to protection</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {howItWorks.map((step, i) => (
              <div key={step.title} className="relative text-center">
                {/* Step number */}
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
                  <step.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step.desc}</p>
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden sm:block absolute top-7 left-[calc(50%+40px)] w-[calc(100%-80px)] border-t border-dashed border-zinc-800" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two products side by side */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Shield Packs preview */}
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Shield Packs</h3>
              <Link href="/packs" className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                Browse Packs <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="mb-4 text-xs text-zinc-500">Buy booster packs containing random Shield Cards, each a parametric micro-insurance on real-world events.</p>
            <div className="grid gap-3 grid-cols-2">
              {previewPacks.map((pack) => (
                <Link
                  key={pack.id}
                  href="/packs"
                  className="rounded-xl border border-zinc-800/50 bg-zinc-800/30 p-3 text-center transition-all hover:bg-zinc-800/60 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Package className="mx-auto h-8 w-8 text-zinc-500 mb-1" />
                  <p className="text-sm font-semibold text-white">{pack.name}</p>
                  <p className="text-xs text-zinc-500">{pack.cardCount} cards &middot; ${pack.price}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Event Protection preview */}
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Event Protection</h3>
              <Link href="/" className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                Browse Events <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="mb-4 text-xs text-zinc-500">Buy ticket covers for specific events. Get instant payouts when events get cancelled, delayed, or changed.</p>
            <div className="grid gap-3 grid-cols-2">
              {events.slice(0, 2).map((event) => (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="rounded-xl border border-zinc-800/50 bg-zinc-800/30 p-3 transition-all hover:bg-zinc-800/60 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <p className="text-sm font-semibold text-white truncate">{event.name}</p>
                  <p className="text-xs text-zinc-500">{event.city}</p>
                  <p className="mt-1 text-xs text-emerald-400">{event.ticketPrice} USDC</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">All Events</h2>
            <p className="mt-0.5 text-xs text-zinc-500">Browse events and add protection covers</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Built On / Backed By */}
      <section className="border-t border-zinc-800/50 bg-zinc-900/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-8">Built With</p>
          <div className="flex flex-wrap items-center justify-center gap-10 text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                <span className="text-sm font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">S</span>
              </div>
              <span className="text-sm font-medium text-zinc-400">Built on Solana</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                <span className="text-sm font-bold text-emerald-400">Sw</span>
              </div>
              <span className="text-sm font-medium text-zinc-400">Oracles by Switchboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                <Shield className="h-4 w-4 text-zinc-400" />
              </div>
              <span className="text-sm font-medium text-zinc-400">Parametric Insurance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">CrowdShield</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              <Link href="/about" className="hover:text-zinc-300 transition-colors">About</Link>
              <Link href="/packs" className="hover:text-zinc-300 transition-colors">Packs</Link>
              <Link href="/event/wireless-2026" className="hover:text-zinc-300 transition-colors">Events</Link>
              <a href="https://github.com/exhuman777/crowdshield" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">GitHub</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">Twitter</a>
            </div>
            <p className="text-xs text-zinc-700">&copy; 2026 CrowdShield</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
