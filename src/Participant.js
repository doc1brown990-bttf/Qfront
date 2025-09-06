import React, { useEffect, useState } from 'react';
import socket from './socket';

export default function Participant() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    socket.on('question', ({ question, index, deadline }) => {
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
      setDeadline(deadline);
    });

    socket.on('showCorrectAnswer', ({ correct }) => {
      setCorrectAnswer(correct);
    });

    socket.on('gameOver', () => {
      alert("Gioco terminato!");
    });

    return () => {
      socket.off('question');
      socket.off('showCorrectAnswer');
      socket.off('gameOver');
    };
  }, []);

  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
    }, 500);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!currentQuestion) {
    return <h2 style={{ textAlign: "center", marginTop: 50 }}>In attesa che il gioco inizi...</h2>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>{currentQuestion.text}</h2>
      <p><strong>Tempo rimasto:</strong> {timeLeft}s</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        {currentQuestion.options.map((opt, i) => {
          let style = { padding: 10, minWidth: 120 };
          if (correctAnswer !== null) {
            if (i === correctAnswer) style = { ...style, background: 'green', color: 'white' };
            if (i === selectedAnswer && selectedAnswer !== correctAnswer) style = { ...style, background: 'red', color: 'white' };
          }
          return (
            <button
              key={i}
              style={style}
              disabled={correctAnswer !== null}
              onClick={() => {
                if (selectedAnswer === null) {
                  setSelectedAnswer(i);
                  socket.emit('answer', { questionIndex: 0, option: i });
                }
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
          }
