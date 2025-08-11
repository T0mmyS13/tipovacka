"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, TrendingUp, TrendingDown, Calendar, Trophy, Target, BarChart3, RefreshCw, Settings, Home, Database } from 'lucide-react';

// Mock data for demonstration
const mockMatches = [
    {
        id: 1,
        homeTeam: "Manchester City",
        awayTeam: "Liverpool",
        league: "Premier League",
        date: "2025-08-15",
        time: "15:00",
        homeOdds: 2.10,
        drawOdds: 3.40,
        awayOdds: 3.20,
        predictedOutcome: "home",
        confidence: 78,
        expectedValue: 15.2,
        bookmaker: "Bet365",
        homeForm: [1, 1, 0, 1, 1],
        awayForm: [1, 0, 1, 1, 0],
        h2h: { home: 3, draw: 1, away: 2 },
        injuries: { home: 1, away: 3 }
    },
    {
        id: 2,
        homeTeam: "Barcelona",
        awayTeam: "Real Madrid",
        league: "La Liga",
        date: "2025-08-15",
        time: "20:00",
        homeOdds: 2.50,
        drawOdds: 3.10,
        awayOdds: 2.80,
        predictedOutcome: "away",
        confidence: 65,
        expectedValue: 8.7,
        bookmaker: "William Hill",
        homeForm: [1, 0, 1, 1, 0],
        awayForm: [1, 1, 1, 0, 1],
        h2h: { home: 2, draw: 2, away: 4 },
        injuries: { home: 2, away: 1 }
    },
    {
        id: 3,
        homeTeam: "Bayern Munich",
        awayTeam: "Borussia Dortmund",
        league: "Bundesliga",
        date: "2025-08-16",
        time: "18:30",
        homeOdds: 1.85,
        drawOdds: 3.60,
        awayOdds: 4.20,
        predictedOutcome: "home",
        confidence: 82,
        expectedValue: 12.3,
        bookmaker: "Betfair",
        homeForm: [1, 1, 1, 0, 1],
        awayForm: [0, 1, 0, 1, 1],
        h2h: { home: 5, draw: 1, away: 2 },
        injuries: { home: 0, away: 2 }
    }
];

const mockResults = [
    { id: 1, match: "Chelsea vs Arsenal", prediction: "home", actual: "home", correct: true, profit: 12.5, confidence: 75 },
    { id: 2, match: "PSG vs Lyon", prediction: "away", actual: "draw", correct: false, profit: -10, confidence: 68 },
    { id: 3, match: "Juventus vs AC Milan", prediction: "draw", actual: "draw", correct: true, profit: 28, confidence: 71 }
];

const SportsBettingApp = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLeague, setSelectedLeague] = useState('all');
    const [sortBy, setSortBy] = useState('ev');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    // Simulate data refresh
    const refreshData = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    // Filter and sort matches
    const filteredMatches = mockMatches
        .filter(match =>
            (selectedLeague === 'all' || match.league === selectedLeague) &&
            (match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            switch(sortBy) {
                case 'ev': return b.expectedValue - a.expectedValue;
                case 'confidence': return b.confidence - a.confidence;
                case 'date': return new Date(a.date) - new Date(b.date);
                default: return 0;
            }
        });

    const ValueIndicator = ({ value, confidence }) => {
        const getColor = () => {
            if (value > 10) return 'text-green-500';
            if (value > 5) return 'text-yellow-500';
            return 'text-red-500';
        };

        return (
            <div className="flex items-center space-x-2">
                <div className={`font-bold text-lg ${getColor()}`}>
                    {value > 0 ? '+' : ''}{value.toFixed(1)}%
                </div>
                <div className="flex items-center space-x-1">
                    <div className="text-sm text-gray-600">({confidence}%)</div>
                    {value > 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                </div>
            </div>
        );
    };

    const FormDisplay = ({ form }) => (
        <div className="flex space-x-1">
            {form.map((result, idx) => (
                <div
                    key={idx}
                    className={`w-3 h-3 rounded-full ${
                        result === 1 ? 'bg-green-500' : result === 0 ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                />
            ))}
        </div>
    );

    const MatchCard = ({ match }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => setSelectedMatch(match)}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {match.homeTeam} vs {match.awayTeam}
                        </h3>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {match.league}
            </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
                {match.date} at {match.time}
            </span>
                        <span>{match.bookmaker}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-sm text-gray-500">Home</div>
                    <div className="text-lg font-bold">{match.homeOdds}</div>
                    <FormDisplay form={match.homeForm} />
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-500">Draw</div>
                    <div className="text-lg font-bold">{match.drawOdds}</div>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-500">Away</div>
                    <div className="text-lg font-bold">{match.awayOdds}</div>
                    <FormDisplay form={match.awayForm} />
                </div>
            </div>

            <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-sm text-gray-600">Predicted:
                            <span className="font-semibold ml-1 capitalize">{match.predictedOutcome}</span>
                        </div>
                        <ValueIndicator value={match.expectedValue} confidence={match.confidence} />
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Injuries</div>
                        <div className="text-sm">H: {match.injuries.home} A: {match.injuries.away}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const Dashboard = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: "Total Bets Analyzed", value: "1,247", icon: Target, color: "blue" },
                    { title: "Success Rate", value: "68.3%", icon: Trophy, color: "green" },
                    { title: "Average EV", value: "+7.2%", icon: TrendingUp, color: "purple" },
                    { title: "ROI This Month", value: "+15.8%", icon: BarChart3, color: "orange" }
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <stat.icon className={`w-12 h-12 text-${stat.color}-500`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search teams..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={selectedLeague}
                        onChange={(e) => setSelectedLeague(e.target.value)}
                    >
                        <option value="all">All Leagues</option>
                        <option value="Premier League">Premier League</option>
                        <option value="La Liga">La Liga</option>
                        <option value="Bundesliga">Bundesliga</option>
                    </select>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="ev">Expected Value</option>
                        <option value="confidence">Confidence</option>
                        <option value="date">Date</option>
                    </select>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={refreshData}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </motion.button>
                </div>
            </div>

            {/* Matches */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Value Opportunities</h2>
                <AnimatePresence>
                    {filteredMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );

    const ResultsTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Results</h2>
                <div className="space-y-4">
                    {mockResults.map((result) => (
                        <motion.div
                            key={result.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                            <div className="flex-1">
                                <div className="font-semibold">{result.match}</div>
                                <div className="text-sm text-gray-600">
                                    Predicted: {result.prediction} | Actual: {result.actual} | Confidence: {result.confidence}%
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                result.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {result.correct ? 'Correct' : 'Wrong'}
                            </div>
                            <div className={`ml-4 font-bold ${
                                result.profit > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {result.profit > 0 ? '+' : ''}${result.profit}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );

    const AdminTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Data Management</h3>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                            <Database className="w-4 h-4" />
                            <span>Update Match Data</span>
                        </button>
                        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
                            <RefreshCw className="w-4 h-4" />
                            <span>Retrain ML Model</span>
                        </button>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">System Status</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>API Status:</span>
                                <span className="text-green-600 font-semibold">Online</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Model Accuracy:</span>
                                <span className="text-blue-600 font-semibold">68.3%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Last Update:</span>
                                <span className="text-gray-600">2 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Match Detail Modal
    const MatchDetailModal = ({ match, onClose }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {match.homeTeam} vs {match.awayTeam}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">Head to Head (Last 8)</h3>
                            <div className="space-y-1">
                                <div>Home Wins: {match.h2h.home}</div>
                                <div>Draws: {match.h2h.draw}</div>
                                <div>Away Wins: {match.h2h.away}</div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Team Form</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <span className="w-20">{match.homeTeam}:</span>
                                    <FormDisplay form={match.homeForm} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-20">{match.awayTeam}:</span>
                                    <FormDisplay form={match.awayForm} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">ML Analysis</h3>
                        <div className="space-y-2">
                            <div>Predicted Outcome: <span className="font-semibold capitalize">{match.predictedOutcome}</span></div>
                            <div>Confidence Level: <span className="font-semibold">{match.confidence}%</span></div>
                            <div>Expected Value: <span className="font-semibold">{match.expectedValue}%</span></div>
                            <div>Recommended Bet: <span className="font-semibold">${(match.expectedValue * 2).toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Target className="w-8 h-8 text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-900">BetValue Analytics</h1>
                        </div>
                        <nav className="flex space-x-8">
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: Home },
                                { id: 'results', label: 'Results', icon: BarChart3 },
                                { id: 'admin', label: 'Admin', icon: Settings }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'dashboard' && <Dashboard />}
                        {activeTab === 'results' && <ResultsTab />}
                        {activeTab === 'admin' && <AdminTab />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Match Detail Modal */}
            <AnimatePresence>
                {selectedMatch && (
                    <MatchDetailModal
                        match={selectedMatch}
                        onClose={() => setSelectedMatch(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default SportsBettingApp;