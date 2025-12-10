import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function Navigation() {
  const navigate = useNavigate();
  const { gameState, handleLogout } = useGame();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  if (!gameState.isLoggedIn) return null;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          ⚔️ Adventure
        </motion.button>

        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/history')}
            className="text-sm md:text-base text-slate-300 hover:text-purple-300 transition-colors flex items-center gap-2"
          >
            <span>📜</span> History
          </motion.button>

          <motion.div
            className="text-sm md:text-base text-slate-400"
          >
            {gameState.username}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoutClick}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Sign Out
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
