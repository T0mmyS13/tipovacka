'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  MessageCircle,
  Plus,
  Star,
  Clock,
  BarChart3
} from 'lucide-react';
import { formatOdds, getConfidenceDescription, isValueBet } from '@/lib/betting-utils';
import { format } from 'date-fns';

interface TipCardProps {
  tip: any; // We'll type this properly later
  onAddToTicket?: (tip: any) => void;
}

export function TipCard({ tip, onAddToTicket }: TipCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const valueScore = tip.valueScore;
  const isValue = isValueBet(tip);
  const confidenceDesc = getConfidenceDescription(tip.confidenceScore);

  const getSportColor = (sport: string) => {
    const colors = {
      FOOTBALL: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      SOCCER: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      TENNIS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      BASKETBALL: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      HOCKEY: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      BASEBALL: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[sport as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getOddsMovement = () => {
    switch (tip.oddsMovement) {
      case 'UP':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'DOWN':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4" />; // Placeholder for stable
    }
  };

  return (
    <motion.div
      layout
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSportColor(tip.sport)}`}>
                {tip.sport}
              </span>
              {tip.league && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {tip.league}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {tip.matchInfo}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(tip.matchDate), 'MMM d, yyyy HH:mm')}</span>
            </div>
          </div>

          {/* Value Badge */}
          {isValue && (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
              <Target className="h-4 w-4" />
              <span>Value Bet</span>
            </div>
          )}
        </div>

        {/* Pick and Odds */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Suggested Pick</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {tip.suggestedPick}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Odds</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatOdds(tip.odds)}
                  </span>
                  {getOddsMovement()}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Win Prob.</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {tip.winProbability.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confidence</div>
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {tip.confidenceScore}/10
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {confidenceDesc}
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Value Score</div>
            <div className={`font-semibold ${valueScore > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {valueScore > 0 ? '+' : ''}{valueScore.toFixed(3)}
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Break Even</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {((1 / tip.odds) * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Added to</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {tip._count?.ticketTips || 0} tickets
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {onAddToTicket && (
            <button
              onClick={() => onAddToTicket(tip)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add to Ticket
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            {isExpanded ? 'Hide Details' : 'View Analysis'}
          </button>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors">
            <MessageCircle className="h-4 w-4" />
            Comments ({tip._count?.comments || 0})
          </button>
        </div>

        {/* Expanded Analysis */}
        {isExpanded && tip.analysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Professional Analysis
            </h4>
            <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {tip.analysis}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
