import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { PageHeader, Card, Grid, Stat, StatGrid, TabBar } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, LABEL, GRID_LINE } from '../shared/chartHelpers.js';
import { useDataset } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  PRIVATE_ENTERPRISE_META,
  PE500_DATASETS,
  loadPrivateEnterprise500,
} from '../../lib/db/privateEnterpriseSeed.js';
import Pe500Map from './Pe500Map.jsx';
import {
  shortProv,
  RANK_TIERS,
  tally,
  tierOf,
  aggregateByProvince,
  mapMetricsFromAgg,
  tierDistribution,
  buildCompanyIndex,
} from './geo.js';

const TABS = [
  ['ranking', '500强榜单'],
  ['founders', '创始人'],
  ['equity', '股权架构'],
  ['managers', '职业经理人'],
];

const VIEW_MODES = [
  ['dashboard', '地图', 'Map'],
  ['ranking', '榜单', 'List'],
  ['matrix', '矩阵', 'LayoutGrid'],
];

const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = (active, accent = '#fb923c') => ({
  background: active ? `rgba(251,146,60,0.2)` : 'var(--bg-elevated)',
  color: active ? '#fff' : 'var(--text-secondary)',
  border: `1px solid ${active ? accent : 'var(--border-subtle)'}`,
  cursor: 'pointer',
  borderRadius: 6,
  padding: '6px 12px',
  fontSize: 12,
});

const PAL = ['#fb923c', '#c41e3a', '#22d3ee', '#e8a317', '#10b981', '#8b5cf6', '#f0abfc', '#64748b', '#f97316', '#06b6d4'];

function DistBars({ data, color = '#fb923c', max, onPick, active, labelW = 56 }) {
  const top = max || (data[0]?.[1] || 1);
  return (
    <div className="space-y-1.5">
      {data.map(([k, n]) => (
        <button key={k} type="button" onClick={onPick ? () => onPick(k) : undefined} className="w-full flex items-center gap-2 text-left"
          style={{ cursor: onPick ? 'pointer' : 'default', opacity: active && active !== k ? 0.45 : 1, background: 'none', border: 'none', padding: 0 }}>
          <span className="text-[11px] mono shrink-0 text-right" style={{ width: labelW, color: active === k ? color : 'var(--text-secondary)' }}>{k}</span>
          <span className="flex-1 rounded-sm" style={{ height: 13, background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
            <span style={{ position: 'absolute', inset: 0, width: `${(n / top) * 100}%`, background: color, opacity: 0.75, borderRadius: 2 }} />
          </span>
          <span className="text-[11px] mono shrink-0" style={{ width: 32, color: 'var(--text-tertiary)' }}>{n}</span>
        </button>
      ))}
    </div>
  );
}

const ROW_H = 52;
const VISIBLE = 14;

function VirtualList({ items, height, renderRow, onScroll }) {
  const [scroll, setScroll] = useState(0);
  const totalH = items.length * ROW_H;
  const start = Math.max(0, Math.floor(scroll / ROW_H) - 2);
  const end = Math.min(items.length, start + VISIBLE + 4);
  const slice = items.slice(start, end);

  return (
    <div
      style={{ height, overflowY: 'auto' }}
      onScroll={(e) => { setScroll(e.target.scrollTop); onScroll?.(e.target.scrollTop); }}
    >
      <div style={{ height: totalH, position: 'relative' }}>
        {slice.map((item, i) => (
          <div key={item.id || item.key || start + i} style={{ position: 'absolute', top: (start + i) * ROW_H, left: 0, right: 0, height: ROW_H }}>
            {renderRow(item, start + i)}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyCard({ c, onSelect, onHover, selected, founderN, eqN, accent }) {
  const t = tierOf(c.rank);
  return (
    <button
      type="button"
      onClick={() => onSelect(c.id)}
      onMouseEnter={() => onHover(c.province)}
      onMouseLeave={() => onHover('')}
      className="text-left p-2.5 rounded flex flex-col gap-1"
      style={{
        background: selected ? 'rgba(251,146,60,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${selected ? '#fb923c' : 'var(--border-subtle)'}`,
        cursor: 'pointer',
        minHeight: 108,
      }}
    >
      <div className="flex items-start gap-1.5">
        <span className="mono text-[10px] shrink-0 px-1.5 py-0.5 rounded font-bold" style={{ background: `${t.color}22`, color: t.color }}>#{c.rank}</span>
        <span className="text-xs font-medium flex-1 leading-tight line-clamp-2" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        <span className="text-[9px] mono px-1 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee' }}>{shortProv(c.province)}</span>
        <span className="text-[9px] mono px-1 rounded truncate max-w-full" style={{ background: 'rgba(251,146,60,0.1)', color: '#fb923c' }}>{c.industry}</span>
      </div>
      <div className="flex items-center justify-between text-[10px] mono mt-auto">
        <span style={{ color: accent || '#e8a317' }}>{c.revenueYi}亿</span>
        <span style={{ color: 'var(--text-tertiary)' }}>
          {founderN ? `创${founderN}` : ''}{eqN ? ` · 股${eqN}` : ''}{c.profileDepth === 'full' ? ' · 深' : ''}
        </span>
      </div>
    </button>
  );
}

export default function Page() {
  const { rows: companies, ready: coReady } = useDataset('pe500-companies', PE500_DATASETS.companies);
  const { rows: people, ready: peReady } = useDataset('pe500-people', PE500_DATASETS.people);
  const { rows: equity, ready: eqReady } = useDataset('pe500-equity', PE500_DATASETS.equity);

  const [viewMode, setViewMode] = useState('dashboard');
  const [tab, setTab] = useState('ranking');
  const [q, setQ] = useState('');
  const [industry, setIndustry] = useState('');
  const [province, setProvince] = useState('');
  const [rankMax, setRankMax] = useState(500);
  const [depthOnly, setDepthOnly] = useState(false);
  const [selId, setSelId] = useState(null);
  const [hoverProv, setHoverProv] = useState('');
  const [mapMetricIdx, setMapMetricIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [listFocus, setListFocus] = useState(0);
  const listRef = useRef(null);

  const cos = companies || [];
  const ppl = people || [];
  const eqs = equity || [];

  const { founders: founderMap, eqDepth: eqMap } = useMemo(
    () => buildCompanyIndex(ppl, eqs),
    [ppl, eqs],
  );

  const industries = useMemo(() => [...new Set(cos.map((c) => c.industry))].sort(), [cos]);
  const provinces = useMemo(() => [...new Set(cos.map((c) => c.province))].sort(), [cos]);

  const filteredCos = useMemo(() => cos.filter((c) => {
    const hay = [c.name, c.industry, c.province, c.listing, c.controlNote].join(' ');
    return (!q || hay.toLowerCase().includes(q.toLowerCase()))
      && (!industry || c.industry === industry)
      && (!province || c.province === province)
      && c.rank <= rankMax
      && (!depthOnly || c.profileDepth === 'full');
  }), [cos, q, industry, province, rankMax, depthOnly]);

  const founders = useMemo(() => ppl.filter((p) => p.roleType === 'founder'), [ppl]);
  const managers = useMemo(() => ppl.filter((p) => p.roleType === 'manager'), [ppl]);

  const filteredFounders = useMemo(() => founders.filter((p) => {
    const hay = [p.name, p.companyName, p.title, p.background].join(' ');
    const co = cos.find((c) => c.id === p.companyId);
    return (!q || hay.toLowerCase().includes(q.toLowerCase()))
      && (!industry || co?.industry === industry)
      && (!province || co?.province === province)
      && p.rank <= rankMax;
  }), [founders, cos, q, industry, province, rankMax]);

  const filteredManagers = useMemo(() => managers.filter((p) => {
    const hay = [p.name, p.companyName, p.title, p.background].join(' ');
    const co = cos.find((c) => c.id === p.companyId);
    return (!q || hay.toLowerCase().includes(q.toLowerCase()))
      && (!industry || co?.industry === industry)
      && (!province || co?.province === province)
      && p.rank <= rankMax;
  }), [managers, cos, q, industry, province, rankMax]);

  const filteredEquity = useMemo(() => eqs.filter((e) => {
    const hay = [e.shareholder, e.companyName, e.note, e.holderType].join(' ');
    const co = cos.find((c) => c.id === e.companyId);
    return (!q || hay.toLowerCase().includes(q.toLowerCase()))
      && (!industry || co?.industry === industry)
      && (!province || co?.province === province)
      && e.rank <= rankMax;
  }), [eqs, cos, q, industry, province, rankMax]);

  const provAgg = useMemo(() => aggregateByProvince(filteredCos), [filteredCos]);
  const mapMetrics = useMemo(() => mapMetricsFromAgg(provAgg), [provAgg]);
  const tierDist = useMemo(() => tierDistribution(filteredCos), [filteredCos]);

  const totalRevenue = useMemo(
    () => Math.round(filteredCos.reduce((s, c) => s + (c.revenueYi || 0), 0) * 100) / 100,
    [filteredCos],
  );

  const deepCount = useMemo(() => cos.filter((c) => c.profileDepth === 'full').length, [cos]);
  const avgRevenue = filteredCos.length
    ? Math.round(filteredCos.reduce((s, c) => s + c.revenueYi, 0) / filteredCos.length)
    : 0;

  const detail = useMemo(() => {
    const id = selId || filteredCos[0]?.id;
    if (!id) return null;
    const co = cos.find((c) => c.id === id);
    if (!co) return null;
    return {
      ...co,
      founders: ppl.filter((p) => p.companyId === id && p.roleType === 'founder'),
      managers: ppl.filter((p) => p.companyId === id && p.roleType === 'manager'),
      equity: eqs.filter((e) => e.companyId === id),
    };
  }, [selId, filteredCos, cos, ppl, eqs]);

  const listRows = tab === 'founders' ? filteredFounders
    : tab === 'managers' ? filteredManagers
      : tab === 'equity' ? filteredEquity
        : filteredCos;

  const provBarRace = useMemo(() => {
    const top = provAgg.slice(0, 15).reverse();
    return {
      grid: { left: 72, right: 28, top: 8, bottom: 20 },
      animationDurationUpdate: 600,
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
      yAxis: { type: 'category', data: top.map((a) => shortProv(a.province)), axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
      series: [{
        type: 'bar',
        data: top.map((a) => ({ value: a.count, itemStyle: { color: province === a.province ? '#22d3ee' : '#fb923c' } })),
        barWidth: 12,
        itemStyle: { borderRadius: 3 },
        label: { show: true, position: 'right', formatter: '{c}', color: LABEL.color, fontSize: 10 },
      }],
    };
  }, [provAgg, province]);

  const tierSpark = useMemo(() => ({
    grid: { left: 36, right: 12, top: 16, bottom: 28 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: tierDist.map((t) => t.label), axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    series: [{
      type: 'bar',
      data: tierDist.map((t) => ({ value: t.count, itemStyle: { color: t.color, borderRadius: [4, 4, 0, 0] } })),
      barWidth: 28,
    }],
  }), [tierDist]);

  const indTreemap = useMemo(() => {
    const top = tally(filteredCos, 'industry').slice(0, 16);
    return {
      tooltip: { formatter: (p) => `${p.name}<br/>${p.value} 家` },
      series: [{
        type: 'treemap',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: { show: true, formatter: '{b}', fontSize: 10, color: '#e2e8f0' },
        upperLabel: { show: false },
        itemStyle: { borderColor: 'rgba(10,14,23,0.8)', borderWidth: 2, gapWidth: 2 },
        data: top.map(([name, value], i) => ({
          name,
          value,
          itemStyle: { color: PAL[i % PAL.length] },
        })),
      }],
    };
  }, [filteredCos]);

  const rankScatter = useMemo(() => {
    const pts = filteredCos.slice(0, 120).map((c) => [c.rank, c.revenueYi, c.name, c.province]);
    return {
      grid: { left: 44, right: 16, top: 16, bottom: 32 },
      tooltip: {
        formatter: (p) => `#${p.value[0]} ${p.value[2]}<br/>${shortProv(p.value[3])} · ${p.value[1]}亿`,
      },
      xAxis: { type: 'value', name: '排名', inverse: true, min: 1, max: rankMax, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
      yAxis: { type: 'value', name: '营收(亿)', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
      series: [{
        type: 'scatter',
        symbolSize: (d) => Math.max(6, Math.min(22, Math.sqrt(d[1]) / 8)),
        data: pts,
        itemStyle: { color: '#fb923c', opacity: 0.75 },
        emphasis: { itemStyle: { color: '#22d3ee', borderColor: '#fff', borderWidth: 1 } },
      }],
    };
  }, [filteredCos, rankMax]);

  const handleMapClick = useCallback((name) => {
    setProvince((p) => (p === name ? '' : name));
    const first = filteredCos.find((c) => c.province === name);
    if (first) setSelId(first.id);
  }, [filteredCos]);

  const clearFilters = () => {
    setQ(''); setIndustry(''); setProvince(''); setRankMax(500); setDepthOnly(false);
  };

  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    industry && ['行业', industry, () => setIndustry('')],
    province && ['省份', shortProv(province), () => setProvince('')],
    rankMax < 500 && ['排名', `≤${rankMax}`, () => setRankMax(500)],
    depthOnly && ['深度', '仅深度画像', () => setDepthOnly(false)],
  ].filter(Boolean);

  const reload = async () => {
    setLoading(true);
    await loadPrivateEnterprise500(DB);
    setLoading(false);
  };

  // 键盘导航（榜单视图）
  useEffect(() => {
    const onKey = (e) => {
      if (viewMode !== 'ranking' && viewMode !== 'dashboard') return;
      if (tab !== 'ranking') return;
      const rows = filteredCos;
      if (!rows.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = Math.min(listFocus + 1, rows.length - 1);
        setListFocus(next);
        setSelId(rows[next].id);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = Math.max(listFocus - 1, 0);
        setListFocus(next);
        setSelId(rows[next].id);
      } else if (e.key === 'Escape') {
        setProvince('');
        setHoverProv('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewMode, tab, filteredCos, listFocus]);

  useEffect(() => {
    if (selId) {
      const idx = filteredCos.findIndex((c) => c.id === selId);
      if (idx >= 0) setListFocus(idx);
    }
  }, [selId, filteredCos]);

  if (!coReady || !peReady || !eqReady) {
    return <div className="py-20 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载民营经济500强数据…</div>;
  }

  const renderListRow = (c) => {
    const on = detail?.id === c.id;
    return (
      <button
        type="button"
        onClick={() => setSelId(c.id)}
        onMouseEnter={() => setHoverProv(c.province)}
        onMouseLeave={() => setHoverProv('')}
        className="w-full text-left px-2 py-1.5 rounded flex items-center gap-2"
        style={{ background: on ? 'rgba(251,146,60,0.14)' : 'transparent', border: `1px solid ${on ? '#fb923c' : 'transparent'}`, cursor: 'pointer', height: ROW_H - 4 }}
      >
        <span className="mono text-xs shrink-0 font-bold" style={{ color: tierOf(c.rank).color, width: 32 }}>#{c.rank}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</div>
          <div className="flex gap-1 flex-wrap mt-0.5">
            <span className="text-[9px] mono px-1 rounded" style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee' }}>{shortProv(c.province)}</span>
            <span className="text-[9px] mono px-1 rounded truncate max-w-[120px]" style={{ background: 'rgba(251,146,60,0.08)', color: '#fb923c' }}>{c.industry}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] mono" style={{ color: '#e8a317' }}>{c.revenueYi}亿</div>
          <div className="text-[9px] mono" style={{ color: 'var(--text-tertiary)' }}>
            {(founderMap.get(c.id) || 0) > 0 && `创${founderMap.get(c.id)}`}
            {(eqMap.get(c.id) || 0) > 0 && ` 股${eqMap.get(c.id)}`}
            {c.profileDepth === 'full' && ' 深'}
          </div>
        </div>
      </button>
    );
  };

  const DetailPanel = detail ? (
    <div className="space-y-4 text-sm">
      <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded-lg shrink-0 mono font-bold text-lg" style={{ width: 48, height: 48, background: `${tierOf(detail.rank).color}22`, color: tierOf(detail.rank).color }}>#{detail.rank}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base truncate" style={{ color: 'var(--text-primary)' }}>{detail.name}</div>
          <div className="flex gap-1 flex-wrap mt-1">
            <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee' }}>{detail.province}</span>
            <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(251,146,60,0.12)', color: '#fb923c' }}>{detail.industry}</span>
            {detail.profileDepth === 'full' && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>深度画像</span>}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[['营收', `${detail.revenueYi} 亿元`], ['上市', detail.listing], ['创始人', `${detail.founders.length} 人`], ['股权层', `${detail.equity.length} 条`]].map(([k, v]) => (
          <div key={k}><span style={{ color: 'var(--text-tertiary)' }}>{k}：</span><span style={{ color: 'var(--text-secondary)' }}>{v}</span></div>
        ))}
      </div>
      {detail.controlNote && (
        <p className="text-xs leading-relaxed p-2 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{detail.controlNote}</p>
      )}
      <div>
        <div className="text-xs font-semibold mb-2" style={{ color: '#fb923c' }}>创始人 ({detail.founders.length})</div>
        {detail.founders.length ? detail.founders.map((f) => (
          <div key={f.id} className="mb-2 pl-2" style={{ borderLeft: '2px solid #fb923c' }}>
            <div style={{ color: 'var(--text-primary)' }}>{f.name} · {f.title}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{f.background}</div>
          </div>
        )) : <div className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 待补</div>}
      </div>
      <div>
        <div className="text-xs font-semibold mb-2" style={{ color: '#e8a317' }}>职业经理人 ({detail.managers.length})</div>
        {detail.managers.length ? detail.managers.map((m) => (
          <div key={m.id} className="mb-2 pl-2" style={{ borderLeft: '2px solid #e8a317' }}>
            <div style={{ color: 'var(--text-primary)' }}>{m.name} · {m.title}{m.since ? `（${m.since}）` : ''}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{m.background}</div>
          </div>
        )) : <div className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 待补</div>}
      </div>
      <div>
        <div className="text-xs font-semibold mb-2" style={{ color: '#10b981' }}>股权架构 ({detail.equity.length})</div>
        {detail.equity.length ? (
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead><tr style={{ color: 'var(--text-tertiary)' }}>
              <th className="text-left py-1">股东</th><th className="text-left py-1">类型</th><th className="text-right py-1">持股%</th>
            </tr></thead>
            <tbody>
              {detail.equity.map((e) => (
                <tr key={e.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td className="py-1" style={{ color: 'var(--text-primary)' }}>{e.shareholder}</td>
                  <td className="py-1" style={{ color: 'var(--text-secondary)' }}>{e.holderType}</td>
                  <td className="py-1 text-right mono" style={{ color: e.pct != null ? '#10b981' : 'var(--text-tertiary)' }}>{e.pct != null ? e.pct : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>// 待补</div>}
      </div>
    </div>
  ) : (
    <div className="py-16 text-center text-sm mono" style={{ color: 'var(--text-tertiary)' }}>// 选择企业查看四维画像</div>
  );

  return (
    <div>
      <PageHeader
        badge="Private Enterprise 500 · 工商联"
        title="民营经济500强 · 企业治理透视"
        subtitle={`${PRIVATE_ENTERPRISE_META.listSource}（${PRIVATE_ENTERPRISE_META.listPublished}）· 营收基准 ${PRIVATE_ENTERPRISE_META.revenueBaseYear} 年 · 入围门槛 ${PRIVATE_ENTERPRISE_META.thresholdYi} 亿元`}
      />

      <Card className="mb-4">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          本模块与人才精英库<strong style={{ color: 'var(--text-primary)' }}>隔离存储</strong>，聚焦工商联榜单企业的创始人、股权架构与职业经理人三条治理维度。
          全量 {cos.length} 家企业已载入；深度画像 {deepCount} 家。
          {PRIVATE_ENTERPRISE_META.notes}
        </p>
      </Card>

      <StatGrid className="mb-4">
        <Stat value={String(cos.length)} label="上榜企业" accent="#fb923c" />
        <Stat value={String(filteredCos.length)} label="当前命中" accent="#22d3ee" />
        <Stat value={`${totalRevenue.toLocaleString()}亿`} label="筛选营收汇总" accent="#e8a317" />
        <Stat value={`${avgRevenue}亿`} label="均营收" />
        <Stat value={String(deepCount)} label="深度画像" accent="#10b981" />
        <Stat value={String(provAgg.length)} label="覆盖省份" accent="#8b5cf6" />
      </StatGrid>

      {/* 粘性筛选栏 */}
      <div className="sticky z-20 mb-4" style={{ top: 0, background: 'var(--bg-surface)', paddingTop: 4, paddingBottom: 4 }}>
        <Card>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
              <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="检索企业/人名/股东…" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
            </div>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={{ ...inp, width: 140 }}>
              <option value="">全部行业</option>
              {industries.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={province} onChange={(e) => setProvince(e.target.value)} style={{ ...inp, width: 120 }}>
              <option value="">全部省份</option>
              {provinces.map((p) => <option key={p} value={p}>{shortProv(p)}</option>)}
            </select>
            <label className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              排名≤
              <input type="number" min={1} max={500} value={rankMax} onChange={(e) => setRankMax(+e.target.value || 500)} style={{ ...inp, width: 56, padding: '4px 6px' }} />
            </label>
            <label className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={depthOnly} onChange={(e) => setDepthOnly(e.target.checked)} />
              仅深度
            </label>
            <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
              {VIEW_MODES.map(([v, , ic]) => {
                const I = Lucide[ic];
                const on = viewMode === v;
                return (
                  <button key={v} type="button" title={VIEW_MODES.find(([k]) => k === v)[1]} onClick={() => setViewMode(v)}
                    style={{ padding: '6px 9px', background: on ? 'rgba(251,146,60,0.18)' : 'var(--bg-base)', color: on ? '#fb923c' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}>
                    <I size={15} />
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={reload} disabled={loading} style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Lucide.RefreshCw size={13} />{loading ? '载入中…' : '重载'}
            </button>
          </div>
          {activeChips.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-3 items-center">
              <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>筛选</span>
              {activeChips.map(([k, v, clr], i) => (
                <button key={i} type="button" onClick={clr} className="text-[11px] mono px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>{k}:</span>{v}<Lucide.X size={11} />
                </button>
              ))}
              <button type="button" onClick={clearFilters} className="text-[11px] mono px-2 py-0.5" style={{ color: '#fb923c', background: 'none', border: 'none', cursor: 'pointer' }}>清空</button>
            </div>
          )}
          <p className="text-[11px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
            命中 {filteredCos.length} / {cos.length} 家 · ↑↓ 键盘导航 · Esc 清除省份 · {viewMode === 'dashboard' ? '点地图筛选省份' : ''}
          </p>
        </Card>
      </div>

      {/* 梯队带 */}
      <div className="flex gap-2 flex-wrap mb-4">
        {tierDist.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setRankMax(t.max)}
            className="flex-1 min-w-[120px] px-3 py-2 rounded text-left"
            style={{
              background: rankMax === t.max && rankMax <= t.max ? `${t.color}18` : 'var(--bg-elevated)',
              border: `1px solid ${rankMax <= t.max && rankMax >= t.min ? t.color : 'var(--border-subtle)'}`,
              cursor: 'pointer',
            }}
          >
            <div className="text-[10px] mono" style={{ color: t.color }}>{t.label}</div>
            <div className="text-lg font-bold mono" style={{ color: 'var(--text-primary)' }}>{t.count}</div>
            <div className="text-[9px] mono" style={{ color: 'var(--text-tertiary)' }}>家 · 点选缩至 ≤{t.max}</div>
          </button>
        ))}
      </div>

      {viewMode === 'dashboard' && (
        <>
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(260px, 1fr)' }}>
            <Card title="500强省域分布 · 点击筛选">
              <div className="flex gap-1 mb-2 justify-end">
                {[mapMetrics.count, mapMetrics.revenue].map((m, i) => (
                  <button key={m.key} type="button" onClick={() => setMapMetricIdx(i)} className="text-[10px] mono px-2 py-0.5 rounded"
                    style={{ background: mapMetricIdx === i ? 'rgba(251,146,60,0.2)' : 'var(--bg-elevated)', color: mapMetricIdx === i ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                    {m.label}
                  </button>
                ))}
              </div>
              <Pe500Map
                metrics={[mapMetrics.count, mapMetrics.revenue]}
                metricIdx={mapMetricIdx}
                selectedProv={province}
                hoverProv={hoverProv}
                onRegionClick={handleMapClick}
                onRegionHover={setHoverProv}
                style={{ height: 360 }}
              />
              {province && mapMetrics.byProv[province] && (
                <div className="mt-2 p-2 rounded text-xs" style={{ background: 'var(--bg-elevated)' }}>
                  <span style={{ color: '#fb923c' }}>{province}</span>
                  <span style={{ color: 'var(--text-secondary)' }}> · {mapMetrics.byProv[province].count} 家 · 营收 {mapMetrics.byProv[province].revenueYi.toLocaleString()} 亿</span>
                </div>
              )}
            </Card>
            <div className="space-y-4">
              <Card title="省份 Bar Race（当前筛选）">
                <EChart option={provBarRace} style={{ height: 200 }} />
              </Card>
              <Card title="排名梯队分布">
                <EChart option={tierSpark} style={{ height: 160 }} />
              </Card>
            </div>
          </div>

          <Grid cols={2} className="mb-4">
            <Card title="行业 Treemap">
              <EChart option={indTreemap} style={{ height: 240 }} onReady={(chart) => {
                chart.on('click', (p) => { if (p.name) setIndustry((i) => (i === p.name ? '' : p.name)); });
              }} />
            </Card>
            <Card title="排名 × 营收散点（Top120）">
              <EChart option={rankScatter} style={{ height: 240 }} />
            </Card>
          </Grid>

          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'minmax(280px, 1.1fr) minmax(280px, 1fr)' }}>
            <Card title={`企业列表 · ${filteredCos.length} 家`}>
              <VirtualList
                items={filteredCos.map((c) => ({ ...c, key: c.id }))}
                height={420}
                renderRow={renderListRow}
              />
            </Card>
            <Card title={detail ? `企业详情 · #${detail.rank}` : '企业详情'}>
              {DetailPanel}
            </Card>
          </div>

          <Card title="省份排行（点选筛选）" className="mb-4">
            <DistBars
              data={provAgg.slice(0, 12).map((a) => [shortProv(a.province), a.count])}
              color="#22d3ee"
              labelW={48}
              active={province ? shortProv(province) : ''}
              onPick={(k) => {
                const full = provinces.find((p) => shortProv(p) === k);
                setProvince(province === full ? '' : full);
              }}
            />
          </Card>
        </>
      )}

      {viewMode === 'matrix' && (
        <>
          <Card title={`企业矩阵 · ${filteredCos.length} 家`} className="mb-4">
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))' }}>
              {filteredCos.map((c) => (
                <CompanyCard
                  key={c.id}
                  c={c}
                  selected={detail?.id === c.id}
                  founderN={founderMap.get(c.id)}
                  eqN={eqMap.get(c.id)}
                  onSelect={setSelId}
                  onHover={setHoverProv}
                />
              ))}
            </div>
          </Card>
          {detail && (
            <Card title={`详情 · ${detail.name}`} className="mb-4">{DetailPanel}</Card>
          )}
        </>
      )}

      {viewMode === 'ranking' && (
        <>
          <TabBar tabs={TABS} value={tab} onChange={setTab} accent="#fb923c" className="mb-4" />

          <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(280px, 1.25fr) minmax(260px, 1fr)' }}>
            <Card title={`${TABS.find(([k]) => k === tab)?.[1] || ''} · ${listRows.length} 条`}>
              <div className="space-y-1" style={{ maxHeight: 560, overflowY: 'auto' }} ref={listRef}>
                {tab === 'ranking' && (
                  <VirtualList items={filteredCos.map((c) => ({ ...c, key: c.id }))} height={540} renderRow={renderListRow} />
                )}
                {tab === 'founders' && filteredFounders.map((p) => (
                  <button key={p.id} type="button" onClick={() => setSelId(p.companyId)}
                    className="w-full text-left p-2 rounded"
                    style={{ background: detail?.id === p.companyId ? 'rgba(251,146,60,0.14)' : 'var(--bg-elevated)', border: 'none', cursor: 'pointer' }}>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.name} <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>{p.title}</span></div>
                    <div className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>#{p.rank} {p.companyName}</div>
                  </button>
                ))}
                {tab === 'managers' && filteredManagers.map((p) => (
                  <button key={p.id} type="button" onClick={() => setSelId(p.companyId)}
                    className="w-full text-left p-2 rounded"
                    style={{ background: detail?.id === p.companyId ? 'rgba(251,146,60,0.14)' : 'var(--bg-elevated)', border: 'none', cursor: 'pointer' }}>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.name} <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>{p.title}</span></div>
                    <div className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>#{p.rank} {p.companyName}{p.since ? ` · 自${p.since}` : ''}</div>
                  </button>
                ))}
                {tab === 'equity' && filteredEquity.map((e) => (
                  <button key={e.id} type="button" onClick={() => setSelId(e.companyId)}
                    className="w-full text-left p-2 rounded"
                    style={{ background: detail?.id === e.companyId ? 'rgba(251,146,60,0.14)' : 'var(--bg-elevated)', border: 'none', cursor: 'pointer' }}>
                    <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {e.shareholder}
                      {e.pct != null && <span className="mono ml-2" style={{ color: '#fb923c' }}>{e.pct}%</span>}
                    </div>
                    <div className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>#{e.rank} {e.companyName} · {e.holderType}</div>
                  </button>
                ))}
                {!listRows.length && <div className="py-12 text-center text-sm mono" style={{ color: 'var(--text-tertiary)' }}>// 无匹配记录</div>}
              </div>
            </Card>
            <Card title={detail ? `企业详情 · #${detail.rank} ${detail.name}` : '企业详情'}>
              {DetailPanel}
            </Card>
          </div>
        </>
      )}

      <ModuleFooter moduleId="enterprise500" disclaimer="榜单与股权数据为公开信息综合，仅用于产业分布与治理结构分析，不代表投资建议" />
    </div>
  );
}
