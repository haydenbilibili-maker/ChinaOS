import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat } from '../../app/ui.jsx';
import { useThinkTank } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  THINK_TANK_SEED_PKG,
  THINK_TANK_META,
  THINK_TANK_DEDUPED_COUNT,
  dedupeThinkTank,
  TT_TYPES,
} from '../../lib/db/thinkTankSeed.js';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps } from '../../lib/ui/figureAvatarResolve.js';
import TalentDetailPanel, { ExpandableText } from './TalentDetailPanel.jsx';
import { applyTalentEnrichment } from '../../lib/talent/talentEnrich.js';
import { buildTalentDetailSections, CrossRefLinks, InstitutionCard } from '../../lib/talent/detailSections.jsx';
import { buildDetailFooter } from '../../lib/talent/metadata.jsx';
import { useTalentDeepLink, findEntityInList } from '../../lib/talent/routing.js';

const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(34,211,238,0.14)', color: 'var(--cyber-cyan)', border: '1px solid rgba(34,211,238,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };
const TYPE_SHORT = { '国家级智库': '国家级', '高校智库': '高校', '社会智库': '社会', '部委智库': '部委' };

function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((r) => { const k = keyFn(r); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function DistBars({ data, color = '#22d3ee', max, onPick, active }) {
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

function TankCard({ r, on, onClick, dense = false }) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded"
      style={{
        background: on ? 'rgba(34,211,238,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${on ? 'var(--cyber-cyan)' : 'var(--border-subtle)'}`,
        cursor: 'pointer', padding: dense ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-2">
        <FigureAvatar {...figureAvatarProps(r)} size={dense ? 28 : 32} ring={on} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{TYPE_SHORT[r.type] || r.type}</span>
            {r.province && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>{short(r.province)}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{r.affiliation} · {r.focusAreas}</div>
        </div>
      </div>
    </button>
  );
}

export default function ThinkTankSection() {
  const { rows, ready } = useThinkTank();
  const [searchParams, setSearchParams] = useSearchParams();
  const ttParam = searchParams.get('tt');
  const [typeTab, setTypeTab] = useState(ttParam && TT_TYPES.includes(ttParam) ? ttParam : '国家级智库');
  const [q, setQ] = useState('');
  const [province, setProvince] = useState('');
  const [focus, setFocus] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const { list, typeCounts } = useMemo(() => {
    const { rows: deduped } = dedupeThinkTank(rows || []);
    const counts = Object.fromEntries(TT_TYPES.map((k) => [k, 0]));
    deduped.forEach((r) => { if (counts[r.type] != null) counts[r.type] += 1; });
    return { list: deduped, typeCounts: counts };
  }, [rows]);

  const tabList = useMemo(() => list.filter((r) => r.type === typeTab), [list, typeTab]);
  const provinces = useMemo(() => [...new Set(tabList.map((r) => r.province).filter(Boolean))].sort(), [tabList]);
  const focusAreas = useMemo(() => {
    const set = new Set();
    tabList.forEach((r) => (r.focusAreas || '').split('/').forEach((f) => { if (f.trim()) set.add(f.trim()); }));
    return [...set].sort();
  }, [tabList]);

  const filtered = useMemo(() => {
    const out = tabList.filter((r) => {
      const hay = [r.name, r.affiliation, r.focusAreas, r.tier, r.honors, r.province, r.notes, r.source].join(' ');
      const focusMatch = !focus || (r.focusAreas || '').includes(focus);
      return (!province || r.province === province) && focusMatch && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'province') out.sort((a, b) => (a.province || '').localeCompare(b.province || '', 'zh'));
    return out;
  }, [tabList, q, province, focus, sort]);

  const detail = useMemo(() => {
    if (sel) {
      const hit = filtered.find((r) => (r.id && sel.id ? r.id === sel.id : r.name === sel.name));
      if (hit) return hit;
    }
    return searchParams.get('id') ? null : (filtered[0] || null);
  }, [sel, filtered, searchParams]);

  const { selectEntity } = useTalentDeepLink({
    searchParams, setSearchParams, filtered, allList: list, sel, setSel, ready, preserveKeys: ['tt'],
  });

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (!idParam || !list.length) return;
    const hit = findEntityInList(list, idParam);
    if (hit?.type && hit.type !== typeTab) setTypeTab(hit.type);
  }, [searchParams, list, typeTab]);

  useEffect(() => {
    if (ttParam && TT_TYPES.includes(ttParam) && ttParam !== typeTab) setTypeTab(ttParam);
  }, [ttParam, typeTab]);

  useEffect(() => { setSel(null); }, [typeTab]);

  const distFocus = tally(filtered.flatMap((r) => (r.focusAreas || '').split('/').map((f) => f.trim()).filter(Boolean).map((f) => ({ r, f }))), (x) => x.f);
  const distProvince = tally(filtered, (r) => short(r.province) || r.province);

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖智库数据集（${THINK_TANK_DEDUPED_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...THINK_TANK_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const clearAll = () => { setQ(''); setProvince(''); setFocus(''); setSel(null); };
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

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载智库库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>
          <Lucide.Landmark size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>智库 · 政策研究节点</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            机构载体队列 · 国家级/高校/社会/部委智库 —— 内置 {THINK_TANK_DEDUPED_COUNT.total} 家，截至 {THINK_TANK_META.asOf}。聚焦政策研究与战略咨询的公开节点。
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px,1fr))' }}>
        {TT_TYPES.map((t) => <Stat key={t} value={typeCounts[t] || 0} label={TYPE_SHORT[t]} accent="#22d3ee" />)}
        <Stat value={focusAreas.length} label="研究领域" accent="#a78bfa" />
        <Stat value={filtered.length} label="当前命中" />
      </div>

      <div className="flex gap-1 flex-wrap mb-4">
        {TT_TYPES.map((t) => (
          <button key={t} type="button" onClick={() => {
            setTypeTab(t); setSel(null); clearAll();
            const next = new URLSearchParams(searchParams);
            next.set('tt', t); next.delete('id');
            setSearchParams(next, { replace: true });
          }}
            className={`text-sm px-3 py-1.5 mono os-filter-chip ${typeTab === t ? 'is-active' : ''}`}
            style={{ '--chip-accent': 'var(--cyber-cyan)' }}>
            {TYPE_SHORT[t]} ({typeCounts[t] ?? 0})
          </button>
        ))}
      </div>

      {list.length < 10 && (
        <Card title="一键载入智库库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（think-tank-2026-06），机构载体队列，与人物名录隔离。来源：{THINK_TANK_META.sources.slice(0, 4).join('、')}等。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${THINK_TANK_META.label}（${THINK_TANK_DEDUPED_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="智库队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置智库数据集。</p></Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="智库名称 / 隶属 / 研究领域" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={province} onChange={(e) => setProvince(e.target.value)} style={inp}><option value="">全部省份</option>{provinces.map((p) => <option key={p} value={p}>{short(p) || p}</option>)}</select>
              <select value={focus} onChange={(e) => setFocus(e.target.value)} style={inp}><option value="">全部领域</option>{focusAreas.map((f) => <option key={f} value={f}>{f}</option>)}</select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}><option value="name">按名称</option><option value="province">按省份</option></select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(34,211,238,0.18)' : 'var(--bg-base)', color: on ? 'var(--cyber-cyan)' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
            </div>
            <p className="text-[11px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
              {TYPE_SHORT[typeTab]} · 命中 {filtered.length} / {tabList.length} 家 · {THINK_TANK_META.scope}
            </p>
          </Card>

          {view === 'stats' ? (
            <Grid cols={2}>
              <Card title="研究领域"><DistBars data={distFocus.slice(0, 12)} onPick={(k) => setFocus(focus === k ? '' : k)} active={focus} /></Card>
              <Card title="省份"><DistBars data={distProvince.slice(0, 12)} color="#a78bfa" onPick={(k) => { const full = provinces.find((p) => short(p) === k); setProvince(province === full ? '' : full); }} active={short(province)} /></Card>
            </Grid>
          ) : view === 'grid' ? (
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', maxHeight: 620, overflowY: 'auto' }}>
              {filtered.map((r) => <TankCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} dense />)}
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
              <Card title={`${TYPE_SHORT[typeTab]} (${filtered.length}/${tabList.length})`}>
                <div className="space-y-1.5" style={{ maxHeight: 560, overflowY: 'auto' }}>
                  {filtered.map((r) => <TankCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} />)}
                </div>
              </Card>
              <Card title={detail ? `${detail.name} · 详情` : '选择一家'}>
                {detail && (() => {
                  const d = applyTalentEnrichment(detail, { queue: 'thinktank' });
                  return (
                  <TalentDetailPanel
                    name={d.name}
                    subtitle={`${d.affiliation || ''} · ${d.focusAreas || ''}`}
                    verifyRecord={d}
                    institutionCard={<InstitutionCard record={{ ...d, institution: d.name, type: d.type }} />}
                    crossLinks={<CrossRefLinks record={d} queue="thinktank" />}
                    avatar={<FigureAvatar {...figureAvatarProps(d)} size={56} ring eager />}
                    badges={<span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{TYPE_SHORT[d.type] || d.type}</span>}
                    sections={buildTalentDetailSections(d, {
                      queue: 'thinktank',
                      baseSections: [
                      {
                        title: '基本信息',
                        cols: 3,
                        fields: [
                          { label: '类型', value: d.type, accent: 'var(--cyber-cyan)' },
                          { label: '隶属', value: d.affiliation },
                          { label: '省份', value: d.province },
                          { label: '层级', value: d.tier, accent: '#e8a317' },
                        ],
                      },
                      {
                        title: '研究定位',
                        cols: 3,
                        fields: [
                          { label: '研究领域', value: d.focusAreas },
                          { label: '荣誉/定位', value: d.honors, accent: '#d4af37' },
                        ],
                      },
                      ...(d.notes ? [{ title: '备注', content: <ExpandableText text={d.notes} maxLen={120} /> }] : []),
                    ],
                    })}
                    queueNote="// 政策研究节点 · 国家级/高校/社会/部委智库"
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
        数据来源：{THINK_TANK_META.sources.join('、')} · {THINK_TANK_META.notes} · 研究参考
      </p>
    </section>
  );
}
