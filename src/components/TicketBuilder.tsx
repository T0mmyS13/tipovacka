'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket,
  X,
  Calculator,
  TrendingUp,
  AlertTriangle,
  Save,
  Share2,
  DollarSign
} from 'lucide-react';
import { calculateCombinedOdds, calculateTicketScenarios, getBettingCalculations } from '@/lib/betting-utils';
import { useAuth } from '@/contexts/AuthContext';

interface TicketBuilderProps {
  className?: string;
}

export function TicketBuilder({ className = '' }: TicketBuilderProps) {
  const { user } = useAuth();
  const [selectedTips, setSelectedTips] = useState<any[]>([]);
  const [stake, setStake] = useState<number>(100);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const totalOdds = selectedTips.length > 0 ? calculateCombinedOdds(selectedTips) : 0;
  const estimatedPayout = stake * totalOdds;
  const potentialProfit = estimatedPayout - stake;

  useEffect(() => {
    if (selectedTips.length > 0) {
      setIsCalculating(true);
      // Simulate calculation delay for better UX
      const timer = setTimeout(() => {
        const calculatedScenarios = calculateTicketScenarios(selectedTips, stake);
        setScenarios(calculatedScenarios);
        setIsCalculating(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setScenarios([]);
    }
  }, [selectedTips, stake]);

  // Listen for tips being added from TipCard components
  useEffect(() => {
    const handleAddTip = (event: CustomEvent) => {
      const tip = event.detail;
      if (!selectedTips.find(t => t.id === tip.id)) {
        setSelectedTips(prev => [...prev, tip]);
      }
    };

    window.addEventListener('addTipToTicket', handleAddTip as EventListener);
    return () => window.removeEventListener('addTipToTicket', handleAddTip as EventListener);
  }, [selectedTips]);

  const removeTip = (tipId: string) => {
    setSelectedTips(prev => prev.filter(tip => tip.id !== tipId));
  };

  const clearTicket = () => {
    setSelectedTips([]);
    setStake(100);
  };

  const saveTicket = async () => {
    if (selectedTips.length === 0) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          tipIds: selectedTips.map(tip => tip.id),
          stake
        })
      });

      const data = await response.json();
      if (data.success) {
        // Show success message or redirect
        alert('Ticket saved successfully!');
        clearTicket();
      } else {
        alert('Failed to save ticket: ' + data.error);
      }
    } catch (error) {
      alert('Error saving ticket');
    } finally {
      setIsSaving(false);
    }
  };

  const shareTicket = async () => {
    if (selectedTips.length === 0) return;
    
    const shareText = `🎯 My Betting Ticket (${totalOdds.toFixed(2)} odds)\n\n` +
      selectedTips.map(tip => `${tip.matchInfo}: ${tip.suggestedPick} @ ${tip.odds}`).join('\n') +
      `\n\nStake: $${stake} | Potential Payout: $${estimatedPayout.toFixed(2)}`;
    
    if (navigator.share) {
      await navigator.share({
        title: 'My Betting Ticket',
        text: shareText
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Ticket copied to clipboard!');
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Ticket Builder
            </h2>
          </div>
          
          {selectedTips.length > 0 && (
            <button
              onClick={clearTicket}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {selectedTips.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Ticket className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tips selected
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Add tips from the list above to build your betting ticket
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Selected Tips */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Selected Tips ({selectedTips.length})
              </h3>
              
              <AnimatePresence>
                {selectedTips.map((tip) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {tip.matchInfo}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {tip.suggestedPick}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            {tip.odds.toFixed(2)}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {tip.winProbability.toFixed(1)}% prob.
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeTip(tip.id)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-3"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Stake Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stake Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter stake amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Ticket Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Odds</div>
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {totalOdds.toFixed(2)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Potential Payout</div>
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    ${estimatedPayout.toFixed(2)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Potential Profit</div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    +${potentialProfit.toFixed(2)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Combined Prob.</div>
                  <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
                    {((selectedTips.reduce((prob, tip) => prob * (tip.winProbability / 100), 1)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Scenarios */}
            {scenarios.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Scenarios Analysis
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {scenarios.slice(0, 3).map((scenario, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {scenario.name}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                          {scenario.probability.toFixed(1)}% probability
                        </div>
                      </div>
                      
                      <div className={`font-semibold text-sm ${
                        scenario.payout > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {scenario.payout > 0 ? `+$${scenario.payout.toFixed(2)}` : '$0.00'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Warning */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Risk Notice:</strong> This is an accumulator bet. All selections must win for the ticket to pay out. 
                  Consider the combined probability of {((selectedTips.reduce((prob, tip) => prob * (tip.winProbability / 100), 1)) * 100).toFixed(1)}% when placing your stake.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={saveTicket}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : user ? 'Save Ticket' : 'Save as Guest'}
              </button>
              
              <button
                onClick={shareTicket}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share Ticket
              </button>
            </div>

            {!user && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <a href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Sign in
                </a> to track your betting history and statistics
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
