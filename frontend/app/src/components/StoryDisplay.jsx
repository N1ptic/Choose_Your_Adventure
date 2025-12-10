import React from 'react';
import { motion } from 'framer-motion';

export default function StoryDisplay({ prompt, story, choices, onChoiceSelect }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const choiceVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
    hover: { scale: 1.02, boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Prompt section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="text-3xl">✨</div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-widest">
              Current Scene
            </h2>
            <p className="text-xl leading-relaxed text-slate-100 font-light">
              {prompt}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Story response section */}
      {story && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50 shadow-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">📖</div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-widest">
                What Happens Next
              </h2>
              <p className="text-lg leading-relaxed text-slate-200 font-light">
                {story}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Extracted choices section */}
      {choices && choices.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/50 shadow-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">⚔️</div>
            <div className="flex-1 w-full">
              <h2 className="text-sm font-semibold text-amber-300 mb-4 uppercase tracking-widest">
                Your Options
              </h2>
              <div className="space-y-3">
                {choices.map((choice, index) => (
                  <motion.button
                    key={index}
                    variants={choiceVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => onChoiceSelect(choice)}
                    className="w-full text-left p-4 rounded-lg bg-slate-700/40 border border-amber-400/40 hover:border-amber-400 hover:bg-amber-800/30 transition-all duration-200"
                  >
                    <span className="flex items-start gap-3">
                      <span className="text-amber-400 font-bold mt-1">→</span>
                      <span className="text-amber-100 leading-relaxed flex-1">{choice}</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
