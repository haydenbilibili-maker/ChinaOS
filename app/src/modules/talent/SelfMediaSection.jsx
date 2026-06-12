import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat } from '../../app/ui.jsx';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps, prefetchFigureAvatars } from '../../lib/ui/figureAvatarResolve.js';
import EChart from '../../lib/viz/EChart.jsx';
import { useSelfMedia } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  SELF_MEDIA_SEED_PKG,
  SELF_MEDIA_META,
  SELF_MEDIA_DEDUPED_COUNT,
  dedupeSelfMedia,
  SM_SUB_CATS,
  SM_TAB_LABEL,
  SM_PLATFORM_LABEL,
  SM_TIER_LABEL,
  smKey,
} from '../../lib/db/selfMediaSeed.js';
import { useTalentDeepLink, findEntityInList } from '../../lib/talent/routing.js';
import TalentDetailPanel, { ExpandableText } from './TalentDetailPanel.jsx';
import { applyTalentEnrichment } from '../../lib/talent/talentEnrich.js';
import { buildTalentDetailSections, CrossRefLinks, eventsToTimeline } from '../../lib/talent/detailSections.jsx';
import { buildDetailFooter, normalizeTags } from '../../lib/talent/metadata.jsx';

const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(244,114,182,0.14)', color: '#f472b6', border: '1px solid rgba(244,114,182,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };

const CAT_ACCENT = {
  politics: '#c41e3a', finance: '#eab308', tech: '#6366f1', culture: '#a78bfa',
  history: '#d4af37', military: '#556b2f', international: '#0ea5e9',
  lifestyle: '#22c55e', entertainment: '#f472b6',
};
const TIER_RANK = { S: 0, A: 1, B: 2, C: 3 };
const CAT_RANK = Object.fromEntries(SM_SUB_CATS.map((k, i) => [k, i]));

const TAB_DESC = {
  politics: '时政与国际关系评论类自媒体；公共议题传播节点，不含党政任命主身份者。',
  finance: '财经评论、商业观察、宏观策略与知识付费类传播者。',
  tech: '科技数码、科普教育与考研培训类视频/图文创作者。',
  culture: '文化访谈、知识传播、心理与出版类自媒体大V。',
  history: '历史讲述、人文科普与口述史类内容生产者。',
  military: '军事装备解读、国防议题评论类传播节点。',
  international: '国际关系解读、跨文化对比与海外华人自媒体。',
  lifestyle: '生活方式、美食、汽车、健身与直播带货类创作者。',
  entertainment: '脱口秀、游戏、音乐、明星与搞笑短视频类账号。',
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

function DistBars({ data, color = '#f472b6', max, onPick, active, labelFn = (k) => k }) {
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

function MediaCard({ r, on, onClick, dense = false }) {
  const accent = CAT_ACCENT[r.category] || '#f472b6';
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded"
      style={{
        background: on ? 'rgba(244,114,182,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${on ? '#f472b6' : 'var(--border-subtle)'}`,
        cursor: 'pointer', padding: dense ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-2">
        <FigureAvatar {...figureAvatarProps(r)} size={dense ? 28 : 32} ring={on} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: `${accent}22`, color: accent }}>{SM_TAB_LABEL[r.category]}</span>
            {r.platform && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{r.platform}</span>}
            {r.tier && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>{SM_TIER_LABEL[r.tier] || r.tier}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {r.niche}{r.followers ? ` · ${r.followers}` : ''}
          </div>
          {r.keyWorks && (
            <div className="text-[10px] mt-1 truncate" style={{ color: 'var(--cyber-cyan)', opacity: 0.85 }}>
              {preview(r.keyWorks)}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function SelfMediaSection() {
  const { rows, ready } = useSelfMedia();
  const [searchParams, setSearchParams] = useSearchParams();
  const smParam = searchParams.get('sm');
  const [catTab, setCatTab] = useState(smParam && SM_SUB_CATS.includes(smParam) ? smParam : 'politics');
  const [q, setQ] = useState('');
  const [platform, setPlatform] = useState('');
  const [niche, setNiche] = useState('');
  const [tier, setTier] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const { list, catCounts } = useMemo(() => {
    const { rows: deduped } = dedupeSelfMedia(rows || []);
    const counts = Object.fromEntries(SM_SUB_CATS.map((k) => [k, 0]));
    deduped.forEach((r) => { if (counts[r.category] != null) counts[r.category] += 1; });
    return { list: deduped, catCounts: counts };
  }, [rows]);

  const tabList = useMemo(() => list.filter((r) => r.category === catTab), [list, catTab]);
  const platforms = useMemo(() => [...new Set(tabList.map((r) => r.platformKey).filter(Boolean))].sort(), [tabList]);
  const niches = useMemo(() => [...new Set(tabList.map((r) => r.niche).filter(Boolean))].sort(), [tabList]);
  const tiers = useMemo(() => [...new Set(tabList.filter((r) => r.tier).map((r) => r.tier))].sort((a, b) => (TIER_RANK[a] ?? 9) - (TIER_RANK[b] ?? 9)), [tabList]);

  const filtered = useMemo(() => {
    const out = tabList.filter((r) => {
      const hay = [r.name, r.platform, r.niche, r.followers, r.bio, r.keyWorks, r.controversies, r.notes, r.source, r.tags].join(' ');
      return (!platform || r.platformKey === platform)
        && (!niche || r.niche === niche)
        && (!tier || r.tier === tier)
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'tier') out.sort((a, b) => (TIER_RANK[a.tier] ?? 9) - (TIER_RANK[b.tier] ?? 9));
    else if (sort === 'platform') out.sort((a, b) => (a.platform || '').localeCompare(b.platform || '', 'zh'));
    return out;
  }, [tabList, q, platform, niche, tier, sort]);

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
    searchParams, setSearchParams, filtered, allList: list, sel, setSel, ready,
    preserveKeys: ['sm'], keyFn: smKey,
  });

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (!idParam || !list.length) return;
    const hit = findEntityInList(list, idParam, { keyFn: smKey });
    if (hit?.category && SM_SUB_CATS.includes(hit.category) && hit.category !== catTab) setCatTab(hit.category);
  }, [searchParams, list, catTab]);

  useEffect(() => {
    if (smParam && SM_SUB_CATS.includes(smParam) && smParam !== catTab) setCatTab(smParam);
  }, [smParam, catTab]);

  const pickTab = (k) => {
    setCatTab(k);
    setSel(null);
    clearAll();
    const next = new URLSearchParams(searchParams);
    next.set('sm', k);
    next.delete('id');
    setSearchParams(next, { replace: true });
  };

  useEffect(() => { setSel(null); }, [catTab]);

  const distPlatform = tally(filtered, (r) => r.platformKey);
  const distNiche = tally(filtered, (r) => r.niche);
  const distTier = tally(filtered.filter((r) => r.tier), (r) => r.tier);

  const platformChart = {
    grid: { left: 72, right: 16, top: 12, bottom: 24 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    yAxis: { type: 'category', data: distPlatform.slice(0, 10).map(([k]) => SM_PLATFORM_LABEL[k] || k).reverse(), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'bar', data: distPlatform.slice(0, 10).map(([, n]) => n).reverse(), barWidth: 14, itemStyle: { color: '#f472b6', borderRadius: 3 } }],
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  };

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖自媒体人数据集（${SELF_MEDIA_DEDUPED_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...SELF_MEDIA_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const clearAll = () => { setQ(''); setPlatform(''); setNiche(''); setTier(''); setSel(null); };
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    platform && ['平台', SM_PLATFORM_LABEL[platform] || platform, () => setPlatform('')],
    niche && ['垂类', niche, () => setNiche('')],
    tier && ['影响力', SM_TIER_LABEL[tier] || tier, () => setTier('')],
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

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载自媒体人库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(244,114,182,0.12)', color: '#f472b6' }}>
          <Lucide.Megaphone size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>自媒体人 · 传媒影响力图谱</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            传播节点队列 · 平台 × 垂类 × 影响力分层 —— 内置 {SELF_MEDIA_DEDUPED_COUNT.total} 条（含自知识精英迁出 {SELF_MEDIA_DEDUPED_COUNT.migrated} 条），截至 {SELF_MEDIA_META.asOf}
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(88px,1fr))' }}>
        {SM_SUB_CATS.map((k) => (
          <Stat key={k} value={catCounts[k] ?? 0} label={SM_TAB_LABEL[k]} accent={CAT_ACCENT[k]} />
        ))}
        <Stat value={filtered.length} label="当前命中" accent="#f472b6" />
      </div>

      <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {TAB_DESC[catTab]}
      </p>

      <div className="flex gap-1 flex-wrap mb-4">
        {SM_SUB_CATS.map((k) => (
          <button key={k} type="button" onClick={() => pickTab(k)}
            className={`text-sm px-3 py-1.5 mono os-filter-chip ${catTab === k ? 'is-active' : ''}`}
            style={{ '--chip-accent': CAT_ACCENT[k] }}>
            {SM_TAB_LABEL[k]} ({catCounts[k] ?? 0})
          </button>
        ))}
      </div>

      {list.length < 10 && (
        <Card title="一键载入自媒体人库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（self-media-2026-06），与政要/知识精英/商业精英队列隔离。来源：{SELF_MEDIA_META.sources.slice(0, 4).join('、')}等。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${SELF_MEDIA_META.label}（${SELF_MEDIA_DEDUPED_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="传媒影响力队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置自媒体人数据集。</p></Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 平台 / 代表作 / 争议" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={inp}>
                <option value="">全部平台</option>
                {platforms.map((p) => <option key={p} value={p}>{SM_PLATFORM_LABEL[p] || p}</option>)}
              </select>
              <select value={niche} onChange={(e) => setNiche(e.target.value)} style={inp}>
                <option value="">全部垂类</option>
                {niches.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <select value={tier} onChange={(e) => setTier(e.target.value)} style={inp}>
                <option value="">全部影响力</option>
                {tiers.map((t) => <option key={t} value={t}>{SM_TIER_LABEL[t] || t}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="name">按名称</option>
                <option value="tier">按影响力</option>
                <option value="platform">按平台</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(244,114,182,0.18)' : 'var(--bg-base)', color: on ? '#f472b6' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
              {list.length < SELF_MEDIA_DEDUPED_COUNT.total && (
                <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lucide.RefreshCw size={13} />{loading ? '载入中…' : `补全 ${SELF_MEDIA_DEDUPED_COUNT.total} 条`}
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
              {SM_TAB_LABEL[catTab]} · 命中 {filtered.length} / {tabList.length} 条 · ↑↓ 或 j/k 切换 · {SELF_MEDIA_META.scope}
            </p>
          </Card>

          {view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <Grid cols={2}>
                <Card title="平台分布"><EChart option={platformChart} style={{ height: Math.max(220, distPlatform.slice(0, 10).length * 22) }} /></Card>
                <Card title="影响力层级"><DistBars data={distTier} color="#d4af37" onPick={(k) => setTier(tier === k ? '' : k)} active={tier} labelFn={(k) => SM_TIER_LABEL[k] || k} /></Card>
              </Grid>
              <Card title="垂类（点选筛选）"><DistBars data={distNiche.slice(0, 12)} onPick={(k) => setNiche(niche === k ? '' : k)} active={niche} /></Card>
            </div>
          ) : view === 'grid' ? (
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', maxHeight: 620, overflowY: 'auto' }}>
              {filtered.map((r) => (
                <MediaCard key={smKey(r)} r={r} on={detail === r} onClick={() => selectEntity(r)} dense />
              ))}
              {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
              <Card title={`${SM_TAB_LABEL[catTab]} (${filtered.length}/${tabList.length})`}>
                <div className="space-y-1.5" style={{ maxHeight: 560, overflowY: 'auto' }}>
                  {filtered.map((r) => (
                    <MediaCard key={smKey(r)} r={r} on={detail === r} onClick={() => selectEntity(r)} />
                  ))}
                  {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                </div>
              </Card>

              <Card title={detail ? `${detail.name} · 详情` : '选择一位'}>
                {detail && (() => {
                  const d = applyTalentEnrichment(detail, { queue: 'selfMedia' });
                  return (
                  <TalentDetailPanel
                    name={d.name}
                    subtitle={`${d.platform || ''}${d.niche ? ` · ${d.niche}` : ''}`}
                    verifyRecord={d}
                    crossLinks={<CrossRefLinks record={d} queue="selfMedia" />}
                    avatar={<FigureAvatar {...figureAvatarProps(d)} size={56} ring eager />}
                    badges={(
                      <>
                        <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: `${CAT_ACCENT[d.category] || '#f472b6'}22`, color: CAT_ACCENT[d.category] || '#f472b6' }}>{SM_TAB_LABEL[d.category]}</span>
                        <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{d.platform}</span>
                        {d.tier && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>{SM_TIER_LABEL[d.tier] || d.tier}</span>}
                      </>
                    )}
                    tags={normalizeTags(d.tags).filter(Boolean)}
                    tagAccent="#f472b6"
                    sections={buildTalentDetailSections(d, {
                      queue: 'selfMedia',
                      bioLabel: '公开传播履历',
                      baseSections: [
                      {
                        title: '传播节点',
                        cols: 2,
                        fields: [
                          { label: '主平台', value: d.platform, accent: 'var(--cyber-cyan)' },
                          { label: '垂类', value: d.niche },
                          { label: '粉丝量级', value: d.followers, accent: '#d4af37' },
                          { label: '影响力层级', value: SM_TIER_LABEL[d.tier] || d.tier },
                        ],
                      },
                      {
                        title: '代表作品与争议',
                        fields: [
                          { label: '代表作品', value: d.keyWorks, accent: 'var(--cyber-cyan)' },
                          { label: '争议/事件', value: d.controversies !== '—' ? d.controversies : null },
                          { label: '迁出来源', value: d.migratedFrom === 'knowledge' ? '知识精英队列' : null },
                        ],
                      },
                      ...(d.bio ? [] : [{
                        title: '简介',
                        content: <ExpandableText text={d.bio || d.keyWorks} maxLen={160} />,
                      }]),
                    ],
                    })}
                    timeline={eventsToTimeline(d)}
                    timelineExpandable
                    timelineAccent="#f472b6"
                    queueNote={`// ${SM_TAB_LABEL[d.category]} · 粉丝量级为公开报道口径 · 不含非公开商业数据`}
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
        数据来源：{SELF_MEDIA_META.sources.join('、')} · {SELF_MEDIA_META.notes} · 研究参考
      </p>
    </section>
  );
}
