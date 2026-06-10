import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat } from '../../app/ui.jsx';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { useCulturalElite } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  CULTURAL_ELITE_SEED_PKG,
  CULTURAL_ELITE_META,
  CULTURAL_ELITE_COUNT,
} from '../../lib/db/culturalEliteSeed.js';

const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(139,92,246,0.14)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };

const TAB_LABEL = { university: '顶级大学', scholar: '顶级学者', talent: '文化人才' };
const TIER_RANK = { C9: 0, '985': 1, 双一流: 2 };
const HONOR_PATTERNS = [
  ['长江学者', /长江学者/],
  ['杰青', /杰青|杰出青年/],
  ['院士', /院士/],
  ['茅盾奖', /茅盾文学奖/],
  ['雨果奖', /雨果奖/],
  ['诺奖', /诺贝尔/],
  ['国家级非遗', /非遗传承人|国家级非遗/],
  ['文联/协会', /作协主席|文联|协会主席/],
];

function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((r) => { const k = keyFn(r); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function honorTags(r) {
  const hay = [r.title, r.rankNotes, r.notes].filter(Boolean).join(' ');
  return HONOR_PATTERNS.filter(([, re]) => re.test(hay)).map(([k]) => k);
}

function worksPreview(works, max = 48) {
  if (!works) return '';
  return works.length <= max ? works : `${works.slice(0, max)}…`;
}

function DistBars({ data, color = '#a78bfa', max, onPick, active }) {
  const top = max || (data[0]?.[1] || 1);
  return (
    <div className="space-y-1.5">
      {data.map(([k, n]) => (
        <button key={k} type="button" onClick={onPick ? () => onPick(k) : undefined} className="w-full flex items-center gap-2 text-left"
          style={{ cursor: onPick ? 'pointer' : 'default', opacity: active && active !== k ? 0.45 : 1 }}>
          <span className="text-[11px] mono shrink-0 text-right" style={{ width: 70, color: active === k ? color : 'var(--text-secondary)' }}>{k}</span>
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
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded"
      style={{
        background: on ? 'rgba(139,92,246,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${on ? '#a78bfa' : 'var(--border-subtle)'}`,
        cursor: 'pointer', padding: dense ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-2">
        {r.category !== 'university' && (
          <FigureAvatar name={r.name} size={dense ? 28 : 32} ring={on} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            {r.tier && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>{r.tier}</span>}
            {r.region && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(r.region)}</span>}
            {(r.discipline || r.field) && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>{r.discipline || r.field}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {r.category === 'university' ? r.strengths : (r.institution || r.title)}
          </div>
          {honors.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {honors.slice(0, 3).map((h) => (
                <span key={h} className="text-[8px] mono px-1 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>{h}</span>
              ))}
            </div>
          )}
          {r.works && (
            <div className="text-[10px] mt-1 truncate" style={{ color: 'var(--cyber-cyan)', opacity: 0.85 }}>
              {worksPreview(r.works)}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function CulturalEliteSection() {
  const { rows, ready } = useCulturalElite();
  const [catTab, setCatTab] = useState('university');
  const [q, setQ] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [region, setRegion] = useState('');
  const [tier, setTier] = useState('');
  const [decade, setDecade] = useState('');
  const [honor, setHonor] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const list = rows || [];
  const tabList = useMemo(() => list.filter((r) => r.category === catTab), [list, catTab]);

  const disciplines = useMemo(() => [...new Set(tabList.map((r) => r.discipline || r.field).filter(Boolean))].sort(), [tabList]);
  const regions = useMemo(() => [...new Set(tabList.map((r) => r.region).filter(Boolean))].sort(), [tabList]);
  const tiers = useMemo(() => [...new Set(tabList.filter((r) => r.tier).map((r) => r.tier))].sort((a, b) => (TIER_RANK[a] ?? 9) - (TIER_RANK[b] ?? 9)), [tabList]);
  const decades = useMemo(() => [...new Set(tabList.map((r) => r.decade).filter(Boolean))].sort(), [tabList]);
  const honorOpts = useMemo(() => {
    const set = new Set();
    tabList.forEach((r) => honorTags(r).forEach((h) => set.add(h)));
    return [...set].sort();
  }, [tabList]);

  const filtered = useMemo(() => {
    const out = tabList.filter((r) => {
      const hay = [r.name, r.institution, r.field, r.discipline, r.title, r.works, r.strengths, r.rankNotes, r.region, r.tier, r.notes, r.source].join(' ');
      const honorMatch = !honor || honorTags(r).includes(honor);
      return (!discipline || r.discipline === discipline || r.field === discipline)
        && (!region || r.region === region)
        && (!tier || r.tier === tier)
        && (!decade || r.decade === decade)
        && honorMatch
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'tier') out.sort((a, b) => (TIER_RANK[a.tier] ?? 9) - (TIER_RANK[b.tier] ?? 9));
    else if (sort === 'region') out.sort((a, b) => (a.region || '').localeCompare(b.region || '', 'zh'));
    return out;
  }, [tabList, q, discipline, region, tier, decade, honor, sort]);

  const detail = sel || filtered[0] || null;
  const uniCount = list.filter((r) => r.category === 'university').length;
  const schCount = list.filter((r) => r.category === 'scholar').length;
  const talCount = list.filter((r) => r.category === 'talent').length;

  const distDiscipline = tally(filtered, (r) => r.discipline || r.field);
  const distRegion = tally(filtered, (r) => short(r.region) || r.region);
  const distTier = tally(filtered.filter((r) => r.tier), (r) => r.tier);
  const distDecade = tally(filtered.filter((r) => r.decade), (r) => r.decade).sort((a, b) => a[0].localeCompare(b[0]));
  const distHonor = tally(filtered.flatMap((r) => honorTags(r).map((h) => ({ r, h }))), (x) => x.h);

  const disciplineChart = {
    grid: { left: 100, right: 16, top: 12, bottom: 24 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    yAxis: { type: 'category', data: distDiscipline.slice(0, 12).map(([k]) => k).reverse(), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'bar', data: distDiscipline.slice(0, 12).map(([, n]) => n).reverse(), barWidth: 14, itemStyle: { color: '#a78bfa', borderRadius: 3 } }],
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  };

  const regionMapData = distRegion.slice(0, 20).map(([name, value]) => ({ name, value }));
  const regionChart = regionMapData.length ? {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    grid: { left: 48, right: 16, top: 8, bottom: 24 },
    xAxis: { type: 'category', data: regionMapData.map((d) => d.name), axisLabel: { color: '#93a1b5', fontSize: 10, rotate: 35 }, axisLine: { lineStyle: { color: '#27324a' } } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'bar', data: regionMapData.map((d) => d.value), barWidth: '55%', itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } }],
  } : null;

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖文化精英数据集（${CULTURAL_ELITE_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...CULTURAL_ELITE_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const clearAll = () => { setQ(''); setDiscipline(''); setRegion(''); setTier(''); setDecade(''); setHonor(''); setSel(null); };
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    discipline && ['学科', discipline, () => setDiscipline('')],
    region && ['地域', short(region), () => setRegion('')],
    tier && ['层级', tier, () => setTier('')],
    decade && ['年代', decade, () => setDecade('')],
    honor && ['荣誉', honor, () => setHonor('')],
  ].filter(Boolean);

  const pickByIndex = useCallback((idx) => {
    const r = filtered[idx];
    if (r) setSel(r);
  }, [filtered]);

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

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载文化精英库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>
          <Lucide.BookOpen size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>文化精英 · 语义防火墙之外的硬实力</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            人才库子模块 · C9/985 人文强校 · 长江学者/杰青 · 文博/文联/非遗（商业精英已解耦） —— 内置 {CULTURAL_ELITE_COUNT.total} 条，截至 {CULTURAL_ELITE_META.asOf}
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px,1fr))' }}>
        <Stat value={uniCount} label="顶级大学" accent="#a78bfa" />
        <Stat value={schCount} label="顶级学者" accent="#22d3ee" />
        <Stat value={talCount} label="文化人才" accent="#e8a317" />
        <Stat value={disciplines.length} label="学科门类" accent="#10b981" />
        <Stat value={regions.length} label="覆盖地域" accent="#f0abfc" />
        <Stat value={filtered.length} label="当前命中" />
      </div>

      <div className="flex gap-1 flex-wrap mb-4">
        {Object.entries(TAB_LABEL).map(([k, label]) => (
          <button key={k} type="button" onClick={() => { setCatTab(k); setSel(null); clearAll(); }}
            className="text-sm px-3 py-1.5 mono"
            style={{ background: catTab === k ? 'rgba(139,92,246,0.2)' : 'var(--bg-elevated)', color: catTab === k ? '#fff' : 'var(--text-secondary)', border: catTab === k ? '1px solid rgba(139,92,246,0.5)' : '1px solid transparent', borderRadius: 6, cursor: 'pointer' }}>
            {label} ({list.filter((r) => r.category === k).length})
          </button>
        ))}
      </div>

      {list.length < 10 && (
        <Card title="一键载入文化精英库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（cultural-elite-2026-06），与政治人才 figures 隔离。来源：{CULTURAL_ELITE_META.sources.slice(0, 4).join('、')}等。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${CULTURAL_ELITE_META.label}（${CULTURAL_ELITE_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="数据集为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置文化精英名单。</p></Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 机构 / 代表作 / 荣誉" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} style={inp}><option value="">全部学科</option>{disciplines.map((d) => <option key={d} value={d}>{d}</option>)}</select>
              <select value={region} onChange={(e) => setRegion(e.target.value)} style={inp}><option value="">全部地域</option>{regions.map((r) => <option key={r} value={r}>{short(r) || r}</option>)}</select>
              {catTab === 'university' && (
                <select value={tier} onChange={(e) => setTier(e.target.value)} style={inp}><option value="">全部层级</option>{tiers.map((t) => <option key={t} value={t}>{t}</option>)}</select>
              )}
              {catTab !== 'university' && (
                <>
                  <select value={decade} onChange={(e) => setDecade(e.target.value)} style={inp}><option value="">全部年代</option>{decades.map((d) => <option key={d} value={d}>{d}</option>)}</select>
                  {honorOpts.length > 0 && (
                    <select value={honor} onChange={(e) => setHonor(e.target.value)} style={inp}><option value="">全部荣誉</option>{honorOpts.map((h) => <option key={h} value={h}>{h}</option>)}</select>
                  )}
                </>
              )}
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="name">按名称</option>
                {catTab === 'university' && <option value="tier">按层级</option>}
                <option value="region">按地域</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(139,92,246,0.18)' : 'var(--bg-base)', color: on ? '#a78bfa' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
              {list.length < CULTURAL_ELITE_COUNT.total && (
                <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lucide.RefreshCw size={13} />{loading ? '载入中…' : `补全 ${CULTURAL_ELITE_COUNT.total} 条`}
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
              {TAB_LABEL[catTab]} · 命中 {filtered.length} / {tabList.length} 条 · ↑↓ 或 j/k 切换 · {CULTURAL_ELITE_META.scope}
            </p>
          </Card>

          {view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
                // 学科/地域分布基于当前筛选 {filtered.length} 条；符号生产与叙事资本的硬基础设施
              </div>
              <Grid cols={2}>
                <Card title="学科/领域分布"><EChart option={disciplineChart} style={{ height: Math.max(240, distDiscipline.slice(0, 12).length * 22) }} /></Card>
                {regionChart && <Card title="地域分布"><EChart option={regionChart} style={{ height: 260 }} /></Card>}
              </Grid>
              <Grid cols={2}>
                {catTab === 'university' && <Card title="层级（C9/985/双一流）"><DistBars data={distTier} color="#e8a317" onPick={(k) => setTier(tier === k ? '' : k)} active={tier} /></Card>}
                {catTab !== 'university' && decades.length > 0 && <Card title="出生年代"><DistBars data={distDecade} color="#e8a317" onPick={(k) => setDecade(decade === k ? '' : k)} active={decade} /></Card>}
                {distHonor.length > 0 && <Card title="荣誉类型"><DistBars data={distHonor.slice(0, 10)} color="#d4af37" onPick={(k) => setHonor(honor === k ? '' : k)} active={honor} /></Card>}
                <Card title="学科（点选筛选）"><DistBars data={distDiscipline.slice(0, 10)} onPick={(k) => setDiscipline(discipline === k ? '' : k)} active={discipline} /></Card>
              </Grid>
              <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>// 数据边界：{CULTURAL_ELITE_META.notes}</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', maxHeight: 620, overflowY: 'auto' }}>
              {filtered.map((r) => (
                <EliteCard key={r.id || r.name} r={r} on={detail === r} onClick={() => setSel(r)} dense />
              ))}
              {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
              <Card title={`${TAB_LABEL[catTab]} (${filtered.length}/${tabList.length})`}>
                <div className="space-y-1.5" style={{ maxHeight: 560, overflowY: 'auto' }}>
                  {filtered.map((r) => (
                    <EliteCard key={r.id || r.name} r={r} on={detail === r} onClick={() => setSel(r)} />
                  ))}
                  {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                </div>
              </Card>

              <Card title={detail ? `${detail.name} · 详情` : '选择一条'}>
                {detail && (
                  <>
                    <div className="flex items-center gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {detail.category !== 'university' ? (
                        <FigureAvatar name={detail.name} size={44} ring />
                      ) : (
                        <span className="flex items-center justify-center rounded-full shrink-0 text-lg font-bold" style={{ width: 44, height: 44, background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>{detail.name[0]}</span>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{detail.name}</span>
                          <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>{TAB_LABEL[detail.category]}</span>
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{detail.title || detail.rankNotes}</div>
                        {honorTags(detail).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {honorTags(detail).map((h) => (
                              <span key={h} className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>{h}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-1.5 text-xs mb-3" style={{ gridTemplateColumns: 'auto 1fr' }}>
                      {detail.category === 'university' && detail.tier && <><span style={{ color: 'var(--text-tertiary)' }}>层级</span><span style={{ color: '#e8a317' }}>{detail.tier}</span></>}
                      {detail.region && <><span style={{ color: 'var(--text-tertiary)' }}>地域</span><span style={{ color: 'var(--text-secondary)' }}>{detail.region}</span></>}
                      {(detail.discipline || detail.field) && <><span style={{ color: 'var(--text-tertiary)' }}>学科</span><span style={{ color: 'var(--text-secondary)' }}>{detail.discipline || detail.field}</span></>}
                      {detail.institution && detail.category !== 'university' && <><span style={{ color: 'var(--text-tertiary)' }}>机构</span><span style={{ color: 'var(--text-secondary)' }}>{detail.institution}</span></>}
                      {detail.strengths && <><span style={{ color: 'var(--text-tertiary)' }}>优势领域</span><span style={{ color: 'var(--text-secondary)' }}>{detail.strengths}</span></>}
                      {detail.rankNotes && detail.category === 'university' && <><span style={{ color: 'var(--text-tertiary)' }}>排名备注</span><span style={{ color: 'var(--text-secondary)' }}>{detail.rankNotes}</span></>}
                      {detail.works && <><span style={{ color: 'var(--text-tertiary)' }}>代表作</span><span style={{ color: 'var(--cyber-cyan)' }}>{detail.works}</span></>}
                      {detail.decade && <><span style={{ color: 'var(--text-tertiary)' }}>年代</span><span style={{ color: 'var(--text-secondary)' }}>{detail.decade}</span></>}
                      {detail.source && <><span style={{ color: 'var(--text-tertiary)' }}>来源</span><span style={{ color: 'var(--text-tertiary)' }}>{detail.source}</span></>}
                      {detail.notes && <><span style={{ color: 'var(--text-tertiary)' }}>备注</span><span style={{ color: 'var(--text-secondary)' }}>{detail.notes}</span></>}
                    </div>
                    <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>// 公开信息口径 · 荣誉与职务以来源发布时为准</p>
                  </>
                )}
              </Card>
            </div>
          )}
        </>
      )}

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        数据来源：{CULTURAL_ELITE_META.sources.join('、')} · {CULTURAL_ELITE_META.notes} · 研究参考
      </p>
    </section>
  );
}
