import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat } from '../../app/ui.jsx';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps, prefetchFigureAvatars } from '../../lib/ui/figureAvatarResolve.js';
import AcademicianBadge from '../../lib/ui/AcademicianBadge.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { useBusinessElite } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  BUSINESS_ELITE_SEED_PKG,
  BUSINESS_ELITE_META,
  BUSINESS_ELITE_DEDUPED_COUNT,
  dedupeBusinessElite,
  BE_ROLE_CATS,
  BE_ROLE_LABEL,
  BE_ROLE_LEGACY_ALIASES,
  BE_SECTOR_CATS,
  BE_SECTOR_LABEL,
  resolveBeRoleKey,
  classifyBusinessSector,
} from '../../lib/db/businessEliteSeed.js';
import TalentDetailPanel, { ExpandableText } from './TalentDetailPanel.jsx';
import { applyTalentEnrichment } from '../../lib/talent/talentEnrich.js';
import { buildTalentDetailSections, CrossRefLinks, eventsToTimeline } from '../../lib/talent/detailSections.jsx';
import { buildDetailFooter, normalizeTags } from '../../lib/talent/metadata.jsx';
import { useTalentDeepLink, findEntityInList } from '../../lib/talent/routing.js';

const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(232,163,23,0.14)', color: '#e8a317', border: '1px solid rgba(232,163,23,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };

const ROLE_DESC = {
  founder: '创办或联合创办企业、定义早期资本与治理结构的企业家节点。',
  controller: '通过控股、家族传承或并购掌握企业实际控制权的资本节点。',
  executive: '担任 CEO、总裁、董事长等经营要职的职业经理人或非创始掌舵者。',
  investor: '私募、风投、产业资本与二级市场的资源配置者。',
  industry_leader: '跨企业或跨周期的行业整合者与标杆人物（含部分央企掌舵）。',
};
const ROLE_ACCENT = {
  founder: '#e8a317', controller: '#f97316', executive: '#22d3ee',
  investor: '#10b981', industry_leader: '#a78bfa',
};
const SECTOR_ACCENT = {
  tech: '#6366f1', new_energy: '#22c55e', manufacturing: '#94a3b8',
  consumer: '#f472b6', finance: '#eab308', pharma: '#14b8a6',
  infra: '#64748b', other: '#78716c',
};
const CAT_RANK = Object.fromEntries(BE_ROLE_CATS.map((k, i) => [k, i]));
const HONOR_PATTERNS = [
  ['工商联', /工商联/],
  ['人大代表/政协', /人大代表|全国政协委员/],
  ['院士', /院士/],
  ['首富/富豪榜', /首富|富豪榜/],
  ['改革先锋', /改革先锋/],
  ['慈善', /慈善/],
  ['已故', /已故/],
];

function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((r) => { const k = keyFn(r); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function honorTags(r) {
  const hay = [r.title, r.honors, r.notes, r.background].filter(Boolean).join(' ');
  const tags = HONOR_PATTERNS.filter(([, re]) => re.test(hay)).map(([k]) => k);
  if (r.notes?.includes('已故')) tags.push('已故');
  return [...new Set(tags)];
}

function preview(text, max = 52) {
  if (!text) return '';
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

function sectorOf(r) {
  return r.sectorKey || classifyBusinessSector(r.industry);
}

function DistBars({ data, color = '#e8a317', max, onPick, active, labelFn = (k) => k }) {
  const top = max || (data[0]?.[1] || 1);
  return (
    <div className="space-y-1.5">
      {data.map(([k, n]) => (
        <button key={k} type="button" onClick={onPick ? () => onPick(k) : undefined} className="w-full flex items-center gap-2 text-left"
          style={{ cursor: onPick ? 'pointer' : 'default', opacity: active && active !== k ? 0.45 : 1 }}>
          <span className="text-[11px] mono shrink-0 text-right" style={{ width: 72, color: active === k ? color : 'var(--text-secondary)' }}>{labelFn(k)}</span>
          <span className="flex-1 rounded-sm" style={{ height: 13, background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
            <span style={{ position: 'absolute', inset: 0, width: `${(n / top) * 100}%`, background: color, opacity: 0.75, borderRadius: 2 }} />
          </span>
          <span className="text-[11px] mono shrink-0" style={{ width: 26, color: 'var(--text-tertiary)' }}>{n}</span>
        </button>
      ))}
    </div>
  );
}

function EliteCard({ r, on, onClick, dense = false }) {
  const honors = honorTags(r);
  const sk = sectorOf(r);
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded"
      style={{
        background: on ? 'rgba(232,163,23,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${on ? '#e8a317' : 'var(--border-subtle)'}`,
        cursor: 'pointer', padding: dense ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-2">
        <FigureAvatar {...figureAvatarProps(r)} size={dense ? 28 : 32} ring={on} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            <AcademicianBadge record={r} />
            <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.12)', color: ROLE_ACCENT[r.category] || '#e8a317' }}>{BE_ROLE_LABEL[r.category] || r.category}</span>
            {r.province && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(r.province)}</span>}
            {sk && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: SECTOR_ACCENT[sk] || '#a78bfa' }}>{BE_SECTOR_LABEL[sk] || preview(r.industry, 6)}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {r.company}{r.title ? ` · ${r.title}` : ''}
          </div>
          {honors.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {honors.slice(0, 3).map((h) => (
                <span key={h} className="text-[8px] mono px-1 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>{h}</span>
              ))}
            </div>
          )}
          {r.achievements && (
            <div className="text-[10px] mt-1 truncate" style={{ color: 'var(--cyber-cyan)', opacity: 0.85 }}>
              {preview(r.achievements)}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function BusinessEliteSection() {
  const { rows, ready } = useBusinessElite();
  const [searchParams, setSearchParams] = useSearchParams();
  const beParam = searchParams.get('be');
  const bsParam = searchParams.get('bs');
  const [dimMode, setDimMode] = useState(bsParam && BE_SECTOR_CATS.includes(bsParam) ? 'sector' : 'role');
  const [catTab, setCatTab] = useState(beParam && (BE_ROLE_LABEL[beParam] || BE_ROLE_LEGACY_ALIASES[beParam]) ? resolveBeRoleKey(beParam) : 'founder');
  const [sectorTab, setSectorTab] = useState(bsParam && BE_SECTOR_CATS.includes(bsParam) ? bsParam : '');
  const [q, setQ] = useState('');
  const [industry, setIndustry] = useState('');
  const [province, setProvince] = useState('');
  const [honor, setHonor] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const { list, roleCounts, sectorCounts } = useMemo(() => {
    const { rows: deduped } = dedupeBusinessElite(rows || []);
    const roles = Object.fromEntries(BE_ROLE_CATS.map((k) => [k, 0]));
    const sectors = Object.fromEntries(BE_SECTOR_CATS.map((k) => [k, 0]));
    deduped.forEach((r) => {
      if (roles[r.category] != null) roles[r.category] += 1;
      const sk = sectorOf(r);
      if (sectors[sk] != null) sectors[sk] += 1;
    });
    return { list: deduped, roleCounts: roles, sectorCounts: sectors };
  }, [rows]);

  const tabList = useMemo(() => {
    if (dimMode === 'sector' && sectorTab) return list.filter((r) => sectorOf(r) === sectorTab);
    if (dimMode === 'role') return list.filter((r) => r.category === catTab);
    return list;
  }, [list, dimMode, catTab, sectorTab]);

  const industries = useMemo(() => [...new Set(tabList.map((r) => r.industry).filter(Boolean))].sort(), [tabList]);
  const provinces = useMemo(() => [...new Set(tabList.map((r) => r.province).filter(Boolean))].sort(), [tabList]);
  const honorOpts = useMemo(() => {
    const set = new Set();
    tabList.forEach((r) => honorTags(r).forEach((h) => set.add(h)));
    return [...set].sort();
  }, [tabList]);

  const filtered = useMemo(() => {
    const out = tabList.filter((r) => {
      const hay = [r.name, r.company, r.industry, r.title, r.achievements, r.honors, r.background, r.province, r.notes, r.source].join(' ');
      const honorMatch = !honor || honorTags(r).includes(honor);
      const sectorMatch = dimMode !== 'role' || !sectorTab || sectorOf(r) === sectorTab;
      return sectorMatch
        && (!industry || r.industry === industry)
        && (!province || r.province === province)
        && honorMatch
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'category') out.sort((a, b) => (CAT_RANK[a.category] ?? 9) - (CAT_RANK[b.category] ?? 9));
    else if (sort === 'province') out.sort((a, b) => (a.province || '').localeCompare(b.province || '', 'zh'));
    else if (sort === 'sector') out.sort((a, b) => sectorOf(a).localeCompare(sectorOf(b)));
    return out;
  }, [tabList, q, industry, province, honor, sort, dimMode, sectorTab]);

  useEffect(() => {
    if (filtered.length) prefetchFigureAvatars(filtered, 56);
  }, [filtered]);

  const detail = useMemo(() => {
    if (sel) {
      const hit = filtered.find((r) => (r.id && sel.id ? r.id === sel.id : r.name === sel.name && r.category === sel.category));
      if (hit) return hit;
    }
    return searchParams.get('id') ? null : (filtered[0] || null);
  }, [sel, filtered, searchParams]);

  const { selectEntity } = useTalentDeepLink({
    searchParams, setSearchParams, filtered, allList: list, sel, setSel, ready, preserveKeys: ['be', 'bs'],
  });

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (!idParam || !list.length) return;
    const hit = findEntityInList(list, idParam);
    if (hit?.category && hit.category !== catTab && dimMode === 'role') setCatTab(hit.category);
    if (hit) {
      const sk = sectorOf(hit);
      if (dimMode === 'sector' && sk !== sectorTab) setSectorTab(sk);
    }
  }, [searchParams, list, catTab, dimMode, sectorTab]);

  useEffect(() => {
    if (beParam && (BE_ROLE_LABEL[beParam] || BE_ROLE_LEGACY_ALIASES[beParam]) && beParam !== catTab) {
      setCatTab(resolveBeRoleKey(beParam));
      setDimMode('role');
    }
  }, [beParam, catTab]);

  useEffect(() => {
    if (bsParam && BE_SECTOR_CATS.includes(bsParam) && bsParam !== sectorTab) {
      setSectorTab(bsParam);
      setDimMode('sector');
    }
  }, [bsParam, sectorTab]);

  const syncParams = useCallback((nextRole, nextSector, mode) => {
    const next = new URLSearchParams(searchParams);
    next.delete('id');
    if (mode === 'sector') {
      next.delete('be');
      if (nextSector) next.set('bs', nextSector);
      else next.delete('bs');
    } else {
      next.delete('bs');
      if (nextRole) next.set('be', nextRole);
      else next.delete('be');
    }
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => { setSel(null); }, [catTab, sectorTab, dimMode]);

  const distIndustry = tally(filtered, (r) => r.industry);
  const distProvince = tally(filtered, (r) => short(r.province) || r.province);
  const distSector = tally(filtered, sectorOf);
  const topSectors = BE_SECTOR_CATS.map((k) => [k, sectorCounts[k] || 0]).filter(([, n]) => n > 0);

  const industryChart = {
    grid: { left: 100, right: 16, top: 12, bottom: 24 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    yAxis: { type: 'category', data: distIndustry.slice(0, 12).map(([k]) => k).reverse(), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'bar', data: distIndustry.slice(0, 12).map(([, n]) => n).reverse(), barWidth: 14, itemStyle: { color: '#e8a317', borderRadius: 3 } }],
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  };

  const regionMapData = distProvince.slice(0, 20);
  const regionChart = regionMapData.length ? {
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 16, top: 8, bottom: 24 },
    xAxis: { type: 'category', data: regionMapData.map(([k]) => k), axisLabel: { color: '#93a1b5', fontSize: 10, rotate: 35 }, axisLine: { lineStyle: { color: '#27324a' } } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'bar', data: regionMapData.map(([, n]) => n), barWidth: '55%', itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } }],
  } : null;

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖商业精英数据集（${BUSINESS_ELITE_DEDUPED_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...BUSINESS_ELITE_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const clearAll = () => { setQ(''); setIndustry(''); setProvince(''); setHonor(''); setSectorTab(''); setSel(null); };

  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    industry && ['行业', industry, () => setIndustry('')],
    province && ['省份', short(province), () => setProvince('')],
    honor && ['标签', honor, () => setHonor('')],
    dimMode === 'role' && sectorTab && ['板块', BE_SECTOR_LABEL[sectorTab], () => setSectorTab('')],
  ].filter(Boolean);

  const pickByIndex = useCallback((idx) => {
    const r = filtered[idx];
    if (r) selectEntity(r);
  }, [filtered, selectEntity]);

  useEffect(() => {
    const onKey = (e) => {
      if (!filtered.length || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      const cur = detail ? filtered.indexOf(detail) : 0;
      if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); pickByIndex(Math.min(cur + 1, filtered.length - 1)); }
      else if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); pickByIndex(Math.max(cur - 1, 0)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, detail, pickByIndex]);

  const tabTitle = dimMode === 'sector'
    ? (BE_SECTOR_LABEL[sectorTab] || '全行业')
    : (BE_ROLE_LABEL[catTab] || catTab);

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载商业精英库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>
          <Lucide.Briefcase size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>商业精英 · 资本逻辑节点</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            市场面向队列 · 角色 × 行业双维分类 —— 内置 {BUSINESS_ELITE_DEDUPED_COUNT.total} 条，截至 {BUSINESS_ELITE_META.asOf}。不含政治任命与知识生产名录。
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px,1fr))' }}>
        {BE_ROLE_CATS.map((k) => (
          <Stat key={k} value={roleCounts[k] ?? 0} label={BE_ROLE_LABEL[k]} accent={ROLE_ACCENT[k]} />
        ))}
        <Stat value={topSectors.length} label="行业板块" accent="#f0abfc" />
        <Stat value={filtered.length} label="当前命中" />
      </div>

      <div className="flex gap-2 flex-wrap items-center mb-3">
        <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>主维度</span>
        {[['role', '按角色'], ['sector', '按行业']].map(([m, label]) => (
          <button key={m} type="button" onClick={() => { setDimMode(m); setSel(null); clearAll(); if (m === 'role') syncParams(catTab, '', 'role'); else syncParams('', sectorTab || BE_SECTOR_CATS[0], 'sector'); }}
            className="text-xs px-2.5 py-1 mono rounded"
            style={{ background: dimMode === m ? 'rgba(232,163,23,0.18)' : 'var(--bg-elevated)', color: dimMode === m ? '#e8a317' : 'var(--text-secondary)', border: `1px solid ${dimMode === m ? 'rgba(232,163,23,0.4)' : 'var(--border-subtle)'}`, cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-1 flex-wrap mb-2">
        {dimMode === 'role' ? BE_ROLE_CATS.map((k) => (
          <button key={k} type="button" onClick={() => {
            setCatTab(k); setSel(null); clearAll(); syncParams(k, '', 'role');
          }}
            className={`text-sm px-3 py-1.5 mono os-filter-chip ${catTab === k ? 'is-active' : ''}`}
            style={{ '--chip-accent': '#e8a317' }}>
            {BE_ROLE_LABEL[k]} ({roleCounts[k] ?? 0})
          </button>
        )) : BE_SECTOR_CATS.filter((k) => (sectorCounts[k] ?? 0) > 0).map((k) => (
          <button key={k} type="button" onClick={() => {
            setSectorTab(k); setSel(null); clearAll(); syncParams('', k, 'sector');
          }}
            className={`text-sm px-3 py-1.5 mono os-filter-chip ${sectorTab === k ? 'is-active' : ''}`}
            style={{ '--chip-accent': SECTOR_ACCENT[k] }}>
            {BE_SECTOR_LABEL[k]} ({sectorCounts[k] ?? 0})
          </button>
        ))}
      </div>

      {dimMode === 'role' && (
        <div className="flex gap-1 flex-wrap mb-4 items-center">
          <span className="text-[10px] mono mr-1" style={{ color: 'var(--text-tertiary)' }}>行业筛选</span>
          <button type="button" onClick={() => setSectorTab('')} className="text-[11px] px-2 py-0.5 mono rounded" style={{ background: !sectorTab ? 'rgba(232,163,23,0.15)' : 'var(--bg-elevated)', color: !sectorTab ? '#e8a317' : 'var(--text-tertiary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>全部</button>
          {topSectors.map(([k, n]) => (
            <button key={k} type="button" onClick={() => setSectorTab(sectorTab === k ? '' : k)}
              className="text-[11px] px-2 py-0.5 mono rounded"
              style={{ background: sectorTab === k ? `${SECTOR_ACCENT[k]}22` : 'var(--bg-elevated)', color: sectorTab === k ? SECTOR_ACCENT[k] : 'var(--text-secondary)', border: `1px solid ${sectorTab === k ? `${SECTOR_ACCENT[k]}55` : 'var(--border-subtle)'}`, cursor: 'pointer' }}>
              {BE_SECTOR_LABEL[k]} {n}
            </button>
          ))}
        </div>
      )}

      {dimMode === 'role' && ROLE_DESC[catTab] && (
        <p className="text-[11px] mb-4 mono" style={{ color: 'var(--text-secondary)' }}>{ROLE_DESC[catTab]}</p>
      )}

      {list.length < 10 && (
        <Card title="一键载入商业精英库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（business-elite-2026-06），与中国政要及知识生产队列隔离；与民企500强榜单交叉引用但不重复建档。来源：{BUSINESS_ELITE_META.sources.slice(0, 4).join('、')}等。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${BUSINESS_ELITE_META.label}（${BUSINESS_ELITE_DEDUPED_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="资本逻辑队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置商业精英数据集。</p></Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 公司 / 行业 / 成就" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={inp}><option value="">全部行业</option>{industries.map((d) => <option key={d} value={d}>{d}</option>)}</select>
              <select value={province} onChange={(e) => setProvince(e.target.value)} style={inp}><option value="">全部省份</option>{provinces.map((p) => <option key={p} value={p}>{short(p) || p}</option>)}</select>
              {honorOpts.length > 0 && (
                <select value={honor} onChange={(e) => setHonor(e.target.value)} style={inp}><option value="">全部标签</option>{honorOpts.map((h) => <option key={h} value={h}>{h}</option>)}</select>
              )}
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="name">按名称</option>
                <option value="province">按省份</option>
                <option value="category">按角色</option>
                <option value="sector">按板块</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(232,163,23,0.18)' : 'var(--bg-base)', color: on ? '#e8a317' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
              {list.length < BUSINESS_ELITE_DEDUPED_COUNT.total && (
                <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lucide.RefreshCw size={13} />{loading ? '载入中…' : `补全 ${BUSINESS_ELITE_DEDUPED_COUNT.total} 条`}
                </button>
              )}
            </div>
            {activeChips.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mt-3 items-center">
                <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>筛选</span>
                {activeChips.map(([k, v, clr], i) => (
                  <button key={i} type="button" onClick={clr} className="text-[11px] mono px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>{k}:</span>{v}<Lucide.X size={11} />
                  </button>
                ))}
                <button type="button" onClick={clearAll} className="text-[11px] mono px-2 py-0.5" style={{ color: 'var(--china-red)', background: 'none', border: 'none', cursor: 'pointer' }}>清空</button>
              </div>
            )}
            <p className="text-[11px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
              {tabTitle} · 命中 {filtered.length} / {tabList.length} 条 · ↑↓ 或 j/k 切换 · {BUSINESS_ELITE_META.scope}
            </p>
          </Card>

          {view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
                // 行业/地域分布基于当前筛选 {filtered.length} 条；资本与产业的交叉节点
              </div>
              <Grid cols={2}>
                <Card title="细分行业"><EChart option={industryChart} style={{ height: Math.max(240, distIndustry.slice(0, 12).length * 22) }} /></Card>
                {regionChart && <Card title="地域分布"><EChart option={regionChart} style={{ height: 260 }} /></Card>}
              </Grid>
              <Grid cols={2}>
                <Card title="行业板块（点选筛选）"><DistBars data={distSector} color="#a78bfa" onPick={(k) => setSectorTab(sectorTab === k ? '' : k)} active={sectorTab} labelFn={(k) => BE_SECTOR_LABEL[k] || k} /></Card>
                <Card title="省份（点选筛选）"><DistBars data={distProvince.slice(0, 10)} color="#22d3ee" onPick={(k) => { const full = provinces.find((p) => short(p) === k); setProvince(province === full ? '' : full); }} active={short(province)} /></Card>
              </Grid>
              <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>// 数据边界：{BUSINESS_ELITE_META.notes}</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', maxHeight: 620, overflowY: 'auto' }}>
              {filtered.map((r) => (
                <EliteCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} dense />
              ))}
              {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
              <Card title={`${tabTitle} (${filtered.length}/${tabList.length})`}>
                <div className="space-y-1.5" style={{ maxHeight: 560, overflowY: 'auto' }}>
                  {filtered.map((r) => (
                    <EliteCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} />
                  ))}
                  {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                </div>
              </Card>

              <Card title={detail ? `${detail.name} · 详情` : '选择一位'}>
                {detail && (() => {
                  const d = applyTalentEnrichment(detail, { queue: 'business' });
                  return (
                  <TalentDetailPanel
                    name={d.name}
                    subtitle={`${d.title || ''}${d.company ? ` · ${d.company}` : ''}`}
                    verifyRecord={d}
                    crossLinks={<CrossRefLinks record={d} queue="business" />}
                    avatar={<FigureAvatar {...figureAvatarProps(d)} size={56} ring eager />}
                    badges={(
                      <>
                        <AcademicianBadge record={d} size="md" />
                        <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.12)', color: ROLE_ACCENT[d.category] || '#e8a317' }}>{BE_ROLE_LABEL[d.category]}</span>
                        <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: SECTOR_ACCENT[sectorOf(d)] || '#a78bfa' }}>{BE_SECTOR_LABEL[sectorOf(d)]}</span>
                      </>
                    )}
                    tags={[...normalizeTags(d.tags), ...honorTags(d)].filter(Boolean)}
                    tagAccent="#d4af37"
                    sections={buildTalentDetailSections(d, {
                      queue: 'business',
                      bioLabel: '公开商业履历要点',
                      baseSections: [
                      {
                        title: '基本信息',
                        fields: [
                          { label: '公司/机构', value: d.company },
                          { label: '职务', value: d.title },
                          { label: '细分行业', value: d.industry, accent: '#a78bfa' },
                          { label: '行业板块', value: BE_SECTOR_LABEL[sectorOf(d)] },
                          { label: '省份', value: d.province },
                          { label: '角色', value: BE_ROLE_LABEL[d.category] },
                        ],
                      },
                      {
                        title: '资本逻辑',
                        fields: [
                          { label: '代表成就', value: d.achievements, accent: 'var(--cyber-cyan)' },
                          { label: '荣誉', value: d.honors !== '—' ? d.honors : null, accent: '#d4af37' },
                        ],
                      },
                      ...(d.background && !d.bio ? [{
                        title: '背景摘要',
                        content: <ExpandableText text={d.background} maxLen={140} />,
                      }] : []),
                    ],
                    })}
                    timeline={eventsToTimeline(d)}
                    timelineExpandable
                    timelineAccent="#e8a317"
                    queueNote="// 资本逻辑队列 · 与民企500强公司视角互补"
                    footer={buildDetailFooter(d)}
                  />
                  );
                })()}
              </Card>
            </div>
          )}
        </>
      )}

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        数据来源：{BUSINESS_ELITE_META.sources.join('、')} · {BUSINESS_ELITE_META.notes} · 研究参考
      </p>
    </section>
  );
}
