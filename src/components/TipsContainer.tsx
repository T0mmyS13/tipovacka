'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TipFilters } from '@/types';
import { TipCard } from './TipCard';
import { TipsFilter } from './TipsFilter';
import { Loader2 } from 'lucide-react';

export function TipsContainer() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TipFilters>({
    dateRange: 'today'
  });

  useEffect(() => {
    fetchTips();
  }, [filters]);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.sport) params.append('sport', filters.sport);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      if (filters.valueOnly) params.append('valueOnly', 'true');
      if (filters.oddsRange?.min) params.append('minOdds', filters.oddsRange.min.toString());
      if (filters.oddsRange?.max) params.append('maxOdds', filters.oddsRange.max.toString());
      if (filters.confidenceLevel?.min) params.append('minConfidence', filters.confidenceLevel.min.toString());

      const response = await fetch(`/api/tips?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTips(data.data);
      } else {
        console.error('Failed to fetch tips:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daily Betting Tips
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Professional analysis with value betting opportunities
          </p>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {!loading && (
            <span>{tips.length} tip{tips.length !== 1 ? 's' : ''} available</span>
          )}
        </div>
      </div>

      <TipsFilter filters={filters} onFiltersChange={setFilters} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : tips.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tips available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or check back later for new tips.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <TipCard tip={tip} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
