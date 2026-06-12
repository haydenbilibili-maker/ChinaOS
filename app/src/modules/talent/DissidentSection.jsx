import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat } from '../../app/ui.jsx';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps, prefetchFigureAvatars } from '../../lib/ui/figureAvatarResolve.js';
import EChart from '../../lib/viz/EChart.jsx';
import { useDissident } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  DISSIDENT_SEED_PKG,
  DISSIDENT_META,
  DISSIDENT_DEDUPED_COUNT,
  dedupeDissident,
  DV_SUB_CATS,
  DV_TAB_LABEL,
  dvKey,
} from '../../lib/db/dissidentSeed.js';
import { useTalentDeepLink, findEntityInList } from '../../lib/talent/routing.js';
import TalentDetailPanel from './TalentDetailPanel.jsx';

const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(139,92,246,0.14)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };
const ACCENT = '#a78bfa';
const STATUS_RANK = { 在押: 0, 监视居住: 1, 取保候审: 2, 流亡: 3, 已获释: 4, 已故: 5 };
const CAT_RANK = Object.fromEntries(DV_SUB_CATS.map((k, i) => [k, i]));

function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((r) => { const k = keyFn(r); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function preview(text, max = 52) {
  if (!text) return '';
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

function DistBars({ data, color = ACCENT, max, onPick, active }) {
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

function statusStyle(status) {
  if (status === '在押') return { background: 'rgba(196,30,58,0.12)', color: 'var(--china-red)' };
  if (status === '流亡') return { background: 'rgba(14,165,233,0.12)', color: '#0ea5e9' };
  if (status === '已故') return { background: 'var(--bg-base)', color: 'var(--text-tertiary)' };
  if (status === '已获释') return { background: 'rgba(16,185,129,0.12)', color: '#10b981' };
  return { background: 'rgba(232,163,23,0.12)', color: '#e8a317' };
}

function DissidentCard({ r, on, onClick, dense = false }) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded"
      style={{
        background: on ? 'rgba(139,92,246,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${on ? ACCENT : 'var(--border-subtle)'}`,
        cursor: 'pointer', padding: dense ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-2">
        <FigureAvatar {...figureAvatarProps(r)} size={dense ? 28 : 32} ring={on} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            {r.nameEn && <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{r.nameEn}</span>}
            <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: ACCENT }}>{DV_TAB_LABEL[r.category] || r.subCategory}</span>
            {r.status && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={statusStyle(r.status)}>{r.status}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {r.knownFor}{r.location ? ` · ${r.location}` : ''}
          </div>
          {r.field && (
            <div className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>{r.field}</div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function DissidentSection() {
  const { rows, ready } = useDissident();
  const [searchParams, setSearchParams] = useSearchParams();
  const dvParam = searchParams.get('dv');
  const [catTab, setCatTab] = useState(dvParam && DV_SUB_CATS.includes(dvParam) ? dvParam : '');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const { list, catCounts } = useMemo(() => {
    const { rows: deduped } = dedupeDissident(rows || []);
    const counts = Object.fromEntries(DV_SUB_CATS.map((k) => [k, 0]));
    deduped.forEach((r) => { if (counts[r.category] != null) counts[r.category] += 1; });
    return { list: deduped, catCounts: counts };
  }, [rows]);

  const tabList = useMemo(() => (catTab ? list.filter((r) => r.category === catTab) : list), [list, catTab]);

  const statuses = useMemo(() => [...new Set(tabList.map((r) => r.status).filter(Boolean))].sort((a, b) => (STATUS_RANK[a] ?? 9) - (STATUS_RANK[b] ?? 9)), [tabList]);
  const locations = useMemo(() => [...new Set(tabList.map((r) => r.location).filter(Boolean))].sort(), [tabList]);

  const filtered = useMemo(() => {
    const out = tabList.filter((r) => {
      const hay = [r.name, r.nameEn, r.background, r.field, r.knownFor, r.status, r.location, r.bio, r.tags, r.notes, r.subCategory, DV_TAB_LABEL[r.category]].join(' ');
      return (!status || r.status === status)
        && (!location || r.location === location)
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'status') out.sort((a, b) => (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9));
    else if (sort === 'category') out.sort((a, b) => (CAT_RANK[a.category] ?? 9) - (CAT_RANK[b.category] ?? 9));
    return out;
  }, [tabList, q, status, location, sort]);

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
    searchParams, setSearchParams, filtered, allList: list, sel, setSel, ready, preserveKeys: ['dv'],
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

  const inCustody = list.filter((r) => r.status === '在押').length;
  const exiled = list.filter((r) => r.status === '流亡').length;
  const released = list.filter((r) => r.status === '已获释').length;
  const deceased = list.filter((r) => r.status === '已故').length;
  const distStatus = tally(filtered, (r) => r.status);
  const distCat = tally(filtered, (r) => DV_TAB_LABEL[r.category] || r.category);
  const statusChart = distStatus.length ? {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 56, right: 16, top: 12, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { color: '#93a1b5', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    yAxis: { type: 'category', data: distStatus.map(([k]) => k).reverse(), axisLabel: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'bar', data: distStatus.map(([, n]) => n).reverse(), barWidth: 14, itemStyle: { color: ACCENT, borderRadius: [0, 3, 3, 0] } }],
  } : null;

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖异见人士数据集（${DISSIDENT_DEDUPED_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...DISSIDENT_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const setCat = (k) => {
    setCatTab(k);
    const next = new URLSearchParams(searchParams);
    if (k) next.set('dv', k);
    else next.delete('dv');
    setSearchParams(next, { replace: true });
  };

  const clearAll = () => { setQ(''); setStatus(''); setLocation(''); };
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    catTab && ['类别', DV_TAB_LABEL[catTab], () => setCat('')],
    status && ['状态', status, () => setStatus('')],
    location && ['所在地', location, () => setLocation('')],
  ].filter(Boolean);

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载异见人士库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(139,92,246,0.12)', color: ACCENT }}>
          <Lucide.Megaphone size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>异见人士 · 制度边界档案</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            公开记录中的异议表达者、维权者与制度边界案例；与政要/知识生产队列隔离 —— 内置 {DISSIDENT_DEDUPED_COUNT.total} 条，截至 {DISSIDENT_META.asOf}
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px,1fr))' }}>
        <Stat value={list.length} label="档案总数" accent={ACCENT} />
        <Stat value={inCustody} label="在押" accent="var(--china-red)" />
        <Stat value={exiled} label="流亡" accent="#0ea5e9" />
        <Stat value={released} label="已获释" accent="#10b981" />
        <Stat value={deceased} label="已故" accent="#64748b" />
        <Stat value={filtered.length} label="当前命中" />
      </div>

      <div className="flex gap-1.5 flex-wrap mb-4">
        <button type="button" onClick={() => setCat('')} className="text-[11px] mono px-2.5 py-1 rounded-full"
          style={{ background: !catTab ? 'rgba(139,92,246,0.2)' : 'var(--bg-elevated)', border: `1px solid ${!catTab ? ACCENT : 'var(--border-subtle)'}`, color: !catTab ? ACCENT : 'var(--text-secondary)', cursor: 'pointer' }}>
          全部 {list.length}
        </button>
        {DV_SUB_CATS.map((k) => (
          <button key={k} type="button" onClick={() => setCat(catTab === k ? '' : k)} className="text-[11px] mono px-2.5 py-1 rounded-full"
            style={{ background: catTab === k ? 'rgba(139,92,246,0.2)' : 'var(--bg-elevated)', border: `1px solid ${catTab === k ? ACCENT : 'var(--border-subtle)'}`, color: catTab === k ? ACCENT : 'var(--text-secondary)', cursor: 'pointer' }}>
            {DV_TAB_LABEL[k]} {catCounts[k] ?? 0}
          </button>
        ))}
      </div>

      {list.length < 10 && (
        <Card title="一键载入异见人士库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（dissent-voices-2026-06），与政要、知识精英、商业精英、反腐透视队列隔离。来源：{DISSIDENT_META.sources.slice(0, 4).join('、')}等。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${DISSIDENT_META.label}（${DISSIDENT_DEDUPED_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="异见人士队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置异见人士数据集。</p></Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 领域 / 案件 / 关键词" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inp}>
                <option value="">全部状态</option>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={location} onChange={(e) => setLocation(e.target.value)} style={inp}>
                <option value="">全部所在地</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="name">按姓名</option>
                <option value="status">按状态</option>
                <option value="category">按类别</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(139,92,246,0.18)' : 'var(--bg-base)', color: on ? ACCENT : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
              {list.length < DISSIDENT_DEDUPED_COUNT.total && (
                <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lucide.RefreshCw size={13} />{loading ? '载入中…' : `补全 ${DISSIDENT_DEDUPED_COUNT.total} 条`}
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
              {catTab ? DV_TAB_LABEL[catTab] : '全部类别'} · 命中 {filtered.length} / {tabList.length} 条 · ↑↓ 或 j/k 切换 · {DISSIDENT_META.scope}
            </p>
          </Card>

          {view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
                // 状态/类别分布基于当前筛选 {filtered.length} 条；制度边界档案统计口径
              </div>
              <Grid cols={2}>
                {statusChart && <Card title="状态分布"><EChart option={statusChart} style={{ height: Math.max(220, distStatus.length * 28) }} /></Card>}
                <Card title="类别（点选筛选）"><DistBars data={distCat} onPick={(k) => { const code = Object.entries(DV_TAB_LABEL).find(([, v]) => v === k)?.[0]; if (code) setCat(catTab === code ? '' : code); }} active={catTab ? DV_TAB_LABEL[catTab] : ''} /></Card>
              </Grid>
              <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>// 数据边界：{DISSIDENT_META.notes}</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', maxHeight: 620, overflowY: 'auto' }}>
              {filtered.map((r) => (
                <DissidentCard key={dvKey(r)} r={r} on={detail === r} onClick={() => selectEntity(r)} dense />
              ))}
              {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
              <Card title={`${catTab ? DV_TAB_LABEL[catTab] : '全部'} (${filtered.length}/${tabList.length})`}>
                <div className="space-y-1.5" style={{ maxHeight: 560, overflowY: 'auto' }}>
                  {filtered.map((r) => (
                    <DissidentCard key={dvKey(r)} r={r} on={detail === r} onClick={() => selectEntity(r)} />
                  ))}
                  {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                </div>
              </Card>

              <Card title={detail ? `${detail.name} · 档案详情` : '选择一位'}>
                {detail && (
                  <TalentDetailPanel
                    name={detail.name}
                    subtitle={detail.knownFor || detail.subCategory}
                    avatar={<FigureAvatar {...figureAvatarProps(detail)} size={56} ring eager />}
                    badges={(
                      <>
                        {detail.nameEn && <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{detail.nameEn}</span>}
                        <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: ACCENT }}>{DV_TAB_LABEL[detail.category] || detail.subCategory}</span>
                        {detail.status && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={statusStyle(detail.status)}>{detail.status}</span>}
                        {detail.tier && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>Tier {detail.tier}</span>}
                      </>
                    )}
                    tags={detail.tags ? detail.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean) : []}
                    tagAccent={ACCENT}
                    sections={[
                      {
                        title: '公开履历',
                        fields: [
                          { label: '背景', value: detail.background },
                          { label: '领域', value: detail.field },
                          { label: '制度语境', value: detail.knownFor, accent: ACCENT },
                          { label: '现状', value: detail.status, accent: detail.status === '在押' ? 'var(--china-red)' : undefined },
                          { label: '所在地', value: detail.location },
                        ],
                      },
                      {
                        title: '记录口径',
                        fields: [
                          { label: '档案摘要', value: detail.bio, span: 2 },
                          { label: '备注', value: detail.notes, span: 2, accent: '#e8a317' },
                        ],
                      },
                    ]}
                    timeline={detail.keyEvents}
                    timelineAccent={ACCENT}
                    queueNote="// 制度边界档案 · 公开记录口径 · 与反腐透视/政要队列隔离"
                    footer={(
                      <>
                        <span>来源：{detail.source || DISSIDENT_META.sources[0]}</span>
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
