import React, { useState, useEffect } from 'react';
import socket from './socket';

export default function Participant() {
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);

    const joinRoom = () => {
        if (!name || !roomId) return alert("Inserisci nome e stanza");
        socket.emit('joinRoom', { roomId, name });
    };

    const submitAnswer = (index) => {
        if (submitted) return;
        setAnswer(index);
        setSubmitted(true);
        socket.emit('answer', { roomId, answer: index });
    };

    useEffect(() => {
        socket.on('newQuestion', q => {
            setQuestion(q);
            setAnswer(null);
            setSubmitted(false);

            // Countdown timer lato partecipante
            const interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - q.startTime) / 1000);
                const remaining = 10 - elapsed;
                setTimeLeft(remaining > 0 ? remaining : 0);
            }, 100);

            return () => clearInterval(interval);
        });

        socket.on('closeQuestion', () => {
            setSubmitted(true);
            setTimeLeft(0);
        });
    }, []);

    if (!question) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
                <input placeholder="ID Stanza" value={roomId} onChange={e => setRoomId(e.target.value)} />
                <button onClick={joinRoom}>Entra nella Stanza</button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h3>{question.text}</h3>
            <div style={{ margin: '20px' }}>
                {question.options.map((opt, idx) => (
                    <button
                        key={idx}
                        disabled={submitted}
                        style={{
                            padding: '10px',
                            margin: '5px',
                            backgroundColor: submitted
                                ? idx === question.correct ? 'green'
                                : idx === answer ? 'red' : ''
                                : ''
                        }}
                        onClick={() => submitAnswer(idx)}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            <h2>Tempo rimanente: {timeLeft}s</h2>
        </div>
    );
}
