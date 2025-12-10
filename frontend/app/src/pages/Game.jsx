import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import StoryDisplay from '../components/StoryDisplay';
import ChoiceButtons from '../components/ChoiceButtons';
import ImageGallery from '../components/ImageGallery';
import LoadingScreen from '../components/LoadingScreen';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Game() {
  const { gameState, updateStory, setError, setLoading, addToHistory } = useGame();
  const [userInput, setUserInput] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [extractedChoices, setExtractedChoices] = useState([]);

  const handleSubmitChoice = async () => {
    if (!userInput.trim() && !selectedChoice) {
      toast.error('Please enter a choice or select one');
      return;
    }

    const finalChoice = selectedChoice || userInput;
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/handle_choice', {
        choice: finalChoice,
        prompt: gameState.currentPrompt,
      }, {
        headers: {
          'Authorization': `Bearer ${gameState.authToken}`,
        },
      });

      if (response.data.story) {
        const newPrompt = response.data.story;
        const choices = response.data.choices || [];

        const imageResponse = await axios.post(
          'http://127.0.0.1:8000/generate-image',
          { prompt: newPrompt },
          { headers: { 'Authorization': `Bearer ${gameState.authToken}` } }
        );

        updateStory(newPrompt, imageResponse.data.image_url);
        addToHistory(finalChoice, newPrompt);
        setExtractedChoices(choices);
        setUserInput('');
        setSelectedChoice(null);
        toast.success('Your choice has been made...');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to progress story';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractedChoiceSelect = (choice) => {
    setSelectedChoice(choice);
    setUserInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen blur-3xl animate-pulse-slow animation-delay-2000" />
      </div>

      <div className="relative z-10">
        {gameState.isLoading && <LoadingScreen />}

        <AnimatePresence mode="wait">
          <motion.div
            key="game-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 py-8 md:py-12"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Choose Your Adventure
              </h1>
              <p className="text-slate-400 text-lg md:text-xl">
                Welcome, {gameState.username}
              </p>
            </motion.div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Story section */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <StoryDisplay
                  prompt={gameState.currentPrompt}
                  story={gameState.currentStory}
                  choices={extractedChoices}
                  onChoiceSelect={handleExtractedChoiceSelect}
                />

                {/* Input section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 space-y-6"
                >
                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      What will you do?
                    </label>
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      disabled={gameState.isLoading}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50 resize-none h-24"
                      placeholder="Describe your action, or leave blank to choose from suggestions..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitChoice}
                    disabled={gameState.isLoading || (!userInput.trim() && !selectedChoice)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {gameState.isLoading ? 'Making your choice...' : 'Continue your journey'}
                  </motion.button>
                </motion.div>

                {/* Suggested choices */}
                {gameState.currentStory && (
                  <ChoiceButtons
                    onChoiceSelect={setSelectedChoice}
                    selectedChoice={selectedChoice}
                  />
                )}
              </motion.div>

              {/* Image section */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <ImageGallery imageUrl={gameState.imageUrl} />
              </motion.div>
            </div>

            {/* Error display */}
            <AnimatePresence>
              {gameState.error && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300 text-center"
                >
                  {gameState.error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
