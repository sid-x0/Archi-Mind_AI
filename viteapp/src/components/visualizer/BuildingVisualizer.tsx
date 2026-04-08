import { useState } from 'react';
import {
  RotateCcw, ZoomIn, ZoomOut, Plus, Eye, EyeOff, Layers
} from 'lucide-react';
import { useBuilding } from '../../context/BuildingContext';
import { sendMessage } from '../../services/api';

const FLOOR_COLORS: Record<number, { top: string; front: string; side: string; label: string }> = {
  0: { top: '#4a7d8c', front: '#2d5a68', side: '#1e3d47', label: '#7ecfdf' },
  1: { top: '#3d5a4c', front: '#2a3e35', side: '#1c2b25', label: '#6db88e' },
  2: { top: '#8a4a5a', front: '#6a3545', side: '#4a2430', label: '#d4849a' },
  3: { top: '#6a5a2a', front: '#4a3e1c', side: '#332c12', label: '#d4b86a' },
  4: { top: '#4a4a8a', front: '#33336a', side: '#22224a', label: '#8a8ad4' },
  5: { top: '#6a3a8a', front: '#4a2868', side: '#321b48', label: '#b88ad4' },
  6: { top: '#2a7a5a', front: '#1c5a40', side: '#123d2c', label: '#5ad4a8' },
  7: { top: '#7a4a2a', front: '#5a3318', side: '#3d2210', label: '#d49a5a' },
  8: { top: '#2a5a7a', front: '#1c3f5a', side: '#122b3d', label: '#5aaad4' },
  9: { top: '#7a2a4a', front: '#5a1c35', side: '#3d1224', label: '#d45a8a' },
};

function getFloorColor(floorIndex: number) {
  return FLOOR_COLORS[floorIndex % 10];
}

export function BuildingVisualizer() {
  const { state, dispatch } = useBuilding();
  const [zoom, setZoom] = useState(1.2);
  const [showLabels, setShowLabels] = useState(true);
  const [adding, setAdding] = useState(false);
  const [fps] = useState(144);

  const floors = state.floors;
  const totalFloors = floors.length;

  const handleAddFloor = async () => {
    if (adding) return;
    setAdding(true);
    try {
      const res = await sendMessage('add a floor');
      if (res.updatedState) dispatch({ type: 'SET_STATE', payload: res.updatedState });
    } catch { /* ignore */ }
    finally { setAdding(false); }
  };

  const coords = { lat: '40.7128° N', lon: '74.0060° W' };

  /* ── Isometric floor geometry ── */
  const FLOOR_W = 280;
  const FLOOR_H = 100;
  const FLOOR_DEPTH = 28;
  const FLOOR_STEP_X = -18;
  const FLOOR_STEP_Y = -72;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* Metadata bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '0.5rem 1.25rem',
        background: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '0.65rem',
        fontWeight: 600,
        letterSpacing: '0.07em',
        color: 'var(--text-tertiary)',
        flexShrink: 0,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          RENDER: VULKAN HYBRID
        </span>
        <span>COORDS: {coords.lat}, {coords.lon}</span>
        <span style={{ color: '#06b6d4' }}>ZOOM: {zoom.toFixed(1)}X</span>
        <span style={{ marginLeft: 'auto' }}>FPS: {fps}</span>
      </div>

      {/* Main canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Radial glow */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {totalFloors === 0 ? (
          <EmptyState onAddFloor={handleAddFloor} adding={adding} />
        ) : (
          /* Isometric building */
          <div
            style={{
              position: 'relative',
              transform: `scale(${zoom})`,
              transition: 'transform 0.3s ease',
            }}
          >
            {/* Shadow base */}
            <div style={{
              position: 'absolute',
              bottom: `-${FLOOR_DEPTH + 8}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              width: `${FLOOR_W + 40}px`,
              height: '20px',
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
            }} />

            {/* Floors — rendered bottom-to-top */}
            {[...floors].reverse().map((floor, revIdx) => {
              const idx = totalFloors - 1 - revIdx; // original index
              const colors = getFloorColor(idx);
              const offsetX = idx * FLOOR_STEP_X;
              const offsetY = idx * FLOOR_STEP_Y;

              return (
                <div
                  key={floor.id}
                  className="floor-card-3d"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    transform: `translate(${offsetX}px, ${offsetY}px)`,
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    cursor: 'pointer',
                  }}
                >
                  {/* Top face */}
                  <div style={{
                    width: `${FLOOR_W}px`,
                    height: `${FLOOR_H}px`,
                    background: `linear-gradient(135deg, ${colors.top} 0%, ${colors.front} 100%)`,
                    borderRadius: '8px 8px 4px 4px',
                    position: 'relative',
                    boxShadow: `0 0 20px ${colors.top}40, inset 0 1px 0 ${colors.label}30`,
                    border: `1px solid ${colors.label}30`,
                  }}>
                    {/* Room indicators */}
                    <div style={{
                      position: 'absolute',
                      inset: '8px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      alignContent: 'flex-start',
                    }}>
                      {floor.rooms.map((_, ri) => (
                        <div key={ri} style={{
                          width: '14px',
                          height: '10px',
                          background: `${colors.label}50`,
                          border: `1px solid ${colors.label}60`,
                          borderRadius: '2px',
                        }} />
                      ))}
                    </div>

                    {/* Floor label */}
                    {showLabels && (
                      <div style={{
                        position: 'absolute',
                        right: '12px',
                        bottom: '8px',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: colors.label,
                        opacity: 0.9,
                      }}>
                        FLOOR {String(floor.number).padStart(2, '0')}
                      </div>
                    )}

                    {/* Room count badge */}
                    <div style={{
                      position: 'absolute',
                      left: '10px',
                      top: '8px',
                      background: `${colors.label}20`,
                      border: `1px solid ${colors.label}40`,
                      borderRadius: '10px',
                      padding: '1px 6px',
                      fontSize: '0.55rem',
                      color: colors.label,
                      fontWeight: 600,
                    }}>
                      {floor.rooms.length} room{floor.rooms.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Front face */}
                  <div style={{
                    width: `${FLOOR_W}px`,
                    height: `${FLOOR_DEPTH}px`,
                    background: `linear-gradient(180deg, ${colors.front} 0%, ${colors.side} 100%)`,
                    borderRadius: '0 0 4px 4px',
                    marginTop: '-1px',
                    border: `1px solid ${colors.label}15`,
                    borderTop: 'none',
                  }} />
                </div>
              );
            })}

            {/* Spacer to size the container */}
            <div style={{
              width: `${FLOOR_W + Math.abs(FLOOR_STEP_X) * Math.max(totalFloors - 1, 0)}px`,
              height: `${FLOOR_H + FLOOR_DEPTH + Math.abs(FLOOR_STEP_Y) * Math.max(totalFloors - 1, 0)}px`,
              pointerEvents: 'none',
            }} />
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem',
        background: 'rgba(13,13,20,0.9)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '0.5rem 0.75rem',
        backdropFilter: 'blur(12px)',
      }}>
        <ToolBtn icon={<RotateCcw size={16} />} label="Undo" onClick={() => {}} />
        <ToolBtn icon={<ZoomIn size={16} />} label="Zoom In" onClick={() => setZoom(z => Math.min(z + 0.2, 3))} />
        <ToolBtn
          icon={<Plus size={18} />}
          label="Add Floor"
          accent
          loading={adding}
          onClick={handleAddFloor}
        />
        <ToolBtn icon={<ZoomOut size={16} />} label="Zoom Out" onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))} />
        <ToolBtn
          icon={showLabels ? <Eye size={16} /> : <EyeOff size={16} />}
          label="Toggle Labels"
          onClick={() => setShowLabels(v => !v)}
          active={showLabels}
        />
        <ToolBtn icon={<Layers size={16} />} label="Layers" onClick={() => {}} />
      </div>
    </div>
  );
}

/* ── Tool button ── */
function ToolBtn({
  icon, label, onClick, accent, active, loading,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
  active?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      disabled={loading}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: accent
          ? 'linear-gradient(135deg, #ec4899, #f97316)'
          : active
          ? 'rgba(6,182,212,0.15)'
          : 'rgba(255,255,255,0.04)',
        border: accent
          ? 'none'
          : active
          ? '1px solid rgba(6,182,212,0.3)'
          : '1px solid transparent',
        color: accent ? '#fff' : active ? '#06b6d4' : 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: loading ? 'wait' : 'pointer',
        transition: 'all 0.15s',
        transform: 'none',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {icon}
    </button>
  );
}

/* ── Empty state ── */
function EmptyState({ onAddFloor, adding }: { onAddFloor: () => void; adding: boolean }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      color: 'var(--text-tertiary)',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '16px',
        border: '2px dashed var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Layers size={32} color="var(--text-tertiary)" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
          No floors yet
        </div>
        <div style={{ fontSize: '0.75rem' }}>Ask the AI to add a floor or click below</div>
      </div>
      <button
        onClick={onAddFloor}
        disabled={adding}
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          border: 'none',
          borderRadius: '8px',
          padding: '0.6rem 1.25rem',
          color: '#fff',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: adding ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          transform: 'none',
        }}
      >
        <Plus size={14} />
        {adding ? 'Adding...' : 'Add First Floor'}
      </button>
    </div>
  );
}
