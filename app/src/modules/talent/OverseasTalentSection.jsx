import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat } from '../../app/ui.jsx';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps, prefetchFigureAvatars } from '../../lib/ui/figureAvatarResolve.js';
import EChart from '../../lib/viz/EChart.jsx';
import { useOverseasTalent } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  OVERSEAS_TALENT_SEED_PKG,
  OVERSEAS_TALENT_META,
  OVERSEAS_TALENT_DEDUPED_COUNT,
  dedupeOverseasTalent,
  OT_SUB_CATS,
  OT_TAB_LABEL,
} from '../../lib/db/overseasTalentSeed.js';
import { useTalentDeepLink, findEntityInList } from '../../lib/talent/routing.js';
import TalentDetailPanel, { ExpandableText } from './TalentDetailPanel.jsx';
import { applyTalentEnrichment } from '../../lib/talent/talentEnrich.js';
import { buildTalentDetailSections, CrossRefLinks, eventsToTimeline } from '../../lib/talent/detailSections.jsx';
import { buildDetailFooter, normalizeTags } from '../../lib/talent/metadata.jsx';

const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(14,165,233,0.14)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };

const NAT_LABEL = { cn: '中国籍', hua: '华人背景' };
const CAT_RANK = { knowledge: 0, tech: 1, industry: 2, culture: 3, academic: 4 };
const COUNTRY_LABEL = {
  US: '美国', UK: '英国', SG: '新加坡', HK: '香港', TW: '台湾', CA: '加拿大',
  DE: '德国', FR: '法国', CH: '瑞士', AE: '阿联酋', JP: '日本', AU: '澳大利亚', CN: '中国',
};

function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((r) => { const k = keyFn(r); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function preview(text, max = 52) {
  if (!text) return '';
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

function DistBars({ data, color = '#0ea5e9', max, onPick, active }) {
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

function TalentCard({ r, on, onClick, dense = false }) {
  const country = COUNTRY_LABEL[r.baseCountry] || r.baseCountry;
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded"
      style={{
        background: on ? 'rgba(14,165,233,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${on ? '#0ea5e9' : 'var(--border-subtle)'}`,
        cursor: 'pointer', padding: dense ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-2">
        <FigureAvatar {...figureAvatarProps(r)} size={dense ? 28 : 32} ring={on} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            {r.nameEn && <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{r.nameEn}</span>}
            <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(14,165,233,0.12)', color: '#0ea5e9' }}>{OT_TAB_LABEL[r.category] || r.category}</span>
            {country && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{country}</span>}
            {r.nationality && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>{NAT_LABEL[r.nationality] || r.nationality}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {r.institution}{r.role ? ` · ${r.role}` : ''}
          </div>
          {r.field && (
            <div className="text-[10px] mt-0.5 truncate" style={{ color: '#a78bfa' }}>{r.field}</div>
          )}
          {r.tags && r.tags !== '—' && (
            <div className="text-[10px] mt-1 truncate" style={{ color: 'var(--cyber-cyan)', opacity: 0.85 }}>
              {preview(r.tags)}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function OverseasTalentSection() {
  const { rows, ready } = useOverseasTalent();
  const [searchParams, setSearchParams] = useSearchParams();
  const otParam = searchParams.get('ot');
  const [catTab, setCatTab] = useState(otParam && OT_SUB_CATS.includes(otParam) ? otParam : 'knowledge');
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('');
  const [nationality, setNationality] = useState('');
  const [field, setField] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const { list, catCounts } = useMemo(() => {
    const { rows: deduped } = dedupeOverseasTalent(rows || []);
    const counts = Object.fromEntries(OT_SUB_CATS.map((k) => [k, 0]));
    deduped.forEach((r) => { if (counts[r.category] != null) counts[r.category] += 1; });
    return { list: deduped, catCounts: counts };
  }, [rows]);

  const tabList = useMemo(() => list.filter((r) => r.category === catTab), [list, catTab]);

  const countries = useMemo(() => [...new Set(tabList.map((r) => r.baseCountry).filter(Boolean))].sort(), [tabList]);
  const fields = useMemo(() => [...new Set(tabList.map((r) => r.field).filter(Boolean))].sort(), [tabList]);

  const filtered = useMemo(() => {
    const out = tabList.filter((r) => {
      const hay = [r.name, r.nameEn, r.institution, r.role, r.field, r.bio, r.tags, r.region, r.notes, r.baseCountry, COUNTRY_LABEL[r.baseCountry]].join(' ');
      return (!country || r.baseCountry === country)
        && (!nationality || r.nationality === nationality)
        && (!field || r.field === field)
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'country') out.sort((a, b) => (a.baseCountry || '').localeCompare(b.baseCountry || ''));
    else if (sort === 'category') out.sort((a, b) => (CAT_RANK[a.category] ?? 9) - (CAT_RANK[b.category] ?? 9));
    return out;
  }, [tabList, q, country, nationality, field, sort]);

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
    searchParams, setSearchParams, filtered, allList: list, sel, setSel, ready, preserveKeys: ['ot'],
  });

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (!idParam || !list.length) return;
    const hit = findEntityInList(list, idParam);
    if (hit?.category && OT_SUB_CATS.includes(hit.category) && hit.category !== catTab) setCatTab(hit.category);
  }, [searchParams, list, catTab]);

  useEffect(() => {
    if (otParam && OT_SUB_CATS.includes(otParam) && otParam !== catTab) setCatTab(otParam);
  }, [otParam, catTab]);

  useEffect(() => { setSel(null); }, [catTab]);

  const distCountry = tally(filtered, (r) => COUNTRY_LABEL[r.baseCountry] || r.baseCountry);
  const distField = tally(filtered, (r) => r.field);

  const countryChart = {
    grid: { left: 48, right: 16, top: 12, bottom: 24 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    yAxis: { type: 'category', data: distCountry.slice(0, 12).map(([k]) => k).reverse(), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'bar', data: distCountry.slice(0, 12).map(([, n]) => n).reverse(), barWidth: 14, itemStyle: { color: '#0ea5e9', borderRadius: 3 } }],
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  };

  const fieldChart = distField.length ? {
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 16, top: 8, bottom: 24 },
    xAxis: { type: 'category', data: distField.slice(0, 14).map(([k]) => k), axisLabel: { color: '#93a1b5', fontSize: 10, rotate: 35 }, axisLine: { lineStyle: { color: '#27324a' } } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'bar', data: distField.slice(0, 14).map(([, n]) => n), barWidth: '55%', itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } }],
  } : null;

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖海外人才数据集（${OVERSEAS_TALENT_DEDUPED_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...OVERSEAS_TALENT_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const clearAll = () => { setQ(''); setCountry(''); setNationality(''); setField(''); setSel(null); };
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    country && ['驻留国', COUNTRY_LABEL[country] || country, () => setCountry('')],
    nationality && ['身份', NAT_LABEL[nationality] || nationality, () => setNationality('')],
    field && ['领域', field, () => setField('')],
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

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载海外人才库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(14,165,233,0.12)', color: '#0ea5e9' }}>
          <Lucide.Globe2 size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>海外人才 · 跨境人力资本队列</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            与境内知识精英/商业精英互补 · 聚焦海外工作/游学的中籍或华人背景精英 —— 内置 {OVERSEAS_TALENT_DEDUPED_COUNT.total} 条，截至 {OVERSEAS_TALENT_META.asOf}。不含党政官员。
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px,1fr))' }}>
        {OT_SUB_CATS.map((k) => (
          <Stat key={k} value={catCounts[k] ?? 0} label={OT_TAB_LABEL[k]} accent="#0ea5e9" />
        ))}
        <Stat value={countries.length} label="驻留国别" accent="#22d3ee" />
        <Stat value={filtered.length} label="当前命中" />
      </div>

      <div className="flex gap-1 flex-wrap mb-4">
        {OT_SUB_CATS.map((k) => (
          <button key={k} type="button" onClick={() => {
            setCatTab(k); setSel(null); clearAll();
            const next = new URLSearchParams(searchParams);
            next.set('ot', k); next.delete('id');
            setSearchParams(next, { replace: true });
          }}
            className={`text-sm px-3 py-1.5 mono os-filter-chip ${catTab === k ? 'is-active' : ''}`}
            style={{ '--chip-accent': '#0ea5e9' }}>
            {OT_TAB_LABEL[k]} ({catCounts[k] ?? 0})
          </button>
        ))}
      </div>

      {list.length < 10 && (
        <Card title="一键载入海外人才库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（overseas-talent-2026-06），与境内队列隔离；与 <Link to="/talent?tab=knowledge" className="mono" style={{ color: 'var(--cyber-cyan)' }}>知识精英</Link>、<Link to="/talent?tab=business" className="mono" style={{ color: 'var(--cyber-cyan)' }}>商业精英</Link> 交叉引用但不重复建档。来源：{OVERSEAS_TALENT_META.sources.slice(0, 4).join('、')}等。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${OVERSEAS_TALENT_META.label}（${OVERSEAS_TALENT_DEDUPED_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="跨境人力资本队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置海外人才数据集。</p></Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 机构 / 领域 / 驻留国" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={country} onChange={(e) => setCountry(e.target.value)} style={inp}>
                <option value="">全部驻留国</option>
                {countries.map((c) => <option key={c} value={c}>{COUNTRY_LABEL[c] || c}</option>)}
              </select>
              <select value={nationality} onChange={(e) => setNationality(e.target.value)} style={inp}>
                <option value="">全部身份</option>
                <option value="cn">中国籍</option>
                <option value="hua">华人背景</option>
              </select>
              <select value={field} onChange={(e) => setField(e.target.value)} style={inp}>
                <option value="">全部领域</option>
                {fields.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="name">按名称</option>
                <option value="country">按驻留国</option>
                <option value="category">按类别</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(14,165,233,0.18)' : 'var(--bg-base)', color: on ? '#0ea5e9' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
              {list.length < OVERSEAS_TALENT_DEDUPED_COUNT.total && (
                <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lucide.RefreshCw size={13} />{loading ? '载入中…' : `补全 ${OVERSEAS_TALENT_DEDUPED_COUNT.total} 条`}
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
              {OT_TAB_LABEL[catTab]} · 命中 {filtered.length} / {tabList.length} 条 · ↑↓ 或 j/k 切换 · {OVERSEAS_TALENT_META.scope}
            </p>
          </Card>

          {view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
                // 驻留国/领域分布基于当前筛选 {filtered.length} 条；跨境人力资本地理锚点
              </div>
              <Grid cols={2}>
                <Card title="驻留国分布"><EChart option={countryChart} style={{ height: Math.max(240, distCountry.slice(0, 12).length * 22) }} /></Card>
                {fieldChart && <Card title="领域分布"><EChart option={fieldChart} style={{ height: 260 }} /></Card>}
              </Grid>
              <Grid cols={2}>
                <Card title="驻留国（点选筛选）"><DistBars data={distCountry.slice(0, 10)} onPick={(k) => { const code = Object.entries(COUNTRY_LABEL).find(([, v]) => v === k)?.[0] || k; setCountry(country === code ? '' : code); }} active={COUNTRY_LABEL[country] || country} /></Card>
                <Card title="领域（点选筛选）"><DistBars data={distField.slice(0, 10)} color="#a78bfa" onPick={(k) => setField(field === k ? '' : k)} active={field} /></Card>
              </Grid>
              <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>// 数据边界：{OVERSEAS_TALENT_META.notes}</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', maxHeight: 620, overflowY: 'auto' }}>
              {filtered.map((r) => (
                <TalentCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} dense />
              ))}
              {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
              <Card title={`${OT_TAB_LABEL[catTab]} (${filtered.length}/${tabList.length})`}>
                <div className="space-y-1.5" style={{ maxHeight: 560, overflowY: 'auto' }}>
                  {filtered.map((r) => (
                    <TalentCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} />
                  ))}
                  {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                </div>
              </Card>

              <Card title={detail ? `${detail.name} · 详情` : '选择一位'}>
                {detail && (() => {
                  const d = applyTalentEnrichment(detail, { queue: 'overseas' });
                  return (
                  <TalentDetailPanel
                    name={d.name}
                    subtitle={`${d.role || ''}${d.institution ? ` · ${d.institution}` : ''}`}
                    verifyRecord={d}
                    crossLinks={<CrossRefLinks record={d} queue="overseas" />}
                    avatar={<FigureAvatar {...figureAvatarProps(d)} size={56} ring eager />}
                    badges={(
                      <>
                        {d.nameEn && <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{d.nameEn}</span>}
                        <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(14,165,233,0.12)', color: '#0ea5e9' }}>{OT_TAB_LABEL[d.category]}</span>
                        {d.tier && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>Tier {d.tier}</span>}
                      </>
                    )}
                    tags={normalizeTags(d.tags)}
                    tagAccent="#0ea5e9"
                    sections={buildTalentDetailSections(d, {
                      queue: 'overseas',
                      bioLabel: '跨境履历要点',
                      baseSections: [{
                        title: '基本信息',
                        fields: [
                          { label: '驻留国', value: d.baseCountry ? `${COUNTRY_LABEL[d.baseCountry] || d.baseCountry}${d.region ? ` · ${d.region}` : ''}` : null, accent: 'var(--cyber-cyan)' },
                          { label: '身份', value: NAT_LABEL[d.nationality] || d.nationality },
                          { label: '领域', value: d.field, accent: '#a78bfa' },
                          { label: '机构', value: d.institution },
                          { label: '职务', value: d.role },
                        ],
                      }],
                    })}
                    timeline={eventsToTimeline(d)}
                    timelineExpandable
                    timelineAccent="#0ea5e9"
                    queueNote="// 跨境人力资本队列 · 与境内知识/商业队列互补"
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
        数据来源：{OVERSEAS_TALENT_META.sources.join('、')} · {OVERSEAS_TALENT_META.notes} · 研究参考
      </p>
    </section>
  );
}
