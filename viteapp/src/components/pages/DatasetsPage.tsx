import { Database, Upload, FileText, Clock, ArrowUpRight } from 'lucide-react';

const DATASETS = [
  {
    name: 'NYC Building Permits 2020-2024',
    type: 'Permits',
    records: '2.4M',
    size: '1.8 GB',
    updated: '2 days ago',
    color: '#7c3aed',
  },
  {
    name: 'Global Seismic Hazard Map',
    type: 'Geospatial',
    records: '850K',
    size: '3.2 GB',
    updated: '1 week ago',
    color: '#ef4444',
  },
  {
    name: 'Material Cost Index Q1 2026',
    type: 'Financial',
    records: '120K',
    size: '45 MB',
    updated: 'Today',
    color: '#10b981',
  },
  {
    name: 'ASHRAE Energy Standards',
    type: 'Compliance',
    records: '18K',
    size: '12 MB',
    updated: '3 months ago',
    color: '#f59e0b',
  },
  {
    name: 'Urban Density Profiles — 50 Cities',
    type: 'Geospatial',
    records: '5.1M',
    size: '7.6 GB',
    updated: '5 days ago',
    color: '#06b6d4',
  },
  {
    name: 'IBC 2024 Code Requirements',
    type: 'Compliance',
    records: '32K',
    size: '28 MB',
    updated: '1 month ago',
    color: '#f97316',
  },
];

const TAG_COLORS: Record<string, string> = {
  Permits: '#7c3aed',
  Geospatial: '#06b6d4',
  Financial: '#10b981',
  Compliance: '#f59e0b',
};

export function DatasetsPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Header */}
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
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Datasets</h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {DATASETS.length} datasets available • 12.6 GB total
          </p>
        </div>
        <button style={{
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          border: 'none',
          borderRadius: '8px',
          padding: '0.55rem 1.1rem',
          color: '#fff',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          transform: 'none',
        }}>
          <Upload size={14} />
          Upload Dataset
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--text-tertiary)', textAlign: 'left' }}>
              {['DATASET', 'TYPE', 'RECORDS', 'SIZE', 'UPDATED', ''].map(h => (
                <th key={h} style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DATASETS.map((ds, i) => (
              <tr
                key={ds.name}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
              >
                <td style={{ padding: '0.9rem 0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: `${ds.color}15`,
                      border: `1px solid ${ds.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Database size={15} color={ds.color} />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{ds.name}</span>
                  </div>
                </td>
                <td style={{ padding: '0.9rem 0.75rem' }}>
                  <span style={{
                    background: `${TAG_COLORS[ds.type] ?? '#888'}15`,
                    border: `1px solid ${TAG_COLORS[ds.type] ?? '#888'}30`,
                    borderRadius: '20px',
                    padding: '0.15rem 0.6rem',
                    fontSize: '0.65rem',
                    color: TAG_COLORS[ds.type] ?? '#888',
                    fontWeight: 600,
                  }}>
                    {ds.type}
                  </span>
                </td>
                <td style={{ padding: '0.9rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{ds.records}</td>
                <td style={{ padding: '0.9rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FileText size={11} />
                    {ds.size}
                  </div>
                </td>
                <td style={{ padding: '0.9rem 0.75rem', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={11} />
                    {ds.updated}
                  </div>
                </td>
                <td style={{ padding: '0.9rem 0.75rem' }}>
                  <button style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    transform: 'none',
                  }}>
                    <ArrowUpRight size={11} />
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
