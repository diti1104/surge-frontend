import { useState, useEffect, useRef } from 'react';
import Dashboard from './pages/Dashboard';
import Event from './pages/Event';
import Analytics from './pages/Analytics';
import { connectSocket, disconnectSocket } from './services/socket';
import './App.css';

const PAGES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'simulate',  label: 'Simulate' },
  { id: 'analytics', label: 'Architecture' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [surges, setSurges] = useState({ HIGH: 1.0, MEDIUM: 1.0, LOW: 1.0 });
  const [wsEvents, setWsEvents] = useState([]);

  useEffect(() => {
    connectSocket((zone, value) => {
      setSurges((prev) => ({ ...prev, [zone]: value }));
      setWsEvents((prev) => [
        { zone, value, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 19),
      ]);
    });
    return () => disconnectSocket();
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">⚡ SURGE.IO</div>
        <div className="nav-tabs">
          {PAGES.map((p) => (
            <button
              key={p.id}
              className={`nav-tab ${page === p.id ? 'active' : ''}`}
              onClick={() => setPage(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="live-badge">
          <span className="pulse-dot" />
          LIVE
        </div>
      </nav>
      <main className="main">
        {page === 'dashboard' && <Dashboard surges={surges} wsEvents={wsEvents} />}
        {page === 'simulate'  && <Event />}
        {page === 'analytics' && <Analytics />}
      </main>
    </div>
  );
}