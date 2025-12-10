import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageGallery({ imageUrl }) {
  return (
    <div className="sticky top-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-2xl h-full flex flex-col"
      >
        <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-widest flex items-center gap-2">
          <span className="text-xl">🎨</span> Scene Visualization
        </h2>

        <AnimatePresence mode="wait">
          {imageUrl ? (
            <motion.div
              key={imageUrl}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="flex-1 relative rounded-xl overflow-hidden bg-slate-700/50 border border-purple-400/20 group"
            >
              <img
                src={imageUrl}
                alt="Story visualization"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center border border-slate-600/50"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 opacity-50">🌌</div>
                <p className="text-slate-400 text-sm">
                  Your adventure awaits...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {imageUrl && (
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-4 py-2 bg-purple-600/50 hover:bg-purple-600 text-sm text-white rounded-lg transition-all text-center"
          >
            View Full Size
          </motion.a>
        )}
      </motion.div>
    </div>
  );
}
