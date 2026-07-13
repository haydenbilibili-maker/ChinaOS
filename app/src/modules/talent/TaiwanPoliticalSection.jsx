import { AXIS, LABEL } from '../shared/chartHelpers.js';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat, DistBar } from '../../app/ui.jsx';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps, prefetchFigureAvatars } from '../../lib/ui/figureAvatarResolve.js';
import EChart from '../../lib/viz/EChart.jsx';
import { useTaiwanPolitical } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  TAIWAN_POLITICAL_SEED_PKG,
  TAIWAN_POLITICAL_META,
  TAIWAN_POLITICAL_DEDUPED_COUNT,
  dedupeTaiwanPolitical,
  TW_SUB_CATS,
  TW_TAB_LABEL,
  TW_PARTY_LABEL,
  TW_REGIONS,
  TW_REGION_LABEL,
  twKey,
} from '../../lib/db/taiwanPoliticalSeed.js';
import { useTalentDeepLink, findEntityInList } from '../../lib/talent/routing.js';
import TalentDetailPanel, { ExpandableText } from './TalentDetailPanel.jsx';

const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(56,189,248,0.14)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };
const ACCENT = '#38bdf8';
const STATUS_RANK = { 在任: 0, 卸任: 1, 已故: 2 };
const CAT_RANK = Object.fromEntries(TW_SUB_CATS.map((k, i) => [k, i]));
const TAB_DESC = '台湾/香港/澳门公开任职政治人物；与 PRC 中国政要队列分轨建档';

function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((r) => { const k = keyFn(r); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function preview(text, max = 52) {
  if (!text) return '';
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

function statusStyle(status) {
  if (status === '在任') return { background: 'rgba(56,189,248,0.12)', color: ACCENT };
  if (status === '已故') return { background: 'var(--bg-base)', color: 'var(--text-tertiary)' };
  return { background: 'rgba(148,163,184,0.12)', color: '#94a3b8' };
}

function partyStyle(party) {
  if (party === 'DPP') return { background: 'rgba(34,197,94,0.12)', color: '#22c55e' };
  if (party === 'KMT') return { background: 'rgba(59,130,246,0.12)', color: '#3b82f6' };
  if (party === 'TPP') return { background: 'rgba(168,85,247,0.12)', color: '#a855f7' };
  return { background: 'var(--bg-base)', color: 'var(--text-tertiary)' };
}

function regionStyle(region) {
  if (region === 'tw') return { background: 'rgba(196,30,58,0.12)', color: 'var(--china-red)' };
  if (region === 'hk') return { background: 'rgba(34,211,238,0.12)', color: '#22d3ee' };
  if (region === 'mo') return { background: 'rgba(232,163,23,0.12)', color: '#e8a317' };
  return { background: 'var(--bg-base)', color: 'var(--text-tertiary)' };
}

function TaiwanCard({ r, on, onClick, dense = false }) {
  const partyLabel = TW_PARTY_LABEL[r.party] || r.party;
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded"
      style={{
        background: on ? 'rgba(56,189,248,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${on ? ACCENT : 'var(--border-subtle)'}`,
        cursor: 'pointer', padding: dense ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-2">
        <FigureAvatar {...figureAvatarProps(r)} size={dense ? 28 : 32} ring={on} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            {r.nameEn && <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{r.nameEn}</span>}
            {r.region && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={regionStyle(r.region)}>{TW_REGION_LABEL[r.region] || r.region}</span>}
            <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(56,189,248,0.12)', color: ACCENT }}>{TW_TAB_LABEL[r.category] || r.category}</span>
            {partyLabel && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={partyStyle(r.party)}>{partyLabel}</span>}
            {r.status && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={statusStyle(r.status)}>{r.status}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {r.role}{r.term ? ` · ${r.term}` : ''}
          </div>
          {r.bio && (
            <div className="text-[10px] mt-1 truncate" style={{ color: 'var(--text-tertiary)' }}>{preview(r.bio)}</div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function TaiwanPoliticalSection() {
  const { rows, ready } = useTaiwanPolitical();
  const [searchParams, setSearchParams] = useSearchParams();
  const twParam = searchParams.get('tw');
  const rgParam = searchParams.get('rg');
  const [regionTab, setRegionTab] = useState(rgParam && TW_REGIONS.includes(rgParam) ? rgParam : '');
  const [catTab, setCatTab] = useState(twParam && TW_SUB_CATS.includes(twParam) ? twParam : '');
  const [q, setQ] = useState('');
  const [party, setParty] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const { list, catCounts, regionCounts } = useMemo(() => {
    const { rows: deduped } = dedupeTaiwanPolitical(rows || []);
    const counts = Object.fromEntries(TW_SUB_CATS.map((k) => [k, 0]));
    const regions = Object.fromEntries(TW_REGIONS.map((k) => [k, 0]));
    deduped.forEach((r) => {
      if (counts[r.category] != null) counts[r.category] += 1;
      if (regions[r.region] != null) regions[r.region] += 1;
    });
    return { list: deduped, catCounts: counts, regionCounts: regions };
  }, [rows]);

  const tabList = useMemo(() => {
    let out = regionTab ? list.filter((r) => r.region === regionTab) : list;
    if (catTab) out = out.filter((r) => r.category === catTab);
    return out;
  }, [list, regionTab, catTab]);

  const parties = useMemo(() => [...new Set(tabList.map((r) => r.party).filter(Boolean))].sort(), [tabList]);
  const statuses = useMemo(() => [...new Set(tabList.map((r) => r.status).filter(Boolean))].sort((a, b) => (STATUS_RANK[a] ?? 9) - (STATUS_RANK[b] ?? 9)), [tabList]);

  const filtered = useMemo(() => {
    const out = tabList.filter((r) => {
      const hay = [r.name, r.nameEn, r.role, r.term, r.party, TW_PARTY_LABEL[r.party], r.bio, r.tags, r.notes, TW_TAB_LABEL[r.category]].join(' ');
      return (!party || r.party === party)
        && (!status || r.status === status)
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'status') out.sort((a, b) => (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9));
    else if (sort === 'category') out.sort((a, b) => (CAT_RANK[a.category] ?? 9) - (CAT_RANK[b.category] ?? 9));
    else if (sort === 'party') out.sort((a, b) => (a.party || '').localeCompare(b.party || ''));
    return out;
  }, [tabList, q, party, status, sort]);

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
    searchParams, setSearchParams, filtered, allList: list, sel, setSel, ready, preserveKeys: ['tw', 'rg'], keyFn: twKey,
  });

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (!idParam || !list.length) return;
    const hit = findEntityInList(list, idParam);
    if (hit?.category && hit.category !== catTab) setCatTab(hit.category);
  }, [searchParams, list, catTab]);

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

  const inOffice = list.filter((r) => r.status === '在任').length;
  const retired = list.filter((r) => r.status === '卸任').length;
  const deceased = list.filter((r) => r.status === '已故').length;
  const distStatus = tally(filtered, (r) => r.status);
  const distCat = tally(filtered, (r) => TW_TAB_LABEL[r.category] || r.category);
  const distParty = tally(filtered, (r) => TW_PARTY_LABEL[r.party] || r.party);
  const statusChart = distStatus.length ? {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 56, right: 16, top: 12, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { color: LABEL.color, fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    yAxis: { type: 'category', data: distStatus.map(([k]) => k).reverse(), axisLabel: { color: LABEL.color, fontSize: 10 } },
    series: [{ type: 'bar', data: distStatus.map(([, n]) => n).reverse(), barWidth: 14, itemStyle: { color: ACCENT, borderRadius: [0, 3, 3, 0] } }],
  } : null;

  const setRegion = (k) => {
    setRegionTab(k);
    const next = new URLSearchParams(searchParams);
    if (k) next.set('rg', k);
    else next.delete('rg');
    setSearchParams(next, { replace: true });
  };

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖港澳台政要数据集（${TAIWAN_POLITICAL_DEDUPED_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...TAIWAN_POLITICAL_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const setCat = (k) => {
    setCatTab(k);
    const next = new URLSearchParams(searchParams);
    if (k) next.set('tw', k);
    else next.delete('tw');
    setSearchParams(next, { replace: true });
  };

  const clearAll = () => { setQ(''); setParty(''); setStatus(''); };
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    regionTab && ['地区', TW_REGION_LABEL[regionTab], () => setRegion('')],
    catTab && ['类别', TW_TAB_LABEL[catTab], () => setCat('')],
    party && ['政党', TW_PARTY_LABEL[party] || party, () => setParty('')],
    status && ['状态', status, () => setStatus('')],
  ].filter(Boolean);

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载港澳台政要库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(56,189,248,0.12)', color: ACCENT }}>
          <Lucide.Landmark size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>港澳台政要 · 台港澳政治人物</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {TAB_DESC} —— 台湾 {regionCounts.tw ?? 0} / 香港 {regionCounts.hk ?? 0} / 澳门 {regionCounts.mo ?? 0}，内置 {TAIWAN_POLITICAL_DEDUPED_COUNT.total} 条，截至 {TAIWAN_POLITICAL_META.asOf}
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px,1fr))' }}>
        <Stat value={list.length} label="档案总数" accent={ACCENT} />
        <Stat value={inOffice} label="在任" accent={ACCENT} />
        <Stat value={retired} label="卸任" accent="#94a3b8" />
        <Stat value={deceased} label="已故" accent="#64748b" />
        <Stat value={regionCounts.tw ?? 0} label="台湾" accent="var(--china-red)" />
        <Stat value={regionCounts.hk ?? 0} label="香港" accent="#22d3ee" />
        <Stat value={regionCounts.mo ?? 0} label="澳门" accent="#e8a317" />
        <Stat value={filtered.length} label="当前命中" />
      </div>

      <div className="flex gap-1.5 flex-wrap mb-3">
        <button type="button" onClick={() => setRegion('')} className="text-[11px] mono px-2.5 py-1 rounded-full"
          style={{ background: !regionTab ? 'rgba(56,189,248,0.2)' : 'var(--bg-elevated)', border: `1px solid ${!regionTab ? ACCENT : 'var(--border-subtle)'}`, color: !regionTab ? ACCENT : 'var(--text-secondary)', cursor: 'pointer' }}>
          全部地区 {list.length}
        </button>
        {TW_REGIONS.map((k) => (
          <button key={k} type="button" onClick={() => setRegion(regionTab === k ? '' : k)} className="text-[11px] mono px-2.5 py-1 rounded-full"
            style={{ background: regionTab === k ? 'rgba(56,189,248,0.2)' : 'var(--bg-elevated)', border: `1px solid ${regionTab === k ? ACCENT : 'var(--border-subtle)'}`, color: regionTab === k ? ACCENT : 'var(--text-secondary)', cursor: 'pointer' }}>
            {TW_REGION_LABEL[k]} {regionCounts[k] ?? 0}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 flex-wrap mb-4">
        <button type="button" onClick={() => setCat('')} className="text-[11px] mono px-2.5 py-1 rounded-full"
          style={{ background: !catTab ? 'rgba(56,189,248,0.15)' : 'var(--bg-elevated)', border: `1px solid ${!catTab ? 'var(--border-subtle)' : 'var(--border-subtle)'}`, color: !catTab ? 'var(--text-secondary)' : 'var(--text-tertiary)', cursor: 'pointer' }}>
          全部类别
        </button>
        {TW_SUB_CATS.filter((k) => (catCounts[k] ?? 0) > 0).map((k) => (
          <button key={k} type="button" onClick={() => setCat(catTab === k ? '' : k)} className="text-[11px] mono px-2.5 py-1 rounded-full"
            style={{ background: catTab === k ? 'rgba(56,189,248,0.2)' : 'var(--bg-elevated)', border: `1px solid ${catTab === k ? ACCENT : 'var(--border-subtle)'}`, color: catTab === k ? ACCENT : 'var(--text-secondary)', cursor: 'pointer' }}>
            {TW_TAB_LABEL[k]} {catCounts[k] ?? 0}
          </button>
        ))}
      </div>

      {list.length < 10 && (
        <Card title="一键载入台湾政治人物库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（taiwan-political-2026-06），与大陆政要、异见人士、海外人才队列隔离。来源：{TAIWAN_POLITICAL_META.sources.slice(0, 3).join('、')}等。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${TAIWAN_POLITICAL_META.label}（${TAIWAN_POLITICAL_DEDUPED_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="台湾政要队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置台湾政治人物数据集。</p></Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 职务 / 政党 / 关键词" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={party} onChange={(e) => setParty(e.target.value)} style={inp}>
                <option value="">全部政党</option>
                {parties.map((p) => <option key={p} value={p}>{TW_PARTY_LABEL[p] || p}</option>)}
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inp}>
                <option value="">全部状态</option>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="name">按姓名</option>
                <option value="status">按状态</option>
                <option value="category">按类别</option>
                <option value="party">按政党</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(56,189,248,0.18)' : 'var(--bg-base)', color: on ? ACCENT : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
              {list.length < TAIWAN_POLITICAL_DEDUPED_COUNT.total && (
                <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lucide.RefreshCw size={13} />{loading ? '载入中…' : `补全 ${TAIWAN_POLITICAL_DEDUPED_COUNT.total} 条`}
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
              {catTab ? TW_TAB_LABEL[catTab] : '全部类别'} · 命中 {filtered.length} / {tabList.length} 条 · ↑↓ 或 j/k 切换 · {TAIWAN_POLITICAL_META.scope}
            </p>
          </Card>

          {view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
                // 状态/类别/政党分布基于当前筛选 {filtered.length} 条；两岸政治结构分析口径
              </div>
              <Grid cols={2}>
                {statusChart && <Card title="状态分布"><EChart option={statusChart} style={{ height: Math.max(180, distStatus.length * 28) }} /></Card>}
                <Card title="类别（点选筛选）"><DistBar data={distCat} onPick={(k) => { const code = Object.entries(TW_TAB_LABEL).find(([, v]) => v === k)?.[0]; if (code) setCat(catTab === code ? '' : code); }} active={catTab ? TW_TAB_LABEL[catTab] : ''} /></Card>
              </Grid>
              <Card title="政党分布"><DistBar data={distParty} color="#22c55e" onPick={(k) => { const code = Object.entries(TW_PARTY_LABEL).find(([, v]) => v === k)?.[0]; if (code) setParty(party === code ? '' : code); }} active={party ? TW_PARTY_LABEL[party] : ''} /></Card>
              <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>// 数据边界：{TAIWAN_POLITICAL_META.notes}</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', maxHeight: 620, overflowY: 'auto' }}>
              {filtered.map((r) => (
                <TaiwanCard key={twKey(r)} r={r} on={detail === r} onClick={() => selectEntity(r)} dense />
              ))}
              {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
              <Card title={`${catTab ? TW_TAB_LABEL[catTab] : '全部'} (${filtered.length}/${tabList.length})`}>
                <div className="space-y-1.5" style={{ maxHeight: 560, overflowY: 'auto' }}>
                  {filtered.map((r) => (
                    <TaiwanCard key={twKey(r)} r={r} on={detail === r} onClick={() => selectEntity(r)} />
                  ))}
                  {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                </div>
              </Card>

              <Card title={detail ? `${detail.name} · 档案详情` : '选择一位'}>
                {detail && (
                  <TalentDetailPanel
                    name={detail.name}
                    subtitle={detail.role || TW_TAB_LABEL[detail.category]}
                    avatar={<FigureAvatar {...figureAvatarProps(detail)} size={56} ring eager />}
                    badges={(
                      <>
                        {detail.nameEn && <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{detail.nameEn}</span>}
                        <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(56,189,248,0.12)', color: ACCENT }}>{TW_TAB_LABEL[detail.category]}</span>
                        {detail.party && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={partyStyle(detail.party)}>{TW_PARTY_LABEL[detail.party] || detail.party}</span>}
                        {detail.status && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={statusStyle(detail.status)}>{detail.status}</span>}
                      </>
                    )}
                    tags={detail.tags ? detail.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean) : []}
                    tagAccent={ACCENT}
                    sections={[
                      {
                        title: '公开任职',
                        fields: [
                          { label: '职务', value: detail.role, accent: ACCENT },
                          { label: '任期', value: detail.term },
                          { label: '政党', value: TW_PARTY_LABEL[detail.party] || detail.party },
                          { label: '状态', value: detail.status, accent: detail.status === '在任' ? ACCENT : undefined },
                        ],
                      },
                      {
                        title: '结构分析',
                        fields: [
                          { label: '档案摘要', value: detail.bio ? <ExpandableText text={detail.bio} /> : null, span: 2 },
                          { label: '备注', value: detail.notes, span: 2, accent: '#e8a317' },
                        ],
                      },
                    ]}
                    timeline={detail.keyEvents}
                    timelineAccent={ACCENT}
                    queueNote="// 台湾政治人物队列 · 公开任职口径 · 与大陆政要/异见人士分轨"
                    footer={(
                      <>
                        <span>来源：{TAIWAN_POLITICAL_META.sources[0]}</span>
                        {detail.asOf && <span>截至：{detail.asOf}</span>}
                      </>
                    )}
                  />
                )}
              </Card>
            </div>
          )}
        </>
      )}
    </section>
  );
}
