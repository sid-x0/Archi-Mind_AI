import { LayoutGrid, Pencil, Circle, Layers, History, HelpCircle, Image } from 'lucide-react';

type SidebarIcon = {
  icon: React.ReactNode;
  label: string;
  id: string;
};

import { useState } from 'react';

export function LeftSidebar() {
  const [active, setActive] = useState('grid');

  const topIcons: SidebarIcon[] = [
    { id: 'grid',    icon: <LayoutGrid size={18} />, label: 'Overview' },
    { id: 'draw',    icon: <Pencil size={18} />,     label: 'Draw' },
    { id: 'geo',     icon: <Circle size={18} />,     label: 'Geometry' },
    { id: 'layers',  icon: <Layers size={18} />,     label: 'Layers' },
    { id: 'history', icon: <History size={18} />,    label: 'History' },
  ];

  const bottomIcons: SidebarIcon[] = [
    { id: 'help',  icon: <HelpCircle size={18} />, label: 'Help' },
    { id: 'image', icon: <Image size={18} />,      label: 'Export' },
  ];

  const IconBtn = ({ item }: { item: SidebarIcon }) => (
    <button
      title={item.label}
      onClick={() => setActive(item.id)}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: active === item.id ? 'rgba(6,182,212,0.15)' : 'transparent',
        border: active === item.id ? '1px solid rgba(6,182,212,0.35)' : '1px solid transparent',
        color: active === item.id ? '#06b6d4' : 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        padding: 0,
        transform: 'none',
      }}
      onMouseEnter={e => {
        if (active !== item.id) {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
        }
      }}
      onMouseLeave={e => {
        if (active !== item.id) {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)';
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        }
      }}
    >
      {item.icon}
    </button>
  );

  return (
    <aside style={{
      width: '52px',
      background: '#0d0d14',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0.75rem 0',
      gap: '0.25rem',
      flexShrink: 0,
    }}>
      {/* Section label */}
      <div style={{
        fontSize: '0.5rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        color: 'var(--text-tertiary)',
        textAlign: 'center',
        lineHeight: '1.2',
        marginBottom: '0.5rem',
        writingMode: 'vertical-lr',
        transform: 'rotate(180deg)',
        height: '60px',
        userSelect: 'none',
      }}>
        SYSTEM A
      </div>

      {/* Divider */}
      <div style={{ width: '24px', height: '1px', background: 'var(--border-subtle)', marginBottom: '0.5rem' }} />

      {/* Top icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {topIcons.map(item => <IconBtn key={item.id} item={item} />)}
      </div>

      {/* Bottom icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {bottomIcons.map(item => <IconBtn key={item.id} item={item} />)}
      </div>
    </aside>
  );
}
