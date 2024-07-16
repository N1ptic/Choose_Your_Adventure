import 'regenerator-runtime/runtime'
import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerationPage = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/generate-image', { prompt }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      setImageUrl(response.data.image_url);
    } catch (error) {
      console.error('Error generating image:', error);
      // Handle error state or display an error message to the user
    }
  };

  return (
    <div>
      <h1>Image Generation</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <button type="submit">Generate Image</button>
      </form>
      {imageUrl && (
        <div>
          <h2>Generated Image:</h2>
          <img src={imageUrl} alt="Generated" />
        </div>
      )}
    </div>
  );
};

export default ImageGenerationPage;

