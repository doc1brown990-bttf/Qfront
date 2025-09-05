import React, { useState, useEffect } from 'react';
import socket from './socket';

export default function Participants({ roomId }) {
    const [currentQuestion, setCurrentQuestion] = useState(null);

    useEffect(() => {
        if (!roomId) return;

        socket.emit('joinRoom', roomId); // join della stanza

        socket.on('nextQuestion', (question) => {
            setCurrentQuestion(question.text);
        });

        return () => socket.off('nextQuestion');
    }, [roomId]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Schermata Partecipanti</h2>
            {currentQuestion ? <p>{currentQuestion}</p> : <p>In attesa della prossima domanda...</p>}
        </div>
    );
            }
