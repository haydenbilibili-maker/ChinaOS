import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat, DistBar } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, LABEL } from '../shared/chartHelpers.js';
import { useHigherEducation } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  HIGHER_EDUCATION_SEED_PKG,
  HIGHER_EDUCATION_META,
  HIGHER_EDUCATION_DEDUPED_COUNT,
  dedupeHigherEducation,
  HE_TIERS,
  parseHeTags,
  heHasTag,
} from '../../lib/db/higherEducationSeed.js';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps } from '../../lib/ui/figureAvatarResolve.js';
import TalentDetailPanel, { ExpandableText } from './TalentDetailPanel.jsx';
import { useTalentDeepLink } from '../../lib/talent/routing.js';

const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(16,185,129,0.14)', color: '#10b981', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };
const TIER_RANK = { C9: 0, '985': 1, '211': 2, 双一流: 3 };
const TIER_COLORS = { C9: '#c41e3a', '985': '#e8a317', '211': '#a78bfa', 双一流: '#22d3ee' };

function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((r) => { const k = keyFn(r); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function TagBadges({ r, dense = false }) {
  const tags = parseHeTags(r);
  return tags.map((t) => (
    <span key={t} className="text-[9px] mono px-1.5 py-0.5 rounded"
      style={{ background: `${TIER_COLORS[t] || '#10b981'}22`, color: TIER_COLORS[t] || '#10b981' }}>
      {t}
    </span>
  ));
}

function UniCard({ r, on, onClick, dense = false }) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded"
      style={{
        background: on ? 'rgba(16,185,129,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${on ? '#10b981' : 'var(--border-subtle)'}`,
        cursor: 'pointer', padding: dense ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-2">
        <FigureAvatar {...figureAvatarProps(r)} size={dense ? 28 : 32} ring={on} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            <TagBadges r={r} dense={dense} />
            {r.region && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(r.region)}</span>}
            {r.type && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>{r.type}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{r.strengths}</div>
        </div>
      </div>
    </button>
  );
}

export default function HigherEducationSection() {
  const { rows, ready } = useHigherEducation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [region, setRegion] = useState('');
  const [tier, setTier] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const list = useMemo(() => dedupeHigherEducation(rows || []).rows, [rows]);
  const tierCounts = useMemo(() => {
    const counts = Object.fromEntries(HE_TIERS.map((k) => [k, 0]));
    list.forEach((r) => { parseHeTags(r).forEach((t) => { if (counts[t] != null) counts[t] += 1; }); });
    return counts;
  }, [list]);

  const disciplines = useMemo(() => [...new Set(list.map((r) => r.discipline).filter(Boolean))].sort(), [list]);
  const regions = useMemo(() => [...new Set(list.map((r) => r.region).filter(Boolean))].sort(), [list]);
  const tiers = useMemo(() => HE_TIERS.filter((t) => list.some((r) => heHasTag(r, t))), [list]);

  const filtered = useMemo(() => {
    const out = list.filter((r) => {
      const hay = [r.name, r.discipline, r.type, r.strengths, r.rankNotes, r.region, r.tier, r.tags, r.source, r.notes].join(' ');
      return (!discipline || r.discipline === discipline)
        && (!region || r.region === region)
        && (!tier || heHasTag(r, tier))
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'tier') out.sort((a, b) => (TIER_RANK[a.tier] ?? 9) - (TIER_RANK[b.tier] ?? 9));
    else if (sort === 'region') out.sort((a, b) => (a.region || '').localeCompare(b.region || '', 'zh'));
    return out;
  }, [list, q, discipline, region, tier, sort]);

  const detail = useMemo(() => {
    if (sel) {
      const hit = filtered.find((r) => (r.id && sel.id ? r.id === sel.id : r.name === sel.name));
      if (hit) return hit;
    }
    return searchParams.get('id') ? null : (filtered[0] || null);
  }, [sel, filtered, searchParams]);

  const { selectEntity } = useTalentDeepLink({
    searchParams, setSearchParams, filtered, allList: list, sel, setSel, ready, preserveKeys: [],
  });

  const distDiscipline = tally(filtered, (r) => r.discipline);
  const distRegion = tally(filtered, (r) => short(r.region) || r.region);
  const distTier = useMemo(() => {
    const m = new Map();
    filtered.forEach((r) => {
      parseHeTags(r).forEach((t) => m.set(t, (m.get(t) || 0) + 1));
    });
    return [...m.entries()].sort((a, b) => (TIER_RANK[a[0]] ?? 9) - (TIER_RANK[b[0]] ?? 9));
  }, [filtered]);

  const disciplineChart = {
    grid: { left: 100, right: 16, top: 12, bottom: 24 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    yAxis: { type: 'category', data: distDiscipline.slice(0, 12).map(([k]) => k).reverse(), axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    series: [{ type: 'bar', data: distDiscipline.slice(0, 12).map(([, n]) => n).reverse(), barWidth: 14, itemStyle: { color: '#10b981', borderRadius: 3 } }],
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  };

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖高等教育数据集（${HIGHER_EDUCATION_DEDUPED_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...HIGHER_EDUCATION_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const clearAll = () => { setQ(''); setDiscipline(''); setRegion(''); setTier(''); setSel(null); };
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    discipline && ['学科', discipline, () => setDiscipline('')],
    region && ['地域', short(region), () => setRegion('')],
    tier && ['层级', tier, () => setTier('')],
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

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载高等教育库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
          <Lucide.GraduationCap size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>高等教育 · 机构载体图谱</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            知识生产的基础设施 · 985/211/双一流全覆盖 —— 内置 {HIGHER_EDUCATION_DEDUPED_COUNT.total} 所（C9 {tierCounts.C9} · 985 {tierCounts['985']} · 211 {tierCounts['211']} · 双一流 {tierCounts.双一流}），截至 {HIGHER_EDUCATION_META.asOf}。
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px,1fr))' }}>
        <Stat value={tierCounts.C9 || 0} label="C9" accent="#c41e3a" />
        <Stat value={tierCounts['985'] || 0} label="985" accent="#e8a317" />
        <Stat value={tierCounts['211'] || 0} label="211" accent="#a78bfa" />
        <Stat value={tierCounts.双一流 || 0} label="双一流" accent="#22d3ee" />
        <Stat value={HIGHER_EDUCATION_DEDUPED_COUNT.total} label="院校总数" accent="#10b981" />
        <Stat value={regions.length} label="覆盖地域" accent="#f0abfc" />
        <Stat value={filtered.length} label="当前命中" />
      </div>

      {list.length < 10 && (
        <Card title="一键载入高等教育库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（higher-education-2026-06），机构载体队列，与知识精英人物名录及中国政要隔离。来源：{HIGHER_EDUCATION_META.sources.slice(0, 4).join('、')}等。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${HIGHER_EDUCATION_META.label}（${HIGHER_EDUCATION_DEDUPED_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="高等教育队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置高等教育数据集。</p></Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="校名 / 学科 / 优势领域" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} style={inp}><option value="">全部类型</option>{disciplines.map((d) => <option key={d} value={d}>{d}</option>)}</select>
              <select value={region} onChange={(e) => setRegion(e.target.value)} style={inp}><option value="">全部地域</option>{regions.map((r) => <option key={r} value={r}>{short(r) || r}</option>)}</select>
              <select value={tier} onChange={(e) => setTier(e.target.value)} style={inp}><option value="">全部层级</option>{tiers.map((t) => <option key={t} value={t}>{t}</option>)}</select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="name">按名称</option><option value="tier">按层级</option><option value="region">按地域</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(16,185,129,0.18)' : 'var(--bg-base)', color: on ? '#10b981' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap mt-3 items-center">
              <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>层级</span>
              {tiers.map((t) => {
                const on = tier === t;
                const c = TIER_COLORS[t] || '#10b981';
                return (
                  <button key={t} type="button" onClick={() => setTier(on ? '' : t)}
                    className="text-[11px] mono px-2 py-0.5 rounded-full"
                    style={{ background: on ? `${c}28` : 'var(--bg-elevated)', border: `1px solid ${on ? c : 'var(--border-subtle)'}`, color: on ? c : 'var(--text-secondary)', cursor: 'pointer' }}>
                    {t} {tierCounts[t] || 0}
                  </button>
                );
              })}
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
              命中 {filtered.length} / {list.length} 所 · ↑↓ 或 j/k 切换 · {HIGHER_EDUCATION_META.scope}
            </p>
          </Card>

          {view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <Grid cols={2}>
                <Card title="学科分布"><EChart option={disciplineChart} style={{ height: Math.max(240, distDiscipline.slice(0, 12).length * 22) }} /></Card>
                <Card title="层级（C9/985/211/双一流）"><DistBar data={distTier} color="#e8a317" onPick={(k) => setTier(tier === k ? '' : k)} active={tier} /></Card>
              </Grid>
              <Card title="地域（点选筛选）"><DistBar data={distRegion.slice(0, 12)} color="#22d3ee" onPick={(k) => { const full = regions.find((p) => short(p) === k); setRegion(region === full ? '' : full); }} active={short(region)} /></Card>
            </div>
          ) : (
            <div className="talent-split talent-split--list-detail mb-4">
              <Card title={`检索结果 (${filtered.length}/${list.length})`} asSection={false} className="talent-split__list-card">
                {view === 'grid' ? (
                  <div className="talent-split__scroll grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))' }}>
                    {filtered.map((r) => <UniCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} dense />)}
                    {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                  </div>
                ) : (
                  <div className="talent-split__scroll space-y-1.5">
                    {filtered.map((r) => <UniCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} />)}
                    {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                  </div>
                )}
              </Card>
              <div className="talent-split__detail">
              <Card title={detail ? `${detail.name} · 详情` : '选择一所'} asSection={false}>
                {detail && (
                  <TalentDetailPanel
                    name={detail.name}
                    subtitle={detail.rankNotes}
                    avatar={<FigureAvatar {...figureAvatarProps(detail)} size={56} ring eager />}
                    badges={<TagBadges r={detail} />}
                    sections={[
                      {
                        title: '基本信息',
                        fields: [
                          { label: '层级标签', value: parseHeTags(detail).join(' / ') || detail.tier, accent: '#e8a317' },
                          { label: '主层级', value: detail.tier, accent: TIER_COLORS[detail.tier] },
                          { label: '地域', value: detail.region },
                          { label: '院校类型', value: detail.type || detail.discipline },
                          { label: '创办年份', value: detail.foundingYear },
                          { label: '机构类型', value: detail.sector || '高等教育' },
                        ],
                      },
                      {
                        title: '机构实力',
                        fields: [
                          { label: '优势领域', value: detail.strengths },
                          { label: '排名备注', value: detail.rankNotes },
                          { label: '头衔', value: detail.title },
                          { label: '截至', value: detail.asOf },
                        ],
                      },
                      ...(detail.notes ? [{
                        title: '备注',
                        content: <ExpandableText text={detail.notes} maxLen={120} />,
                      }] : []),
                      { title: '关联标签', fields: [{ label: '来源', value: detail.source }] },
                    ]}
                    queueNote="// 机构载体队列 · 985/211/双一流全覆盖"
                  />
                )}
              </Card>
              </div>
            </div>
          )}
        </>
      )}

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        数据来源：{HIGHER_EDUCATION_META.sources.join('、')} · {HIGHER_EDUCATION_META.notes} · 研究参考
      </p>
    </section>
  );
}
