import 'regenerator-runtime/runtime'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/history/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                // Log to see what the response looks like
                console.log("API Response:", response.data);

                // Check if response data is an array before setting it
                if (Array.isArray(response.data)) {
                    setHistory(response.data);
                } else {
                    // Log unexpected response structure
                    console.error('Received data is not an array:', response.data);
                    setError('Failed to load history data correctly.');
                    setHistory([]);  // Set to empty array to ensure usability elsewhere
                }
            } catch (error) {
                console.error('Error fetching history:', error);
                setError('Failed to fetch history data. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>History of Choices and Responses</h2>
            {history.length > 0 ? (
                <ul>
                    {history.map((item, index) => (
                        <li key={index}>
                            <p><strong>Choice:</strong> {item.choice}</p>
                            <p><strong>Response:</strong> {item.response}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No history to display.</p>
            )}
        </div>
    );
}

export default History;
