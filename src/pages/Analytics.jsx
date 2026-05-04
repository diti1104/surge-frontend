const TECH = [
  { icon: '🍃', name: 'Spring Boot',       badge: 'BACKEND',  badgeColor: '#00e676', desc: 'REST API + WebSocket broker. Tomcat on port 8080.' },
  { icon: '🐬', name: 'MySQL + JPA',        badge: 'DATABASE', badgeColor: '#00d4aa', desc: 'Persistent event storage via Hibernate ORM.' },
  { icon: '⚡', name: 'Redis',              badge: 'CACHE',    badgeColor: '#ff4757', desc: 'In-memory store for surge values. Sub-millisecond reads.' },
  { icon: '🔌', name: 'WebSocket (STOMP)',  badge: 'REALTIME', badgeColor: '#ff9f1c', desc: 'Pushes surge updates to all clients instantly.' },
  { icon: '⚛️', name: 'React + Vite',      badge: 'FRONTEND', badgeColor: '#9b59ff', desc: 'Subscribes to /topic/surge/{zone} via SockJS.' },
  { icon: '🔗', name: 'SockJS + STOMP',    badge: 'PROTOCOL', badgeColor: '#ff6b35', desc: 'WebSocket fallback + pub/sub messaging.' },
];

const FLOW = [
  { label: 'React UI',        sub: 'User action',  color: '#9b59ff' },
  { label: 'POST /api/event', sub: 'REST call',    color: '#ff6b35' },
  { label: 'Controller',      sub: 'Entry point',  color: '#e8e8f0' },
  { label: 'SurgeService',    sub: 'Logic engine', color: '#ff6b35' },
  { label: 'MySQL',           sub: 'Persist',      color: '#00d4aa' },
  { label: 'Redis',           sub: 'Cache',        color: '#ff4757' },
  { label: 'WebSocket',       sub: '/topic/surge', color: '#ff9f1c' },
  { label: 'Dashboard',       sub: 'UI updates',   color: '#9b59ff' },
];

export default function Analytics() {
  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.pageTitle}>Architecture & Prep</h1>
        <p style={s.subtitle}>System design, tech stack, and interview answers</p>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>System Architecture Flow</div>
        <div style={s.flowRow}>
          {FLOW.map((step, i) => (
            <div key={step.label} style={s.flowWrap}>
              <div style={{ ...s.flowBox, borderColor: step.color + '55', background: step.color + '0d' }}>
                <div style={{ ...s.flowLabel, color: step.color }}>{step.label}</div>
                <div style={s.flowSub}>{step.sub}</div>
              </div>
              {i < FLOW.length - 1 && <div style={s.flowArrow}>→</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Tech Stack</div>
        <div style={s.techGrid}>
          {TECH.map((t) => (
            <div key={t.name} style={s.techItem}>
              <div style={s.techIcon}>{t.icon}</div>
              <div>
                <div style={s.techRow}>
                  <span style={s.techName}>{t.name}</span>
                  <span style={{ ...s.techBadge, color: t.badgeColor, background: t.badgeColor + '18', borderColor: t.badgeColor + '44' }}>
                    {t.badge}
                  </span>
                </div>
                <div style={s.techDesc}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.oneliner}>
        <div style={s.onelinerLabel}>Your one-liner</div>
        <div style={s.onelinerText}>
          "I built a real-time surge pricing system using Spring Boot, MySQL, Redis, and WebSocket — events drive dynamic pricing per zone, instantly reflected on a React dashboard."
        </div>
      </div>
    </div>
  );
}

const s = {
  page:          { padding: '28px 32px', maxWidth: 960, margin: '0 auto' },
  header:        { marginBottom: 28 },
  pageTitle:     { fontFamily: "'Space Mono',monospace", fontSize: 22, fontWeight: 700, color: '#e8e8f0', margin: 0 },
  subtitle:      { fontSize: 13, color: '#7a7a9a', marginTop: 4 },
  card:          { background: '#1e1e2e', border: '1px solid #2a2a3e', borderRadius: 16, padding: 24, marginBottom: 20 },
  cardTitle:     { fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 2, color: '#7a7a9a', textTransform: 'uppercase', marginBottom: 20 },
  flowRow:       { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  flowWrap:      { display: 'flex', alignItems: 'center', gap: 6 },
  flowBox:       { border: '1px solid', borderRadius: 10, padding: '10px 14px', minWidth: 90, textAlign: 'center' },
  flowLabel:     { fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700 },
  flowSub:       { fontSize: 10, color: '#7a7a9a', marginTop: 2 },
  flowArrow:     { color: '#7a7a9a', fontSize: 16 },
  techGrid:      { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 },
  techItem:      { background: '#12121a', border: '1px solid #2a2a3e', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12 },
  techIcon:      { fontSize: 22 },
  techRow:       { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
  techName:      { fontWeight: 600, fontSize: 14, color: '#e8e8f0' },
  techBadge:     { fontSize: 10, fontWeight: 700, border: '1px solid', borderRadius: 4, padding: '1px 7px', fontFamily: "'Space Mono',monospace" },
  techDesc:      { fontSize: 12, color: '#7a7a9a', lineHeight: 1.6 },
  oneliner:      { background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: 16, padding: 24 },
  onelinerLabel: { fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 2, color: '#ff6b35', textTransform: 'uppercase', marginBottom: 12 },
  onelinerText:  { fontSize: 15, color: '#e8e8f0', lineHeight: 1.8, fontStyle: 'italic' },
};