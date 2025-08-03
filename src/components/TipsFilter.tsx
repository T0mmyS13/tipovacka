'use client';

import { TipFilters } from '@/types';
import { Sport } from '@prisma/client';
import { Filter, X } from 'lucide-react';

interface TipsFilterProps {
  filters: TipFilters;
  onFiltersChange: (filters: TipFilters) => void;
}

export function TipsFilter({ filters, onFiltersChange }: TipsFilterProps) {
  const sports = [
    { value: 'FOOTBALL', label: 'Football' },
    { value: 'SOCCER', label: 'Soccer' },
    { value: 'TENNIS', label: 'Tennis' },
    { value: 'BASKETBALL', label: 'Basketball' },
    { value: 'HOCKEY', label: 'Hockey' },
    { value: 'BASEBALL', label: 'Baseball' }
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'week', label: 'This Week' }
  ];

  const updateFilter = (key: keyof TipFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({ dateRange: 'today' });
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    if (key === 'dateRange' && filters[key] === 'today') return false;
    return filters[key as keyof TipFilters] !== undefined;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sport Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sport
          </label>
          <select
            value={filters.sport || ''}
            onChange={(e) => updateFilter('sport', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Sports</option>
            {sports.map(sport => (
              <option key={sport.value} value={sport.value}>
                {sport.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange || 'today'}
            onChange={(e) => updateFilter('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Odds Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Odds Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              step="0.1"
              min="1"
              value={filters.oddsRange?.min || ''}
              onChange={(e) => updateFilter('oddsRange', {
                ...filters.oddsRange,
                min: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              step="0.1"
              min="1"
              value={filters.oddsRange?.max || ''}
              onChange={(e) => updateFilter('oddsRange', {
                ...filters.oddsRange,
                max: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Confidence Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Min Confidence
          </label>
          <select
            value={filters.confidenceLevel?.min || ''}
            onChange={(e) => updateFilter('confidenceLevel', {
              min: e.target.value ? parseInt(e.target.value) : undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any Confidence</option>
            <option value="7">High (7+)</option>
            <option value="5">Medium (5+)</option>
            <option value="3">Low (3+)</option>
          </select>
        </div>
      </div>

      {/* Value Only Toggle */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={filters.valueOnly || false}
            onChange={(e) => updateFilter('valueOnly', e.target.checked || undefined)}
            className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Show only value bets
            </span>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Tips with positive expected value (mathematical edge)
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
