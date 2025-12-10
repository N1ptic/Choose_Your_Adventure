import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SUGGESTED_CHOICES = [
  'Explore carefully',
  'Move forward quickly',
  'Look around first',
  'Call out for help',
  'Listen closely',
];

export default function ChoiceButtons({ onChoiceSelect, selectedChoice }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mt-8"
    >
      <p className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest">
        Quick choices
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUGGESTED_CHOICES.map((choice, index) => (
          <motion.button
            key={index}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onChoiceSelect(choice)}
            className={`p-4 rounded-lg font-medium transition-all text-left ${
              selectedChoice === choice
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-purple-400'
                : 'bg-slate-700/40 text-slate-300 border border-slate-600/50 hover:border-purple-400/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">→</span>
              {choice}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
