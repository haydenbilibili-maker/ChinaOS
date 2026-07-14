import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat, DistBar } from '../../app/ui.jsx';
import { useResearchInstitute } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  RESEARCH_INSTITUTE_SEED_PKG,
  RESEARCH_INSTITUTE_META,
  RESEARCH_INSTITUTE_DEDUPED_COUNT,
  dedupeResearchInstitute,
  RI_TYPES,
  RI_STATE_TYPES,
  RI_FACILITY_TYPE,
} from '../../lib/db/researchInstituteSeed.js';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps } from '../../lib/ui/figureAvatarResolve.js';
import TalentDetailPanel, { ExpandableText } from './TalentDetailPanel.jsx';
import { useTalentDeepLink, findEntityInList } from '../../lib/talent/routing.js';

const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const isPrivate = (r) => r?.type === '民企科研';
const isFacility = (r) => r?.type === RI_FACILITY_TYPE;
const statusColor = (s) => (s === '运行' ? '#22c55e' : s === '建设' ? '#e8a317' : '#94a3b8');
const SECTOR_OPTS = [
  { id: 'all', label: '全部体系' },
  { id: 'state', label: '国立科技力量' },
  { id: 'private', label: '民企研发载体' },
  { id: 'facility', label: '中国大科学装置' },
];
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(139,92,246,0.14)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };

function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((r) => { const k = keyFn(r); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function InstCard({ r, on, onClick, dense = false }) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded"
      style={{
        background: on ? 'rgba(139,92,246,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${on ? '#a78bfa' : 'var(--border-subtle)'}`,
        cursor: 'pointer', padding: dense ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-2">
        <FigureAvatar {...figureAvatarProps(r)} size={dense ? 28 : 32} ring={on} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: isPrivate(r) ? 'rgba(34,211,238,0.12)' : isFacility(r) ? 'rgba(232,163,23,0.12)' : 'rgba(139,92,246,0.12)', color: isPrivate(r) ? '#22d3ee' : isFacility(r) ? '#e8a317' : '#a78bfa' }}>{r.type}</span>
            {isFacility(r) && r.tier && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: `${statusColor(r.tier)}22`, color: statusColor(r.tier) }}>{r.tier}</span>}
            {!isFacility(r) && r.tier && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>{r.tier}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {isPrivate(r) && r.parentCompany ? `${r.parentCompany} · ` : isFacility(r) && r.parentCompany ? `${r.parentCompany} · ` : ''}{r.field} · {short(r.province) || r.province}
            {isFacility(r) && r.tier ? ` · ${r.tier}` : ''}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ResearchInstituteSection() {
  const { rows, ready } = useResearchInstitute();
  const [searchParams, setSearchParams] = useSearchParams();
  const riParam = searchParams.get('ri');
  const [sector, setSector] = useState('all');
  const [typeTab, setTypeTab] = useState(riParam && RI_TYPES.includes(riParam) ? riParam : '中科院');
  const [q, setQ] = useState('');
  const [province, setProvince] = useState('');
  const [field, setField] = useState('');
  const [tier, setTier] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const { list, typeCounts } = useMemo(() => {
    const { rows: deduped } = dedupeResearchInstitute(rows || []);
    const counts = Object.fromEntries(RI_TYPES.map((k) => [k, 0]));
    deduped.forEach((r) => { if (counts[r.type] != null) counts[r.type] += 1; });
    return { list: deduped, typeCounts: counts };
  }, [rows]);

  const sectorList = useMemo(() => {
    if (sector === 'private') return list.filter((r) => isPrivate(r));
    if (sector === 'state') return list.filter((r) => RI_STATE_TYPES.includes(r.type));
    if (sector === 'facility') return list.filter((r) => isFacility(r));
    return list;
  }, [list, sector]);
  const stateCount = useMemo(() => list.filter((r) => RI_STATE_TYPES.includes(r.type)).length, [list]);
  const privateCount = useMemo(() => list.filter((r) => isPrivate(r)).length, [list]);
  const facilityCount = useMemo(() => list.filter((r) => isFacility(r)).length, [list]);
  const tabList = useMemo(() => sectorList.filter((r) => r.type === typeTab), [sectorList, typeTab]);
  const provinces = useMemo(() => [...new Set(tabList.map((r) => r.province).filter(Boolean))].sort(), [tabList]);
  const fields = useMemo(() => [...new Set(tabList.map((r) => r.field).filter(Boolean))].sort(), [tabList]);
  const tiers = useMemo(() => [...new Set(tabList.map((r) => r.tier).filter(Boolean))].sort(), [tabList]);
  const nlabCount = useMemo(() => list.filter((r) => r.tier === '国家实验室').length, [list]);

  const filtered = useMemo(() => {
    const out = tabList.filter((r) => {
      const hay = [r.name, r.field, r.province, r.tier, r.notes, r.source, r.parentCompany, r.tags, r.scale].join(' ');
      return (!province || r.province === province) && (!field || r.field === field) && (!tier || r.tier === tier) && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'keyLabs') out.sort((a, b) => (b.keyLabs || 0) - (a.keyLabs || 0));
    else if (sort === 'founded') out.sort((a, b) => (b.founded || 0) - (a.founded || 0));
    return out;
  }, [tabList, q, province, field, tier, sort]);

  const detail = useMemo(() => {
    if (sel) {
      const hit = filtered.find((r) => (r.id && sel.id ? r.id === sel.id : r.name === sel.name));
      if (hit) return hit;
    }
    return searchParams.get('id') ? null : (filtered[0] || null);
  }, [sel, filtered, searchParams]);

  const { selectEntity } = useTalentDeepLink({
    searchParams, setSearchParams, filtered, allList: list, sel, setSel, ready, preserveKeys: ['ri'],
  });

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (!idParam || !list.length) return;
    const hit = findEntityInList(list, idParam);
    if (hit?.type && hit.type !== typeTab) setTypeTab(hit.type);
    if (hit?.type) {
      if (isPrivate(hit)) setSector('private');
      else if (isFacility(hit)) setSector('facility');
      else if (RI_STATE_TYPES.includes(hit.type)) setSector('state');
      else setSector('all');
    }
  }, [searchParams, list, typeTab]);

  useEffect(() => {
    if (riParam && RI_TYPES.includes(riParam) && riParam !== typeTab) setTypeTab(riParam);
  }, [riParam, typeTab]);

  useEffect(() => { setSel(null); }, [typeTab, sector]);

  const distField = tally(filtered, (r) => r.field);
  const distTier = tally(filtered, (r) => r.tier);

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖科研院所数据集（${RESEARCH_INSTITUTE_DEDUPED_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...RESEARCH_INSTITUTE_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const clearAll = () => { setQ(''); setProvince(''); setField(''); setTier(''); setSel(null); };
  const pickByIndex = useCallback((idx) => { const r = filtered[idx]; if (r) selectEntity(r); }, [filtered, selectEntity]);

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

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载科研院所库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>
          <Lucide.FlaskConical size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>科研院所 · 国立体系、企业研发与大科学装置</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            机构载体队列 · 国立科技力量 + 民企科研 + 大科学装置 —— 内置 {RESEARCH_INSTITUTE_DEDUPED_COUNT.total} 条，截至 {RESEARCH_INSTITUTE_META.asOf}。国家战略科技力量的物理锚点与国家创新体系基础设施。
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px,1fr))' }}>
        <Stat value={stateCount} label="国立体系" accent="#a78bfa" />
        <Stat value={privateCount} label="民企科研" accent="#22d3ee" />
        <Stat value={facilityCount} label="大科学装置" accent="#e8a317" />
        {RI_TYPES.filter((t) => t !== RI_FACILITY_TYPE).map((t) => <Stat key={t} value={typeCounts[t] || 0} label={t} accent="#a78bfa" />)}
        <Stat value={nlabCount} label="国家实验室" accent="#c41e3a" />
        <Stat value={filtered.length} label="当前命中" />
      </div>

      <div className="flex gap-1 flex-wrap mb-3">
        {SECTOR_OPTS.map(({ id, label }) => (
          <button key={id} type="button" onClick={() => {
            setSector(id); setSel(null); clearAll();
            if (id === 'private') setTypeTab('民企科研');
            else if (id === 'facility') setTypeTab(RI_FACILITY_TYPE);
            else if (id === 'state' && (typeTab === '民企科研' || typeTab === RI_FACILITY_TYPE)) setTypeTab('中科院');
          }}
            className={`text-sm px-3 py-1.5 mono os-filter-chip ${sector === id ? 'is-active' : ''}`}
            style={{ '--chip-accent': id === 'facility' ? '#e8a317' : 'var(--cyber-cyan)' }}>
            {label}{id === 'state' ? ` (${stateCount})` : id === 'private' ? ` (${privateCount})` : id === 'facility' ? ` (${facilityCount})` : ''}
          </button>
        ))}
      </div>

      <div className="flex gap-1 flex-wrap mb-4">
        {RI_TYPES.filter((t) => sector === 'all' || (sector === 'state' && RI_STATE_TYPES.includes(t)) || (sector === 'private' && t === '民企科研') || (sector === 'facility' && t === RI_FACILITY_TYPE)).map((t) => (
          <button key={t} type="button" onClick={() => {
            setTypeTab(t); setSel(null); clearAll();
            const next = new URLSearchParams(searchParams);
            next.set('ri', t); next.delete('id');
            setSearchParams(next, { replace: true });
          }}
            className={`text-sm px-3 py-1.5 mono os-filter-chip ${typeTab === t ? 'is-active' : ''}`}
            style={{ '--chip-accent': '#8b5cf6' }}>
            {t} ({typeCounts[t] ?? 0})
          </button>
        ))}
      </div>

      {list.length < 10 && (
        <Card title="一键载入科研院所库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（research-institute-2026-06），机构载体队列，与人物名录隔离。来源：{RESEARCH_INSTITUTE_META.sources.slice(0, 4).join('、')}等。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${RESEARCH_INSTITUTE_META.label}（${RESEARCH_INSTITUTE_DEDUPED_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="科研院所队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置科研院所数据集。</p></Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={typeTab === '民企科研' ? '机构名称 / 母公司 / 研发方向 / 标签' : typeTab === RI_FACILITY_TYPE ? '装置名称 / 领域 / 依托单位 / 能力概要' : '院所名称 / 领域 / 实验室层级'} style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={field} onChange={(e) => setField(e.target.value)} style={inp}><option value="">全部领域</option>{fields.map((f) => <option key={f} value={f}>{f}</option>)}</select>
              <select value={province} onChange={(e) => setProvince(e.target.value)} style={inp}><option value="">全部省份</option>{provinces.map((p) => <option key={p} value={p}>{short(p) || p}</option>)}</select>
              <select value={tier} onChange={(e) => setTier(e.target.value)} style={inp}><option value="">{typeTab === RI_FACILITY_TYPE ? '全部状态' : '全部层级'}</option>{tiers.map((t) => <option key={t} value={t}>{t}</option>)}</select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="name">按名称</option>
                {typeTab !== RI_FACILITY_TYPE && <option value="keyLabs">按重点实验室数</option>}
                {(typeTab === '民企科研' || typeTab === RI_FACILITY_TYPE) && <option value="founded">按{ typeTab === RI_FACILITY_TYPE ? '投运年份' : '成立年份'}</option>}
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(139,92,246,0.18)' : 'var(--bg-base)', color: on ? '#a78bfa' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
            </div>
            <p className="text-[11px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
              {typeTab} · 命中 {filtered.length} / {tabList.length} 所 · {RESEARCH_INSTITUTE_META.scope}
            </p>
          </Card>

          {view === 'stats' ? (
            <Grid cols={2}>
              <Card title="研究领域"><DistBar data={distField.slice(0, 12)} onPick={(k) => setField(field === k ? '' : k)} active={field} /></Card>
              <Card title={typeTab === RI_FACILITY_TYPE ? '运行状态' : '实验室层级'}><DistBar data={distTier} color={typeTab === RI_FACILITY_TYPE ? '#22c55e' : '#e8a317'} onPick={(k) => setTier(tier === k ? '' : k)} active={tier} /></Card>
            </Grid>
          ) : (
            <div className="talent-split talent-split--list-detail mb-4">
              <Card title={`检索结果 (${filtered.length}/${tabList.length})`} asSection={false} className="talent-split__list-card">
                {view === 'grid' ? (
                  <div className="talent-split__scroll grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))' }}>
                    {filtered.map((r) => <InstCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} dense />)}
                    {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                  </div>
                ) : (
                  <div className="talent-split__scroll space-y-1.5">
                    {filtered.map((r) => <InstCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} />)}
                    {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                  </div>
                )}
              </Card>
              <div className="talent-split__detail">
              <Card title={detail ? `${detail.name} · 详情` : '选择一所'} asSection={false}>
                {detail && (
                  <TalentDetailPanel
                    name={detail.name}
                    subtitle={isPrivate(detail)
                      ? `${detail.parentCompany || ''} · ${detail.field || ''}`
                      : isFacility(detail)
                        ? `${detail.parentCompany || ''} · ${detail.field || ''} · ${short(detail.province) || detail.province || ''}`
                        : `${detail.field || ''} · ${short(detail.province) || detail.province || ''}`}
                    avatar={<FigureAvatar {...figureAvatarProps(detail)} size={56} ring eager />}
                    badges={(
                      <>
                        <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: isPrivate(detail) ? 'rgba(34,211,238,0.12)' : isFacility(detail) ? 'rgba(232,163,23,0.12)' : 'rgba(139,92,246,0.12)', color: isPrivate(detail) ? '#22d3ee' : isFacility(detail) ? '#e8a317' : '#a78bfa' }}>{detail.type}</span>
                        {isFacility(detail) && detail.tier && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: `${statusColor(detail.tier)}22`, color: statusColor(detail.tier) }}>{detail.tier}</span>}
                        {!isFacility(detail) && detail.tier && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>{detail.tier}</span>}
                        {detail.tags && detail.tags.split(',').slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>{tag.trim()}</span>
                        ))}
                      </>
                    )}
                    sections={isPrivate(detail) ? [
                      {
                        title: '基本信息',
                        fields: [
                          { label: '类型', value: detail.type, accent: '#22d3ee' },
                          { label: '母公司', value: detail.parentCompany, accent: '#22d3ee' },
                          { label: '研发方向', value: detail.field },
                          { label: '总部/省份', value: detail.province },
                          { label: '组织层级', value: detail.tier, accent: '#e8a317' },
                        ],
                      },
                      {
                        title: '研发规模',
                        fields: [
                          { label: '成立年份', value: detail.founded },
                          { label: '规模提示', value: detail.scale },
                          { label: '截至', value: detail.asOf },
                        ],
                      },
                      ...(detail.notes ? [{ title: '分析备注', content: <ExpandableText text={detail.notes} maxLen={160} /> }] : []),
                      { title: '关联标签', fields: [{ label: '标签', value: detail.tags }, { label: '来源', value: detail.source }] },
                    ] : isFacility(detail) ? [
                      {
                        title: '基本信息',
                        fields: [
                          { label: '类型', value: detail.type, accent: '#e8a317' },
                          { label: '科学领域', value: detail.field },
                          { label: '所在省份', value: detail.province },
                          { label: '运行状态', value: detail.tier, accent: statusColor(detail.tier) },
                          { label: '依托单位', value: detail.parentCompany, accent: '#e8a317' },
                        ],
                      },
                      {
                        title: '能力与规模',
                        fields: [
                          { label: '投运/建成', value: detail.founded },
                          { label: '能力概要', value: detail.scale },
                          { label: '截至', value: detail.asOf },
                        ],
                      },
                      ...(detail.notes ? [{ title: '分析备注', content: <ExpandableText text={detail.notes} maxLen={160} /> }] : []),
                      { title: '关联标签', fields: [{ label: '标签', value: detail.tags }, { label: '来源', value: detail.source }] },
                    ] : [
                      {
                        title: '基本信息',
                        fields: [
                          { label: '类型', value: detail.type, accent: '#a78bfa' },
                          { label: '领域', value: detail.field },
                          { label: '总部/省份', value: detail.province },
                          { label: '实验室层级', value: detail.tier, accent: '#e8a317' },
                        ],
                      },
                      {
                        title: '机构实力',
                        fields: [
                          { label: '重点实验室', value: detail.keyLabs != null ? `${detail.keyLabs} 个` : null },
                          { label: '截至', value: detail.asOf },
                        ],
                      },
                      ...(detail.notes ? [{ title: '备注', content: <ExpandableText text={detail.notes} maxLen={120} /> }] : []),
                      { title: '关联标签', fields: [{ label: '来源', value: detail.source }] },
                    ]}
                    queueNote={isPrivate(detail)
                      ? '// 企业级研发载体 · 国家战略科技力量的民间补充节点'
                      : isFacility(detail)
                        ? '// 大科学装置 · 国家创新体系基础设施 · 国家战略科技力量物理锚点'
                        : '// 国家战略科技力量 · 中科院/国家实验室/部属与行业院所'}
                  />
                )}
              </Card>
              </div>
            </div>
          )}
        </>
      )}

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        数据来源：{RESEARCH_INSTITUTE_META.sources.join('、')} · {RESEARCH_INSTITUTE_META.notes} · 研究参考
      </p>
    </section>
  );
}
