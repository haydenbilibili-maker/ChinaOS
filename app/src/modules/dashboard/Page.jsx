import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat, StatGrid, EmptyState, LoadingSkeleton } from '../../app/ui.jsx';
import { GROUPS, MODULES } from '../../app/registry.js';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, GRID_LINE, LABEL } from '../shared/chartHelpers.js';
import * as DB from '../../lib/db/localdb.js';
import { useDocs } from '../../lib/db/useDataset.js';
import { GWR_DOCS } from '../../lib/db/docSeed.js';
import { INDICATORS as WATCH_INDICATORS, LEVELS as WATCH_LEVELS } from '../watchtower/data.js';
import { EVENTS as CHRONICLE_EVENTS, ERAS as CHRONICLE_ERAS } from '../chronicle/data.js';
import { useGdeltNews, timeAgo, domainBadge } from './liveGdelt.js';
import { useLiveMarkets, probColor } from './livePolymarket.js';
import {
  AS_OF,
  MODULE_COUNT,
  GROUP_COUNT,
  ENTRY_TOTAL,
  DATASET_SCALE,
  TALENT_LAYERS,
  ANTICORRUPTION_TREND,
  PE500_PROVINCES,
  RANK_STRUCTURE,
  GROUP_COVERAGE,
  TOPIC_MODULES,
  FEATURED,
  SOURCES,
  LIVE_MODULE_CHIPS,
  DIPLOMACY_TONES,
  groupStrategyVectors,
  sortStrategyVectors,
  RISK_RADAR,
  POLICY_CALENDAR_2026,
} from './data.js';
import { useMacroPulse } from './useMacroPulse.js';
import NewsMarquee from './NewsMarquee.jsx';
import LiveStreamsSection from './LiveStreamsSection.jsx';
import LiveChinaMap from './LiveChinaMap.jsx';
import GovernanceVerdict from '../governance/GovernanceVerdict.jsx';
import { withExportBrand, EXPORT_DISCLAIMER } from '../../lib/exportBrand.js';

function Icon({ name, size = 16 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} />;
}

const fmt = (n) => n.toLocaleString('en-US');

// ── 实时大屏 · 发光指标卡 ─────────────────────────────────
function ScreenCard({ title, accent = '#22d3ee', children, footer, live = false, className = '' }) {
  return (
    <div
      className={`os-card os-card-lift os-screen-card p-4 flex flex-col h-auto${live ? ' os-screen-card--live' : ''} ${className}`.trim()}
      style={{ '--screen-accent': accent }}
    >
      <div className="flex items-center gap-2 mb-2 shrink-0">
        <span
          className={`w-1.5 h-1.5 rounded-full${live ? ' os-live-dot' : ''}`}
          style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
        />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      <div className="min-h-0">{children}</div>
      {footer && <div className="text-[10px] mt-2 leading-snug shrink-0" style={{ color: 'var(--text-tertiary)' }}>{footer}</div>}
    </div>
  );
}

// ── 滚动情报条 · 关键读数（示意，对应各模块判读基准） ────────
const WARM = '#10b981', HOLD = '#e8a317', COOL = '#c41e3a', STEEL = '#22d3ee';
const TICKER = [
  ['GDP H1', '5.3%', COOL], ['CPI 6月', '0.3%', STEEL], ['PMI 6月', '49.8', HOLD],
  ['社零 6月', '+4.6%', WARM], ['赤字率', '4% 左右', COOL], ['货币定调', '适度宽松', WARM],
  ['中美', '竞合管控 →', HOLD], ['台海', '高压常态化', HOLD], ['人口', '14.05 亿 · 负增长', HOLD],
  ['青年失业', '16.8%', COOL], ['城镇调查失业率', '5.1%', HOLD], ['制造业全球份额', '≈30%', WARM],
];

function Ticker() {
  const items = (dup) => TICKER.map(([k, v, c], i) => (
    <span key={`${dup}-${i}`} className="inline-flex items-center gap-1.5 text-xs mono">
      <span style={{ color: 'var(--text-tertiary)' }}>{k}</span>
      <span style={{ color: c, fontWeight: 600 }}>{v}</span>
    </span>
  ));
  return (
    <div className="os-ticker os-card mb-4" style={{ padding: '8px 0', borderColor: 'var(--border-subtle)' }}>
      <div className="os-ticker-track">
        {items('a')}
        {items('b')}
      </div>
    </div>
  );
}

// ── 2026 H1 宏观读数（NBS 公开口径 · 对齐经济大盘 KEY_INDICATORS） ──
function MacroH1Strip({ kpis, asOf, lastRefresh, isRefreshing, secondsToNext, refreshCount }) {
  const tsKey = lastRefresh ? lastRefresh.toISOString() : 'pending';
  const fmtTs = lastRefresh
    ? lastRefresh.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  return (
    <div
      className={`mt-5 pt-5 os-macro-strip${isRefreshing ? ' is-refreshing' : ''}`}
      style={{ borderTop: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap min-w-0 max-w-full">
        <Lucide.Gauge size={14} style={{ color: COOL }} />
        <span className="text-xs font-semibold os-label-slot" style={{ color: 'var(--text-secondary)' }}>2026 H1 宏观读数</span>
        <span className="text-[10px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>
          数据截至 <span className="mono os-mono-tabular">{asOf}</span>
        </span>
        <span key={tsKey} className="text-[10px] mono os-ts-flash shrink-0" style={{ color: 'var(--text-tertiary)' }}>
          上次刷新 {fmtTs}
        </span>
        <span className="text-[10px] mono ml-auto shrink-0" style={{ color: isRefreshing ? STEEL : 'var(--text-tertiary)' }}>
          {isRefreshing ? '刷新中…' : `下次 ${secondsToNext}s`}
          {' · '}
          <Link to="/econ-dashboard" className="mono" style={{ color: STEEL }}>经济大盘</Link>
        </span>
      </div>
      <StatGrid stagger={false}>
        {kpis.map(({ id, k, v, note, c, live }) => (
          <div
            key={`${id}-${refreshCount}`}
            className={`os-card os-stat-card os-card-lift p-4${refreshCount > 0 ? ' os-metric-pulse' : ''}`}
            style={{ borderColor: `${c}33`, '--metric-accent': c }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {live && <span className="os-live-dot w-1.5 h-1.5 rounded-full shrink-0" style={{ background: WARM }} />}
              <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{k}</span>
            </div>
            <div key={`${id}v${v}-${refreshCount}`} className={`${refreshCount > 0 ? 'lcm-flash ' : ''}mono os-mono-tabular`} style={{ fontSize: '1.35rem', fontWeight: 700, color: c }}>{v}</div>
            <span className="block text-[10px] mt-0.5 font-normal" style={{ color: 'var(--text-tertiary)' }}>{note}</span>
          </div>
        ))}
      </StatGrid>
    </div>
  );
}

function LiveModuleChips() {
  return (
    <div className="flex items-center gap-2 flex-wrap mt-5 os-section-stagger">
      <span className="text-[10px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>活模块</span>
      {LIVE_MODULE_CHIPS.map((chip) => (
        <Link key={chip.id} to={chip.path} className="os-live-chip" title={chip.note}>
          <span className={`os-live-chip__dot${chip.live ? ' is-live' : ''}`} aria-hidden="true" />
          <Icon name={chip.icon} size={13} />
          <span>{chip.title}</span>
          <span className="text-[10px] mono opacity-70">{chip.note}</span>
        </Link>
      ))}
    </div>
  );
}

// ── 战略态势速览（镜像外交盘读数 · 2026-06 判读基准） ────────
const STRATEGY_QUICK_LINKS = [
  { to: '/diplomacy', label: '外交框架盘' },
  { to: '/straits', label: '台海战略' },
  { to: '/omnisecurity', label: '大安全观' },
];

function StrategyPulse() {
  const groups = useMemo(() => groupStrategyVectors(), []);
  return (
    <ScreenCard title="战略态势速览" accent={COOL} footer={<>判读基准 2026-06 · 排序：圈层 → 紧张度 → 优先级 · 详见 <Link to="/diplomacy" className="mono" style={{ color: STEEL }}>外交全局框架盘</Link></>}>
      <div className="strategy-pulse-grid">
        {groups.map((g) => (
          <div key={g.id} className="strategy-pulse-group">
            <div className="strategy-pulse-group__label mono">{g.label}</div>
            {g.items.map((v) => {
              const c = DIPLOMACY_TONES[v.tone] || HOLD;
              return (
                <Link
                  key={v.id}
                  to="/diplomacy"
                  className="dash-vector-row os-card-interactive"
                  title={`${v.role} · ${v.note}`}
                >
                  <span className="dash-vector-row__name">{v.name}</span>
                  <span className="dash-vector-row__pill mono" style={{ borderColor: `${c}55`, background: `${c}14`, color: c }}>
                    {v.status} {v.trend}
                  </span>
                  <span className="dash-vector-row__note">{v.note}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
      <div className="strategy-pulse-links">
        {STRATEGY_QUICK_LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="strategy-pulse-link mono">{l.label} ↗</Link>
        ))}
      </div>
    </ScreenCard>
  );
}

// ── 政策脉搏（联动本地政策文件库：库内有报告即读活数据，写入即刷新；空库回退内置种子） ──
function PolicyPulse() {
  const docs = useDocs();
  const liveGwr = useMemo(() => {
    const list = (docs || []).filter((d) => d.type === '政府工作报告' && d.metrics);
    return list.sort((a, b) => (b.year || 0) - (a.year || 0))[0] || null;
  }, [docs]);
  const latest = liveGwr || GWR_DOCS[GWR_DOCS.length - 1];
  const metrics = latest.metrics || {};
  const chips = [
    ['GDP', metrics.gdpTarget != null ? `${metrics.gdpTarget}%左右` : '—', HOLD],
    ['赤字率', metrics.deficit != null ? `${metrics.deficit}%左右` : '—', COOL],
    ['CPI', metrics.cpi != null ? `${metrics.cpi}%左右` : '—', STEEL],
    ['新增就业', metrics.jobs != null ? `${metrics.jobs}万+` : '—', WARM],
  ];
  return (
    <ScreenCard title={`政策脉搏 · ${latest.year} 施政基准`} accent={HOLD} live={Boolean(liveGwr)}
      footer={<>
        <span className="mono px-1.5 py-0.5 rounded mr-1.5" style={{ background: liveGwr ? 'rgba(16,185,129,0.16)' : 'var(--bg-elevated)', color: liveGwr ? WARM : 'var(--text-tertiary)', fontSize: 9 }}>{liveGwr ? '● 本地库活数据' : '○ 内置种子'}</span>
        结构化要点 · 历年比对与提法变迁见 <Link to="/policydocs" className="mono" style={{ color: STEEL }}>政策文件库</Link>
      </>}>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {chips.map(([k, v, c]) => (
          <div key={k} className="rounded-lg px-3 py-2" style={{ background: 'var(--bg-elevated)', border: `1px solid ${c}33` }}>
            <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{k}</div>
            <div className="mono text-base font-bold os-mono-tabular" style={{ color: c }}>{v}</div>
          </div>
        ))}
      </div>
      {latest.stance && (
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-[11px] px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: HOLD }}>财政：{latest.stance.fiscal}</span>
          <span className="text-[11px] px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: STEEL }}>货币：{latest.stance.monetary}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {(latest.keywords || []).slice(0, 6).map((k) => (
          <span key={k} className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{k}</span>
        ))}
      </div>
    </ScreenCard>
  );
}

// ── 数据底座 · 实时状态（IndexedDB 活数据，写入即刷新） ──────
function LiveDbStatus() {
  const [st, setSt] = useState(null);
  useEffect(() => {
    let alive = true;
    const load = async () => { try { const s = await DB.stats(); if (alive) setSt(s); } catch (_) {} };
    load();
    const unsub = DB.subscribe(() => load());
    return () => { alive = false; unsub(); };
  }, []);
  const cells = [
    { label: '数据集', value: st ? st.datasetCount : '…', to: '/foundation', accent: STEEL, icon: 'Database' },
    { label: '数据行', value: st ? fmt(st.totalRows) : '…', to: '/foundation', accent: WARM, icon: 'Rows3' },
    { label: '人才精英', value: st ? fmt(st.figureCount) : '…', to: '/talent', accent: COOL, icon: 'UsersRound' },
    { label: '政策文件', value: st ? (st.docCount ?? 0) : '…', to: '/policydocs', accent: HOLD, icon: 'FileText' },
  ];
  return (
    <ScreenCard title="数据底座 · 实时状态" accent={STEEL} live footer="浏览器本地库（IndexedDB）实时计数 · 后台写入即刷新，点击直达管理">
      <div className="grid grid-cols-2 gap-2">
        {cells.map((c) => (
          <Link key={c.label} to={c.to} className="os-card-interactive rounded-lg px-3 py-3" style={{ background: 'var(--bg-elevated)', border: `1px solid ${c.accent}33` }}>
            <div className="flex items-center gap-1.5 mb-1" style={{ color: c.accent }}>
              <Icon name={c.icon} size={13} />
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{c.label}</span>
            </div>
            <div className="mono text-xl font-bold os-mono-tabular" style={{ color: c.accent }}>{c.value}</div>
          </Link>
        ))}
      </div>
    </ScreenCard>
  );
}

// ── 最近访问（Shell 记录的访问足迹 · localStorage 驱动） ─────
function RecentVisits() {
  const recent = useMemo(() => {
    try {
      const paths = JSON.parse(localStorage.getItem('cos-recent') || '[]');
      return paths.map((p) => MODULES.find((m) => m.path === p)).filter(Boolean).slice(0, 8);
    } catch (_) { return []; }
  }, []);
  if (!recent.length) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap mb-5">
      <span className="text-[10px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>最近访问</span>
      {recent.map((m) => {
        const g = GROUPS.find((x) => x.id === m.group);
        return (
          <Link key={m.id} to={m.path} className="os-card-interactive inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <span style={{ color: g?.accent || STEEL }}><Icon name={m.icon} size={12} /></span>{m.title}
          </Link>
        );
      })}
    </div>
  );
}

// ── 康波时钟 · 长波坐标（镜像康波页判读） ───────────────────
function KondratievClock() {
  const opt = useMemo(() => {
    const pts = [];
    for (let y = 1990; y <= 2055; y += 1) pts.push([y, +Math.sin((2 * Math.PI * (y - 1788)) / 54).toFixed(3)]);
    return {
      grid: { left: 10, right: 10, top: 10, bottom: 20 },
      xAxis: { type: 'value', min: 1990, max: 2055, interval: 20, axisLabel: { color: '#5b6a82', fontSize: 9, formatter: (v) => String(v) }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } } },
      yAxis: { type: 'value', min: -1.35, max: 1.35, show: false },
      series: [{
        type: 'line', smooth: true, symbol: 'none', data: pts,
        lineStyle: { color: STEEL, width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.07)' },
        markLine: { silent: true, symbol: 'none', data: [{ xAxis: 2026, label: { formatter: '今 2026', color: COOL, fontSize: 9 }, lineStyle: { color: COOL, type: 'dashed' } }] },
        markArea: { silent: true, itemStyle: { color: 'rgba(139,92,246,0.10)' }, data: [[{ xAxis: 2040, label: { formatter: '第6波', color: '#8b5cf6', position: 'insideTop', fontSize: 9 } }, { xAxis: 2055 }]] },
      }],
    };
  }, []);
  return (
    <ScreenCard title="康波时钟 · 长波坐标" accent="#8b5cf6"
      footer={<>第 5 波（信息）冬季尾段 → 第 6 波（AI/聚变/生物）孕育期 · 推演见 <Link to="/cognition" className="mono" style={{ color: STEEL }}>康波周期</Link> 共振模拟器</>}>
      <EChart option={opt} style={{ height: 148 }} />
      <div className="flex gap-2 mt-2 flex-wrap">
        {[['当前相位', '第5波·冬', '#64748b'], ['下一波引擎', 'AI·聚变·生物', '#8b5cf6'], ['切换窗口', '~2035–2045', HOLD]].map(([k, v, c]) => (
          <span key={k} className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: c }}>{k} {v}</span>
        ))}
      </div>
    </ScreenCard>
  );
}

// ── 全域风险雷达（八域威胁紧张度 · 公开判读基准） ──────────────
function RiskRadar() {
  const opt = useMemo(() => ({
    radar: {
      indicator: RISK_RADAR.dims.map((n) => ({ name: n, max: 5 })),
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false }, radius: '66%',
    },
    series: [{ type: 'radar', data: [{ value: RISK_RADAR.values, name: '威胁紧张度', lineStyle: { color: COOL, width: 2 }, itemStyle: { color: COOL }, areaStyle: { color: 'rgba(196,30,58,0.15)' } }] }],
  }), []);
  return (
    <ScreenCard title="全域风险雷达" accent={COOL}
      footer={<>八域威胁紧张度（公开判读 1–5 · {RISK_RADAR.note.slice(0, 42)}…）· 详见 <Link to="/omnisecurity" className="mono" style={{ color: STEEL }}>大安全观</Link> · 数据截至 2026-07-13</>}>
      <EChart option={opt} style={{ height: 196 }} />
    </ScreenCard>
  );
}

// ── 2026 政策日历（关键定调节点） ───────────────────────────
function daysUntil(iso) {
  return Math.ceil((new Date(`${iso}T00:00:00`) - new Date()) / 86400000);
}
function PolicyCalendar() {
  const rows = useMemo(() => {
    const withD = POLICY_CALENDAR_2026.map((r) => ({ r, d: daysUntil(r.date) }));
    const next = withD.filter((x) => x.d >= 0 && !x.r.done).sort((a, b) => a.d - b.d)[0];
    return withD.map((x) => ({ ...x, isNext: next && x === next }));
  }, []);
  return (
    <ScreenCard title="2026 政策日历 · 关键定调节点" accent={WARM}
      footer={<>定调落地追踪见 <Link to="/policydocs" className="mono" style={{ color: STEEL }}>政策文件库</Link> · 数据截至 2026-07-13</>}>
      <div className="space-y-2">
        {rows.map(({ r: { when, title, note, accent, done }, d, isNext }) => {
          const c = DIPLOMACY_TONES[accent] || WARM;
          return (
          <div key={title} className="flex items-start gap-2.5 rounded-lg px-3 py-2"
            style={{ background: 'var(--bg-elevated)', border: `1px solid ${isNext ? `${WARM}66` : 'var(--border-subtle)'}` }}>
            <span className="text-[10px] mono px-1.5 py-0.5 rounded shrink-0 mt-0.5" style={{ background: `${c}14`, color: c, border: `1px solid ${c}44` }}>{when}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{title}</span>
              <span className="block text-[10px] leading-snug" style={{ color: 'var(--text-tertiary)' }}>{note}</span>
            </span>
            <span className="text-[10px] mono shrink-0 mt-0.5 px-1.5 py-0.5 rounded"
              style={{ color: done || d < 0 ? 'var(--text-tertiary)' : isNext ? WARM : 'var(--text-secondary)', background: isNext ? 'rgba(16,185,129,0.14)' : 'transparent' }}>
              {done || d < 0 ? '已过' : d === 0 ? '今日' : `T-${d}天`}
            </span>
          </div>
        );})}
      </div>
    </ScreenCard>
  );
}

// ── 认知内核 · 思想工具箱速览（自动同步注册表） ──────────────
function CognitionToolbox() {
  const tools = MODULES.filter((m) => m.group === 'cognition');
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Lucide.BrainCircuit size={16} style={{ color: HOLD }} />
        <h2 className="os-card-title m-0">认知内核 · 思想工具箱</h2>
        <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{`// ${tools.length} 个可推演理论模型 · 拖动参数看结构后果`}</span>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))' }}>
        {tools.map((m) => (
          <Link key={m.id} to={m.path} className="os-card-interactive rounded-lg p-2.5 flex items-start gap-2"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <span className="shrink-0 mt-0.5" style={{ color: COOL }}><Icon name={m.icon} size={14} /></span>
            <span className="min-w-0">
              <span className="block text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{m.title}</span>
              <span className="block text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>{m.subtitle}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── 大屏图表 option ───────────────────────────────────────
function useOptions() {
  return useMemo(() => {
    const donut = {
      tooltip: { trigger: 'item', formatter: '{b}<br/>{c} 人 · {d}%' },
      legend: { type: 'scroll', bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, icon: 'circle' },
      series: [{
        type: 'pie', radius: ['46%', '70%'], center: ['50%', '42%'],
        avoidLabelOverlap: true, label: { show: false },
        data: TALENT_LAYERS.map((d) => ({ name: d.name, value: d.value, itemStyle: { color: d.color } })),
      }],
    };

    const acTrend = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 32, right: 12, top: 14, bottom: 24 },
      xAxis: { type: 'category', data: ANTICORRUPTION_TREND.years, axisLine: AXIS, axisLabel: { ...LABEL, interval: 1 } },
      yAxis: { type: 'value', splitLine: GRID_LINE, axisLabel: LABEL },
      series: [{
        type: 'bar', barWidth: '62%', data: ANTICORRUPTION_TREND.values,
        itemStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#c41e3a' }, { offset: 1, color: '#5b0f1c' }] },
          borderRadius: [2, 2, 0, 0],
        },
      }],
    };

    const prov = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: {c} 家' },
      grid: { left: 52, right: 24, top: 8, bottom: 16 },
      xAxis: { type: 'value', splitLine: GRID_LINE, axisLabel: LABEL },
      yAxis: {
        type: 'category', inverse: true,
        data: PE500_PROVINCES.map((d) => d.name), axisLine: AXIS, axisLabel: LABEL,
      },
      series: [{
        type: 'bar', barWidth: '64%', data: PE500_PROVINCES.map((d) => d.value),
        itemStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#9a4a17' }, { offset: 1, color: '#fb923c' }] },
          borderRadius: [0, 3, 3, 0],
        },
      }],
    };

    const ranks = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => `${p[0].name}<br/>${fmt(p[0].value)} 人（量级示意）` },
      grid: { left: 56, right: 30, top: 8, bottom: 16 },
      xAxis: { type: 'log', splitLine: GRID_LINE, axisLabel: { ...LABEL, formatter: (v) => (v >= 10000 ? `${v / 10000}万` : v) } },
      yAxis: { type: 'category', inverse: true, data: RANK_STRUCTURE.levels.map((d) => d.name), axisLine: AXIS, axisLabel: LABEL },
      series: [{
        type: 'bar', barWidth: '56%',
        data: RANK_STRUCTURE.levels.map((d) => ({ value: d.value, itemStyle: { color: d.color, borderRadius: [0, 3, 3, 0] } })),
      }],
    };

    const coverage = {
      tooltip: { trigger: 'item', formatter: '{b}: {c} 模块' },
      series: [{
        type: 'treemap', roam: false, nodeClick: false,
        breadcrumb: { show: false },
        label: { show: true, color: '#fff', fontSize: 11, formatter: '{b}\n{c}' },
        itemStyle: { borderColor: 'var(--bg-base)', borderWidth: 2, gapWidth: 2 },
        data: GROUP_COVERAGE,
        top: 4, bottom: 4, left: 4, right: 4,
      }],
    };

    const scale = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: {c} 条' },
      grid: { left: 70, right: 30, top: 8, bottom: 16 },
      xAxis: { type: 'value', splitLine: GRID_LINE, axisLabel: LABEL },
      yAxis: { type: 'category', inverse: true, data: DATASET_SCALE.map((d) => d.key), axisLine: AXIS, axisLabel: LABEL },
      series: [{
        type: 'bar', barWidth: '60%',
        label: { show: true, position: 'right', color: LABEL.color, fontSize: 10, formatter: '{c}' },
        data: DATASET_SCALE.map((d) => ({ value: d.value, itemStyle: { color: d.color, borderRadius: [0, 3, 3, 0] } })),
      }],
    };

    return { donut, acTrend, prov, ranks, coverage, scale };
  }, []);
}

// ── 监测台速览（红档告警回流指挥舱） ─────────────────────────
function WatchPulse() {
  const alerts = useMemo(() => WATCH_INDICATORS.filter((i) => i.level === 'cool').slice(0, 5), []);
  const counts = useMemo(() => ({
    cool: WATCH_INDICATORS.filter((i) => i.level === 'cool').length,
    hold: WATCH_INDICATORS.filter((i) => i.level === 'hold').length,
    warm: WATCH_INDICATORS.filter((i) => i.level === 'warm').length,
  }), []);
  return (
    <ScreenCard title="监测台速览 · 越线告警" accent={COOL}
      footer={<>六域 {WATCH_INDICATORS.length} 项先行指标 · 三档阈值全盘见 <Link to="/watchtower" className="mono" style={{ color: STEEL }}>全局监测台</Link></>}>
      <div className="flex gap-2 mb-2.5">
        {[['红', counts.cool, WATCH_LEVELS.cool.color], ['黄', counts.hold, WATCH_LEVELS.hold.color], ['绿', counts.warm, WATCH_LEVELS.warm.color]].map(([k, n, c]) => (
          <span key={k} className="text-[10px] mono px-2 py-0.5 rounded-full" style={{ background: `${c}14`, color: c, border: `1px solid ${c}44` }}>{k} {n}</span>
        ))}
      </div>
      <div className="space-y-1.5">
        {alerts.map((a) => (
          <Link key={a.id} to="/watchtower" className="os-card-interactive flex items-center gap-2 rounded-lg px-2.5 py-1.5"
            style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${COOL}` }}>
            <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)', maxWidth: 110 }}>{a.name}</span>
            <span className="text-[10px] mono truncate flex-1" style={{ color: COOL }}>{a.reading}</span>
            <span className="mono text-[10px] shrink-0" style={{ color: 'var(--text-tertiary)' }}>{a.trend}</span>
          </Link>
        ))}
      </div>
    </ScreenCard>
  );
}

// ── 时间轴速览（当前时代 + 最新节点回流指挥舱） ───────────────
function ChroniclePulse() {
  const era = CHRONICLE_ERAS[CHRONICLE_ERAS.length - 1];
  const recent = useMemo(() => CHRONICLE_EVENTS.slice(-5).reverse(), []);
  return (
    <ScreenCard title={`国运坐标 · ${era.label} ${era.range[0]}–${era.range[1]}`} accent={era.accent || '#fb923c'}
      footer={<>1949→2026 七时代 {CHRONICLE_EVENTS.length} 节点全轴见 <Link to="/modules/guoyun?tab=timeline" className="mono" style={{ color: STEEL }}>国运时间轴</Link></>}>
      <p className="text-[11px] leading-relaxed mb-2.5 px-2.5 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', borderLeft: `2px solid ${era.accent || '#fb923c'}` }}>{era.summary}</p>
      <div className="space-y-1.5">
        {recent.map((e) => (
          <Link key={`${e.y}-${e.title}`} to={e.to || '/modules/guoyun?tab=timeline'} className="os-card-interactive flex items-center gap-2 rounded-lg px-2.5 py-1.5"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <span className="mono text-[10px] shrink-0" style={{ color: era.accent || '#fb923c' }}>{e.y}</span>
            <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{e.title}</span>
            {e.w === 3 && <span className="text-[9px] mono ml-auto shrink-0" style={{ color: HOLD }}>★</span>}
          </Link>
        ))}
      </div>
    </ScreenCard>
  );
}

// ── 全球涉华舆情流（GDELT 实时索引 · 英文源） ─────────────────
function GdeltPulse() {
  const { articles, fetchedAt, source, loading, error } = useGdeltNews();
  const srcLabel = source === 'hn' ? 'HN 实时（技术面兜底）' : 'GDELT 实时';
  return (
    <ScreenCard title="全球涉华舆情流" accent={STEEL} live={Boolean(articles?.length)}
      footer={<>
        <span className="mono px-1.5 py-0.5 rounded mr-1.5" style={{ background: articles?.length ? 'rgba(16,185,129,0.16)' : 'var(--bg-elevated)', color: articles?.length ? WARM : 'var(--text-tertiary)', fontSize: 9 }}>{articles?.length ? `● ${srcLabel} ${fetchedAt ? fetchedAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : ''}` : '○ 待接入'}</span>
        英文媒体涉华条目 · 双源（GDELT→HN）· 标题与立场来自第三方媒体，不代表本项目观点
      </>}>
      {loading && <LoadingSkeleton rows={2} label="正在拉取 GDELT 索引…" />}
      {!loading && error && !articles?.length && (
        <EmptyState title="实时源不可达" description={`${error} · 自动重试中`} />
      )}
      {!!articles?.length && (
        <div className="space-y-1.5" style={{ maxHeight: 252, overflowY: 'auto' }}>
          {articles.slice(0, 10).map((a) => (
            <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer"
              className="os-card-interactive flex items-start gap-2 rounded-lg px-2.5 py-1.5"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <span className="min-w-0 flex-1">
                <span className="block text-xs leading-snug" style={{ color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.title}</span>
                <span className="block text-[10px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{domainBadge(a.domain)} · {timeAgo(a.when)}</span>
              </span>
              <span className="mono text-[10px] shrink-0 mt-0.5" style={{ color: STEEL }}>↗</span>
            </a>
          ))}
        </div>
      )}
    </ScreenCard>
  );
}

// ── 预测市场速览（Polymarket 群体定价 · 已滤地缘敏感议题） ──────
function PolyPulse() {
  const { markets, fetchedAt, loading, error } = useLiveMarkets();
  return (
    <ScreenCard title="预测市场速览 · 群体预期定价" accent="#8b5cf6" live={Boolean(markets?.length)}
      footer={<>
        <span className="mono px-1.5 py-0.5 rounded mr-1.5" style={{ background: markets?.length ? 'rgba(16,185,129,0.16)' : 'var(--bg-elevated)', color: markets?.length ? WARM : 'var(--text-tertiary)', fontSize: 9 }}>{markets?.length ? `● Polymarket 实时 ${fetchedAt ? fetchedAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : ''}` : '○ 待接入'}</span>
        交易者聚合概率（宏观/科技类，已过滤地缘敏感）· 非本项目观点 · 非投资建议
      </>}>
      {loading && <LoadingSkeleton rows={2} label="正在拉取市场定价…" />}
      {!loading && error && !markets?.length && (
        <EmptyState title="实时源不可达" description={`${error} · 自动重试中`} />
      )}
      {!!markets?.length && (
        <div className="space-y-2">
          {markets.slice(0, 5).map((m) => (
            <div key={m.slug} className="rounded-lg px-2.5 py-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs leading-snug flex-1 min-w-0" style={{ color: 'var(--text-primary)' }}>{m.q}</span>
                <span className="mono text-sm font-bold shrink-0" style={{ color: probColor(m.yes) }}>{m.yes}%</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="flex-1 rounded-full relative" style={{ height: 5, background: 'var(--bg-base)' }}>
                  <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${m.yes}%`, background: probColor(m.yes), opacity: 0.8 }} />
                </span>
                <span className="mono text-[9px] shrink-0" style={{ color: 'var(--text-tertiary)' }}>24h {m.vol} · 截 {m.end}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScreenCard>
  );
}

// ── 关注清单（星标模块 · localStorage + 自定义事件跨组件同步） ──
function readFavs() { try { return JSON.parse(localStorage.getItem('cos-favs') || '[]'); } catch (_) { return []; } }
function useFavs() {
  const [favs, setFavs] = useState(readFavs);
  useEffect(() => {
    const h = () => setFavs(readFavs());
    window.addEventListener('cos-favs-changed', h);
    return () => window.removeEventListener('cos-favs-changed', h);
  }, []);
  const toggle = (id) => {
    const cur = readFavs();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur];
    try { localStorage.setItem('cos-favs', JSON.stringify(next.slice(0, 24))); } catch (_) {}
    window.dispatchEvent(new Event('cos-favs-changed'));
  };
  return [favs, toggle];
}

function FavStrip() {
  const [favs, toggle] = useFavs();
  const mods = favs.map((id) => MODULES.find((m) => m.id === id)).filter(Boolean);
  if (!mods.length) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap mb-3">
      <span className="text-[10px] mono shrink-0" style={{ color: HOLD }}>★ 关注</span>
      {mods.map((m) => {
        const g = GROUPS.find((x) => x.id === m.group);
        return (
          <span key={m.id} className="inline-flex items-center rounded-full" style={{ background: 'var(--bg-elevated)', border: `1px solid ${HOLD}44` }}>
            <Link to={m.path} className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: g?.accent || STEEL }}><Icon name={m.icon} size={12} /></span>{m.title}
            </Link>
            <button onClick={() => toggle(m.id)} title="取消关注" style={{ background: 'none', border: 'none', cursor: 'pointer', color: HOLD, padding: '0 6px' }}><Lucide.X size={11} /></button>
          </span>
        );
      })}
    </div>
  );
}

// ── 今日简报生成器（聚合态势/施政/读数/节点 → 可复制 Markdown） ──
function buildBriefing(latestDoc) {
  const today = new Date().toISOString().slice(0, 10);
  const m = latestDoc.metrics || {};
  const lines = [
    `# China OS 今日简报 · ${today}`, '',
    '## 战略态势',
    ...sortStrategyVectors().map((v) => `- ${v.name}：${v.status} ${v.trend} —— ${v.note}`), '',
    `## 施政基准（${latestDoc.year}）`,
    `- GDP 目标 ${m.gdpTarget ?? '—'}% 左右 · 赤字率 ${m.deficit ?? '—'}% 左右 · CPI ${m.cpi ?? '—'}% · 新增就业 ${m.jobs ?? '—'} 万+`,
    ...(latestDoc.stance ? [`- 财政：${latestDoc.stance.fiscal} · 货币：${latestDoc.stance.monetary}`] : []), '',
    '## 关键读数',
    ...TICKER.slice(0, 12).map(([k, v]) => `- ${k}：${v}`), '',
    '## 临近节点',
    ...POLICY_CALENDAR_2026.map(({ title, date }) => ({ what: title, iso: date, d: daysUntil(date) }))
      .filter((x) => x.d >= 0).sort((a, b) => a.d - b.d)
      .map((x) => `- ${x.what}：T-${x.d} 天（${x.iso}）`), '',
    '> 由 China OS 中枢看板生成 · 读数为公开口径与研判基准 · 数据截至 2026-07-13 · 非投资建议',
  ];
  return withExportBrand(lines.join('\n'), { subtitle: '中枢看板 · 今日简报' });
}

function BriefingGenerator() {
  const docs = useDocs();
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const latest = useMemo(() => {
    const list = (docs || []).filter((d) => d.type === '政府工作报告' && d.metrics);
    return list.sort((a, b) => (b.year || 0) - (a.year || 0))[0] || GWR_DOCS[GWR_DOCS.length - 1];
  }, [docs]);
  const gen = () => { setText(buildBriefing(latest)); setCopied(false); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (_) {}
  };
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Lucide.FileDown size={16} style={{ color: WARM }} />
        <h2 className="os-card-title m-0">今日简报</h2>
        <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{'// 一键聚合 态势/施政/读数/节点 为可复制 Markdown'}</span>
        <span className="ml-auto flex gap-2">
          <button onClick={gen} className="os-btn os-btn-primary os-btn-sm">生成简报</button>
          {text && <button onClick={copy} className="os-btn os-btn-sm">{copied ? '✓ 已复制' : '复制 Markdown'}</button>}
        </span>
      </div>
      {text && (
        <pre className="os-card p-4 text-xs mono" style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', maxHeight: 300, overflowY: 'auto', lineHeight: 1.7 }}>{text}</pre>
      )}
    </section>
  );
}

// ── 快速跳转 ──────────────────────────────────────────────
function QuickNav() {
  const [q, setQ] = useState('');
  const [favs, toggleFav] = useFavs();
  const kw = q.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!kw) return TOPIC_MODULES;
    return TOPIC_MODULES.filter((m) =>
      `${m.title}${m.subtitle || ''}${m.id}`.toLowerCase().includes(kw));
  }, [kw]);

  const groups = useMemo(() => GROUPS
    .filter((g) => g.id !== 'home')
    .map((g) => ({ group: g, mods: filtered.filter((m) => m.group === g.id) }))
    .filter((x) => x.mods.length), [filtered]);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="os-card-title m-0">快速跳转 · {filtered.length} 模块</h2>
        <div className="relative" style={{ minWidth: 220 }}>
          <Lucide.Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-tertiary)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索模块…"
            style={{
              width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)', borderRadius: 8, padding: '6px 10px 6px 30px', fontSize: 13,
            }}
          />
        </div>
      </div>

      {groups.map(({ group, mods }) => (
        <div key={group.id} className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: group.accent }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{group.label}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{group.desc}</span>
            <span className="text-[10px] mono ml-auto" style={{ color: 'var(--text-tertiary)' }}>{mods.length}</span>
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px,1fr))' }}>
            {mods.map((m) => (
              <Link
                key={m.id}
                to={m.path}
                className="os-card-interactive flex items-start gap-2.5 rounded-lg p-2.5"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
              >
                <span className="shrink-0 mt-0.5" style={{ color: group.accent }}><Icon name={m.icon} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{m.title}</span>
                  {m.subtitle && <span className="block text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>{m.subtitle}</span>}
                </span>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(m.id); }}
                  title={favs.includes(m.id) ? '取消关注' : '加入关注'}
                  className="shrink-0"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: favs.includes(m.id) ? HOLD : 'var(--text-tertiary)', padding: 2, marginTop: 2 }}
                >
                  <Lucide.Star size={13} fill={favs.includes(m.id) ? HOLD : 'none'} />
                </button>
              </Link>
            ))}
          </div>
        </div>
      ))}
      {!groups.length && (
        <EmptyState
          title="未找到匹配模块"
          description={`没有与「${q}」匹配的专题模块，请尝试其他关键词。`}
        />
      )}
    </section>
  );
}

export default function DashboardPage() {
  const opt = useOptions();
  const macro = useMacroPulse();
  const [heroPulse, setHeroPulse] = useState(false);

  useEffect(() => {
    if (!macro.refreshCount) return undefined;
    setHeroPulse(true);
    const t = setTimeout(() => setHeroPulse(false), 900);
    return () => clearTimeout(t);
  }, [macro.refreshCount]);

  const stats = [
    { value: MODULE_COUNT, label: '专题模块', accent: '#22d3ee', icon: 'LayoutGrid' },
    { value: fmt(ENTRY_TOTAL), label: '数据集条目', accent: '#c41e3a', icon: 'Database' },
    { value: GROUP_COUNT, label: '专题分组', accent: '#e8a317', icon: 'FolderTree' },
    { value: AS_OF, label: '数据基准 AS_OF', accent: '#10b981', icon: 'CalendarClock', mono: true },
  ];

  return (
    <div>
      {/* ── 0. 滚动情报条 ────────────────────────────────── */}
      <Ticker />

      {/* ── 0.5 关注清单 + 最近访问足迹 ──────────────────── */}
      <FavStrip />
      <RecentVisits />

      {/* ── 1. 项目总揽 · Hero ───────────────────────────── */}
      <section
        className={`os-card os-section os-hero-card mb-6 overflow-hidden relative${heroPulse ? ' os-hero-card--pulse' : ''}`}
        style={{
          padding: '2rem',
          background: 'radial-gradient(120% 140% at 0% 0%, rgba(196,30,58,0.16), transparent 55%), radial-gradient(120% 140% at 100% 0%, rgba(34,211,238,0.14), transparent 55%), var(--bg-surface)',
          borderColor: 'rgba(34,211,238,0.22)',
        }}
      >
        <span
          className="inline-block text-xs font-semibold uppercase px-2 py-0.5 rounded mb-3 mono"
          style={{ background: 'rgba(196,30,58,0.18)', color: 'var(--china-red)', letterSpacing: '0.1em' }}
        >
          CHINA OS · 看板
        </span>
        <h1 className="os-page-title" style={{ fontSize: '2rem' }}>中国深度调研操作系统</h1>
        <p className="os-page-subtitle mt-2 max-w-3xl">
          冷峻现实主义视角 · 穿透宏观叙事，解析权力运作、产业链条与制度演进的底层代码。
          十五五开局（2026）· {MODULE_COUNT} 个专题模块、{GROUP_COUNT} 大分组、{fmt(ENTRY_TOTAL)} 条结构化条目，统一数据底座、即插即用。
        </p>
        <div className="os-stat-grid os-section-stagger mt-6">
          {stats.map((s) => (
            <div key={s.label} className="os-card os-stat-card os-card-lift p-4" style={{ borderColor: `${s.accent}33` }}>
              <div className="flex items-center gap-1.5 mb-1" style={{ color: s.accent }}>
                <Icon name={s.icon} size={14} />
                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{s.label}</span>
              </div>
              <div className="mono os-mono-tabular" style={{ fontSize: s.mono ? '1.1rem' : '1.6rem', fontWeight: 700, color: s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        <MacroH1Strip
          kpis={macro.kpis}
          asOf={macro.asOf}
          lastRefresh={macro.lastRefresh}
          isRefreshing={macro.isRefreshing}
          secondsToNext={macro.secondsToNext}
          refreshCount={macro.refreshCount}
        />

        <LiveModuleChips />

        <div className="mt-5">
          <GovernanceVerdict pulseKey={macro.refreshCount} />
        </div>

        {/* 时政要闻 · 主流媒体 RSS 跑马灯 */}
        <NewsMarquee refreshKey={macro.refreshCount} />

        {/* 神州实况 · 公共直播信号预览 */}
        <LiveStreamsSection compact previewCount={8} pulseKey={macro.refreshCount} />

        {/* 全球资产脉搏 · 独立模块入口 */}
        <Link
          to="/market-pulse"
          className="os-card-interactive mt-5 flex items-center justify-between rounded-lg px-4 py-3"
          style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(34,211,238,0.28)' }}
        >
          <span className="flex items-center gap-2">
            <Lucide.Activity size={16} style={{ color: STEEL }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>全球资产脉搏</span>
            <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>股市 · 债市 · 汇市 · 大宗</span>
          </span>
          <span className="text-xs mono" style={{ color: STEEL }}>进入模块 →</span>
        </Link>

        {/* 重点模块精选 */}
        <div className="mt-6">
          <div className="os-section-heading__meta mb-2">重点模块</div>
          <div className="flex flex-wrap gap-2 os-section-stagger">
            {FEATURED.map((m) => (
              <Link
                key={m.id}
                to={m.path}
                className="os-card-interactive inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
              >
                <span style={{ color: 'var(--cyber-cyan)' }}><Icon name={m.icon} size={13} /></span>
                {m.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 1.5 神州活图 · 紧凑预览 ───────────────────────── */}
      <LiveChinaMap className="mb-8" variant="compact" />

      {/* ── 2. 态势 · 政策 · 底座 三联速览 ─────────────────── */}
      <section className="mb-8">
        <div className="os-section-heading">
          <Lucide.Radar size={16} style={{ color: 'var(--china-red)' }} />
          <h2 className="os-section-heading__title m-0">态势速览</h2>
          <span className="os-section-heading__meta min-w-0">// 外交矢量 · 施政基准 · 本地库活数据</span>
        </div>
        {/* 主卡 + 侧栏密排：取消 span-2 行占位，避免宽屏右下空洞 */}
        <div className="dash-pulse-pack dash-screen-grid os-section-stagger">
          <div className="dash-pulse-pack__hero">
            <StrategyPulse />
          </div>
          <div className="dash-pulse-pack__side os-section-stagger">
            <PolicyPulse />
            <LiveDbStatus />
            <KondratievClock />
            <RiskRadar />
            <div className="dash-pulse-wide">
              <PolicyCalendar />
            </div>
          </div>
        </div>
        <Grid cols={{ sm: 1, lg: 2, '2xl': 3 }} gap="0.85rem" className="dash-screen-grid os-section-stagger mt-3">
          <WatchPulse />
          <ChroniclePulse />
        </Grid>
        <Grid cols={{ sm: 1, lg: 2, '2xl': 3 }} gap="0.85rem" className="dash-screen-grid os-section-stagger mt-3">
          <GdeltPulse />
          <PolyPulse />
        </Grid>
      </section>

      {/* ── 2.5 今日简报生成器 ───────────────────────────── */}
      <BriefingGenerator />

      {/* ── 3. 实时大屏 ──────────────────────────────────── */}
      <section className="mb-8">
        <div className="os-section-heading">
          <Lucide.MonitorPlay size={16} style={{ color: 'var(--cyber-cyan)' }} />
          <h2 className="os-section-heading__title m-0">实时大屏</h2>
          <span className="os-section-heading__meta min-w-0">// LIVE · 种子计数</span>
        </div>
        <Grid cols={{ sm: 1, md: 2, lg: 3, '2xl': 4 }} gap="0.85rem" className="dash-screen-grid os-section-stagger">
          <ScreenCard title="中国政要分层构成" accent="#c41e3a" footer="政治权力队列 · 按层级聚合">
            <EChart option={opt.donut} variant="compact" style={{ height: 230 }} />
          </ScreenCard>
          <ScreenCard title="反腐历年趋势" accent="#e8a317" footer="副省部级及以上为主 · 按官宣年归集（2012 起）">
            <EChart option={opt.acTrend} variant="compact" style={{ height: 230 }} />
          </ScreenCard>
          <ScreenCard title="军衔结构（量级示意）" accent="#10b981" footer={RANK_STRUCTURE.note}>
            <EChart option={opt.ranks} variant="compact" style={{ height: 230 }} />
          </ScreenCard>
          <ScreenCard title="民企500强 · 省份分布 Top12" accent="#fb923c" footer="工商联 2024 榜单 · 注册地口径">
            <EChart option={opt.prov} variant="compact" style={{ height: 260 }} />
          </ScreenCard>
          <ScreenCard title="模块分组覆盖" accent="#8b5cf6" footer="各专题分组下的模块数量">
            <EChart option={opt.coverage} variant="compact" style={{ height: 260 }} />
          </ScreenCard>
          <ScreenCard title="数据集规模对比" accent="#22d3ee" footer="人物/企业画像条目（去重后）">
            <EChart option={opt.scale} variant="compact" style={{ height: 260 }} />
          </ScreenCard>
        </Grid>
      </section>

      {/* ── 2. 快速跳转 ──────────────────────────────────── */}
      {/* ── 3.5 认知内核工具箱 ───────────────────────────── */}
      <CognitionToolbox />

      <QuickNav />

      {/* ── 数据来源 / 免责声明 ──────────────────────────── */}
      <Card title="数据来源与免责声明" className="mb-2">
        <table className="os-prose-table mb-4">
          <thead>
            <tr>
              <th>分组</th>
              <th className="num">模块数</th>
            </tr>
          </thead>
          <tbody>
            {GROUP_COVERAGE.map((g) => (
              <tr key={g.name}>
                <td>{g.name}</td>
                <td className="num os-mono-tabular">{g.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="text-xs space-y-1.5 m-0" style={{ color: 'var(--text-tertiary)' }}>
          <li>· 数据基准 AS_OF：<span className="mono os-mono-tabular" style={{ color: 'var(--text-secondary)' }}>{SOURCES.asOf}</span></li>
          <li>· 民企500强：{SOURCES.pe500}</li>
          <li>· 军事相关：{SOURCES.military}</li>
          <li>· {SOURCES.note}</li>
          <li>· {EXPORT_DISCLAIMER}</li>
        </ul>
      </Card>
    </div>
  );
}
