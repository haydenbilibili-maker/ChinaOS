import React from 'react';
import * as Lucide from 'lucide-react';

function Icon({ name, size = 12 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} />;
}

export default function LiveMapLayerBar({ layers, activeId, onSelect, accent = '#22d3ee', compact = false }) {
  return (
    <div className={`live-map-layer-bar flex flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {layers.map((l) => {
        const active = l.id === activeId;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => onSelect(l.id)}
            className={`lcm-chip inline-flex items-center gap-1 rounded-full font-medium transition-all touch-manipulation ${
              compact ? 'px-2.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-[11px] sm:text-xs'
            }`}
            style={{
              background: active ? `${accent}2e` : 'var(--bg-elevated)',
              border: `1px solid ${active ? `${accent}73` : 'var(--border-subtle)'}`,
              color: active ? accent : 'var(--text-secondary)',
              cursor: 'pointer',
              transform: active ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <Icon name={l.icon} />
            {l.label}
            {l.live && <span className="lcm-live-dot" style={{ color: '#ef4444', width: 6, height: 6 }} />}
          </button>
        );
      })}
    </div>
  );
}
