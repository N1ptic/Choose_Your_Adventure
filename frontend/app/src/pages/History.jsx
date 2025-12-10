import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function History() {
  const { gameState } = useGame();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden py-12">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Journey
          </h1>
          <p className="text-slate-400">Review your choices and paths taken</p>
        </motion.div>

        {gameState.history.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl mx-auto space-y-4"
          >
            {gameState.history.map((entry, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-widest">
                      Your Choice
                    </h3>
                    <p className="text-slate-100 font-medium mb-3">{entry.choice}</p>
                    <h4 className="text-sm font-semibold text-slate-400 mb-2">What Happened</h4>
                    <p className="text-slate-300 leading-relaxed">{entry.story}</p>
                    <p className="text-xs text-slate-500 mt-3">
                      {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : 'Recently'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4 opacity-50">📖</div>
            <p className="text-slate-400 text-lg">
              Your adventure hasn't started yet. Make your first choice to begin!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
