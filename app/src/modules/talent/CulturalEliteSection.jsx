import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat } from '../../app/ui.jsx';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps, prefetchFigureAvatars } from '../../lib/ui/figureAvatarResolve.js';
import AcademicianBadge from '../../lib/ui/AcademicianBadge.jsx';
import { isAcademician } from '../../lib/db/academicianCommon.js';
import EChart from '../../lib/viz/EChart.jsx';
import { useCulturalElite } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import TalentDetailPanel, { ExpandableText } from './TalentDetailPanel.jsx';
import { applyTalentEnrichment } from '../../lib/talent/talentEnrich.js';
import { buildTalentDetailSections, CrossRefLinks } from '../../lib/talent/detailSections.jsx';
import { buildDetailFooter, normalizeTags } from '../../lib/talent/metadata.jsx';
import { eventsToTimeline } from '../../lib/talent/detailSections.jsx';
import { useTalentDeepLink, findEntityInList } from '../../lib/talent/routing.js';
import {
  CULTURAL_ELITE_SEED_PKG,
  CULTURAL_ELITE_META,
  CULTURAL_ELITE_DEDUPED_COUNT,
  dedupeCulturalElite,
  CE_SUB_CATS,
  CE_TAB_LABEL,
  CE_TAB_LEGACY_ALIASES,
  resolveCeTabKey,
} from '../../lib/db/culturalEliteSeed.js';
import { CE_MEDIA_SUBTYPES, CE_MEDIA_SUBTYPE_LABEL } from '../../lib/db/ceCategory.js';

const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(139,92,246,0.14)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };

const TAB_DESC = {
  humanities: '文学、史学、哲学、考古与古典文献领域的学术研究者，以机构任职与学术荣誉建档。',
  socialsci: '经济、法学、社会学、政治学与公共管理领域的研究者，侧重制度分析与政策话语。',
  art: '文学、影视、音乐、美术、表演与非遗传承的创作生产者，不含党政任命职务。',
  basicsci: '数理化生与天地海洋等基础学科研究者；两院院士以最高学术荣誉层标记 enrich。',
  engineering: '计算机、通信、航天、土木、材料与先进制造等应用型工程技术学者与 CAE 体系节点。',
  health: '临床医学、公共卫生、药学与转化医学领域的学者与临床专家，侧重诊疗与防控贡献。',
  media: '媒体、出版、评论、翻译与科普传播从业者，公共话语与符号生产的节点。',
  religion: '佛教、道教、伊斯兰教、天主教/基督教等宗教界公开代表人物与学者型 clergy；不含以党政宗教事务官员为主身份者（可标注双重身份）。',
};
const TAB_ACCENT = {
  humanities: '#22d3ee',
  socialsci: '#38bdf8',
  art: '#f0abfc',
  basicsci: '#10b981',
  engineering: '#6366f1',
  health: '#f472b6',
  media: '#e8a317',
  religion: '#d4af37',
};
const RELIGION_TRADITIONS = ['佛教', '道教', '伊斯兰', '天主教', '基督教', '跨宗教'];
const ACADEMY_TABS = new Set(['basicsci', 'engineering', 'health']);
const TIER_RANK = { C9: 0, '985': 1, 双一流: 2 };
const HONOR_PATTERNS = [
  ['长江学者', /长江学者/],
  ['杰青', /杰青|杰出青年/],
  ['两院院士', /两院院士/],
  ['中科院院士', /中科院院士|中国科学院院士/],
  ['工程院院士', /工程院院士|中国工程院院士/],
  ['院士', /院士/],
  ['茅盾奖', /茅盾文学奖/],
  ['雨果奖', /雨果奖/],
  ['诺奖', /诺贝尔/],
  ['国家级非遗', /非遗传承人|国家级非遗/],
  ['文联/协会', /作协主席|文联|协会主席/],
  ['宗教会长', /协会会长|两会主席|主教|方丈|住持/],
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
        <FigureAvatar {...figureAvatarProps(r)} size={dense ? 28 : 32} ring={on} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            <AcademicianBadge record={r} />
            {r.tier && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>{r.tier}</span>}
            {r.region && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(r.region)}</span>}
            {(r.discipline || r.field) && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>{r.discipline || r.field}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {r.institution || r.title}
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
  const [searchParams, setSearchParams] = useSearchParams();
  const ceParam = searchParams.get('ce');
  const initialTab = resolveCeTabKey(ceParam);
  const [catTab, setCatTab] = useState(initialTab);
  const [q, setQ] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [region, setRegion] = useState('');
  const [tier, setTier] = useState('');
  const [decade, setDecade] = useState('');
  const [honor, setHonor] = useState('');
  const [tradition, setTradition] = useState('');
  const [academyOnly, setAcademyOnly] = useState(false);
  const [mediaSubtype, setMediaSubtype] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const { list, catCounts } = useMemo(() => {
    const { rows: deduped } = dedupeCulturalElite(rows || []);
    const counts = Object.fromEntries(CE_SUB_CATS.map((k) => [k, 0]));
    deduped.forEach((r) => { if (counts[r.category] != null) counts[r.category] += 1; });
    return { list: deduped, catCounts: counts };
  }, [rows]);

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
      const traditionMatch = !tradition || r.field === tradition || r.discipline === tradition;
      const academyMatch = !academyOnly || isAcademician(r);
      const mediaSubMatch = !mediaSubtype || r.mediaSubtype === mediaSubtype || (mediaSubtype === 'institutional' && /总台|央视|新华社|人民日报|CGTN|体制内/.test(`${r.institution || ''}${r.source || ''}`));
      return (!discipline || r.discipline === discipline || r.field === discipline)
        && (!region || r.region === region)
        && (!tier || r.tier === tier)
        && (!decade || r.decade === decade)
        && honorMatch
        && traditionMatch
        && academyMatch
        && mediaSubMatch
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'tier') out.sort((a, b) => (TIER_RANK[a.tier] ?? 9) - (TIER_RANK[b.tier] ?? 9));
    else if (sort === 'region') out.sort((a, b) => (a.region || '').localeCompare(b.region || '', 'zh'));
    return out;
  }, [tabList, q, discipline, region, tier, decade, honor, tradition, academyOnly, mediaSubtype, sort]);

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
    searchParams,
    setSearchParams,
    filtered,
    allList: list,
    sel,
    setSel,
    ready,
    preserveKeys: ['ce'],
  });

  const idParam = searchParams.get('id');
  useEffect(() => {
    if (!idParam || !list.length) return;
    const hit = findEntityInList(list, idParam);
    if (hit?.category && hit.category !== catTab) setCatTab(hit.category);
  }, [idParam, list, catTab]);

  useEffect(() => {
    if (!ceParam) return;
    const resolved = resolveCeTabKey(ceParam);
    if (resolved !== catTab) setCatTab(resolved);
    if (CE_TAB_LEGACY_ALIASES[ceParam]) {
      const next = new URLSearchParams(searchParams);
      next.set('ce', resolved);
      setSearchParams(next, { replace: true });
    }
  }, [ceParam, catTab, searchParams, setSearchParams]);

  const pickTab = (k) => {
    setCatTab(k);
    setSel(null);
    clearAll();
    const next = new URLSearchParams(searchParams);
    next.set('ce', k);
    next.delete('id');
    setSearchParams(next, { replace: true });
  };

  useEffect(() => { setSel(null); setTradition(''); }, [catTab]);

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
    if (replace && list.length && !window.confirm(`将覆盖知识精英数据集（${CULTURAL_ELITE_DEDUPED_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...CULTURAL_ELITE_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const academyCount = useMemo(() => tabList.filter(isAcademician).length, [tabList]);
  const clearAll = () => { setQ(''); setDiscipline(''); setRegion(''); setTier(''); setDecade(''); setHonor(''); setTradition(''); setAcademyOnly(false); setMediaSubtype(''); setSel(null); };
  const traditionCounts = useMemo(() => {
    if (catTab !== 'religion') return [];
    return RELIGION_TRADITIONS.map((t) => [t, tabList.filter((r) => r.field === t || r.discipline === t).length]).filter(([, n]) => n > 0);
  }, [catTab, tabList]);
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    discipline && ['学科', discipline, () => setDiscipline('')],
    tradition && ['教派', tradition, () => setTradition('')],
    region && ['地域', short(region), () => setRegion('')],
    tier && ['层级', tier, () => setTier('')],
    decade && ['年代', decade, () => setDecade('')],
    honor && ['荣誉', honor, () => setHonor('')],
    academyOnly && ['两院院士', '仅院士', () => setAcademyOnly(false)],
    mediaSubtype && ['媒体带', CE_MEDIA_SUBTYPE_LABEL[mediaSubtype], () => setMediaSubtype('')],
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

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载知识精英库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>
          <Lucide.BookOpen size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>知识精英 · 知识生产图谱</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            去政治化队列 · 高校与商业条目已解耦至机构载体/资本逻辑 —— 内置 {CULTURAL_ELITE_DEDUPED_COUNT.total} 条，截至 {CULTURAL_ELITE_META.asOf}
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(88px,1fr))' }}>
        {CE_SUB_CATS.map((k) => (
          <Stat key={k} value={catCounts[k] ?? 0} label={CE_TAB_LABEL[k]} accent={TAB_ACCENT[k]} />
        ))}
        <Stat value={disciplines.length} label="学科门类" accent="#a78bfa" />
        {ACADEMY_TABS.has(catTab) && <Stat value={academyCount} label="两院院士" accent="#d4af37" />}
        <Stat value={filtered.length} label="当前命中" />
      </div>

      <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {TAB_DESC[catTab]}
      </p>

      <div className="flex gap-1 flex-wrap mb-4">
        {CE_SUB_CATS.map((k) => (
          <button key={k} type="button" onClick={() => pickTab(k)}
            className={`text-sm px-3 py-1.5 mono os-filter-chip ${catTab === k ? 'is-active' : ''}`}
            style={{ '--chip-accent': TAB_ACCENT[k] }}>
            {CE_TAB_LABEL[k]} ({catCounts[k] ?? 0})
          </button>
        ))}
      </div>

      {catTab === 'religion' && traditionCounts.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-4">
          <button type="button" onClick={() => setTradition('')} className="text-xs px-2.5 py-1 mono"
            style={{
              background: !tradition ? 'rgba(212,175,55,0.18)' : 'var(--bg-elevated)',
              color: !tradition ? '#d4af37' : 'var(--text-secondary)',
              border: `1px solid ${!tradition ? 'rgba(212,175,55,0.45)' : 'var(--border-subtle)'}`,
              borderRadius: 6, cursor: 'pointer',
            }}>
            全部教派 ({tabList.length})
          </button>
          {traditionCounts.map(([t, n]) => (
            <button key={t} type="button" onClick={() => setTradition(tradition === t ? '' : t)} className="text-xs px-2.5 py-1 mono"
              style={{
                background: tradition === t ? 'rgba(212,175,55,0.18)' : 'var(--bg-elevated)',
                color: tradition === t ? '#d4af37' : 'var(--text-secondary)',
                border: `1px solid ${tradition === t ? 'rgba(212,175,55,0.45)' : 'var(--border-subtle)'}`,
                borderRadius: 6, cursor: 'pointer',
              }}>
              {t} ({n})
            </button>
          ))}
        </div>
      )}

      {list.length < 10 && (
        <Card title="一键载入知识精英库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（cultural-elite-2026-06），与中国政要队列隔离；不含党政官员与政治任命。来源：{CULTURAL_ELITE_META.sources.slice(0, 4).join('、')}等。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${CULTURAL_ELITE_META.label}（${CULTURAL_ELITE_DEDUPED_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="知识生产队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置知识精英数据集。</p></Card>
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
              <select value={decade} onChange={(e) => setDecade(e.target.value)} style={inp}><option value="">全部年代</option>{decades.map((d) => <option key={d} value={d}>{d}</option>)}</select>
              {honorOpts.length > 0 && (
                <select value={honor} onChange={(e) => setHonor(e.target.value)} style={inp}><option value="">全部荣誉</option>{honorOpts.map((h) => <option key={h} value={h}>{h}</option>)}</select>
              )}
              {catTab === 'media' && CE_MEDIA_SUBTYPES.map((k) => (
                <button key={k} type="button" onClick={() => setMediaSubtype((v) => v === k ? '' : k)} style={{
                  ...inp, cursor: 'pointer',
                  color: mediaSubtype === k ? '#e8a317' : 'var(--text-secondary)',
                  borderColor: mediaSubtype === k ? 'rgba(232,163,23,0.45)' : 'var(--border-subtle)',
                  background: mediaSubtype === k ? 'rgba(232,163,23,0.12)' : 'var(--bg-base)',
                }}>
                  {CE_MEDIA_SUBTYPE_LABEL[k]}
                </button>
              ))}
              {ACADEMY_TABS.has(catTab) && academyCount > 0 && (
                <button type="button" onClick={() => setAcademyOnly((v) => !v)} style={{
                  ...inp, cursor: 'pointer',
                  color: academyOnly ? '#d4af37' : 'var(--text-secondary)',
                  borderColor: academyOnly ? 'rgba(212,175,55,0.45)' : 'var(--border-subtle)',
                  background: academyOnly ? 'rgba(212,175,55,0.12)' : 'var(--bg-base)',
                }}>
                  两院院士 ({academyCount})
                </button>
              )}
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="name">按名称</option>
                <option value="region">按地域</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(139,92,246,0.18)' : 'var(--bg-base)', color: on ? '#a78bfa' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
              {list.length < CULTURAL_ELITE_DEDUPED_COUNT.total && (
                <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lucide.RefreshCw size={13} />{loading ? '载入中…' : `补全 ${CULTURAL_ELITE_DEDUPED_COUNT.total} 条`}
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
              {CE_TAB_LABEL[catTab]} · 命中 {filtered.length} / {tabList.length} 条 · ↑↓ 或 j/k 切换 · {CULTURAL_ELITE_META.scope}
            </p>
          </Card>

          {view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
                // 学科/地域分布基于当前筛选 {filtered.length} 条；知识生产队列的结构化剖面
              </div>
              <Grid cols={2}>
                <Card title="学科/领域分布"><EChart option={disciplineChart} style={{ height: Math.max(240, distDiscipline.slice(0, 12).length * 22) }} /></Card>
                {regionChart && <Card title="地域分布"><EChart option={regionChart} style={{ height: 260 }} /></Card>}
              </Grid>
              <Grid cols={2}>
                {decades.length > 0 && <Card title="出生年代"><DistBars data={distDecade} color="#e8a317" onPick={(k) => setDecade(decade === k ? '' : k)} active={decade} /></Card>}
                {distHonor.length > 0 && <Card title="荣誉类型"><DistBars data={distHonor.slice(0, 10)} color="#d4af37" onPick={(k) => setHonor(honor === k ? '' : k)} active={honor} /></Card>}
                <Card title="学科（点选筛选）"><DistBars data={distDiscipline.slice(0, 10)} onPick={(k) => setDiscipline(discipline === k ? '' : k)} active={discipline} /></Card>
              </Grid>
              <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>// 数据边界：{CULTURAL_ELITE_META.notes}</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', maxHeight: 620, overflowY: 'auto' }}>
              {filtered.map((r) => (
                <EliteCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} dense />
              ))}
              {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
              <Card title={`${CE_TAB_LABEL[catTab]} (${filtered.length}/${tabList.length})`}>
                <div className="space-y-1.5" style={{ maxHeight: 560, overflowY: 'auto' }}>
                  {filtered.map((r) => (
                    <EliteCard key={r.id || r.name} r={r} on={detail === r} onClick={() => selectEntity(r)} />
                  ))}
                  {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                </div>
              </Card>

              <Card title={detail ? `${detail.name} · 详情` : '选择一条'}>
                {detail && (() => {
                  const d = applyTalentEnrichment(detail, { queue: 'knowledge' });
                  return (
                  <TalentDetailPanel
                    name={d.name}
                    subtitle={d.title || d.rankNotes}
                    verifyRecord={d}
                    crossLinks={<CrossRefLinks record={d} queue="knowledge" />}
                    avatar={<FigureAvatar {...figureAvatarProps(d)} size={56} ring eager />}
                    badges={(
                      <>
                        <AcademicianBadge record={d} size="md" />
                        <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>{CE_TAB_LABEL[d.category]}</span>
                        {d.tier && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>{d.tier}</span>}
                      </>
                    )}
                    tags={[...normalizeTags(d.tags), ...honorTags(d)].filter(Boolean)}
                    tagAccent="#d4af37"
                    sections={buildTalentDetailSections(d, {
                      queue: 'knowledge',
                      baseSections: [
                      {
                        title: '基本信息',
                        cols: 3,
                        fields: [
                          { label: '机构', value: d.institution },
                          { label: '地域', value: d.region },
                          { label: '学科/领域', value: d.discipline || d.field, accent: '#a78bfa' },
                          { label: '专长', value: d.strengths },
                          { label: '头衔', value: d.title },
                          { label: '年代', value: d.decade },
                          { label: '院校层级', value: d.tier, accent: '#e8a317' },
                        ],
                      },
                      {
                        title: '学术荣誉',
                        cols: 3,
                        fields: [
                          { label: '荣誉备注', value: d.rankNotes, accent: '#d4af37' },
                          { label: '学部', value: d.academyDivision },
                          { label: '当选年份', value: d.electedYear ? `${d.electedYear} 年` : null },
                          { label: 'CAS', value: d.academyCas ? '中科院院士' : null },
                          { label: 'CAE', value: d.academyCae ? '工程院院士' : null },
                        ],
                      },
                      ...(d.works && !d.bio ? [{
                        title: '代表成果',
                        content: <ExpandableText text={d.works} maxLen={160} accent="var(--cyber-cyan)" />,
                      }] : []),
                    ],
                    })}
                    timeline={eventsToTimeline(d)}
                    timelineExpandable
                    timelineAccent="#a78bfa"
                    queueNote={`// ${CE_TAB_LABEL[d.category]} · 公开信息口径 · 荣誉与职务以来源发布时为准`}
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
        数据来源：{CULTURAL_ELITE_META.sources.join('、')} · {CULTURAL_ELITE_META.notes} · 研究参考
      </p>
    </section>
  );
}
