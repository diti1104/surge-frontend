import { useEffect, useState, useRef } from 'react';
import { getAllSurges } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const ZONE_CONFIG = {
  HIGH:   { color: '#ff6b35', bg: 'rgba(255,107,53,0.08)', border: '#ff6b35' },
  MEDIUM: { color: '#ff9f1c', bg: 'rgba(255,159,28,0.08)', border: '#ff9f1c' },
  LOW:    { color: '#00d4aa', bg: 'rgba(0,212,170,0.08)',  border: '#00d4aa' },
};

export default function Dashboard() {
  const [surges, setSurges] = useState({ HIGH: 3.0, MEDIUM: 2.0, LOW: 1.2 });
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const prevSurges = useRef({ HIGH: 3.0, MEDIUM: 2.0, LOW: 1.2 });

  useEffect(() => {
    getAllSurges()
      .then((data) => {
        setSurges(data);
        prevSurges.current = data;
      })
      .catch(console.error);

    connectSocket((zone, value) => {
      setConnected(true);
      setSurges((prev) => {
        prevSurges.current = prev;
        return { ...prev, [zone]: value };
      });
      setLastUpdated(new Date().toLocaleTimeString());
      setHistory((prev) => [
        { zone, value, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 19),
      ]);
    });

    setTimeout(() => setConnected(true), 1500);
    return () => disconnectSocket();
  }, []);

  const peak = Math.max(...Object.values(surges)).toFixed(1);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.pageTitle}>Live Surge Dashboard</h1>
          <p style={s.subtitle}>Real-time pricing via WebSocket</p>
        </div>
        <div style={{
          ...s.badge,
          background: connected ? 'rgba(0,230,118,0.12)' : 'rgba(255,71,87,0.12)',
          borderColor: connected ? '#00e676' : '#ff4757',
          color: connected ? '#00e676' : '#ff4757',
        }}>
          <span style={{ ...s.dot, background: connected ? '#00e676' : '#ff4757' }} />
          {connected ? 'CONNECTED' : 'CONNECTING...'}
        </div>
      </div>

      <div style={s.metricRow}>
        {[
          { label: 'Peak Surge',    value: peak + '×',            color: '#ff6b35' },
          { label: 'Active Zones',  value: '3',                   color: '#9b59ff' },
          { label: 'Last Update',   value: lastUpdated || '--:--:--', color: '#00d4aa' },
        ].map((m) => (
          <div key={m.label} style={s.metricCard}>
            <div style={s.metricLabel}>{m.label}</div>
            <div style={{ ...s.metricValue, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={s.zoneGrid}>
        {Object.entries(surges).map(([zone, value]) => {
          const cfg = ZONE_CONFIG[zone];
          const prev = prevSurges.current[zone];
          const trend = value > prev ? '↑' : value < prev ? '↓' : '–';
          const trendColor = value > prev ? '#ff4757' : value < prev ? '#00e676' : '#7a7a9a';
          return (
            <div key={zone} style={{ ...s.zoneCard, background: cfg.bg, borderColor: cfg.border }}>
              <div style={{ ...s.zoneTag, color: cfg.color }}>{zone} ZONE</div>
              <div style={s.zoneRow}>
                <span style={{ ...s.zoneValue, color: cfg.color }}>{value.toFixed(1)}</span>
                <span style={s.zoneX}>×</span>
                <span style={{ ...s.trend, color: trendColor }}>{trend}</span>
              </div>
              <div style={s.zoneBar}>
                <div style={{ ...s.zoneBarFill, width: `${Math.min((value / 5) * 100, 100)}%`, background: cfg.color }} />
              </div>
              <div style={s.zoneHint}>Max 5.0×</div>
            </div>
          );
        })}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Recent WebSocket Updates</div>
        {history.length === 0 ? (
          <div style={s.empty}>Waiting for live events from backend...</div>
        ) : (
          history.slice(0, 8).map((h, i) => (
            <div key={i} style={s.logRow}>
              <span style={{ ...s.logZone, color: ZONE_CONFIG[h.zone].color }}>{h.zone}</span>
              <span style={s.logArrow}>→</span>
              <span style={{ ...s.logVal, color: ZONE_CONFIG[h.zone].color }}>{h.value.toFixed(1)}×</span>
              <span style={s.logTime}>{h.time}</span>
            </div>
          ))
        )}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>System Flow</div>
        <div style={s.flowRow}>
          {['POST /event', 'Controller', 'SurgeService', 'MySQL + Redis', 'WebSocket', 'Dashboard'].map((step, i, arr) => (
            <div key={step} style={s.flowWrap}>
              <div style={{
                ...s.flowStep,
                ...(i === 0 ? s.flowStepApi : {}),
                ...(i === 4 ? s.flowStepWs  : {}),
              }}>
                {step}
              </div>
              {i < arr.length - 1 && <span style={s.flowArrow}>→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page:        { padding: '28px 32px', maxWidth: 960, margin: '0 auto' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  pageTitle:   { fontFamily: "'Space Mono',monospace", fontSize: 22, fontWeight: 700, color: '#e8e8f0', margin: 0 },
  subtitle:    { fontSize: 13, color: '#7a7a9a', marginTop: 4 },
  badge:       { display: 'flex', alignItems: 'center', gap: 8, border: '1px solid', borderRadius: 20, padding: '6px 14px', fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "'Space Mono',monospace" },
  dot:         { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
  metricRow:   { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 },
  metricCard:  { background: '#1e1e2e', border: '1px solid #2a2a3e', borderRadius: 12, padding: '16px 20px' },
  metricLabel: { fontSize: 11, color: '#7a7a9a', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontFamily: "'Space Mono',monospace" },
  metricValue: { fontFamily: "'Space Mono',monospace", fontSize: 26, fontWeight: 700 },
  zoneGrid:    { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 },
  zoneCard:    { border: '1px solid', borderRadius: 16, padding: 20 },
  zoneTag:     { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'Space Mono',monospace", marginBottom: 12 },
  zoneRow:     { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 },
  zoneValue:   { fontFamily: "'Space Mono',monospace", fontSize: 44, fontWeight: 700, lineHeight: 1 },
  zoneX:       { fontSize: 20, color: '#7a7a9a' },
  trend:       { fontSize: 22, fontWeight: 700, marginLeft: 4 },
  zoneBar:     { height: 4, background: '#2a2a3e', borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  zoneBarFill: { height: '100%', borderRadius: 2, transition: 'width 0.6s ease' },
  zoneHint:    { fontSize: 10, color: '#7a7a9a', fontFamily: "'Space Mono',monospace" },
  card:        { background: '#1e1e2e', border: '1px solid #2a2a3e', borderRadius: 16, padding: 20, marginBottom: 20 },
  cardTitle:   { fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 2, color: '#7a7a9a', textTransform: 'uppercase', marginBottom: 16 },
  empty:       { fontSize: 13, color: '#7a7a9a', textAlign: 'center', padding: '16px 0' },
  logRow:      { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #2a2a3e' },
  logZone:     { fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700, width: 60 },
  logArrow:    { color: '#7a7a9a' },
  logVal:      { fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700 },
  logTime:     { marginLeft: 'auto', fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#7a7a9a' },
  flowRow:     { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  flowWrap:    { display: 'flex', alignItems: 'center', gap: 4 },
  flowStep:    { background: '#12121a', border: '1px solid #2a2a3e', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#e8e8f0' },
  flowStepApi: { borderColor: '#ff6b35', color: '#ff6b35' },
  flowStepWs:  { borderColor: '#00d4aa', color: '#00d4aa' },
  flowArrow:   { color: '#7a7a9a', fontSize: 16 },
};