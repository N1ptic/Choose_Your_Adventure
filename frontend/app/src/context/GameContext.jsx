import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState({
    isLoggedIn: false,
    username: '',
    authToken: '',
    currentPrompt: 'You find yourself at the threshold of an ancient, mystical realm. The air shimmers with untold possibilities...',
    currentStory: '',
    imageUrl: '',
    isLoading: false,
    error: '',
    history: [],
  });

  const handleLogin = useCallback((username, token) => {
    localStorage.setItem('authToken', token);
    setGameState(prev => ({
      ...prev,
      isLoggedIn: true,
      username,
      authToken: token,
    }));
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setGameState(prev => ({
      ...prev,
      isLoggedIn: false,
      username: '',
      authToken: '',
    }));
  }, []);

  const updateStory = useCallback((story, imageUrl) => {
    setGameState(prev => ({
      ...prev,
      currentStory: story,
      imageUrl,
      error: '',
    }));
  }, []);

  const setError = useCallback((error) => {
    setGameState(prev => ({
      ...prev,
      error,
    }));
  }, []);

  const setLoading = useCallback((loading) => {
    setGameState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  const addToHistory = useCallback((choice, story) => {
    setGameState(prev => ({
      ...prev,
      history: [...prev.history, { choice, story, timestamp: new Date() }],
    }));
  }, []);

  const initializeFromStorage = useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setGameState(prev => ({
        ...prev,
        authToken: token,
        isLoggedIn: true,
      }));
    }
  }, []);

  const value = {
    gameState,
    handleLogin,
    handleLogout,
    updateStory,
    setError,
    setLoading,
    addToHistory,
    initializeFromStorage,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
