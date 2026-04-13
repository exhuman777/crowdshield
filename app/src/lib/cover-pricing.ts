import { CoverType } from './types';

export function calculateCoverPremium(params: {
  coverType: CoverType;
  payoutAmount: number;
  controversyScore: number;
  coversSold: number;
  maxTickets: number;
  daysToEvent: number;
}): number {
  const baseRates: Record<CoverType, number> = {
    cancellation: 0.03,
    delay: 0.015,
    headliner_changed: 0.02,
    weather_rain: 0.018,
    venue_changed: 0.02,
  };

  const baseRate = baseRates[params.coverType];
  const controversyMult = 1 + Math.pow(params.controversyScore / 100, 2);
  const demandCurve = 1 + Math.pow(params.coversSold / params.maxTickets, 3);
  const safedays = Math.max(params.daysToEvent, 1);
  const timeDecay = 1 + (1 / Math.sqrt(safedays));

  return Math.round(baseRate * params.payoutAmount * controversyMult * demandCurve * timeDecay * 100) / 100;
}

export function estimateCoverMarketValue(params: {
  premiumPaid: number;
  payoutAmount: number;
  currentControversyScore: number;
  originalControversyScore: number;
  coverType: CoverType;
  daysToEvent: number;
  coversSold: number;
  maxTickets: number;
}): number {
  const currentPremium = calculateCoverPremium({
    coverType: params.coverType,
    payoutAmount: params.payoutAmount,
    controversyScore: params.currentControversyScore,
    coversSold: params.coversSold,
    maxTickets: params.maxTickets,
    daysToEvent: params.daysToEvent,
  });
  return currentPremium;
}
