import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, Grid, Stat } from '../../app/ui.jsx';
import { IntroCard, FrameworkTrio } from '../shared/ModuleParadigm.jsx';
import DocumentViewer, { ReadDocumentButton } from '../shared/DocumentViewer.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, LABEL } from '../shared/chartHelpers.js';
import { useLegalStatutes } from '../../lib/db/useDataset.js';
import { hasEmbeddedBody } from '../../lib/doc/documentContent.js';
import { loadLegalCorpusManifest, corpusListBadge } from '../../lib/doc/legalCorpus.js';
import {
  LEGAL_STATUTE_SEED_PKG,
  LEGAL_STATUTE_DEDUPED_COUNT,
  LEGAL_STATUTE_META,
  dedupeLegalStatute,
  LS_TYPE_MAP,
  LS_DOMAINS,
} from '../../lib/db/legalStatuteSeed.js';

const AS_OF = LEGAL_STATUTE_META.asOf;
const TYPE_COLOR = {
  law: '#c41e3a',
  admin_regulation: '#22d3ee',
  judicial_interpretation: '#8b5cf6',
};
const STATUS_COLOR = {
  现行有效: '#10b981',
  已修订: '#e8a317',
  已废止: '#64748b',
};
const TYPE_FILTERS = [['all', '全部'], ['law', '法律'], ['admin_regulation', '行政法规'], ['judicial_interpretation', '司法解释']];
const STATUS_FILTERS = ['全部', '现行有效', '已修订', '已废止'];

const pill = (c) => ({
  fontSize: 10, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 12,
  border: `1px solid ${c}55`, background: `${c}14`, color: c,
});

const chipBtn = (on, accent) => ({
  fontSize: 11, fontFamily: 'monospace', padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
  background: on ? `${accent}22` : 'var(--bg-elevated)',
  color: on ? accent : 'var(--text-secondary)',
  border: `1px solid ${on ? accent : 'var(--border-subtle)'}`,
});

export default function LegalCorpusSection() {
  const { rows, ready } = useLegalStatutes();
  const [searchParams, setSearchParams] = useSearchParams();
  const [typeF, setTypeF] = useState('all');
  const [domainF, setDomainF] = useState('全部');
  const [statusF, setStatusF] = useState('全部');
  const [query, setQuery] = useState('');
  const [selId, setSelId] = useState(searchParams.get('sel'));
  const [corpusIds, setCorpusIds] = useState(new Set());
  const [corpusTiers, setCorpusTiers] = useState({});
  const [corpusCount, setCorpusCount] = useState(0);

  useEffect(() => {
    loadLegalCorpusManifest()
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

  useEffect(() => {
    const sel = searchParams.get('sel');
    if (sel) setSelId(sel);
  }, [searchParams]);

  const all = useMemo(() => dedupeLegalStatute(rows || []).rows, [rows]);
  const seedTotal = LEGAL_STATUTE_SEED_PKG.rows.length;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((r) => {
      if (typeF !== 'all' && r.type !== typeF) return false;
      if (domainF !== '全部' && !(r.domain || []).includes(domainF)) return false;
      if (statusF !== '全部' && r.status !== statusF) return false;
      if (!q) return true;
      const hay = [r.title, r.issuer, r.summary, ...(r.domain || []), ...(r.keyArticles || [])].join(' ').toLowerCase();
      return q.split(/\s+/).every((t) => hay.includes(t));
    });
  }, [all, typeF, domainF, statusF, query]);

  const readerOpen = searchParams.get('view') === 'read';
  const sel = all.find((r) => r.id === selId) || list[0] || null;

  const selHasCorpus = sel?.id ? corpusIds.has(sel.id) : false;

  const typeCounts = useMemo(() => {
    const m = { law: 0, admin_regulation: 0, judicial_interpretation: 0 };
    all.forEach((r) => { if (m[r.type] != null) m[r.type] += 1; });
    return m;
  }, [all]);

  const domainCounts = useMemo(() => {
    const m = Object.fromEntries(LS_DOMAINS.map((d) => [d, 0]));
    all.forEach((r) => (r.domain || []).forEach((d) => { if (m[d] != null) m[d] += 1; }));
    return m;
  }, [all]);

  const typeChart = useMemo(() => ({
    grid: { left: 8, right: 8, top: 8, bottom: 8 },
    series: [{
      type: 'pie', radius: ['42%', '68%'],
      label: { color: LABEL.color, fontSize: 10 },
      data: Object.entries(typeCounts).map(([k, v]) => ({
        name: LS_TYPE_MAP[k], value: v,
        itemStyle: { color: TYPE_COLOR[k] },
      })),
    }],
  }), [typeCounts]);

  const domainChart = useMemo(() => ({
    grid: { left: 88, right: 16, top: 8, bottom: 24 },
    xAxis: { type: 'value', axisLabel: { color: LABEL.color }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    yAxis: {
      type: 'category',
      data: [...LS_DOMAINS].reverse(),
      axisLabel: { color: LABEL.color, fontSize: 10 },
      axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
    },
    series: [{
      type: 'bar', barWidth: 12,
      data: [...LS_DOMAINS].reverse().map((d) => domainCounts[d] || 0),
      itemStyle: { color: '#22d3ee', borderRadius: [0, 3, 3, 0] },
    }],
  }), [domainCounts]);

  if (!ready) {
    return <div className="py-20 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载法律条文库…</div>;
  }

  return (
    <div>
      <IntroCard>
        以<strong style={{ color: 'var(--text-primary)' }}>元数据索引 + 本地原文库</strong>支撑条文研读：覆盖宪法国家机构、民商、行政、刑事、经济、社会、环境、科技数据、国家安全九大领域。
        已入库 <span className="mono" style={{ color: '#10b981' }}>{corpusCount || 0}</span> 部规范原文（含法典节选），其余条目提供要点汇编 fallback。
        与「法治建设」模块互补——后者侧重制度红利与司法现代化态势，本库提供可检索的规范语料底座。数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={all.length || seedTotal} label="条文总数" accent="#c41e3a" />
        <Stat value={typeCounts.law || LEGAL_STATUTE_DEDUPED_COUNT.law} label="法律" accent="#c41e3a" />
        <Stat value={typeCounts.admin_regulation || LEGAL_STATUTE_DEDUPED_COUNT.admin_regulation} label="行政法规" accent="#22d3ee" />
        <Stat value={typeCounts.judicial_interpretation || LEGAL_STATUTE_DEDUPED_COUNT.judicial_interpretation} label="司法解释" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="规范类型分布"><EChart option={typeChart} style={{ height: 200 }} /></Card>
        <Card title="领域覆盖（条）"><EChart option={domainChart} style={{ height: 200 }} /></Card>
      </Grid>

      {all.length < seedTotal && (
        <Card title="数据集载入提示" className="mb-4">
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            内置种子 {seedTotal} 条规范要点。首次访问已自动播种至 IndexedDB；若数据不完整，可到
            {' '}<Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link>
            {' '}重新录入「法律条文库」存量队列。
          </p>
        </Card>
      )}

      <Card title="检索与筛选" className="mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索标题、制定机关、摘要、要点…"
          className="w-full mb-3 px-3 py-2 rounded text-sm mono"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
        />
        <div className="flex flex-wrap gap-2 mb-2">
          {TYPE_FILTERS.map(([k, l]) => (
            <button key={k} onClick={() => setTypeF(k)} style={chipBtn(typeF === k, TYPE_COLOR[k] || '#64748b')}>{l}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => setStatusF(s)} style={chipBtn(statusF === s, STATUS_COLOR[s] || '#64748b')}>{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setDomainF('全部')} style={chipBtn(domainF === '全部', '#e8a317')}>全部领域</button>
          {LS_DOMAINS.map((d) => (
            <button key={d} onClick={() => setDomainF(d)} style={chipBtn(domainF === d, '#22d3ee')}>
              {d} {domainCounts[d] || 0}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(280px, 320px) 1fr' }}>
        <Card title={`条文列表 (${list.length})`}>
          <div className="space-y-1.5" style={{ maxHeight: 560, overflowY: 'auto' }}>
            {list.map((r) => {
              const on = sel?.id === r.id;
              const c = TYPE_COLOR[r.type] || '#64748b';
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelId(r.id);
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set('sel', r.id);
                      if (prev.get('view') === 'read') next.set('view', 'read');
                      else next.delete('view');
                      return next;
                    }, { replace: true });
                  }}
                  className="w-full text-left px-3 py-2 rounded"
                  style={{
                    background: on ? 'rgba(196,30,58,0.12)' : 'var(--bg-elevated)',
                    border: `1px solid ${on ? 'var(--china-red)' : 'transparent'}`,
                    borderLeft: `3px solid ${c}`,
                    cursor: 'pointer',
                  }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={pill(c)}>{LS_TYPE_MAP[r.type]}</span>
                    <span style={pill(STATUS_COLOR[r.status] || '#64748b')}>{r.status}</span>
                    {corpusIds.has(r.id) && (() => {
                      const b = corpusListBadge(corpusTiers[r.id]);
                      return b ? <span style={pill(b.color)}>{b.text}</span> : null;
                    })()}
                  </div>
                  <div className="text-xs mt-1 leading-snug" style={{ color: 'var(--text-primary)' }}>{r.title}</div>
                  <div className="text-[10px] mono mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>{r.issuer} · {r.effectiveDate}</div>
                </button>
              );
            })}
            {list.length === 0 && (
              <p className="text-xs py-6 text-center" style={{ color: 'var(--text-tertiary)' }}>无匹配条文，请调整筛选条件。</p>
            )}
          </div>
        </Card>

        {readerOpen && sel ? (
          <Card title="原文阅读" className="hidden md:flex min-h-0 flex-col" style={{ minHeight: 560 }}>
            <div className="flex-1 min-h-0" style={{ height: 520 }}>
              <DocumentViewer
                record={sel}
                kind="legal"
                open={readerOpen}
                onClose={closeReader}
                mode="inline"
              />
            </div>
          </Card>
        ) : (
        <Card title="规范详情">
          {sel ? (
            <>
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div className="text-sm font-semibold leading-snug flex-1" style={{ color: 'var(--text-primary)' }}>{sel.title}</div>
                <ReadDocumentButton
                  onClick={openReader}
                  hasBody={hasEmbeddedBody(sel, 'legal')}
                  hasCorpus={selHasCorpus}
                />
              </div>
              {(sel.domain || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {(sel.domain || []).map((d) => (
                    <span key={d} style={pill('#22d3ee')}>{d}</span>
                  ))}
                </div>
              )}
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{sel.summary}</p>
              {sel.keyArticles?.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>核心条款 / 要点</div>
                  <ul className="space-y-1.5">
                    {sel.keyArticles.map((h) => (
                      <li key={h} className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', borderLeft: '2px solid var(--cyber-cyan)', paddingLeft: 8 }}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
              {sel.relatedPolicyLinks?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>关联模块</div>
                  <div className="flex flex-wrap gap-2">
                    {sel.relatedPolicyLinks.map((p) => (
                      <Link key={p} to={p} className="text-[11px] mono px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)', border: '1px solid rgba(34,211,238,0.25)' }}>
                        {p}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs py-6 text-center" style={{ color: 'var(--text-tertiary)' }}>从左侧列表选择一条规范查看摘要与要点。</p>
          )}
        </Card>
        )}
      </div>

      {/* 移动端全屏阅读 overlay */}
      {readerOpen && sel && (
        <div className="md:hidden">
          <DocumentViewer
            record={sel}
            kind="legal"
            open={readerOpen}
            onClose={closeReader}
            mode="overlay"
          />
        </div>
      )}

      <FrameworkTrio cards={[
        {
          key: 'salt', title: '盐铁逻辑', subtitle: '规范阀门',
          body: '法律与行政法规是国家意志的「硬编码」——市场准入、数据出境、国安审查等关键阀门，均以立法与备案审查固化。',
          pillars: [['立法', '人大立法权。'], ['行政', '国务院条例。'], ['司法', '统一裁判尺度。']],
        },
        {
          key: 'stone', title: '摸石头方法论', subtitle: '试点立法',
          body: '个人破产（深圳）、生成式AI暂行办法、自贸区制度创新——先行试点后以法律或行政法规固化，是法治建设的中国节奏。',
          pillars: [['试点', '特区/自贸试验。'], ['评估', '备案审查。'], ['固化', '上升为法律。']],
        },
        {
          key: 'path', title: '升级路径', subtitle: '依法治国',
          body: '从「有法可依」到「良法善治」：民法典法典化、数据三法并行、金融稳定法立法——规范密度与治理精度同步提升。',
          pillars: [['有法', '规范供给。'], ['善治', '执法司法。'], ['透明', '备案审查。']],
        },
      ]} />

    </div>
  );
}
