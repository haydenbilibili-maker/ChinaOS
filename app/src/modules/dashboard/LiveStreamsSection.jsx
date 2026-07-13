import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import StreamPlayer from '../../lib/live/StreamPlayer.jsx';
import {
  PUBLIC_STREAMS,
  STREAM_AUDIT,
  STREAM_CATEGORIES,
  countByCategory,
  countPlayable,
  countExternal,
  dashboardPreviewStreams,
} from './liveStreams.js';
import { embedBadgeLabel, embedBadgeTone } from '../../lib/live/streamUtils.js';

const STEEL = '#22d3ee';

function Icon({ name, size = 16 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} />;
}

const THUMB_GRADIENTS = {
  panda: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
  scenic: 'linear-gradient(135deg, #0c4a6e 0%, #22d3ee 100%)',
  traffic: 'linear-gradient(135deg, #78350f 0%, #e8a317 100%)',
  other: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)',
};

const BADGE_STYLES = {
  playable: { bg: 'rgba(52,211,153,0.14)', color: '#34d399', border: 'rgba(52,211,153,0.35)' },
  external: { bg: 'var(--bg-base)', color: 'var(--text-tertiary)', border: 'var(--border-subtle)' },
  unknown: { bg: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)', border: 'rgba(34,211,238,0.35)' },
};

function StreamCard({ stream, onOpen }) {
  const cat = STREAM_CATEGORIES[stream.category];
  const badgeTone = embedBadgeTone(stream);
  const badgeStyle = BADGE_STYLES[badgeTone] || BADGE_STYLES.unknown;
  return (
    <button
      type="button"
      onClick={() => onOpen(stream)}
      className="os-card-interactive text-left rounded-lg overflow-hidden flex flex-col"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
    >
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          aspectRatio: '16/9',
          background: stream.thumbnail
            ? `url(${stream.thumbnail}) center/cover`
            : THUMB_GRADIENTS[stream.category],
        }}
      >
        {!stream.thumbnail && (
          <Icon name={cat?.icon || 'Radio'} size={28} style={{ color: 'rgba(255,255,255,0.85)' }} />
        )}
        <span
          className="absolute top-2 left-2 text-[10px] mono px-1.5 py-0.5 rounded flex items-center gap-1"
          style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}
        >
          <span className="os-live-dot w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#ef4444' }} aria-hidden="true" />
          LIVE
        </span>
        <span
          className="absolute bottom-2 right-2 p-1.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        >
          <Lucide.Play size={14} fill="#fff" stroke="none" style={{ color: '#fff' }} />
        </span>
      </div>
      <div className="p-2.5 flex-1 flex flex-col gap-1.5 min-w-0">
        <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {stream.title}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
            style={{ background: 'var(--bg-base)', color: 'var(--text-secondary)' }}
          >
            {stream.region}
          </span>
          <span
            className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
            style={{
              background: `${cat?.accent || STEEL}18`,
              color: cat?.accent || STEEL,
              border: `1px solid ${cat?.accent || STEEL}44`,
            }}
          >
            {cat?.label}
          </span>
          <span
            className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0"
            style={{
              background: badgeStyle.bg,
              color: badgeStyle.color,
              border: `1px solid ${badgeStyle.border}`,
            }}
          >
            {embedBadgeLabel(stream)}
          </span>
        </div>
        <span className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>
          来源：{stream.source}
        </span>
      </div>
    </button>
  );
}

function StreamModal({ stream, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!stream) return null;
  const cat = STREAM_CATEGORIES[stream.category];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stream-modal-title"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(6px)' }} />
      <div
        className="relative w-full max-w-3xl rounded-xl overflow-hidden"
        style={{
          background: 'var(--modal-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--modal-shadow)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="min-w-0">
            <h3 id="stream-modal-title" className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {stream.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{stream.region}</span>
              <span
                className="text-[10px] mono px-1.5 py-0.5 rounded"
                style={{ background: `${cat?.accent}18`, color: cat?.accent, border: `1px solid ${cat?.accent}44` }}
              >
                {cat?.label}
              </span>
              <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
                公开信号 · {stream.source}
              </span>
              <span
                className="text-[10px] mono px-1.5 py-0.5 rounded"
                style={{
                  background: BADGE_STYLES[embedBadgeTone(stream)]?.bg,
                  color: BADGE_STYLES[embedBadgeTone(stream)]?.color,
                  border: `1px solid ${BADGE_STYLES[embedBadgeTone(stream)]?.border}`,
                }}
              >
                {embedBadgeLabel(stream)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            aria-label="关闭"
          >
            <Lucide.X size={16} />
          </button>
        </div>
        <div className="p-4">
          <StreamPlayer stream={stream} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            {stream.description}
          </p>
          <p className="text-[10px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
            {stream.embedType.toUpperCase()}
            {stream.playVerified ? ' · 已验证内嵌' : ' · 外链'}
            {stream.needsProxy ? ' · 开发代理' : ''}
            {' · 非私人监控 · 仅供公开信息浏览'}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{ compact?: boolean, previewCount?: number, pulseKey?: number }} props
 * compact=true 时用于中枢看板预览；false 时展示全量目录
 */
export default function LiveStreamsSection({ compact = false, previewCount = 8, pulseKey = 0 }) {
  const [activeCat, setActiveCat] = useState('all');
  const [embedFilter, setEmbedFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const counts = useMemo(() => countByCategory(), []);

  const filtered = useMemo(() => {
    let list = compact
      ? dashboardPreviewStreams(previewCount, activeCat)
      : PUBLIC_STREAMS;
    if (!compact && activeCat !== 'all') {
      list = list.filter((s) => s.category === activeCat);
    }
    if (!compact && embedFilter === 'hls') {
      list = list.filter((s) => s.playVerified === true);
    }
    if (!compact && embedFilter === 'external') {
      list = list.filter((s) => s.playVerified !== true);
    }
    return list;
  }, [activeCat, compact, embedFilter, previewCount]);

  const open = useCallback((stream) => setSelected(stream), []);
  const close = useCallback(() => setSelected(null), []);

  const embedTabs = [
    ['all', `全部 ${PUBLIC_STREAMS.length}`],
    ['hls', `已验证HLS ${countPlayable()}`],
    ['external', `外链 ${countExternal()}`],
  ];

  const tabs = [
    ['all', `全部分类`],
    ...Object.entries(STREAM_CATEGORIES).map(([id, c]) => [id, `${c.label} ${counts[id]}`]),
  ];

  return (
    <section className={compact ? 'mt-5' : 'mb-8'}>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Lucide.Radio size={16} style={{ color: STEEL }} />
        <h2 className="os-card-title m-0">{compact ? '神州实况' : '公共直播 · 神州实况'}</h2>
        {compact ? (
          <>
            <span className="text-[11px] mono inline-flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
              <span className="os-live-dot w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#34d399' }} aria-hidden="true" />
              公开信号 · 看板同步 #{pulseKey || 0}
            </span>
            <span
              className="text-[10px] mono px-2 py-0.5 rounded"
              style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.35)' }}
            >
              已验证HLS {countPlayable()}
            </span>
            <span
              className="text-[10px] mono px-2 py-0.5 rounded"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}
            >
              外链 {countExternal()}
            </span>
            <Link to="/live-feeds" className="ml-auto text-xs mono os-link">
              查看更多 →
            </Link>
          </>
        ) : (
          <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
            {'// 已验证HLS '}{countPlayable()}{' · 外链 '}{countExternal()}{' · 合计 '}{PUBLIC_STREAMS.length}
          </span>
        )}
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {embedTabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setEmbedFilter(id)}
              className="text-[11px] mono px-2.5 py-1 rounded-full transition-colors"
              style={{
                background: embedFilter === id ? 'rgba(52,211,153,0.14)' : 'var(--bg-elevated)',
                color: embedFilter === id ? '#34d399' : 'var(--text-secondary)',
                border: `1px solid ${embedFilter === id ? 'rgba(52,211,153,0.35)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveCat(id)}
            className="text-[11px] mono px-2.5 py-1 rounded-full transition-colors"
            style={{
              background: activeCat === id ? 'rgba(34,211,238,0.16)' : 'var(--bg-elevated)',
              color: activeCat === id ? STEEL : 'var(--text-secondary)',
              border: `1px solid ${activeCat === id ? 'rgba(34,211,238,0.35)' : 'var(--border-subtle)'}`,
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className="grid gap-3 os-section-stagger"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
      >
        {filtered.map((s) => (
          <StreamCard key={s.id} stream={s} onOpen={open} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="os-card p-6 text-sm text-center" style={{ color: 'var(--text-tertiary)' }}>
          该分类暂无收录信号。
        </div>
      )}

      {compact && (
        <p className="text-[10px] mono mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          已核查 {STREAM_AUDIT.verifiedAt}：{countPlayable()} 路 curl 验证 HLS 可内嵌，{countExternal()} 路官方页面外链（iPanda/CCTV/YouTube 等暂无可用 m3u8）。
        </p>
      )}

      {selected && <StreamModal stream={selected} onClose={close} />}
    </section>
  );
}
