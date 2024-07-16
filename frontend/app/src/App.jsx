import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import History from './History';
import Firefly from './Firefly';
import './App.css';
import ImageGenerationPage from './GenerateImage';
import Dictaphone from './Dictaphone';

const NUM_FIREFLIES = 50;

function App() {
  const [choice, setChoice] = useState('');
  const [prompt, setPrompt] = useState('You find yourself in a dark forest. What do you do?');
  const [story, setStory] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firefliesPositions, setFirefliesPositions] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const [transcript, setTranscript] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const initialPositions = Array.from({ length: NUM_FIREFLIES }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDuration: `${Math.random() * 3 + 2}s, ${Math.random() * 5 + 5}s`
    }));
    setFirefliesPositions(initialPositions);

    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const DISPERSE_RADIUS = 76; // Pixels for 2cm approximation
    if (mousePosition.x !== null && mousePosition.y !== null) {
      const newPositions = firefliesPositions.map(pos => {
        const fireflyX = (window.innerWidth * pos.left) / 100;
        const fireflyY = (window.innerHeight * pos.top) / 100;
        const distance = Math.sqrt(Math.pow(mousePosition.x - fireflyX, 2) + Math.pow(mousePosition.y - fireflyY, 2));

        if (distance < DISPERSE_RADIUS) {
          return {
            ...pos,
            left: pos.left + (Math.random() - 0.5) * 20,
            top: pos.top + (Math.random() - 0.5) * 20
          };
        }
        return pos;
      });

      setFirefliesPositions(newPositions);
    }
  }, [mousePosition]);

  const handleHistoryClick = () => {
    navigate('/history');
  };

  const handleLogin = (username, token) => {
    localStorage.setItem('authToken', token);
    setUsername(username);
    setAuthToken(token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUsername('');
    setAuthToken('');
    setIsLoggedIn(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalChoice = transcript || choice; // Use transcript if available, fallback to the input choice

    try {
      const response = await axios.post('http://127.0.0.1:8000/handle_choice', {
        choice: finalChoice,
        prompt,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.data.story) {
        setStory(response.data.story);
        setError('');

        const imageResponse = await axios.post('http://127.0.0.1:8000/generate-image', { prompt: response.data.story }, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        setImageUrl(imageResponse.data.image_url);
      } else {
        setStory('');
        setError('Something went wrong, please try again.');
      }
    } catch (error) {
      setError('Failed to fetch story. Please check your connection and try again.');
    }
  };

  const fireflies = firefliesPositions.map((style, index) => (
    <Firefly key={index} style={{
      left: `${style.left}%`,
      top: `${style.top}%`,
      animationDuration: style.animationDuration
    }} />
  ));

  const handleTranscriptChange = (newTranscript) => {
    setTranscript(newTranscript);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {fireflies}
          <nav>
            {!isLoggedIn ? (
              <>
                <Link to="/login"><u>Login</u></Link>   <b>OR</b>   <Link to="/register"><u>Register</u></Link>
              </>
            ) : (
              <>
                <button onClick={handleLogout}>Logout</button><br />
                <p>Welcome, {username}!</p>
              </>
            )} 
          </nav>
          <Routes>
            <Route path="/" element={
              isLoggedIn ? (
                <>
                <div>
                <Link to="/history">History</Link>
                </div>
                <div>
                <Link to="/generate-image">Generate Image</Link> {/* Button to navigate to image generation page */}
                </div>
                  <h1>Choose Your Adventure</h1>
                  <p>{prompt}</p>
                 {story && <p>{story}</p>}
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                <input
                type="text"
                value={choice}
                onChange={(e) => setChoice(e.target.value)}
                placeholder="Your choice..."
                />
                <button type="submit">Submit</button>
                </form>

                  <Dictaphone onTranscriptChange={handleTranscriptChange} />
                  <p>Transcript: {transcript}</p>
                {imageUrl && (
                  <div>
                  <h2>Generated Image:</h2>
                  <img src={imageUrl} alt="Generated" />
                  </div>
                )}
                </>
              ) : (
                <Navigate replace to="/login" />
              )
            } />
            <Route path="/login" element={isLoggedIn ? <Navigate replace to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/history" element={isLoggedIn ? <History /> : <Navigate replace to="/login" />} />
            <Route path="/generate-image" element={<ImageGenerationPage imageUrl={imageUrl} />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
