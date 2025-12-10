import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GameProvider, useGame } from './context/GameContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import History from './pages/History';
import Navigation from './components/Navigation';

function AppRoutes() {
  const { gameState, initializeFromStorage } = useGame();

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  return (
    <>
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={gameState.isLoggedIn ? <Game /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/login"
          element={gameState.isLoggedIn ? <Navigate replace to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={gameState.isLoggedIn ? <Navigate replace to="/" /> : <Register />}
        />
        <Route
          path="/history"
          element={gameState.isLoggedIn ? <History /> : <Navigate replace to="/login" />}
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <Router>
        <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </GameProvider>
  );
}

export default App;
