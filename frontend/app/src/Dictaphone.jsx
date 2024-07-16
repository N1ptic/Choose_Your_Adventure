import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = ({ onTranscriptChange }) => {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const handleStartListening = () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening();
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    onTranscriptChange(transcript);
    resetTranscript();
  };

  return (
    <div>
      <button onClick={handleStartListening}>Start</button>
      <button onClick={handleStopListening}>Stop</button>
      <p>{transcript}</p>
    </div>
  );
};

export default Dictaphone;

