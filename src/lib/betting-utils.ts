import { Tip, Ticket } from '@prisma/client';
import { BettingCalculations, TicketScenario } from '@/types';

/**
 * Calculate value score using the formula: (estimated probability × odds) - 1
 */
export function calculateValueScore(winProbability: number, odds: number): number {
  return (winProbability / 100) * odds - 1;
}

/**
 * Calculate expected return for a bet
 */
export function calculateExpectedReturn(
  winProbability: number,
  odds: number,
  stake: number
): number {
  const winAmount = stake * odds;
  const lossAmount = -stake;
  const probWin = winProbability / 100;
  const probLoss = 1 - probWin;

  return (probWin * winAmount) + (probLoss * lossAmount);
}

/**
 * Calculate breakeven percentage needed for a bet to be profitable
 */
export function calculateBreakEvenPercentage(odds: number): number {
  return (1 / odds) * 100;
}

/**
 * Calculate risk-to-reward ratio
 */
export function calculateRiskToReward(odds: number, stake: number): number {
  const potentialWin = (odds - 1) * stake;
  return stake / potentialWin;
}

/**
 * Get all betting calculations for a tip
 */
export function getBettingCalculations(
  tip: Tip,
  stake: number = 100
): BettingCalculations {
  return {
    valueScore: calculateValueScore(tip.winProbability, tip.odds),
    expectedReturn: calculateExpectedReturn(tip.winProbability, tip.odds, stake),
    breakEvenPercentage: calculateBreakEvenPercentage(tip.odds),
    riskToReward: calculateRiskToReward(tip.odds, stake)
  };
}

/**
 * Calculate combined odds for multiple tips
 */
export function calculateCombinedOdds(tips: Tip[]): number {
  return tips.reduce((total, tip) => total * tip.odds, 1);
}

/**
 * Calculate ticket scenarios (what happens if one tip fails, etc.)
 */
export function calculateTicketScenarios(
  tips: Tip[],
  stake: number
): TicketScenario[] {
  const scenarios: TicketScenario[] = [];

  // All tips win
  const allWinOdds = calculateCombinedOdds(tips);
  const allWinProbability = tips.reduce((prob, tip) =>
    prob * (tip.winProbability / 100), 1
  ) * 100;

  scenarios.push({
    name: 'All Tips Win',
    probability: allWinProbability,
    payout: stake * allWinOdds,
    description: `If all ${tips.length} tips are correct`
  });

  // One tip fails (for tickets with 2+ tips)
  if (tips.length >= 2) {
    tips.forEach((failedTip, index) => {
      const remainingTips = tips.filter((_, i) => i !== index);
      const remainingOdds = calculateCombinedOdds(remainingTips);
      const remainingProb = remainingTips.reduce((prob, tip) =>
        prob * (tip.winProbability / 100), 1
      ) * (1 - failedTip.winProbability / 100) * 100;

      scenarios.push({
        name: `${failedTip.matchInfo} Fails`,
        probability: remainingProb,
        payout: 0, // In accumulator, one failure = total loss
        description: `If "${failedTip.suggestedPick}" loses`
      });
    });
  }

  // Total loss
  const totalLossProbability = 100 - allWinProbability;
  scenarios.push({
    name: 'Total Loss',
    probability: totalLossProbability,
    payout: 0,
    description: 'If any tip fails (accumulator bet)'
  });

  return scenarios.sort((a, b) => b.probability - a.probability);
}

/**
 * Determine if a bet has value (positive expected value)
 */
export function isValueBet(tip: Tip): boolean {
  return calculateValueScore(tip.winProbability, tip.odds) > 0;
}

/**
 * Get confidence level description
 */
export function getConfidenceDescription(score: number): string {
  if (score >= 9) return 'Very High';
  if (score >= 7) return 'High';
  if (score >= 5) return 'Medium';
  if (score >= 3) return 'Low';
  return 'Very Low';
}

/**
 * Format odds for display
 */
export function formatOdds(odds: number, format: 'decimal' | 'fractional' | 'american' = 'decimal'): string {
  switch (format) {
    case 'fractional':
      const numerator = Math.round((odds - 1) * 100);
      return `${numerator}/100`;
    case 'american':
      if (odds >= 2) {
        return `+${Math.round((odds - 1) * 100)}`;
      } else {
        return `-${Math.round(100 / (odds - 1))}`;
      }
    default:
      return odds.toFixed(2);
  }
}

/**
 * Calculate Kelly Criterion for optimal stake sizing
 */
export function calculateKellyCriterion(winProbability: number, odds: number): number {
  const p = winProbability / 100; // convert to decimal
  const q = 1 - p; // probability of losing
  const b = odds - 1; // net odds received

  const kelly = (b * p - q) / b;
  return Math.max(0, Math.min(kelly, 0.25)); // Cap at 25% for safety
}
