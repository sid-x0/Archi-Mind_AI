import { useState } from 'react';
import { Play, Pause, RefreshCw, Activity, Thermometer, Wind, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const SIMULATIONS = [
  {
    id: 'seismic',
    name: 'Seismic Load Analysis',
    description: 'Zone 4 earthquake simulation with P-wave and S-wave modelling.',
    icon: <Activity size={18} />,
    color: '#ef4444',
    status: 'ready' as const,
    duration: '~45s',
    lastRun: '2h ago',
  },
  {
    id: 'thermal',
    name: 'Thermal Performance',
    description: 'Annual heat-gain/loss simulation using EnergyPlus engine.',
    icon: <Thermometer size={18} />,
    color: '#f59e0b',
    status: 'running' as const,
    duration: '~2m',
    lastRun: 'Running…',
    progress: 62,
  },
  {
    id: 'wind',
    name: 'Wind Load Study',
    description: 'CFD wind pressure simulation at 120 mph design wind speed.',
    icon: <Wind size={18} />,
    color: '#06b6d4',
    status: 'completed' as const,
    duration: '~1m',
    lastRun: '30m ago',
    result: 'PASS',
  },
  {
    id: 'electrical',
    name: 'Electrical Load Flow',
    description: 'Power distribution analysis across all floors and panels.',
    icon: <Zap size={18} />,
    color: '#f97316',
    status: 'failed' as const,
    duration: '~20s',
    lastRun: '1h ago',
    result: 'FAIL',
  },
];

type SimStatus = 'ready' | 'running' | 'completed' | 'failed';

const STATUS_CONFIG: Record<SimStatus, { label: string; color: string; bg: string }> = {
  ready:     { label: 'READY',     color: '#94a3b8', bg: 'rgba(148,163,184,0.08)' },
  running:   { label: 'RUNNING',   color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
  completed: { label: 'COMPLETED', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
  failed:    { label: 'FAILED',    color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
};

export function SimulationsPage() {
  const [sims, setSims] = useState(SIMULATIONS);

  const handleRun = (id: string) => {
    setSims(prev => prev.map(s => s.id === id ? { ...s, status: 'running' as SimStatus, progress: 0, lastRun: 'Running…' } : s));
    // Simulate progress
    let pct = 0;
    const iv = setInterval(() => {
      pct += Math.random() * 20;
      if (pct >= 100) {
        clearInterval(iv);
        setSims(prev => prev.map(s => s.id === id ? { ...s, status: 'completed', progress: 100, lastRun: 'Just now', result: 'PASS' } : s));
      } else {
        setSims(prev => prev.map(s => s.id === id ? { ...s, progress: Math.round(pct) } : s));
      }
    }, 400);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
          ARCHITECTURE LIBRARY
        </div>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Simulations</h2>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Run engineering simulations against your building model
        </p>
      </div>

      {/* Sim cards */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '1rem',
        alignContent: 'start',
      }}>
        {sims.map(sim => {
          const statusCfg = STATUS_CONFIG[sim.status];
          return (
            <div
              key={sim.id}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid var(--border-subtle)`,
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${sim.color}40`}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)'}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: `${sim.color}15`,
                    border: `1px solid ${sim.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: sim.color,
                  }}>
                    {sim.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{sim.name}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '1px' }}>
                      Duration: {sim.duration} • Last: {sim.lastRun}
                    </div>
                  </div>
                </div>
                <span style={{
                  background: statusCfg.bg,
                  color: statusCfg.color,
                  border: `1px solid ${statusCfg.color}30`,
                  borderRadius: '20px',
                  padding: '0.15rem 0.6rem',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}>
                  {statusCfg.label}
                </span>
              </div>

              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {sim.description}
              </p>

              {/* Progress bar (running state) */}
              {'progress' in sim && sim.status === 'running' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem' }}>
                    <span>Progress</span>
                    <span>{sim.progress}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${sim.progress ?? 0}%`,
                      background: `linear-gradient(90deg, ${sim.color}, ${sim.color}80)`,
                      borderRadius: '2px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              )}

              {/* Result badge */}
              {'result' in sim && sim.result && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: sim.result === 'PASS' ? '#10b981' : '#ef4444',
                }}>
                  {sim.result === 'PASS'
                    ? <CheckCircle size={14} />
                    : <AlertTriangle size={14} />
                  }
                  {sim.result === 'PASS' ? 'Simulation passed all checks' : 'Simulation failed — review logs'}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleRun(sim.id)}
                  disabled={sim.status === 'running'}
                  style={{
                    flex: 1,
                    background: sim.status === 'running' ? 'rgba(255,255,255,0.04)' : `${sim.color}20`,
                    border: `1px solid ${sim.status === 'running' ? 'var(--border-subtle)' : `${sim.color}40`}`,
                    borderRadius: '8px',
                    padding: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: sim.status === 'running' ? 'var(--text-tertiary)' : sim.color,
                    cursor: sim.status === 'running' ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transform: 'none',
                  }}
                >
                  {sim.status === 'running'
                    ? <><Pause size={13} /> Running</>
                    : <><Play size={13} /> Run</>
                  }
                </button>
                <button style={{
                  width: '38px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'none',
                }}>
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
