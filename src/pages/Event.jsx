import { useState } from 'react';
import { sendEvent } from '../services/api';

const ZONES = ['HIGH', 'MEDIUM', 'LOW'];
const TYPES = ['RIDER', 'DRIVER'];
const ZONE_COLOR = { HIGH: '#ff6b35', MEDIUM: '#ff9f1c', LOW: '#00d4aa' };
const TYPE_COLOR = { RIDER: '#9b59ff', DRIVER: '#00d4aa' };

export default function Event() {
  const [form, setForm]     = useState({ type: 'RIDER', zone: 'HIGH', lat: '12.9716', lon: '77.5946' });
  const [logs, setLogs]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast]   = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        type: form.type,
        zone: form.zone,
        lat:  parseFloat(form.lat),
        lon:  parseFloat(form.lon),
      };
      const res = await sendEvent(payload);
      setLogs((prev) => [{ ...payload, time: new Date().toLocaleTimeString(), status: 'success' }, ...prev.slice(0, 14)]);
      setToast({ msg: `Sent! Backend: "${res}"`, ok: true });
    } catch (err) {
      setLogs((prev) => [{ ...form, time: new Date().toLocaleTimeString(), status: 'error' }, ...prev.slice(0, 14)]);
      setToast({ msg: 'Error: ' + err.message, ok: false });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div style={s.page}>
      {toast && (
        <div style={{
          ...s.toast,
          background:  toast.ok ? 'rgba(0,230,118,0.12)' : 'rgba(255,71,87,0.12)',
          borderColor: toast.ok ? '#00e676' : '#ff4757',
          color:       toast.ok ? '#00e676' : '#ff4757',
        }}>
          {toast.msg}
        </div>
      )}

      <div style={s.header}>
        <h1 style={s.pageTitle}>Event Simulator</h1>
        <p style={s.subtitle}>Simulate rider/driver events → POST /api/event</p>
      </div>

      <div style={s.grid}>
        {/* Left — form */}
        <div style={s.formCard}>
          <div style={s.cardTitle}>Send Event</div>

          <div style={s.toggleGroup}>
            <div style={s.toggleLabel}>Event Type</div>
            <div style={s.toggleRow}>
              {TYPES.map((t) => (
                <button key={t} onClick={() => setForm({ ...form, type: t })}
                  style={{ ...s.toggleBtn, ...(form.type === t ? { background: TYPE_COLOR[t], color: '#fff', borderColor: TYPE_COLOR[t] } : {}) }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={s.toggleGroup}>
            <div style={s.toggleLabel}>Zone</div>
            <div style={s.toggleRow}>
              {ZONES.map((z) => (
                <button key={z} onClick={() => setForm({ ...form, zone: z })}
                  style={{ ...s.toggleBtn, ...(form.zone === z ? { background: ZONE_COLOR[z], color: '#fff', borderColor: ZONE_COLOR[z] } : {}) }}>
                  {z}
                </button>
              ))}
            </div>
          </div>

          <div style={s.inputRow}>
            <div style={s.inputGroup}>
              <label style={s.inputLabel}>Latitude</label>
              <input name="lat" value={form.lat} onChange={handleChange} style={s.input} type="number" step="0.01" />
            </div>
            <div style={s.inputGroup}>
              <label style={s.inputLabel}>Longitude</label>
              <input name="lon" value={form.lon} onChange={handleChange} style={s.input} type="number" step="0.01" />
            </div>
          </div>

          <div style={s.previewBox}>
            <div style={s.previewLabel}>Payload Preview</div>
            <pre style={s.pre}>{JSON.stringify({ type: form.type, zone: form.zone, lat: parseFloat(form.lat), lon: parseFloat(form.lon) }, null, 2)}</pre>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ ...s.sendBtn, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Sending...' : 'Send to Backend →'}
          </button>
        </div>

        {/* Right — quick fire + log */}
        <div style={s.rightCol}>
          <div style={s.card}>
            <div style={s.cardTitle}>Quick Fire</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['RIDER','HIGH'], ['RIDER','MEDIUM'], ['DRIVER','HIGH'], ['DRIVER','LOW']].map(([t, z]) => (
                <button key={t + z}
                  onClick={() => {
                    setForm((f) => ({ ...f, type: t, zone: z }));
                    setTimeout(handleSubmit, 50);
                  }}
                  style={{ ...s.quickBtn, borderColor: t === 'RIDER' ? '#9b59ff' : '#00d4aa', color: t === 'RIDER' ? '#9b59ff' : '#00d4aa' }}>
                  {t} → {z}
                </button>
              ))}
            </div>
          </div>

          <div style={s.card}>
            <div style={s.cardTitle}>Event Log</div>
            {logs.length === 0 ? (
              <div style={s.empty}>No events sent yet</div>
            ) : (
              logs.map((l, i) => (
                <div key={i} style={s.logRow}>
                  <span style={{ ...s.logBadge, background: l.type === 'RIDER' ? 'rgba(155,89,255,0.15)' : 'rgba(0,212,170,0.15)', color: l.type === 'RIDER' ? '#9b59ff' : '#00d4aa' }}>
                    {l.type}
                  </span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, fontWeight: 700, color: ZONE_COLOR[l.zone] }}>
                    {l.zone}
                  </span>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: l.status === 'success' ? '#00e676' : '#ff4757', display: 'inline-block' }} />
                  <span style={s.logTime}>{l.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:         { padding: '28px 32px', maxWidth: 960, margin: '0 auto', position: 'relative' },
  toast:        { position: 'fixed', top: 80, right: 24, border: '1px solid', borderRadius: 10, padding: '12px 20px', fontSize: 13, fontWeight: 600, zIndex: 100, fontFamily: "'Space Mono',monospace" },
  header:       { marginBottom: 28 },
  pageTitle:    { fontFamily: "'Space Mono',monospace", fontSize: 22, fontWeight: 700, color: '#e8e8f0', margin: 0 },
  subtitle:     { fontSize: 13, color: '#7a7a9a', marginTop: 4 },
  grid:         { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 },
  formCard:     { background: '#1e1e2e', border: '1px solid #2a2a3e', borderRadius: 16, padding: 24 },
  rightCol:     { display: 'flex', flexDirection: 'column', gap: 16 },
  card:         { background: '#1e1e2e', border: '1px solid #2a2a3e', borderRadius: 16, padding: 20 },
  cardTitle:    { fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 2, color: '#7a7a9a', textTransform: 'uppercase', marginBottom: 16 },
  toggleGroup:  { marginBottom: 20 },
  toggleLabel:  { fontSize: 11, color: '#7a7a9a', fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  toggleRow:    { display: 'flex', gap: 8 },
  toggleBtn:    { flex: 1, padding: '10px 0', background: '#12121a', border: '1px solid #2a2a3e', borderRadius: 8, color: '#7a7a9a', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Mono',monospace", transition: 'all 0.15s' },
  inputRow:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 },
  inputGroup:   { display: 'flex', flexDirection: 'column', gap: 6 },
  inputLabel:   { fontSize: 11, color: '#7a7a9a', fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase' },
  input:        { background: '#12121a', border: '1px solid #2a2a3e', borderRadius: 8, padding: '10px 12px', color: '#e8e8f0', fontSize: 13, fontFamily: "'DM Sans',sans-serif" },
  previewBox:   { background: '#12121a', border: '1px solid #2a2a3e', borderRadius: 10, padding: 14, marginBottom: 16 },
  previewLabel: { fontSize: 10, color: '#7a7a9a', fontFamily: "'Space Mono',monospace", letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  pre:          { fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#00d4aa', margin: 0, lineHeight: 1.6 },
  sendBtn:      { width: '100%', background: '#ff6b35', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Mono',monospace" },
  quickBtn:     { width: '100%', background: '#12121a', border: '1px solid', borderRadius: 8, padding: '9px 0', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Mono',monospace" },
  empty:        { fontSize: 12, color: '#7a7a9a', textAlign: 'center', padding: '12px 0' },
  logRow:       { display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid #2a2a3e' },
  logBadge:     { borderRadius: 4, padding: '2px 7px', fontSize: 10, fontWeight: 700, fontFamily: "'Space Mono',monospace" },
  logTime:      { marginLeft: 'auto', fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#7a7a9a' },
};