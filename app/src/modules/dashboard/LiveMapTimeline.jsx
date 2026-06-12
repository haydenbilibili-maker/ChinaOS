import React from 'react';
import * as Lucide from 'lucide-react';
import { MONTH_LABELS } from './liveMapHistory.js';

export default function LiveMapTimeline({
  monthIndex,
  onChange,
  playing,
  onTogglePlay,
  accent = '#22d3ee',
}) {
  return (
    <div
      className="live-china-map-timeline flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg px-3 py-2.5"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
    >
      <button
        type="button"
        onClick={onTogglePlay}
        className="inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0 touch-manipulation"
        style={{ background: `${accent}22`, border: `1px solid ${accent}55`, color: accent }}
        aria-label={playing ? '暂停' : '播放'}
      >
        {playing ? <Lucide.Pause size={13} /> : <Lucide.Play size={13} />}
      </button>
      <input
        type="range"
        min={0}
        max={MONTH_LABELS.length - 1}
        value={monthIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 min-w-[100px] accent-cyan-400"
        style={{ accentColor: accent }}
      />
      <span className="text-[10px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>
        {MONTH_LABELS[monthIndex]}
      </span>
      <span className="text-[10px] mono hidden sm:inline shrink-0" style={{ color: 'var(--text-tertiary)' }}>
        · 12 月回放
      </span>
    </div>
  );
}
