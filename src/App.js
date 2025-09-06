import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LiveOrganizer from "./LiveOrganizer";

export default function App() {
  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>🍸 Quiz Cocktail Live</h1>
        <p>Scegli come vuoi entrare:</p>
        <nav style={{ margin: "20px" }}>
          <Link to="/organizer" style={{ margin: "10px" }}>👤 Organizzatore</Link>
          <Link to="/participant" style={{ margin: "10px" }}>🙋 Partecipante</Link>
        </nav>

        <Routes>
          <Route path="/organizer" element={<LiveOrganizer isOrganizer={true} />} />
          <Route path="/participant" element={<LiveOrganizer />} />
          <Route path="/" element={<p>Benvenuto! Seleziona un ruolo.</p>} />
        </Routes>
      </div>
    </Router>
  );
}
