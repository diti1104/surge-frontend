import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Event from './pages/Event';
import Analytics from './pages/Analytics';
import './App.css';

const PAGES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'simulate',  label: 'Simulate' },
  { id: 'analytics', label: 'Architecture' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');

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
        {page === 'dashboard' && <Dashboard />}
        {page === 'simulate'  && <Event />}
        {page === 'analytics' && <Analytics />}
      </main>
    </div>
  );
}