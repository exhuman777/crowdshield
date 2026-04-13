export type CoverType = 'cancellation' | 'delay' | 'headliner_changed' | 'weather_rain' | 'venue_changed';

export interface EventData {
  id: string;
  name: string;
  venue: string;
  city: string;
  date: string;
  imageUrl: string;
  ticketPrice: number;
  ticketsSold: number;
  maxTickets: number;
  controversyScore: number;
  organizerBond: number;
  organizerTrustTier: 'unverified' | 'standard' | 'trusted' | 'guaranteed';
  coverTypes: CoverType[];
  isResolved: boolean;
  tags: string[];
  backstory?: EventBackstory;
  methodology?: EventMethodology;
}

export interface Cover {
  id: string;
  eventId: string;
  coverType: CoverType;
  premiumPaid: number;
  payoutAmount: number;
  isResolved: boolean;
  outcome: boolean | null;
  isClaimed: boolean;
  purchasedAt: string;
  currentMarketValue: number;
}

export interface PollOption {
  label: string;
  votes: number;
  percentage: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt: string;
}

export interface FeedItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  detail: string;
  timestamp: string;
}

// Shield Packs TCG system
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type CardCategory = 'natural_disaster' | 'travel' | 'event' | 'health' | 'geopolitical' | 'crypto';

export interface CardResolution {
  trigger: string;
  oracleSource: string;
  oracleUrl: string;
  verificationMethod: string;
  resolutionWindow: string;
  binaryQuestion: string;
}

export interface CardOdds {
  estimatedProbability: number;
  methodology: string;
  historicalRate: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  trendNote: string;
}

export interface CardNews {
  headline: string;
  source: string;
  date: string;
  impact: 'bullish' | 'bearish' | 'neutral';
  snippet: string;
}

export interface CardBackstory {
  summary: string;
  whyItMatters: string;
  historicalContext: string;
  currentSituation: string;
}

export interface ShieldCard {
  id: string;
  name: string;
  category: CardCategory;
  rarity: CardRarity;
  region: string;
  triggerCondition: string;
  oracleSource: string;
  payoutAmount: number;
  activeWindow: string;
  expiresAt: string;
  editionNumber: number;
  totalEditions: number;
  isTriggered: boolean;
  isExpired: boolean;
  currentMarketValue: number;
  artGradient: string;
  resolution: CardResolution;
  odds: CardOdds;
  news: CardNews[];
  backstory: CardBackstory;
  riskFactors: string[];
  benefitExplainer: string;
}

export interface BoosterPack {
  id: string;
  name: string;
  price: number;
  cardCount: number;
  guaranteedMinRarity: CardRarity;
  season: string;
  description: string;
}

// Event rich content types
export interface EventBackstory {
  summary: string;
  whyControversial: string;
  timeline: { date: string; event: string; impact: string }[];
  stakeholders: string[];
  currentStatus: string;
}

export interface EventMethodology {
  controversyScoreExplainer: string;
  coverPricingExplainer: string;
  resolutionExplainer: string;
  whatYouCanDo: string[];
}
