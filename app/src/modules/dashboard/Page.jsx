import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid } from '../../app/ui.jsx';
import { GROUPS } from '../../app/registry.js';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, GRID_LINE, LABEL } from '../shared/chartHelpers.js';
import * as DB from '../../lib/db/localdb.js';
import { useDocs } from '../../lib/db/useDataset.js';
import { GWR_DOCS } from '../../lib/db/docSeed.js';
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
} from './data.js';

function Icon({ name, size = 16 }) {
  const Cmp = Lucide[name] || Lucide.Square;
  return <Cmp size={size} strokeWidth={1.75} />;
}

const fmt = (n) => n.toLocaleString('en-US');

// ── 实时大屏 · 发光指标卡 ─────────────────────────────────
function ScreenCard({ title, accent = '#22d3ee', children, footer }) {
  return (
    <div
      className="os-card os-card-lift p-4 flex flex-col"
      style={{ borderColor: `${accent}33`, boxShadow: `0 0 0 1px ${accent}1f, 0 0 28px -10px ${accent}40` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
      {footer && <div className="text-[10px] mt-2 leading-snug" style={{ color: 'var(--text-tertiary)' }}>{footer}</div>}
    </div>
  );
}

// ── 滚动情报条 · 关键读数（示意，对应各模块判读基准） ────────
const WARM = '#10b981', HOLD = '#e8a317', COOL = '#c41e3a', STEEL = '#22d3ee';
const TICKER = [
  ['GDP 目标', '5% 左右', HOLD], ['赤字率', '4% 左右', COOL], ['货币定调', '适度宽松', WARM],
  ['中美', '竞合管控 →', HOLD], ['中俄', '深度协作 →', WARM], ['中欧', '摩擦中维系 →', COOL],
  ['中朝', '管控型同盟 ↗', WARM], ['台海', '高压常态化', HOLD], ['康波坐标', '第5波·冬→第6波', STEEL],
  ['制造业全球份额', '≈30%', WARM], ['原油对外依存', '≈72%', COOL], ['人口', '负增长·橄榄→倒金字塔', HOLD],
  ['城镇调查失业率', '5.5% 左右', HOLD], ['离岸 RMB 份额(香港)', '≈73%', STEEL], ['宏观杠杆率', '≈298%', COOL],
];

function Ticker() {
  const items = (dup) => TICKER.map(([k, v, c], i) => (
    <span key={`${dup}-${i}`} className="inline-flex items-center gap-1.5 text-xs mono">
      <span style={{ color: 'var(--text-tertiary)' }}>{k}</span>
      <span style={{ color: c, fontWeight: 600 }}>{v}</span>
    </span>
  ));
  return (
    <div className="os-ticker os-card mb-4" style={{ padding: '8px 0', borderColor: 'rgba(34,211,238,0.18)' }}>
      <div className="os-ticker-track">
        {items('a')}
        {items('b')}
      </div>
    </div>
  );
}

// ── 战略态势速览（镜像外交盘读数 · 2026-06 判读基准） ────────
const VECTORS = [
  ['中美', '竞合管控', HOLD, '→', '元首护栏在线，关税科技战未解'],
  ['中俄', '深度协作', WARM, '→', '上不封顶，但不结盟红线未动'],
  ['中欧', '摩擦中维系', COOL, '→', '电动车/产能之争，分化去风险阵线'],
  ['中朝', '管控型同盟', WARM, '↗', '高规格再锚定，对冲向俄漂移'],
  ['台海', '高压常态化', HOLD, '↗', '巡航成新常态，未越升级阈值'],
];

function StrategyPulse() {
  return (
    <ScreenCard title="战略态势速览" accent={COOL} footer={<>判读基准 2026-06 · 详见 <Link to="/diplomacy" className="mono" style={{ color: STEEL }}>外交全局框架盘</Link> 的矢量盘与情景评估</>}>
      <div className="space-y-2">
        {VECTORS.map(([nm, st, c, arrow, note]) => (
          <Link key={nm} to="/diplomacy" className="flex items-center gap-2.5 rounded-lg px-3 py-2 os-card-interactive"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <span className="text-sm font-semibold w-10 shrink-0" style={{ color: 'var(--text-primary)' }}>{nm}</span>
            <span className="text-[10px] mono px-2 py-0.5 rounded-full shrink-0" style={{ border: `1px solid ${c}55`, background: `${c}14`, color: c }}>{st} {arrow}</span>
            <span className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>{note}</span>
          </Link>
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
    <ScreenCard title={`政策脉搏 · ${latest.year} 施政基准`} accent={HOLD}
      footer={<>
        <span className="mono px-1.5 py-0.5 rounded mr-1.5" style={{ background: liveGwr ? 'rgba(16,185,129,0.16)' : 'var(--bg-elevated)', color: liveGwr ? WARM : 'var(--text-tertiary)', fontSize: 9 }}>{liveGwr ? '● 本地库活数据' : '○ 内置种子'}</span>
        结构化要点 · 历年比对与提法变迁见 <Link to="/policydocs" className="mono" style={{ color: STEEL }}>政策文件库</Link>
      </>}>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {chips.map(([k, v, c]) => (
          <div key={k} className="rounded-lg px-3 py-2" style={{ background: 'var(--bg-elevated)', border: `1px solid ${c}33` }}>
            <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{k}</div>
            <div className="mono text-base font-bold" style={{ color: c }}>{v}</div>
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
    <ScreenCard title="数据底座 · 实时状态" accent={STEEL} footer="浏览器本地库（IndexedDB）实时计数 · 后台写入即刷新，点击直达管理">
      <div className="grid grid-cols-2 gap-2">
        {cells.map((c) => (
          <Link key={c.label} to={c.to} className="os-card-interactive rounded-lg px-3 py-3" style={{ background: 'var(--bg-elevated)', border: `1px solid ${c.accent}33` }}>
            <div className="flex items-center gap-1.5 mb-1" style={{ color: c.accent }}>
              <Icon name={c.icon} size={13} />
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{c.label}</span>
            </div>
            <div className="mono text-xl font-bold" style={{ color: c.accent }}>{c.value}</div>
          </Link>
        ))}
      </div>
    </ScreenCard>
  );
}

// ── 大屏图表 option ───────────────────────────────────────
function useOptions() {
  return useMemo(() => {
    const donut = {
      tooltip: { trigger: 'item', formatter: '{b}<br/>{c} 人 · {d}%' },
      legend: { type: 'scroll', bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, icon: 'circle' },
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
        label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10, formatter: '{c}' },
        data: DATASET_SCALE.map((d) => ({ value: d.value, itemStyle: { color: d.color, borderRadius: [0, 3, 3, 0] } })),
      }],
    };

    return { donut, acTrend, prov, ranks, coverage, scale };
  }, []);
}

// ── 快速跳转 ──────────────────────────────────────────────
function QuickNav() {
  const [q, setQ] = useState('');
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
                <span className="min-w-0">
                  <span className="block text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{m.title}</span>
                  {m.subtitle && <span className="block text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>{m.subtitle}</span>}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
      {!groups.length && (
        <div className="os-card p-6 text-sm text-center" style={{ color: 'var(--text-tertiary)' }}>
          未找到匹配「{q}」的模块。
        </div>
      )}
    </section>
  );
}

export default function DashboardPage() {
  const opt = useOptions();

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

      {/* ── 1. 项目总揽 · Hero ───────────────────────────── */}
      <section
        className="os-card os-section mb-6 overflow-hidden relative"
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
          {MODULE_COUNT} 个专题模块、{GROUP_COUNT} 大分组、{fmt(ENTRY_TOTAL)} 条结构化条目，统一数据底座、即插即用。
        </p>
        <div className="os-stat-grid mt-6">
          {stats.map((s) => (
            <div key={s.label} className="os-card p-4" style={{ borderColor: `${s.accent}33` }}>
              <div className="flex items-center gap-1.5 mb-1" style={{ color: s.accent }}>
                <Icon name={s.icon} size={14} />
                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{s.label}</span>
              </div>
              <div className="mono" style={{ fontSize: s.mono ? '1.1rem' : '1.6rem', fontWeight: 700, color: s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* 重点模块精选 */}
        <div className="mt-6">
          <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>重点模块</div>
          <div className="flex flex-wrap gap-2">
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

      {/* ── 2. 态势 · 政策 · 底座 三联速览 ─────────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Lucide.Radar size={16} style={{ color: 'var(--china-red)' }} />
          <h2 className="os-card-title m-0">态势速览</h2>
          <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>// 外交矢量 · 施政基准 · 本地库活数据</span>
        </div>
        <Grid cols={3} gap="0.85rem" className="dash-screen-grid">
          <StrategyPulse />
          <PolicyPulse />
          <LiveDbStatus />
        </Grid>
      </section>

      {/* ── 3. 实时大屏 ──────────────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Lucide.MonitorPlay size={16} style={{ color: 'var(--cyber-cyan)' }} />
          <h2 className="os-card-title m-0">实时大屏</h2>
          <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>// LIVE · 种子计数</span>
        </div>
        <Grid cols={3} gap="0.85rem" className="dash-screen-grid">
          <ScreenCard title="中国政要分层构成" accent="#c41e3a" footer="政治权力队列 · 按层级聚合">
            <EChart option={opt.donut} style={{ height: 230 }} />
          </ScreenCard>
          <ScreenCard title="反腐历年趋势" accent="#e8a317" footer="副省部级及以上为主 · 按官宣年归集（2012 起）">
            <EChart option={opt.acTrend} style={{ height: 230 }} />
          </ScreenCard>
          <ScreenCard title="军衔结构（量级示意）" accent="#10b981" footer={RANK_STRUCTURE.note}>
            <EChart option={opt.ranks} style={{ height: 230 }} />
          </ScreenCard>
          <ScreenCard title="民企500强 · 省份分布 Top12" accent="#fb923c" footer="工商联 2024 榜单 · 注册地口径">
            <EChart option={opt.prov} style={{ height: 260 }} />
          </ScreenCard>
          <ScreenCard title="模块分组覆盖" accent="#8b5cf6" footer="各专题分组下的模块数量">
            <EChart option={opt.coverage} style={{ height: 260 }} />
          </ScreenCard>
          <ScreenCard title="数据集规模对比" accent="#22d3ee" footer="人物/企业画像条目（去重后）">
            <EChart option={opt.scale} style={{ height: 260 }} />
          </ScreenCard>
        </Grid>
      </section>

      {/* ── 2. 快速跳转 ──────────────────────────────────── */}
      <QuickNav />

      {/* ── 数据来源 / 免责声明 ──────────────────────────── */}
      <Card title="数据来源与免责声明" className="mb-2">
        <ul className="text-xs space-y-1.5" style={{ color: 'var(--text-tertiary)' }}>
          <li>· 数据基准 AS_OF：<span className="mono" style={{ color: 'var(--text-secondary)' }}>{SOURCES.asOf}</span></li>
          <li>· 民企500强：{SOURCES.pe500}</li>
          <li>· 军事相关：{SOURCES.military}</li>
          <li>· {SOURCES.note}</li>
        </ul>
      </Card>
    </div>
  );
}
