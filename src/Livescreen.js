import React, { useEffect, useState } from 'react';
import socket from './socket';

export default function LiveScreen() {
    const [question, setQuestion] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        socket.on('newQuestion', (q) => {
            setQuestion(q);

            const interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - q.startTime) / 1000);
                const remaining = 10 - elapsed;
                setTimeLeft(remaining > 0 ? remaining : 0);
            }, 100);

            return () => clearInterval(interval);
        });

        socket.on('closeQuestion', () => {
            setTimeLeft(0);
        });
    }, []);

    if (!question) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '2rem' }}>In attesa di iniziare...</div>;

    return (
        <div style={{ textAlign: 'center', fontSize: '2rem' }}>
            <h1>{question.text}</h1>
            <div style={{ margin: '20px' }}>
                {question.options.map((opt, idx) => (
                    <div key={idx}
                        style={{
                            padding: '10px',
                            margin: '5px',
                            backgroundColor: idx === question.correct ? 'orange' : 'lightgray',
                            borderRadius: '5px',
                            width: '50%',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    >
                        {opt}
                    </div>
                ))}
            </div>
            <h2>Tempo rimanente: {timeLeft}s</h2>
        </div>
    );
    }
