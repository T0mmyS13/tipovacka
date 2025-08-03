import { Tip, Ticket, User, Sport, TipStatus, TicketStatus, OddsMovement } from '@prisma/client';

// Extended types with relations
export interface TipWithDetails extends Tip {
  ticketTips?: TicketTip[];
  comments?: Comment[];
}

export interface TicketWithTips extends Ticket {
  ticketTips: (TicketTip & {
    tip: Tip;
  })[];
  user?: User;
}

export interface TicketTip {
  id: string;
  ticketId: string;
  tipId: string;
  tip?: Tip;
}

// Betting calculation utilities
export interface BettingCalculations {
  valueScore: number;
  expectedReturn: number;
  breakEvenPercentage: number;
  riskToReward: number;
}

// Filter types
export interface TipFilters {
  sport?: Sport;
  dateRange?: 'today' | 'tomorrow' | 'week';
  oddsRange?: {
    min: number;
    max: number;
  };
  confidenceLevel?: {
    min: number;
    max: number;
  };
  valueOnly?: boolean;
}

// Ticket builder types
export interface TicketBuilder {
  tips: Tip[];
  totalOdds: number;
  stake?: number;
  estimatedPayout?: number;
  scenarios: TicketScenario[];
}

export interface TicketScenario {
  name: string;
  probability: number;
  payout: number;
  description: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Authentication types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}

// Statistics types
export interface UserStats {
  totalTickets: number;
  wonTickets: number;
  lostTickets: number;
  winRate: number;
  totalProfit: number;
  averageOdds: number;
}

export interface TipStats {
  totalTips: number;
  wonTips: number;
  lostTips: number;
  winRate: number;
  averageOdds: number;
  profitLoss: number;
}
