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
      className="live-china-map-timeline lcm-timeline flex flex-wrap items-center gap-x-3 gap-y-2"
      role="group"
      aria-label="12 月时间轴回放"
    >
      <button
        type="button"
        onClick={onTogglePlay}
        className="lcm-timeline__play inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0 touch-manipulation"
        style={{ background: `${accent}22`, border: `1px solid ${accent}55`, color: accent }}
        aria-label={playing ? '暂停回放' : '播放回放'}
      >
        {playing ? <Lucide.Pause size={13} /> : <Lucide.Play size={13} />}
      </button>
      <input
        type="range"
        min={0}
        max={MONTH_LABELS.length - 1}
        value={monthIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 min-w-[100px]"
        style={{ accentColor: accent }}
        aria-valuetext={MONTH_LABELS[monthIndex]}
        aria-label="选择月份"
      />
      <span className="text-[10px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>
        {MONTH_LABELS[monthIndex]}
      </span>
      <span className="text-[10px] mono hidden sm:inline shrink-0" style={{ color: 'var(--text-tertiary)' }}>
        · 12 月回放 · 示意序列
      </span>
    </div>
  );
}
