import { useEffect, useRef, useState } from 'react';
import { X, Monitor, MapPin, IndianRupee, Bell, Shield, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface SettingsPanelProps {
  onClose: () => void;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: '36px', height: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
      background: value ? 'linear-gradient(135deg,#7c3aed,#06b6d4)' : 'rgba(255,255,255,0.1)',
      transition: 'background 0.2s',
    }}>
      <div style={{
        position: 'absolute', top: '2px', left: value ? '18px' : '2px',
        width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontSize: '0.58rem', letterSpacing: '0.12em', fontWeight: 700, color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>{children}</div>
    </div>
  );
}

function SettingRow({ icon, label, subtitle, right }: { icon: React.ReactNode; label: string; subtitle?: string; right: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
        <div style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#f1f5f9', fontWeight: 500 }}>{label}</div>
          {subtitle && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ flexShrink: 0, marginLeft: '1rem' }}>{right}</div>
    </div>
  );
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  const darkMode = theme === 'dark';
  const [notifSeismic, setNotifSeismic] = useState(true);
  const [notifThermal, setNotifThermal] = useState(true);
  const [notifWind, setNotifWind] = useState(false);
  const [notifEmail, setNotifEmail] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [highRes, setHighRes] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: 'fixed', top: '60px', right: '1rem', zIndex: 400,
      width: '340px', maxHeight: 'calc(100vh - 80px)',
      background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
      borderRadius: '16px', boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
      backdropFilter: 'blur(24px)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Settings</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: '2px' }}>
          <X size={15} />
        </button>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '1.1rem' }}>
        <Section title="DISPLAY">
          <SettingRow
            icon={<Monitor size={15} />}
            label="Dark Mode"
            subtitle="App theme"
            right={<Toggle value={darkMode} onChange={toggleTheme} />}
          />
          <SettingRow
            icon={<Monitor size={15} />}
            label="High-res 3D Render"
            subtitle="May reduce performance"
            right={<Toggle value={highRes} onChange={setHighRes} />}
          />
          <SettingRow
            icon={<Monitor size={15} />}
            label="Auto-save Project"
            subtitle="Save changes automatically"
            right={<Toggle value={autoSave} onChange={setAutoSave} />}
          />
        </Section>

        <Section title="PROJECT DEFAULTS">
          <SettingRow
            icon={<MapPin size={15} />}
            label="Default District"
            subtitle="Pre-selected on project setup"
            right={
              <select style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f1f5f9', fontSize: '0.72rem', padding: '0.25rem 0.5rem', fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                <option value="bengaluru-urban" style={{ background: '#0d0d14' }}>Bengaluru Urban</option>
                <option value="mysuru" style={{ background: '#0d0d14' }}>Mysuru</option>
                <option value="mangaluru" style={{ background: '#0d0d14' }}>Mangaluru</option>
              </select>
            }
          />
          <SettingRow
            icon={<IndianRupee size={15} />}
            label="Default Budget"
            subtitle="In lakhs (INR)"
            right={
              <select style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f1f5f9', fontSize: '0.72rem', padding: '0.25rem 0.5rem', fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                <option style={{ background: '#0d0d14' }}>25–50 L</option>
                <option style={{ background: '#0d0d14' }}>50–100 L</option>
                <option style={{ background: '#0d0d14' }}>100–200 L</option>
                <option style={{ background: '#0d0d14' }}>200+ L</option>
              </select>
            }
          />
        </Section>

        <Section title="NOTIFICATIONS">
          <SettingRow icon={<Bell size={15} />} label="Seismic Alerts" right={<Toggle value={notifSeismic} onChange={setNotifSeismic} />} />
          <SettingRow icon={<Bell size={15} />} label="Thermal Updates" right={<Toggle value={notifThermal} onChange={setNotifThermal} />} />
          <SettingRow icon={<Bell size={15} />} label="Wind Analysis" right={<Toggle value={notifWind} onChange={setNotifWind} />} />
          <SettingRow icon={<Bell size={15} />} label="Email Digest" subtitle="Weekly summary" right={<Toggle value={notifEmail} onChange={setNotifEmail} />} />
        </Section>

        <Section title="ACCOUNT">
          <SettingRow
            icon={<Shield size={15} />}
            label="Signed in as"
            subtitle={user?.email ?? 'Not logged in'}
            right={<span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>Active</span>}
          />
          <SettingRow
            icon={<Info size={15} />}
            label="App Version"
            right={<span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>v1.0.0</span>}
          />
        </Section>
      </div>

      <div style={{ padding: '0.85rem 1.1rem', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <button style={{
          width: '100%', padding: '0.6rem', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
          border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
