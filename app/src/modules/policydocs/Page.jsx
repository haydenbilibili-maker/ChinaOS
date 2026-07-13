import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import { IntroCard, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import DocumentViewer, { ReadDocumentButton } from '../shared/DocumentViewer.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { useDocs } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import { hasEmbeddedBody } from '../../lib/doc/documentContent.js';
import { loadPolicyCorpusManifest, corpusListBadge } from '../../lib/doc/policyCorpus.js';
import { DOC_SEED, GWR_METRICS, DOC_CATALOG_META, TYPE_COLOR, CATEGORY_COLOR, DOC_TYPES, DOC_CATEGORIES } from '../../lib/db/docSeed.js';
import { LEGAL_STATUTE_DEDUPED_COUNT } from '../../lib/db/legalStatuteSeed.js';
import LegalCorpusSection from './LegalCorpusSection.jsx';

const CORPUS_TABS = [
  { id: 'policy', label: '政策文件', count: DOC_CATALOG_META.total, accent: '#c41e3a' },
  { id: 'legal', label: '法律条文', count: LEGAL_STATUTE_DEDUPED_COUNT.total, accent: '#8b5cf6' },
];

const TYPES = ['全部', ...DOC_TYPES];
const CATEGORIES = ['全部', ...DOC_CATEGORIES];
const TABS = [['browse', '文件浏览'], ['compare', '历年比对'], ['trend', '指标趋势'], ['insight', '政策洞察']];
const DETAIL_TABS = [['summary', '概要'], ['read', '阅读全文']];
const tabBtn = (a) => ({ background: a ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: a ? 'var(--chip-active-text)' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '6px 14px', fontSize: 13 });
const detailTabBtn = (active) => ({
  background: active ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)',
  color: active ? 'var(--chip-active-text)' : 'var(--text-secondary)',
  border: `1px solid ${active ? 'var(--china-red)' : 'transparent'}`,
  cursor: 'pointer',
  borderRadius: 6,
  padding: '5px 12px',
  fontSize: 12,
});
const pill = (c) => ({ fontSize: 10, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 12, border: `1px solid ${c}55`, background: `${c}14`, color: c });
const fmt = (v, u) => (v == null ? '—' : `${v}${u || ''}`);

// 关键提法首入年份（扫描全部文件 keywords，取最早出现年）
function firstSeen(docs) {
  const m = new Map();
  [...docs].sort((a, b) => a.year - b.year).forEach((d) => (d.keywords || []).forEach((k) => { if (!m.has(k)) m.set(k, d.year); }));
  return m;
}

function MetricTable({ a, b }) {
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
      {GWR_METRICS.map((m, i) => {
        const va = a?.metrics?.[m.key], vb = b?.metrics?.[m.key];
        const delta = (typeof va === 'number' && typeof vb === 'number') ? Math.round((va - vb) * 100) / 100 : null;
        const dc = delta == null || delta === 0 ? 'var(--text-tertiary)' : delta > 0 ? '#10b981' : '#c41e3a';
        return (
          <div key={m.key} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 0.8fr', borderTop: i ? '1px solid var(--border-subtle)' : 'none', fontSize: 12.5, alignItems: 'center' }}>
            <div style={{ padding: '9px 12px', color: 'var(--text-secondary)' }}>{m.label}<span className="mono ml-1" style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>{m.unit}</span></div>
            <div style={{ padding: '9px 12px', color: 'var(--text-primary)', borderLeft: '1px solid var(--border-subtle)' }}>{fmt(va)}</div>
            <div style={{ padding: '9px 12px', color: 'var(--text-primary)', borderLeft: '1px solid var(--border-subtle)' }}>{fmt(vb)}</div>
            <div className="mono" style={{ padding: '9px 12px', color: dc, borderLeft: '1px solid var(--border-subtle)' }}>{delta == null ? '—' : (delta > 0 ? `▲${delta}` : delta < 0 ? `▼${Math.abs(delta)}` : '＝')}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function Page() {
  const docs = useDocs();
  const [searchParams, setSearchParams] = useSearchParams();
  const corpusTab = searchParams.get('tab') === 'legal' ? 'legal' : 'policy';
  const setCorpusTab = (id) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams();
      if (id === 'legal') next.set('tab', 'legal');
      const sel = prev.get('sel') || prev.get('id');
      if (sel) next.set('sel', sel);
      return next;
    }, { replace: true });
  };
  const [tab, setTab] = useState('browse');
  const [typeF, setTypeF] = useState('全部');
  const [catF, setCatF] = useState('全部');
  const [selId, setSelId] = useState(() => searchParams.get('sel') || searchParams.get('id') || null);
  const [aId, setAId] = useState('gwr-2024');
  const [bId, setBId] = useState('gwr-2025');
  const [metric, setMetric] = useState('gdpTarget');
  const [loading, setLoading] = useState(false);
  const [corpusIds, setCorpusIds] = useState(new Set());
  const [corpusTiers, setCorpusTiers] = useState({});
  const [corpusCount, setCorpusCount] = useState(0);
  const readerOpen = searchParams.get('view') === 'read';
  const detailTab = readerOpen ? 'read' : 'summary';

  const openReader = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (selId) next.set('sel', selId);
      next.set('view', 'read');
      return next;
    }, { replace: true });
  }, [selId, setSearchParams]);

  const closeReader = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('view');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setDetailTab = useCallback((k) => {
    if (k === 'read') openReader();
    else closeReader();
  }, [openReader, closeReader]);

  const loadSeed = async () => {
    setLoading(true);
    await DB.clearDocs();
    let ts = Date.now();
    for (const d of DOC_SEED) await DB.putDoc({ ...d, updatedAt: ts++ });
    setLoading(false);
  };

  const all = docs || [];
  const gwr = useMemo(() => all.filter((d) => d.type === '政府工作报告').sort((a, b) => a.year - b.year), [all]);
  const firstMap = useMemo(() => firstSeen(all), [all]);
  const list = useMemo(() => all.filter((d) => {
    if (typeF !== '全部' && d.type !== typeF) return false;
    if (catF !== '全部' && d.category !== catF) return false;
    return true;
  }), [all, typeF, catF]);
  const typeCounts = useMemo(() => {
    const m = {};
    for (const d of all) m[d.type] = (m[d.type] || 0) + 1;
    return m;
  }, [all]);
  const catCounts = useMemo(() => {
    const m = {};
    for (const d of all) if (d.category) m[d.category] = (m[d.category] || 0) + 1;
    return m;
  }, [all]);
  const sel = all.find((d) => d.id === selId) || list[0] || null;
  const selHasCorpus = sel?.id ? corpusIds.has(sel.id) : false;
  const docA = all.find((d) => d.id === aId) || null;
  const docB = all.find((d) => d.id === bId) || null;

  useEffect(() => {
    loadPolicyCorpusManifest()
      .then((m) => {
        const ids = new Set();
        const tiers = {};
        Object.values(m.entries || {}).forEach((e) => {
          if (e.corpusFile) {
            ids.add(e.id);
            tiers[e.id] = e.corpusTier || 'full';
          }
        });
        setCorpusIds(ids);
        setCorpusTiers(tiers);
        setCorpusCount(m.corpusCount || ids.size);
      })
      .catch(() => { /* manifest optional */ });
  }, []);

  useEffect(() => {
    if (corpusTab !== 'policy') return;
    const deep = searchParams.get('sel') || searchParams.get('id');
    if (deep) {
      setSelId(deep);
      setTab('browse');
    }
  }, [searchParams, corpusTab]);

  if (corpusTab === 'legal') {
    return (
      <div>
        <PageHeader badge="Sim · 政令文库" title="政令文库 · 政策文件与法律条文"
          subtitle={`政策语料 ${DOC_CATALOG_META.total} 份 · 法律语料 ${LEGAL_STATUTE_DEDUPED_COUNT.total} 部 —— 结构化要点 / 本地原文库 / 交叉检索`} />
        <div className="flex gap-2 mb-6 flex-wrap">
          {CORPUS_TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setCorpusTab(t.id)}
              className="text-sm px-4 py-2 rounded mono font-semibold"
              style={{
                background: corpusTab === t.id ? `${t.accent}22` : 'var(--bg-elevated)',
                color: corpusTab === t.id ? t.accent : 'var(--text-secondary)',
                border: corpusTab === t.id ? `1px solid ${t.accent}66` : '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}>
              {t.label}({t.count})
            </button>
          ))}
        </div>
        <LegalCorpusSection />
        <ModuleFooter moduleId="policydocs" disclaimer="政策与法律语料均为公开发布文件的结构化要点综合；旗舰条目提供本地原文存档。正式引用请以官方发布文本为准。" />
      </div>
    );
  }

  if (docs === null) return <div className="py-20 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载政策文件库…</div>;

  const years = all.map((d) => d.year);
  const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '—';

  // 指标趋势图
  const mMeta = GWR_METRICS.find((m) => m.key === metric);
  const trendOption = {
    grid: { left: 44, right: 18, top: 16, bottom: 26 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: gwr.map((d) => d.year), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
    yAxis: { type: 'value', name: mMeta?.unit, nameTextStyle: { color: '#5b6a82' }, axisLabel: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 7, connectNulls: false, data: gwr.map((d) => d.metrics?.[metric] ?? null), lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' }, label: { show: true, color: '#93a1b5', fontSize: 10 } }],
  };

  // 洞察：货币/财政定调时间线 + 关键转折
  const stanceTimeline = gwr.map((d) => ({ year: d.year, monetary: d.stance?.monetary || '', fiscal: d.stance?.fiscal || '' }));
  const notableFirsts = ['碳达峰碳中和', '新质生产力', '提振消费', '适度宽松', '人工智能+', '高质量发展', '六保'].map((k) => [k, firstMap.get(k)]).filter(([, y]) => y);

  return (
    <div>
      <PageHeader badge="Sim · 政令文库" title="政令文库 · 政策文件与法律条文"
        subtitle={`政策语料 ${DOC_CATALOG_META.total} 份 · 法律语料 ${LEGAL_STATUTE_DEDUPED_COUNT.total} 部 —— 报告比对 / 指标趋势 / 提法变迁 / 法律检索`} />

      <div className="flex gap-2 mb-6 flex-wrap">
        {CORPUS_TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setCorpusTab(t.id)}
            className="text-sm px-4 py-2 rounded mono font-semibold"
            style={{
              background: corpusTab === t.id ? `${t.accent}22` : 'var(--bg-elevated)',
              color: corpusTab === t.id ? t.accent : 'var(--text-secondary)',
              border: corpusTab === t.id ? `1px solid ${t.accent}66` : '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}>
            {t.label}({t.count})
          </button>
        ))}
      </div>

      <IntroCard>
        以<strong style={{ color: 'var(--text-primary)' }}>结构化要点 + 本地原文库</strong>支撑政策研读：政府工作报告、中央经济工作会议、五年规划等支持历年比对与指标趋势；旗舰文件已入库
        {' '}<span className="mono" style={{ color: '#10b981' }}>{corpusCount || 0}</span> 份扩展原文/节选，其余提供要点汇编 fallback。数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>2026-06-27</span>。
      </IntroCard>

      <StatGrid className="mb-6">
        <Stat value={all.length} label="文件总数" accent="#22d3ee" />
        <Stat value={gwr.length} label="政府工作报告" accent="#c41e3a" />
        <Stat value={span} label="覆盖年份" accent="#e8a317" />
        <Stat value={new Set(all.map((d) => d.type)).size} label="文件类型" accent="#10b981" />
      </StatGrid>
      {all.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-4">
          {Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([t, n]) => (
            <span key={t} className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: `${TYPE_COLOR[t] || '#64748b'}18`, color: TYPE_COLOR[t] || '#64748b', border: `1px solid ${TYPE_COLOR[t] || '#64748b'}33` }}>{t} {n}</span>
          ))}
        </div>
      )}

      {all.length < DOC_SEED.length && (
        <Card title="载入内置政策文件库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            内置 {DOC_SEED.length} 份公开要点（{Object.entries(DOC_CATALOG_META.breakdown).filter(([, n]) => n).map(([k, n]) => `${k} ${n}`).join(' · ')}）。来源：{DOC_CATALOG_META.sources.join('、')}。也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座 · 政策文件</Link> 粘贴上传与解析新文件。
          </p>
          <button onClick={loadSeed} disabled={loading} style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>
            {loading ? '载入中…' : `载入 ${DOC_SEED.length} 份文件`}
          </button>
        </Card>
      )}

      {all.length > 0 && (
        <>
          <div className="flex gap-1 flex-wrap mb-4">
            {TABS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} style={tabBtn(k === tab)} className="mono">{l}</button>)}
          </div>

          {/* 文件浏览 */}
          {tab === 'browse' && (
            <div className="grid gap-4" style={{ gridTemplateColumns: '300px 1fr' }}>
              <Card title={`文件列表 (${list.length})`}>
                <div className="flex gap-1 flex-wrap mb-2">
                  {TYPES.map((t) => <button key={t} onClick={() => setTypeF(t)} className="text-[11px] mono px-2 py-0.5 rounded-full" style={{ background: t === typeF ? 'rgba(34,211,238,0.18)' : 'var(--bg-elevated)', color: t === typeF ? 'var(--cyber-cyan)' : 'var(--text-secondary)', border: `1px solid ${t === typeF ? 'var(--cyber-cyan)' : 'transparent'}`, cursor: 'pointer' }}>{t}{t !== '全部' && typeCounts[t] ? ` (${typeCounts[t]})` : ''}</button>)}
                </div>
                <div className="flex gap-1 flex-wrap mb-3">
                  {CATEGORIES.map((c) => <button key={c} onClick={() => setCatF(c)} className="text-[10px] mono px-2 py-0.5 rounded-full" style={{ background: c === catF ? `${CATEGORY_COLOR[c] || 'var(--cyber-cyan)'}22` : 'var(--bg-elevated)', color: c === catF ? (CATEGORY_COLOR[c] || 'var(--cyber-cyan)') : 'var(--text-tertiary)', border: `1px solid ${c === catF ? (CATEGORY_COLOR[c] || 'var(--cyber-cyan)') : 'transparent'}`, cursor: 'pointer' }}>{c}{c !== '全部' && catCounts[c] ? ` ${catCounts[c]}` : ''}</button>)}
                </div>
                <div className="space-y-1.5" style={{ maxHeight: 520, overflowY: 'auto' }}>
                  {list.map((d) => {
                    const on = sel?.id === d.id; const c = TYPE_COLOR[d.type] || '#64748b';
                    return (
                      <button key={d.id} onClick={() => {
                        setSelId(d.id);
                        setSearchParams((prev) => {
                          const next = new URLSearchParams(prev);
                          next.set('sel', d.id);
                          if (prev.get('view') === 'read') next.set('view', 'read');
                          else next.delete('view');
                          return next;
                        }, { replace: true });
                      }} className="w-full text-left px-3 py-2 rounded" style={{ background: on ? 'rgba(196,30,58,0.14)' : 'var(--bg-elevated)', border: `1px solid ${on ? 'var(--china-red)' : 'transparent'}`, borderLeft: `3px solid ${c}`, cursor: 'pointer' }}>
                        <div className="flex items-center gap-2">
                          <span className="mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{d.year}</span>
                          <span style={pill(c)}>{d.type}</span>
                          {corpusIds.has(d.id) && (() => {
                            const b = corpusListBadge(corpusTiers[d.id]);
                            return b ? <span style={pill(b.color)}>{b.text}</span> : null;
                          })()}
                        </div>
                        <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>{d.title}</div>
                      </button>
                    );
                  })}
                </div>
              </Card>
              <Card title={sel ? sel.title : '选择一份文件'}>
                {sel && (
                  <>
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <div className="flex gap-1 flex-wrap">
                        {DETAIL_TABS.map(([k, l]) => (
                          <button key={k} type="button" onClick={() => setDetailTab(k)} style={detailTabBtn(detailTab === k)} className="mono">{l}</button>
                        ))}
                      </div>
                      {detailTab === 'summary' && (
                        <ReadDocumentButton
                          onClick={openReader}
                          hasBody={hasEmbeddedBody(sel, 'policy')}
                          hasCorpus={selHasCorpus}
                        />
                      )}
                    </div>

                    {detailTab === 'read' ? (
                      <div className="hidden md:block" style={{ height: 520 }}>
                        <DocumentViewer
                          record={sel}
                          kind="policy"
                          open={readerOpen}
                          onClose={closeReader}
                          mode="inline"
                        />
                      </div>
                    ) : (
                      <>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span style={pill(TYPE_COLOR[sel.type] || '#64748b')}>{sel.type}</span>
                      {sel.category && <span style={pill(CATEGORY_COLOR[sel.category] || '#64748b')}>{sel.category}</span>}
                      <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{sel.org} · {sel.date} · 来源 {sel.source}</span>
                    </div>
                    {sel.stance && (
                      <div className="flex gap-2 flex-wrap mb-3">
                        {sel.stance.fiscal && <span className="text-[11px] px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: '#e8a317' }}>财政：{sel.stance.fiscal}</span>}
                        {sel.stance.monetary && <span className="text-[11px] px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: '#22d3ee' }}>货币：{sel.stance.monetary}</span>}
                      </div>
                    )}
                    {sel.metrics && Object.values(sel.metrics).some((v) => v != null) && (
                      <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))' }}>
                        {GWR_METRICS.filter((m) => sel.metrics[m.key] != null).map((m) => (
                          <div key={m.key} className="px-2.5 py-2 rounded" style={{ background: 'var(--bg-elevated)' }}>
                            <div className="text-base font-bold mono" style={{ color: 'var(--text-primary)' }}>{sel.metrics[m.key]}<span className="text-[10px] ml-0.5" style={{ color: 'var(--text-tertiary)' }}>{m.unit}</span></div>
                            <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {sel.tasks && (
                      <div className="mb-3"><div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>重点任务（按序）</div>
                        <ol className="space-y-1">{sel.tasks.map((t, i) => <li key={i} className="text-xs flex gap-2" style={{ color: 'var(--text-secondary)' }}><span className="mono" style={{ color: 'var(--china-red)' }}>{String(i + 1).padStart(2, '0')}</span>{t}</li>)}</ol>
                      </div>
                    )}
                    <div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>要点</div>
                    <ul className="space-y-1.5 mb-3">{(sel.highlights || []).map((h, i) => <li key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', borderLeft: '2px solid var(--cyber-cyan)', paddingLeft: 8 }}>{h}</li>)}</ul>
                    <div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>关键提法</div>
                    <div className="flex flex-wrap gap-1.5">{(sel.keywords || []).map((k) => {
                      const fy = firstMap.get(k); const isNew = fy === sel.year;
                      return <span key={k} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: isNew ? 'rgba(16,185,129,0.16)' : 'var(--bg-elevated)', color: isNew ? '#10b981' : 'var(--text-secondary)' }}>{k}{isNew ? ' ·首入' : ''}</span>;
                    })}</div>
                      </>
                    )}
                  </>
                )}
              </Card>
            </div>
          )}

          {tab === 'browse' && readerOpen && sel && (
            <div className="md:hidden">
              <DocumentViewer
                record={sel}
                kind="policy"
                open={readerOpen}
                onClose={closeReader}
                mode="overlay"
              />
            </div>
          )}

          {/* 历年比对 */}
          {tab === 'compare' && (
            <div>
              <div className="flex gap-2 items-center flex-wrap mb-4">
                <select value={aId} onChange={(e) => setAId(e.target.value)} style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 }}>
                  {all.map((d) => <option key={d.id} value={d.id}>{d.year} · {d.type}</option>)}
                </select>
                <span className="mono" style={{ color: 'var(--text-tertiary)' }}>对比</span>
                <select value={bId} onChange={(e) => setBId(e.target.value)} style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 }}>
                  {all.map((d) => <option key={d.id} value={d.id}>{d.year} · {d.type}</option>)}
                </select>
              </div>
              {docA && docB && (
                <>
                  <Grid cols={2} className="mb-4">
                    {[docA, docB].map((d, idx) => (
                      <div key={idx} className="os-card p-4" style={{ borderLeft: `3px solid ${TYPE_COLOR[d.type] || '#64748b'}` }}>
                        <div className="flex items-center gap-2 mb-1"><span className="mono font-semibold" style={{ color: 'var(--text-primary)' }}>{d.year}</span><span style={pill(TYPE_COLOR[d.type] || '#64748b')}>{d.type}</span></div>
                        <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d.title}</div>
                        {d.stance && <div className="text-[11px] mt-2" style={{ color: 'var(--text-secondary)' }}>财政：{d.stance.fiscal}<br />货币：{d.stance.monetary}</div>}
                      </div>
                    ))}
                  </Grid>
                  {(docA.metrics || docB.metrics) && (
                    <Card title="量化指标比对（左 A · 中 B · 右 Δ＝A−B）" className="mb-4"><MetricTable a={docA} b={docB} /></Card>
                  )}
                  <Grid cols={2}>
                    <Card title="新增提法（A 有 B 无）">
                      <div className="flex flex-wrap gap-1.5">
                        {(docA.keywords || []).filter((k) => !(docB.keywords || []).includes(k)).map((k) => <span key={k} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.16)', color: '#10b981' }}>+ {k}</span>)}
                        {!(docA.keywords || []).filter((k) => !(docB.keywords || []).includes(k)).length && <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>无差异</span>}
                      </div>
                    </Card>
                    <Card title="淡出提法（B 有 A 无）">
                      <div className="flex flex-wrap gap-1.5">
                        {(docB.keywords || []).filter((k) => !(docA.keywords || []).includes(k)).map((k) => <span key={k} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.14)', color: '#c41e3a' }}>− {k}</span>)}
                        {!(docB.keywords || []).filter((k) => !(docA.keywords || []).includes(k)).length && <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>无差异</span>}
                      </div>
                    </Card>
                  </Grid>
                </>
              )}
            </div>
          )}

          {/* 指标趋势 */}
          {tab === 'trend' && (
            <div>
              <div className="flex gap-1.5 flex-wrap mb-4">
                {GWR_METRICS.map((m) => <button key={m.key} onClick={() => setMetric(m.key)} className="text-xs mono px-3 py-1 rounded" style={{ background: metric === m.key ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: metric === m.key ? 'var(--chip-active-text)' : 'var(--text-secondary)', border: `1px solid ${metric === m.key ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer' }}>{m.label}</button>)}
              </div>
              <Card title={`政府工作报告 · ${mMeta?.label} 历年走势（${mMeta?.unit}）`} className="mb-4">
                <EChart option={trendOption} style={{ height: 300 }} />
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>// 缺口处为该年未设具体目标（如 2020 年未设 GDP 增速目标）。数值为公开要点综合。</p>
              </Card>
              <Card title="货币 / 财政政策定调时间线">
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
                  {stanceTimeline.map((s, i) => (
                    <div key={s.year} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', borderTop: i ? '1px solid var(--border-subtle)' : 'none', fontSize: 12, alignItems: 'center' }}>
                      <div className="mono" style={{ padding: '8px 12px', color: 'var(--text-primary)', fontWeight: 600 }}>{s.year}</div>
                      <div style={{ padding: '8px 12px', color: '#e8a317', borderLeft: '1px solid var(--border-subtle)' }}>{s.fiscal}</div>
                      <div style={{ padding: '8px 12px', color: '#22d3ee', borderLeft: '1px solid var(--border-subtle)' }}>{s.monetary}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* 政策洞察 */}
          {tab === 'insight' && (
            <div className="space-y-4">
              <Card title="关键转折 · 自动洞察">
                <div className="space-y-3">
                  {[
                    ['十五五规划纲要', '#a78bfa', '2026 年 3 月两会审议通过，明确新质生产力、统一大市场、生育支持等十五五开局重点任务排序。'],
                    ['货币政策定调转向', '#22d3ee', '2025 年货币政策由「稳健」改为「适度宽松」——自 2011 年以来首次，标志宏观调控全面转入扩张周期。'],
                    ['赤字率台阶式抬升', '#c41e3a', '赤字率 2.6%(2018) → 3%(2023/24) → 4%左右(2025)，财政空间被结构性打开，从「去杠杆」转向「稳增长」。'],
                    ['GDP 目标下台阶并留弹性', '#e8a317', '增速目标 6.5%(2018) → 5%左右(2023–26)，并改用区间/「左右」表述，从保速度转向重质量与稳就业。'],
                    ['内需 / 消费跃居首位', '#10b981', '2023 起「扩大内需」靠前，2025「大力提振消费」列首要任务——增长动力由投资外需转向消费内需。'],
                    ['新质生产力成主线', '#8b5cf6', '2024 首入报告即居首要任务，叠加「人工智能+」「未来产业」，供给侧主线从「调结构」转为「育新质」。'],
                  ].map(([t, c, d]) => (
                    <div key={t} className="os-card p-3" style={{ borderLeft: `3px solid ${c}` }}>
                      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="关键提法 · 首次进入年份（提法变迁）">
                <div className="flex flex-wrap gap-2">
                  {notableFirsts.sort((a, b) => a[1] - b[1]).map(([k, y]) => (
                    <span key={k} className="text-xs px-3 py-1.5 rounded" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                      <span className="mono mr-2" style={{ color: 'var(--cyber-cyan)' }}>{y}</span><span style={{ color: 'var(--text-primary)' }}>{k}</span>
                    </span>
                  ))}
                </div>
                <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>// 由各年文件关键提法自动归并的首入年份，反映政策话语的迭代节奏。</p>
              </Card>
            </div>
          )}
        </>
      )}

      <FrameworkTrio cards={[
        { title: '盐铁逻辑', subtitle: '财政定调 · 命脉控盘', body: '赤字率台阶式抬升、货币政策由「稳健」转「适度宽松」——财政空间被结构性打开，是宏观调控的当代盐铁专营。', pillars: [['赤字率', '4% 左右台阶。'], ['货币', '适度宽松首提。'], ['专项债', '基建压舱石。']] },
        { title: '摸石头方法论', subtitle: '提法 · 灰度 · 迭代', body: 'GDP 目标从保速度转向「左右」弹性表述；「新质生产力」「人工智能+」首入即居主线——政策话语的灰度试探与迭代节奏可量化追踪。', pillars: [['首入年', '提法变迁表。'], ['比对', '历年差异。'], ['洞察', '自动转折识别。']] },
        { title: '升级路径', subtitle: '从增长到质量', body: '内需/消费跃居首位、新质生产力成供给侧主线——增长动力由投资外需转向消费内需与原始创新。', pillars: [['消费', '首要任务。'], ['新质', '未来产业。'], ['双碳', '绿色转型。']] },
      ]} />

      <ModuleFooter moduleId="policydocs" disclaimer={`内容为公开发布文件的结构化要点综合；${corpusCount || 0} 份旗舰文件提供本地原文存档（其余为要点汇编 fallback）。量化数值以官方正式发布为准。${DOC_CATALOG_META.notes || ''}`} />
    </div>
  );
}
