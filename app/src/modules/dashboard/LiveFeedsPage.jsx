import React from 'react';
import { PageHeader } from '../../app/ui.jsx';
import LiveStreamsSection from './LiveStreamsSection.jsx';
import { countByCategory, countPlayable, countExternal, PUBLIC_STREAMS, STREAM_AUDIT } from './liveStreams.js';

export default function LiveFeedsPage() {
  const counts = countByCategory();

  return (
    <div>
      <PageHeader
        badge="公开信号"
        title="神州实况 · 公共直播目录"
        subtitle="冷峻收录全国各地合法公开慢直播：熊猫基地、风景名胜区、港口枢纽、天文海洋与非遗活动。信号归属各源端维护，本站仅作聚合索引与来源标注。"
      >
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(counts).map(([key, n]) => (
            <span
              key={key}
              className="text-[10px] mono px-2 py-0.5 rounded"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              {key === 'panda' && '熊猫'}
              {key === 'scenic' && '景区'}
              {key === 'traffic' && '交通'}
              {key === 'other' && '其他'}
              {' · '}{n}
            </span>
          ))}
          <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
            已验证HLS {countPlayable()} 路
          </span>
          <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>
            外链 {countExternal()} 路
          </span>
          <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>
            合计 {PUBLIC_STREAMS.length} 路
          </span>
        </div>
        <p className="text-[11px] mono mt-3 leading-relaxed max-w-3xl" style={{ color: 'var(--text-tertiary)' }}>
          核查日期 {STREAM_AUDIT.verifiedAt}。{STREAM_AUDIT.notes} 生产环境无 Vite 代理时，无 CORS 的 HLS 建议在 Safari 打开或跳转原页面。
        </p>
      </PageHeader>
      <LiveStreamsSection compact={false} />
    </div>
  );
}
