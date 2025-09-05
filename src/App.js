import React, { useState } from 'react';
import Organizer from './Organizer';
import Participant from './Participant';
import LiveScreen from './Livescreen';

function App() {
  const [role, setRole] = useState('');

  if (!role) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Seleziona ruolo:</h2>
        <button onClick={() => setRole('organizer')}>Organizzatore</button>
        <button onClick={() => setRole('participant')}>Partecipante</button>
        <button onClick={() => setRole('live')}>Schermo Live</button>
      </div>
    );
  }

  if (role === 'organizer') return <Organizer />;
  if (role === 'participant') return <Participant />;
  if (role === 'live') return <LiveScreen />;
}

export default App;
