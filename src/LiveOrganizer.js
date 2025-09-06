import React, { useEffect, useState } from 'react';
import socket from './socket';

export default function LiveOrganizer() {
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

  // Timer calcolato da deadline
  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
    }, 500);
    return () => clearInterval(interval);
  }, [deadline]);

  const startGame = () => socket.emit('startGame');
  const nextQuestion = () => socket.emit('nextQuestion');

  if (!currentQuestion) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>Organizzatore</h2>
        <button onClick={startGame}>Avvia Gioco</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Domanda</h2>
      <p>{currentQuestion.text}</p>
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
                setSelectedAnswer(i);
                socket.emit('answer', { questionIndex: 0, option: i });
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 30 }}>
        <button onClick={nextQuestion} disabled={timeLeft > 0}>
          Prossima Domanda
        </button>
      </div>
    </div>
  );
}
