import React, { useState, useEffect } from 'react';
import socket from './socket';

export default function LiveScreen({ roomId }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canAnswer, setCanAnswer] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    socket.emit('joinRoom', roomId);

    socket.on('nextQuestion', (question) => {
      setCurrentQuestion(question);
      setTimeLeft(10);        // inizia countdown 10 secondi
      setCanAnswer(true);
    });

    return () => socket.off('nextQuestion');
  }, [roomId]);

  // countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanAnswer(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (optionIndex) => {
    if (!canAnswer) return;
    socket.emit('answer', roomId, { user: socket.id, answer: optionIndex });
    setCanAnswer(false); // blocca risposta dopo invio
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Live Screen</h2>
      {currentQuestion ? (
        <>
          <p>{currentQuestion.text}</p>
          <p>Tempo rimasto: {timeLeft}s</p>
          <div>
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={!canAnswer}
                style={{ margin: '5px' }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>In attesa della prossima domanda...</p>
      )}
    </div>
  );
}
