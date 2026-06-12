import React from 'react';
import * as Lucide from 'lucide-react';
import {
  useNewsFeed,
  truncateTitle,
  getSourceBadge,
  formatNewsAge,
  AS_OF_NEWS,
  NEWS_MAX_AGE_DAYS,
} from './newsFeed.js';

const STEEL = '#22d3ee';
const HOLD = '#e8a317';

function NewsChip({ item }) {
  const meta = getSourceBadge(item.source);
  const age = formatNewsAge(item.publishedAt);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="os-news-chip inline-flex items-center gap-2 text-xs shrink-0"
      title={age ? `${item.title} · ${age}` : item.title}
    >
      <span
        className="mono text-[10px] px-1.5 py-0.5 rounded shrink-0 font-medium"
        style={{
          background: `${meta.color}18`,
          color: meta.color,
          border: `1px solid ${meta.color}44`,
        }}
      >
        {meta.badge}
      </span>
      <span style={{ color: 'var(--text-primary)' }}>{truncateTitle(item.title)}</span>
      {age && (
        <span className="text-[10px] mono shrink-0 opacity-70" style={{ color: 'var(--text-tertiary)' }}>
          {age}
        </span>
      )}
      <span className="text-[10px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>
        {item.category}
      </span>
    </a>
  );
}

function StatusPill({ status, mode, error, filterStats }) {
  if (status === 'loading') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
        <Lucide.Loader2 size={10} className="animate-spin" />
        同步中
      </span>
    );
  }
  if (status === 'offline') {
    return (
      <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.14)', color: HOLD }}>
        离线 · 种子
      </span>
    );
  }
  if (mode === 'live' || mode === 'cached') {
    const filtered = filterStats?.filteredOut > 0;
    return (
      <span
        className="text-[10px] mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
        style={{ background: 'rgba(16,185,129,0.14)', color: '#10b981' }}
        title={filtered ? `已滤除 ${filterStats.filteredOut} 条过期/无效（>${NEWS_MAX_AGE_DAYS}天）` : undefined}
      >
        ● 实时 RSS
        {filtered && (
          <span style={{ color: 'var(--text-tertiary)' }}>
            · 滤{filterStats.filteredOut}
          </span>
        )}
      </span>
    );
  }
  return (
    <span
      className="text-[10px] mono px-1.5 py-0.5 rounded"
      style={{ background: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}
      title={error || '内置种子'}
    >
      ○ 内置种子
    </span>
  );
}

export default function NewsMarquee() {
  const { items, status, mode, error, filterStats } = useNewsFeed();

  const renderTrack = (dup) => items.map((item) => (
    <NewsChip key={`${dup}-${item.id}`} item={item} />
  ));

  return (
    <div className="mt-5 os-news-marquee">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <Lucide.Newspaper size={14} style={{ color: STEEL }} />
        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>时政要闻</span>
        <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
          央视 · 人民日报 · 新华社等 · {NEWS_MAX_AGE_DAYS}天内 · 去重简报
        </span>
        <span className="ml-auto">
          <StatusPill status={status} mode={mode} error={error} filterStats={filterStats} />
        </span>
      </div>

      {status === 'loading' && !items.length ? (
        <div
          className="os-card flex items-center justify-center gap-2 py-3 text-xs"
          style={{ color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}
        >
          <Lucide.Loader2 size={14} className="animate-spin" />
          正在拉取主流媒体 RSS…
        </div>
      ) : (
        <div
          className="os-ticker os-card os-news-ticker"
          style={{ padding: '10px 0', borderColor: 'var(--border-subtle)' }}
        >
          <div className="os-ticker-track os-news-ticker-track">
            {renderTrack('a')}
            {renderTrack('b')}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-1.5 px-0.5">
        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
          基准 {AS_OF_NEWS} · 点击标题跳转原文 · hover 暂停滚动
        </span>
        {error && status !== 'loading' && (
          <span className="text-[10px] truncate max-w-[50%]" style={{ color: HOLD }} title={error}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
