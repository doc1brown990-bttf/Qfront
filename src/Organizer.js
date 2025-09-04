import React, { useState } from 'react';
import socket from './socket';

export default function Organizer() {
    const [roomId, setRoomId] = useState('');
    const [questions, setQuestions] = useState([
        { text: "Qual è il cocktail più ordinato?", options: ["Spritz", "Mojito", "Negroni", "Vino"], correct: 0 },
        { text: "In quale città è nato il Negroni?", options: ["Roma", "Milano", "Firenze", "Venezia"], correct: 2 }
    ]);

    const createRoom = () => {
        if (!roomId) return alert("Inserisci ID stanza");
        socket.emit('createRoom', roomId, questions);
        alert(`Stanza ${roomId} creata`);
    };

    const nextQuestion = () => {
        socket.emit('nextQuestion', roomId);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Organizzatore</h2>
            <input placeholder="ID Stanza" value={roomId} onChange={e => setRoomId(e.target.value)} />
            <div style={{ marginTop: '20px' }}>
                <button onClick={createRoom}>Crea Stanza</button>
                <button onClick={nextQuestion} style={{ marginLeft: '10px' }}>Prossima Domanda</button>
            </div>
        </div>
    );
}
