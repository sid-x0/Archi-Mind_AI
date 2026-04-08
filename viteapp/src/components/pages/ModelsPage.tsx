import { Box, Cpu, Download, Star, Zap } from 'lucide-react';

const MODELS = [
  {
    name: 'StructureGPT v3',
    description: 'Advanced structural analysis model trained on 2M+ building datasets.',
    tags: ['Structural', 'Analysis'],
    accuracy: 98.4,
    star: true,
    color: '#7c3aed',
  },
  {
    name: 'SeismicSim 2.1',
    description: 'Seismic load simulation for zones 1–4 with real-time hazard mapping.',
    tags: ['Seismic', 'Simulation'],
    accuracy: 96.7,
    star: false,
    color: '#ef4444',
  },
  {
    name: 'MEP Optimizer',
    description: 'Mechanical, electrical and plumbing layout optimization engine.',
    tags: ['MEP', 'Optimization'],
    accuracy: 94.1,
    star: true,
    color: '#06b6d4',
  },
  {
    name: 'CostForecaster',
    description: 'Budget prediction and material cost forecasting with live market data.',
    tags: ['Budget', 'Forecast'],
    accuracy: 91.8,
    star: false,
    color: '#10b981',
  },
  {
    name: 'GreenScore AI',
    description: 'Sustainability and energy efficiency scoring aligned with LEED standards.',
    tags: ['Sustainability', 'LEED'],
    accuracy: 93.5,
    star: true,
    color: '#f59e0b',
  },
  {
    name: 'FireSafety Net',
    description: 'Fire egress and sprinkler system compliance checker.',
    tags: ['Safety', 'Compliance'],
    accuracy: 99.1,
    star: false,
    color: '#f97316',
  },
];

export function ModelsPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Page header */}
      <div style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
            ARCHITECTURE LIBRARY
          </div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>AI Models</h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {MODELS.length} specialised models available for deployment
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Structural', 'MEP', 'Simulation', 'Compliance'].map(f => (
            <button key={f} style={{
              background: f === 'All' ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
              border: f === 'All' ? '1px solid rgba(124,58,237,0.4)' : '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '0.3rem 0.85rem',
              fontSize: '0.75rem',
              color: f === 'All' ? '#a78bfa' : 'var(--text-secondary)',
              cursor: 'pointer',
              transform: 'none',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
        alignContent: 'start',
      }}>
        {MODELS.map(m => (
          <div
            key={m.name}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${m.color}50`;
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)';
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)';
            }}
          >
            {/* Accent glow */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${m.color}20, transparent 70%)`,
              transform: 'translate(20px, -20px)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${m.color}20`,
                border: `1px solid ${m.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Cpu size={18} color={m.color} />
              </div>
              {m.star && <Star size={14} color="#f59e0b" fill="#f59e0b" />}
            </div>

            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem' }}>{m.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
              {m.description}
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              {m.tags.map(t => (
                <span key={t} style={{
                  background: `${m.color}15`,
                  border: `1px solid ${m.color}30`,
                  borderRadius: '20px',
                  padding: '0.15rem 0.55rem',
                  fontSize: '0.65rem',
                  color: m.color,
                  fontWeight: 600,
                }}>
                  {t}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem' }}>
                <Zap size={11} color="#10b981" />
                <span style={{ color: '#10b981', fontWeight: 700 }}>{m.accuracy}%</span>
                <span style={{ color: 'var(--text-tertiary)' }}>accuracy</span>
              </div>
              <button style={{
                background: `${m.color}15`,
                border: `1px solid ${m.color}30`,
                borderRadius: '6px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.7rem',
                color: m.color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transform: 'none',
              }}>
                <Download size={11} />
                Deploy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Stub export for icon usage
export { Box };
