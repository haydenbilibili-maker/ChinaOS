import React, { useMemo, useState } from 'react';
import { ECON_COLORS, BandHead, SignalDot } from './econUI.jsx';
import { scanAlerts, watchSummary, WATCH_ASOF } from './econWatch.js';

// ============================================================================
// 经济观测台 · 经济异动监测 · 全盘聚合（自包含 Section，零数据自持）
// ----------------------------------------------------------------------------
// 把核心指标盘 / 金丝雀 / 背离监测 / 区域下钻的异常项汇成一张告警板，
// 顶部汇总（总数 + 三色计数 + 域分布 + 一句研判），列表按严重度降序，
// 支持 level 筛选 chips（受控 state）。容错：scanAlerts 异常回退空 + 提示。
// 声明：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

// —— 档位 → 配色（严重朱砂 / 警示赭 / 关注黛）+ SignalDot 语义 ——
const LEVEL_STYLE = {
  严重: { color: ECON_COLORS.cinnabar, dot: 'red' },
  警示: { color: ECON_COLORS.ochre, dot: 'amber' },
  关注: { color: ECON_COLORS.indigo, dot: 'green' },
};

const FILTERS = ['全部', '严重', '警示', '关注'];

// —— 三色计数 chip ——
function CountChip({ label, value, color, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-baseline gap-1.5 px-2.5 py-1 rounded mono text-[11px] transition-colors"
      style={{
        background: active ? `${color}22` : 'var(--bg-elevated)',
        border: `1px solid ${active ? color : 'var(--border-subtle)'}`,
        color: active ? color : 'var(--text-secondary)',
        cursor: 'pointer',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
      <span>{label}</span>
      <span className="font-bold" style={{ color: active ? color : 'var(--text-primary)' }}>{value}</span>
    </button>
  );
}

// —— level 徽章 ——
function LevelBadge({ level }) {
  const s = LEVEL_STYLE[level] || LEVEL_STYLE['关注'];
  return (
    <span
      className="inline-flex items-center justify-center shrink-0 mono text-[10px] font-semibold px-1.5 py-0.5 rounded"
      style={{ background: `${s.color}1f`, border: `1px solid ${s.color}`, color: s.color, minWidth: 34 }}
    >
      {level}
    </span>
  );
}

// —— 单条告警行 ——
function AlertRow({ a }) {
  const s = LEVEL_STYLE[a.level] || LEVEL_STYLE['关注'];
  return (
    <div
      className="flex items-start gap-3 py-2.5"
      style={{ borderTop: '1px solid var(--border-subtle)' }}
    >
      {/* 左：档位徽章 + 左侧色条 */}
      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        <span style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: s.color, display: 'block' }} />
        <LevelBadge level={a.level} />
      </div>

      {/* 中：domain 小标 + title + detail + source */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="mono text-[10px] px-1.5 py-0.5 rounded shrink-0"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}
          >
            {a.domain}
          </span>
          <span className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {a.title}
          </span>
        </div>
        <p className="text-[12px] leading-snug mt-1" style={{ color: 'var(--text-secondary)' }}>
          {a.detail}
        </p>
        <div className="mono text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
          ← {a.source}
        </div>
      </div>

      {/* 右：value 读数（mono 右对齐）*/}
      {a.value != null && (
        <div className="mono text-[12px] shrink-0 text-right pt-0.5 max-w-[40%]" style={{ color: s.color }}>
          {a.value}
        </div>
      )}
    </div>
  );
}

/**
 * SectionWatch — 经济异动监测 · 全盘聚合。
 * 自包含：内部调 scanAlerts / watchSummary，无 props。
 */
export default function SectionWatch() {
  // —— 容错：scanAlerts 异常回退空数组 + 标记 ——
  const { alerts, failed } = useMemo(() => {
    try {
      const list = scanAlerts();
      return { alerts: Array.isArray(list) ? list : [], failed: false };
    } catch (e) {
      return { alerts: [], failed: true };
    }
  }, []);

  const summary = useMemo(() => watchSummary(alerts), [alerts]);
  const [filter, setFilter] = useState('全部');

  const shown = filter === '全部' ? alerts : alerts.filter((a) => a.level === filter);

  // byDomain 小标签（按计数降序，确定性 tie-break）
  const domainTags = useMemo(
    () =>
      Object.entries(summary.byDomain || {})
        .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)),
    [summary.byDomain],
  );

  return (
    <section className="os-card p-5">
      <BandHead n="!" title="经济异动监测 · 全盘聚合" en="ANOMALY MONITOR" />

      {failed ? (
        <div
          className="text-[12px] leading-relaxed px-3 py-3 rounded"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}
        >
          异动扫描暂不可用，已回退为空告警板。请稍后重试或核对各源数据层。
        </div>
      ) : (
        <>
          {/* —— 顶部汇总 —— */}
          <div
            className="rounded p-4 mb-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-end gap-4 flex-wrap">
              {/* 总数大字 */}
              <div className="flex items-baseline gap-2">
                <span className="mono text-4xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
                  {summary.total}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>条异动告警</span>
              </div>

              {/* 三色计数 chips（点击 = 筛选）*/}
              <div className="flex items-center gap-2 flex-wrap">
                <CountChip label="严重" value={summary['严重']} color={ECON_COLORS.cinnabar}
                  active={filter === '严重'} onClick={() => setFilter(filter === '严重' ? '全部' : '严重')} />
                <CountChip label="警示" value={summary['警示']} color={ECON_COLORS.ochre}
                  active={filter === '警示'} onClick={() => setFilter(filter === '警示' ? '全部' : '警示')} />
                <CountChip label="关注" value={summary['关注']} color={ECON_COLORS.indigo}
                  active={filter === '关注'} onClick={() => setFilter(filter === '关注' ? '全部' : '关注')} />
              </div>
            </div>

            {/* byDomain 小标签 */}
            {domainTags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {domainTags.map(([d, n]) => (
                  <span
                    key={d}
                    className="mono text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--bg-base, transparent)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
                  >
                    {d}<span className="font-bold" style={{ color: 'var(--text-primary)' }}> {n}</span>
                  </span>
                ))}
              </div>
            )}

            {/* mood 研判条 */}
            <div className="flex items-start gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <span className="shrink-0 pt-0.5"><SignalDot signal={summary['警示'] + summary['严重'] > 0 ? 'red' : 'amber'} /></span>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {summary.mood}
              </p>
            </div>
          </div>

          {/* —— level 筛选 chips —— */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {FILTERS.map((f) => {
              const active = filter === f;
              const c = f === '全部' ? 'var(--text-secondary)' : (LEVEL_STYLE[f]?.color || 'var(--text-secondary)');
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className="mono text-[11px] px-2.5 py-1 rounded transition-colors"
                  style={{
                    background: active ? `${f === '全部' ? 'var(--text-secondary)' : c}1f` : 'transparent',
                    border: `1px solid ${active ? (f === '全部' ? 'var(--text-secondary)' : c) : 'var(--border-subtle)'}`,
                    color: active ? (f === '全部' ? 'var(--text-primary)' : c) : 'var(--text-tertiary)',
                    cursor: 'pointer',
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* —— 告警列表 —— */}
          <div>
            {shown.length === 0 ? (
              <p className="text-[12px] py-4" style={{ color: 'var(--text-tertiary)' }}>
                {alerts.length === 0
                  ? '全盘暂无触发的异动告警，主要读数落在合意区间。'
                  : `当前筛选「${filter}」下暂无告警。`}
              </p>
            ) : (
              shown.map((a) => <AlertRow key={a.id} a={a} />)
            )}
          </div>

          {/* —— 卡尾统一口径小字 —— */}
          <p
            className="text-[10px] leading-relaxed mt-3 pt-3"
            style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)' }}
          >
            告警聚合自核心指标盘 / 金丝雀 / 背离监测 / 区域下钻；严重度分级为示意标定。
            基准日 {WATCH_ASOF} · 公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
          </p>
        </>
      )}
    </section>
  );
}
