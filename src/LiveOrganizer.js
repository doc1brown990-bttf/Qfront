import React, { useState, useEffect } from "react";
import socket from "./socket";

export default function LiveOrganizer({ isOrganizer = false }) {
  const [questions] = useState([
    { text: "Qual è il cocktail più ordinato?", options: ["Spritz", "Mojito", "Negroni", "Vino"], correct: 0 },
    { text: "In quale città è nato il Negroni?", options: ["Roma", "Milano", "Firenze", "Venezia"], correct: 2 }
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canAnswer, setCanAnswer] = useState(false);

  useEffect(() => {
    socket.on("nextQuestion", (question) => {
      setCurrentQuestion(question);
      setTimeLeft(10);
      setCanAnswer(true);
    });

    return () => socket.off("nextQuestion");
  }, []);

  useEffect(() => {
    if (!canAnswer) return;
    if (timeLeft <= 0) {
      setCanAnswer(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, canAnswer]);

  const nextQuestion = () => {
    if (currentIndex >= questions.length) return alert("Fine domande");
    socket.emit("startQuestion", questions[currentIndex]);
    setCurrentIndex(currentIndex + 1);
  };

  const handleAnswer = (index) => {
    if (!canAnswer) return;
    socket.emit("answer", { user: socket.id, answer: index });
    setCanAnswer(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>{isOrganizer ? "Organizzatore" : "Partecipante"}</h2>

      {currentQuestion ? (
        <>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>{currentQuestion.text}</p>
          <p style={{ fontSize: "18px" }}>⏱ Tempo rimasto: {timeLeft}s</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "20px auto", maxWidth: "300px" }}>
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={!canAnswer}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: canAnswer ? "pointer" : "not-allowed"
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>In attesa della prossima domanda...</p>
      )}

      {isOrganizer && (
        <div style={{ marginTop: "30px" }}>
          <button onClick={nextQuestion} style={{ padding: "10px 20px" }}>
            ▶️ Prossima Domanda
          </button>
        </div>
      )}
    </div>
  );
        }
