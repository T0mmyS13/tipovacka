'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Target, BarChart3, Shield } from 'lucide-react';

export function Hero() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Daily Analysis',
      description: 'Professional OTPA analysis with team form and news'
    },
    {
      icon: Target,
      title: 'Value Betting',
      description: 'Mathematical edge detection and probability calculations'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Risk management and profit tracking tools'
    },
    {
      icon: Shield,
      title: 'Expert Insights',
      description: 'Professional betting strategies and recommendations'
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 text-white">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Professional Betting
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {' '}Analysis
              </span>
            </h1>

            <p className="text-xl lg:text-2xl mb-8 text-blue-100">
              Advanced sports betting predictions with mathematical edge detection,
              value betting opportunities, and professional risk management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition-colors shadow-lg"
              >
                View Today's Tips
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/30 hover:border-white/50 hover:bg-white/10 font-semibold rounded-lg transition-colors"
              >
                Build Ticket
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-yellow-500/20 rounded-lg">
                  <Icon className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
