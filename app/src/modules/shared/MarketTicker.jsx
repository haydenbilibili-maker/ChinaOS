import React, { useMemo } from 'react';
import * as Lucide from 'lucide-react';
import { useLiveMarketData } from '../../lib/market/useLiveMarketData.js';
import {
  AS_OF_MARKET,
  MARKET_GROUPS,
  REFRESH_INTERVAL_MS,
  formatPrice,
  formatChangePct,
  quoteColor,
} from '../../lib/market/liveQuotes.js';

const STEEL = '#22d3ee';
const HOLD = '#e8a317';
const WARM = '#10b981';

function StatusPill({ status, mode, liveCount, total }) {
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
        离线快照 · 刷新尝试拉取
      </span>
    );
  }
  if (mode === 'live') {
    return (
      <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.14)', color: WARM }}>
        ● 实时 {liveCount}/{total}
      </span>
    );
  }
  if (mode === 'mixed') {
    return (
      <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: STEEL }}>
        ◐ 部分实时 {liveCount}/{total}
      </span>
    );
  }
  return (
    <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.14)', color: HOLD }}>
      ○ 离线快照 · 刷新尝试拉取
    </span>
  );
}

function QuoteSkeleton({ full }) {
  return (
    <div
      className="os-market-card os-card p-3 shrink-0"
      style={{
        width: full ? undefined : 132,
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="os-skeleton h-3 w-16 mb-2 rounded" />
      <div className="os-skeleton h-5 w-20 mb-1.5 rounded" />
      <div className="os-skeleton h-3 w-12 rounded" />
    </div>
  );
}

function QuoteCard({ quote, full }) {
  const color = quoteColor(quote);
  const pct = quote.changePct;
  const Icon = pct == null ? Lucide.Minus : pct > 0 ? Lucide.TrendingUp : pct < 0 ? Lucide.TrendingDown : Lucide.Minus;

  return (
    <div
      className="os-market-card os-card p-3 shrink-0 transition-colors"
      style={{
        width: full ? undefined : 132,
        borderColor: pct != null && pct !== 0 ? `${color}33` : 'var(--border-subtle)',
        background: 'var(--bg-elevated)',
      }}
      title={quote.hint || quote.name}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>{quote.name}</span>
        {quote.mode === 'live' && (
          <span className="w-1 h-1 rounded-full shrink-0" style={{ background: WARM, boxShadow: `0 0 4px ${WARM}` }} />
        )}
      </div>
      <div className="mono text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
        {formatPrice(quote)}
        {quote.unit && quote.category !== 'spread' && (
          <span className="text-[9px] font-normal ml-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {quote.unit}
          </span>
        )}
        {quote.category === 'spread' && (
          <span className="text-[9px] font-normal ml-0.5" style={{ color: 'var(--text-tertiary)' }}>bp</span>
        )}
      </div>
      {quote.category !== 'spread' ? (
        <div className="flex items-center gap-1 mt-1">
          <Icon size={11} style={{ color }} />
          <span className="mono text-[10px] font-semibold" style={{ color }}>{formatChangePct(pct)}</span>
        </div>
      ) : (
        <div className="text-[10px] mt-1 truncate" style={{ color: 'var(--text-tertiary)' }}>{quote.hint}</div>
      )}
    </div>
  );
}

function formatUpdatedAt(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch (_) {
    return '';
  }
}

/**
 * @param {{ variant?: 'compact' | 'full', hideTitle?: boolean, className?: string }} props
 */
export default function MarketTicker({ variant = 'compact', hideTitle = false, className = '' }) {
  const full = variant === 'full';
  const { quotes, status, mode, updatedAt, liveCount, error, refresh, stale } = useLiveMarketData();

  const grouped = useMemo(() => {
    const map = {};
    for (const g of MARKET_GROUPS) map[g.key] = [];
    for (const q of quotes) {
      if (map[q.category]) map[q.category].push(q);
    }
    return MARKET_GROUPS.filter((g) => map[g.key]?.length).map((g) => ({ ...g, items: map[g.key] }));
  }, [quotes]);

  const total = quotes.length;

  const toolbar = (
    <div className="flex items-center gap-2 mb-2 flex-wrap">
      {!hideTitle && (
        <>
          <Lucide.Activity size={14} style={{ color: STEEL }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>全球资产脉搏</span>
          <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
            股 · 债 · 汇 · 金 · 油 · 大宗
          </span>
        </>
      )}
      <button
        type="button"
        onClick={refresh}
        className="inline-flex items-center gap-1 text-[10px] mono px-1.5 py-0.5 rounded os-card-interactive"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}
        title="立即刷新"
      >
        <Lucide.RefreshCw size={10} />
        刷新
      </button>
      <span className={hideTitle ? '' : 'ml-auto'}>
        <StatusPill status={status} mode={mode} liveCount={liveCount} total={total} />
      </span>
    </div>
  );

  const footer = (
    <div className="flex items-center justify-between mt-1.5 px-0.5 flex-wrap gap-1">
      <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
        基准 {AS_OF_MARKET}
        {updatedAt && <> · 更新 {formatUpdatedAt(updatedAt)}</>}
        · 每 {Math.round(REFRESH_INTERVAL_MS / 1000)}s 轮询
        {stale && <> · <span style={{ color: HOLD }}>数据可能过期</span></>}
      </span>
      {error && status !== 'loading' && (
        <span className="text-[10px] truncate max-w-[55%]" style={{ color: HOLD }} title={error}>
          {error}
        </span>
      )}
    </div>
  );

  if (full) {
    return (
      <section className={`os-market-panel ${className}`}>
        {toolbar}
        {status === 'loading' && !quotes.length ? (
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))' }}>
            {Array.from({ length: 12 }).map((_, i) => <QuoteSkeleton key={i} full />)}
          </div>
        ) : (
          grouped.map(({ key, label, items }) => (
            <div key={key} className="os-card p-4 mb-4 last:mb-0" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: STEEL, boxShadow: `0 0 6px ${STEEL}` }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</span>
                <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{items.length} 标的</span>
              </div>
              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))' }}>
                {items.map((q) => <QuoteCard key={q.id} quote={q} full />)}
              </div>
            </div>
          ))
        )}
        {footer}
      </section>
    );
  }

  return (
    <section className={`mt-5 os-market-panel ${className}`}>
      {toolbar}
      {status === 'loading' && !quotes.length ? (
        <div className="flex gap-2 overflow-x-auto pb-1 os-market-scroll">
          {Array.from({ length: 8 }).map((_, i) => <QuoteSkeleton key={i} />)}
        </div>
      ) : (
        grouped.map(({ key, label, items }) => (
          <div key={key} className="mb-2.5 last:mb-0">
            <div className="text-[10px] mono mb-1.5 px-0.5" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
            <div className="flex gap-2 overflow-x-auto pb-1 os-market-scroll">
              {items.map((q) => <QuoteCard key={q.id} quote={q} />)}
            </div>
          </div>
        ))
      )}
      {footer}
    </section>
  );
}
