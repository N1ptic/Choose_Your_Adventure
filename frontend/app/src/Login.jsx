import 'regenerator-runtime/runtime';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', { // Adjusted endpoint for JWT token obtainment
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful');
                // Store the JWT in localStorage or another secure place
                localStorage.setItem('authToken', data.access); // Assuming 'access' is the name of the access token
                // Optionally, store the refresh token as well if your backend provides one
                if(data.refresh) {
                    localStorage.setItem('refreshToken', data.refresh);
                }
                onLogin(username, data.access); // Pass the access token to the parent component
                navigate('/'); // Navigate to the homepage
            } else {
                setError(data.error || 'Invalid username or password. Please try again.');
            }
        } catch (error) {
            console.error('Login request failed:', error);
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <label>Login</label>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>Login</button>
                </form>
            )}
        </div>
    );
}

export default Login;
