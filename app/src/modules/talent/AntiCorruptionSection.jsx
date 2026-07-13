import { AXIS, LABEL, GRID_LINE } from '../shared/chartHelpers.js';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat, DistBar } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { useDataset } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  ANTI_CORRUPTION_DATASET_ID,
  ANTI_CORRUPTION_SEED_PKG,
  ANTI_CORRUPTION_META,
  ANTI_CORRUPTION_COUNT,
  ANTI_CORRUPTION_RAW_COUNT,
  ANTI_CORRUPTION_DUPE_COUNT,
  dedupeAntiCorruption,
  acKey,
} from '../../lib/db/antiCorruptionSeed.js';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps, prefetchFigureAvatars } from '../../lib/ui/figureAvatarResolve.js';
import TalentDetailPanel, { ExpandableText } from './TalentDetailPanel.jsx';
import { applyTalentEnrichment } from '../../lib/talent/talentEnrich.js';
import { buildTalentDetailSections, CrossRefLinks, eventsToTimeline } from '../../lib/talent/detailSections.jsx';
import { buildDetailFooter, normalizeTags } from '../../lib/talent/metadata.jsx';
import { useTalentDeepLink } from '../../lib/talent/routing.js';
import { EraTimeline } from '../leadership/EraTimeline.jsx';

const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(196,30,58,0.14)', color: 'var(--china-red)', border: '1px solid rgba(196,30,58,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };
const LEVEL_RANK = {
  正国级: 0, 副国级: 1, 正部级: 2, 副部级: 3, 副省级: 3, 军队正战区职: 3, 副军级: 4, 正厅级: 5, 副厅级: 6,
};
const LEVEL_TIERS = [
  { id: '', label: '全部层级' },
  { id: 'guo', label: '国级（正/副国级）', match: (l) => ['正国级', '副国级'].includes(l) },
  { id: 'bu', label: '省部级（正/副部级）', match: (l) => ['正部级', '副部级'].includes(l) },
  { id: 'fushu', label: '副省级', match: (l) => l === '副省级' },
  { id: 'jun', label: '军队（战区/副军级）', match: (l) => ['军队正战区职', '副军级'].includes(l) },
  { id: 'ting', label: '厅局级典型', match: (l) => ['正厅级', '副厅级'].includes(l) },
];
const TYPICAL_BADGE = { background: 'rgba(232,163,23,0.18)', color: '#e8a317' };

/** 2026 H1 政策锚点 · 公开表述摘要（研究口径） */
const POLICY_ANCHORS_2026 = [
  {
    period: '2026-01',
    title: '二十届中央纪委五次全会',
    desc: '强调以更高标准推进全面从严治党，持续深化反腐败斗争，一体推进不敢腐、不能腐、不想腐，强化对权力运行的制约和监督。',
    docId: 'gwr-2025',
    docLabel: '政府工作报告 · 2025',
  },
  {
    period: '2026-Q1',
    title: '金融与国企领域高压态势',
    desc: '国家金融监督管理总局、央企集团原「一把手」及省部级地方主官密集通报，巡视反馈与立案审查调查并行，形成「磁盘碎片整理」式权力纠错节奏。',
    docId: null,
    docLabel: null,
  },
  {
    period: '2026-H1',
    title: '巡视整改与通报机制',
    desc: '中央纪委国家监委网站持续发布省部级及以上干部接受审查调查、开除党籍等通报；本库按首次官宣日期归年，司法细节以法院公开裁判为准。',
    docId: 'plenum-20-4',
    docLabel: '二十届四中全会 · 决议',
  },
];

/** 2026 年以来典型节点（种子内置，公开报道口径） */
const RECENT_CASE_SPOTLIGHT_2026 = [
  { date: '2026-01-24', name: '张又侠', tag: '军队', level: '副国级' },
  { date: '2026-01-31', name: '王祥喜', tag: '国务院', level: '正部级' },
  { date: '2026-03-20', name: '胡衡华', tag: '党政', level: '副省级' },
  { date: '2026-03-24', name: '周亮', tag: '金融', level: '副部级' },
  { date: '2026-06-03', name: '杨燕子', tag: '金融', level: '正部级' },
  { date: '2026-07-09', name: '刘建新', tag: '国企', level: '副部级' },
];

function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((r) => { const k = keyFn(r); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function TypicalBadge() {
  return <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={TYPICAL_BADGE}>典型</span>;
}

export default function AntiCorruptionSection() {
  const { rows, ready } = useDataset(ANTI_CORRUPTION_DATASET_ID, ANTI_CORRUPTION_SEED_PKG);
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [year, setYear] = useState('');
  const [yearIdx, setYearIdx] = useState(-1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [bucket, setBucket] = useState('');
  const [level, setLevel] = useState('');
  const [levelTier, setLevelTier] = useState('');
  const [sector, setSector] = useState('');
  const [prov, setProv] = useState('');
  const [typicalOnly, setTypicalOnly] = useState(false);
  const [sort, setSort] = useState('dateDesc');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const { list, dbDupeCount, rawDbCount } = useMemo(() => {
    const raw = rows || [];
    const { rows: deduped, dupeCount } = dedupeAntiCorruption(raw);
    return { list: deduped, dbDupeCount: dupeCount, rawDbCount: raw.length };
  }, [rows]);

  const tierDef = levelTier ? LEVEL_TIERS.find((t) => t.id === levelTier) : null;
  const years = useMemo(() => [...new Set(list.map((r) => r.year).filter(Boolean))].sort((a, b) => b - a), [list]);
  const yearStages = useMemo(() => years.map((y) => {
    const n = list.filter((r) => r.year === y).length;
    return { period: String(y), title: `${n} 案`, desc: `${y} 年公开落马/被查 ${n} 条`, accent: '#c41e3a' };
  }), [years, list]);

  useEffect(() => {
    if (!year) { setYearIdx(-1); return; }
    const idx = years.indexOf(Number(year));
    if (idx >= 0 && idx !== yearIdx) setYearIdx(idx);
  }, [year, years, yearIdx]);

  const pickYear = useCallback((idx) => {
    setYearIdx(idx);
    const y = years[idx];
    if (y != null) {
      setYear(String(y));
      setDateFrom(`${y}-01-01`);
      setDateTo(`${y}-12-31`);
    }
  }, [years]);
  const buckets = useMemo(() => [...new Set(list.map((r) => r.yearBucket).filter(Boolean))], [list]);
  const levels = useMemo(() => [...new Set(list.map((r) => r.level).filter(Boolean))].sort((a, b) => (LEVEL_RANK[a] ?? 9) - (LEVEL_RANK[b] ?? 9)), [list]);
  const sectors = useMemo(() => [...new Set(list.map((r) => r.sector).filter(Boolean))].sort(), [list]);
  const provinces = useMemo(() => [...new Set(list.map((r) => r.province).filter(Boolean))].sort(), [list]);

  const filtered = useMemo(() => {
    const out = list.filter((r) => {
      const hay = [r.name, r.formerRole, r.org, r.province, r.sector, r.level, r.category, r.status, r.notes, r.source, r.caseType].join(' ');
      const tierOk = !tierDef?.match || tierDef.match(r.level);
      const d = r.announcementDate || '';
      const inRange = (!dateFrom || d >= dateFrom) && (!dateTo || d <= dateTo);
      return tierOk
        && inRange
        && (!year || r.year === year || String(r.year) === year)
        && (!bucket || r.yearBucket === bucket)
        && (!level || r.level === level)
        && (!sector || r.sector === sector)
        && (!prov || r.province === prov)
        && (!typicalOnly || r.caseType === '典型')
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'dateDesc') out.sort((a, b) => (b.announcementDate || '').localeCompare(a.announcementDate || ''));
    else if (sort === 'dateAsc') out.sort((a, b) => (a.announcementDate || '').localeCompare(b.announcementDate || ''));
    else if (sort === 'level') out.sort((a, b) => (LEVEL_RANK[a.level] ?? 9) - (LEVEL_RANK[b.level] ?? 9) || (b.announcementDate || '').localeCompare(a.announcementDate || ''));
    else if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    return out;
  }, [list, q, year, dateFrom, dateTo, bucket, level, levelTier, tierDef, sector, prov, typicalOnly, sort]);

  useEffect(() => {
    if (filtered.length) prefetchFigureAvatars(filtered, 56);
  }, [filtered]);

  const detail = sel || (searchParams.get('id') ? null : filtered[0]) || null;

  const { selectEntity } = useTalentDeepLink({
    searchParams, setSearchParams, filtered, allList: list, sel, setSel, ready,
    preserveKeys: [], keyFn: acKey,
  });
  const pickEntity = useCallback((r) => selectEntity(r), [selectEntity]);

  const pickByIndex = useCallback((idx) => {
    const r = filtered[idx];
    if (r) pickEntity(r);
  }, [filtered, pickEntity]);

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
  const distYear = tally(filtered, (r) => r.year).sort((a, b) => b[0] - a[0]);
  const distLevel = tally(filtered, (r) => r.level);
  const distSector = tally(filtered, (r) => r.sector);
  const distBucket = tally(filtered, (r) => r.yearBucket);

  const guoCount = list.filter((r) => ['正国级', '副国级'].includes(r.level)).length;
  const buCount = list.filter((r) => ['正部级', '副部级'].includes(r.level)).length;
  const fushuCount = list.filter((r) => r.level === '副省级').length;
  const junCount = list.filter((r) => ['军队正战区职', '副军级'].includes(r.level)).length;
  const typicalCount = list.filter((r) => r.caseType === '典型').length;
  const recentYear = years[0] || '—';
  const totalDupeHint = ANTI_CORRUPTION_DUPE_COUNT + dbDupeCount;

  const yearChart = {
    grid: { left: 40, right: 12, top: 12, bottom: 24 },
    xAxis: { type: 'category', data: distYear.map(([y]) => y).reverse(), axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: GRID_LINE.color } }, axisLabel: { color: LABEL.color } },
    series: [{ type: 'bar', data: distYear.map(([, n]) => n).reverse(), barWidth: 18, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } }],
  };

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖反腐数据集（${ANTI_CORRUPTION_COUNT} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...ANTI_CORRUPTION_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const clearAll = () => {
    setQ(''); setYear(''); setYearIdx(-1); setDateFrom(''); setDateTo('');
    setBucket(''); setLevel(''); setLevelTier(''); setSector(''); setProv(''); setTypicalOnly(false);
  };
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    (dateFrom || dateTo) && ['被查时间', `${dateFrom || '…'} ~ ${dateTo || '…'}`, () => { setDateFrom(''); setDateTo(''); setYear(''); setYearIdx(-1); }],
    year && !dateFrom && !dateTo && ['年份', year, () => { setYear(''); setYearIdx(-1); }],
    bucket && ['分期', bucket, () => setBucket('')],
    levelTier && ['层级带', LEVEL_TIERS.find((t) => t.id === levelTier)?.label, () => setLevelTier('')],
    level && ['层级', level, () => setLevel('')],
    typicalOnly && ['典型案例', '是', () => setTypicalOnly(false)],
    sector && ['系统', sector, () => setSector('')],
    prov && ['地域', short(prov), () => setProv('')],
  ].filter(Boolean);

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载反腐名单…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(196,30,58,0.12)', color: 'var(--china-red)' }}>
          <Lucide.Gavel size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>反腐透视 · 权力纠错账本</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            独立观测队列 · 十八大以来公开落马/被查 —— 内置 {ANTI_CORRUPTION_COUNT} 条
            {ANTI_CORRUPTION_RAW_COUNT > ANTI_CORRUPTION_COUNT && `（原始 ${ANTI_CORRUPTION_RAW_COUNT}，种子去重 ${ANTI_CORRUPTION_DUPE_COUNT}）`}
            ，截至 {ANTI_CORRUPTION_META.asOf}
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px,1fr))' }}>
        <Stat value={list.length} label="案例总数" accent="#c41e3a" />
        <Stat value={guoCount} label="国级及以上" accent="#e8a317" />
        <Stat value={buCount} label="省部级" accent="#22d3ee" />
        <Stat value={fushuCount} label="副省级" accent="#a78bfa" />
        <Stat value={junCount} label="军队高职" accent="#64748b" />
        <Stat value={typicalCount} label="典型案例" accent="#f59e0b" />
        <Stat value={years.length} label="覆盖年份" accent="#8b5cf6" />
        <Stat value={filtered.length} label="当前命中" />
      </div>

      <Card title="2026 H1 政策锚点 · 权力纠错语境" className="mb-4">
        <p className="text-[11px] mono mb-3" style={{ color: 'var(--text-tertiary)' }}>
          反腐透视模块 · 公开政策话语与通报节奏摘要；不构成官方解读。完整条文见
          {' '}<Link to="/policydocs" className="mono" style={{ color: 'var(--cyber-cyan)' }}>政策文档库</Link>。
        </p>
        <div className="space-y-3">
          {POLICY_ANCHORS_2026.map((a) => (
            <div key={a.period} className="rounded px-3 py-2.5" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #c41e3a' }}>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="mono text-[11px] font-semibold" style={{ color: '#c41e3a' }}>{a.period}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{a.title}</span>
                {a.docId && (
                  <Link to={`/policydocs?doc=${a.docId}`} className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>
                    {a.docLabel}
                  </Link>
                )}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {list.length > 0 && (
        <Card title="2026 年以来典型节点" className="mb-4">
          <p className="text-[11px] mono mb-3" style={{ color: 'var(--text-tertiary)' }}>
            点击卡片可跳转详情 · 数据截至 {ANTI_CORRUPTION_META.asOf} · 仅收录中央纪委国家监委等公开发布信息
          </p>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
            {RECENT_CASE_SPOTLIGHT_2026.map((c) => {
              const hit = list.find((r) => r.name === c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => hit && pickEntity(hit)}
                  disabled={!hit}
                  className="text-left px-3 py-2 rounded"
                  style={{
                    background: hit ? 'rgba(196,30,58,0.1)' : 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    cursor: hit ? 'pointer' : 'default',
                    opacity: hit ? 1 : 0.55,
                  }}
                >
                  <div className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{c.date}</div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <span className="text-[9px] mono px-1 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.12)', color: 'var(--china-red)' }}>{c.level}</span>
                    <span className="text-[9px] mono px-1 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{c.tag}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {list.length < 10 && (
        <Card title="一键载入反腐名单" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集，与中国政要队列隔离；非人物荣誉名录。来源：{ANTI_CORRUPTION_META.sources.join('、')}。{ANTI_CORRUPTION_META.notes}
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${ANTI_CORRUPTION_META.label}（${ANTI_CORRUPTION_COUNT} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="反腐透视队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置反腐数据集。</p></Card>
      ) : (
        <>
          {yearStages.length > 0 && (
            <Card title="反腐时间轴 · 按被查年份" className="mb-4">
              <p className="text-[11px] mono mb-3" style={{ color: 'var(--text-tertiary)' }}>
                节点 = 官宣/被查归年 · 点击年份同步筛选列表 · 支持下方日期区间精筛
              </p>
              <EraTimeline
                stages={yearStages}
                activeIdx={yearIdx >= 0 ? yearIdx : 0}
                onSelect={pickYear}
                renderDetail={(st, idx) => (
                  <div className="os-card lead-era-tl-detail" style={{ padding: 'var(--card-padding)', background: 'var(--bg-elevated)', borderLeft: '3px solid #c41e3a' }}>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="mono text-sm font-semibold" style={{ color: '#c41e3a' }}>{st.period}</span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{st.title}</span>
                      <button type="button" onClick={() => { setYear(''); setYearIdx(-1); setDateFrom(''); setDateTo(''); }}
                        className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                        清除年份筛选
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{st.desc}</p>
                    <p className="text-[11px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
                      当前命中 {filtered.filter((r) => r.year === Number(st.period)).length} / {list.filter((r) => r.year === Number(st.period)).length} 条
                    </p>
                  </div>
                )}
              />
            </Card>
          )}

          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 原职务 / 机构 / 案类" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={year} onChange={(e) => { const v = e.target.value; setYear(v); if (v) { setDateFrom(`${v}-01-01`); setDateTo(`${v}-12-31`); const idx = years.indexOf(Number(v)); if (idx >= 0) setYearIdx(idx); } else { setDateFrom(''); setDateTo(''); setYearIdx(-1); } }} style={inp}><option value="">全部年份</option>{years.map((y) => <option key={y} value={y}>{y}</option>)}</select>
              <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setYear(''); setYearIdx(-1); }} style={inp} title="被查起始" aria-label="被查起始" />
              <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setYear(''); setYearIdx(-1); }} style={inp} title="被查截止" aria-label="被查截止" />
              <select value={bucket} onChange={(e) => setBucket(e.target.value)} style={inp}><option value="">全部分期</option>{buckets.map((b) => <option key={b} value={b}>{b}</option>)}</select>
              <select value={levelTier} onChange={(e) => { setLevelTier(e.target.value); setLevel(''); }} style={inp}>
                {LEVEL_TIERS.map((t) => <option key={t.id || 'all'} value={t.id}>{t.label}</option>)}
              </select>
              <select value={level} onChange={(e) => setLevel(e.target.value)} style={inp}><option value="">精确层级</option>{levels.map((l) => <option key={l} value={l}>{l}</option>)}</select>
              <select value={sector} onChange={(e) => setSector(e.target.value)} style={inp}><option value="">全部系统</option>{sectors.map((s) => <option key={s} value={s}>{s}</option>)}</select>
              <select value={prov} onChange={(e) => setProv(e.target.value)} style={inp}><option value="">全部地域</option>{provinces.map((p) => <option key={p} value={p}>{short(p) || p}</option>)}</select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="dateDesc">官宣日期 ↓</option><option value="dateAsc">官宣日期 ↑</option><option value="level">按层级</option><option value="name">按姓名</option>
              </select>
              <button type="button" onClick={() => setTypicalOnly((v) => !v)} style={{ ...inp, cursor: 'pointer', color: typicalOnly ? '#e8a317' : 'var(--text-secondary)', borderColor: typicalOnly ? 'rgba(232,163,23,0.5)' : undefined }}>
                典型案例
              </button>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(196,30,58,0.18)' : 'var(--bg-base)', color: on ? 'var(--china-red)' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
              {(list.length < ANTI_CORRUPTION_COUNT || rawDbCount > list.length) && (
                <button onClick={() => loadSeed(true)} disabled={loading} style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lucide.RefreshCw size={13} />{loading ? '载入中…' : `覆盖载入 ${ANTI_CORRUPTION_COUNT} 条`}
                </button>
              )}
            </div>
            {activeChips.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mt-3 items-center">
                <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>筛选</span>
                {activeChips.map(([k, v, clr], i) => (
                  <button key={i} onClick={clr} className="text-[11px] mono px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>{k}:</span>{v}<Lucide.X size={11} />
                  </button>
                ))}
                <button onClick={clearAll} className="text-[11px] mono px-2 py-0.5" style={{ color: 'var(--china-red)', background: 'none', border: 'none', cursor: 'pointer' }}>清空</button>
              </div>
            )}
            <p className="text-[11px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>
              命中 {filtered.length} / {list.length} 条 · 按被查/官宣日期筛选 · {ANTI_CORRUPTION_META.scope}
              {dbDupeCount > 0 && ` · 本地库去重 ${rawDbCount}→${list.length}（合并 ${dbDupeCount} 条重复）`}
              {totalDupeHint > 0 && dbDupeCount === 0 && ANTI_CORRUPTION_DUPE_COUNT > 0 && ` · 种子已去重 ${ANTI_CORRUPTION_DUPE_COUNT} 条`}
            </p>
          </Card>

          {view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>// 历年汇总基于当前筛选 {filtered.length} 条；副省部级及以上力争全覆盖，厅局级仅含全国性典型</div>
              <Grid cols={2}>
                <Card title="历年官宣数量"><EChart option={yearChart} style={{ height: 240 }} /></Card>
                <Card title="届别/分期分布"><DistBar data={distBucket} color="#e8a317" onPick={(k) => setBucket(bucket === k ? '' : k)} active={bucket} /></Card>
              </Grid>
              <Grid cols={3}>
                <Card title="层级（点选筛选）"><DistBar data={distLevel} onPick={(k) => setLevel(level === k ? '' : k)} active={level} /></Card>
                <Card title="系统（点选筛选）"><DistBar data={distSector} color="#22d3ee" onPick={(k) => setSector(sector === k ? '' : k)} active={sector} /></Card>
                <Card title="年份（点选筛选）"><DistBar data={distYear} color="#8b5cf6" onPick={(k) => setYear(year === k ? '' : k)} active={year} /></Card>
              </Grid>
              <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>// 数据边界：{ANTI_CORRUPTION_META.notes}</p>
            </div>
          ) : (
            <div className="talent-split talent-split--list-detail mb-4">
              <Card title={`检索结果 (${filtered.length}/${list.length})`} asSection={false} className="talent-split__list-card">
                <div className="talent-split__scroll space-y-1.5">
                  {filtered.map((r) => {
                    const on = detail === r;
                    return (
                      <button key={acKey(r)} onClick={() => pickEntity(r)} className="w-full text-left px-3 py-2 rounded"
                        style={{ background: on ? 'rgba(196,30,58,0.14)' : 'var(--bg-elevated)', border: `1px solid ${on ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer' }}>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <FigureAvatar {...figureAvatarProps(r)} size={28} ring={on} />
                          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
                          <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{r.announcementDate}</span>
                          {r.level && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.12)', color: 'var(--china-red)' }}>{r.level}</span>}
                          {r.caseType === '典型' && <TypicalBadge />}
                          {r.yearBucket && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>{r.yearBucket}</span>}
                          {r.province && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(r.province)}</span>}
                        </div>
                        <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{r.formerRole}</div>
                      </button>
                    );
                  })}
                  {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                </div>
              </Card>

              <div className="talent-split__detail">
              <Card title={detail ? `${detail.name} · 案件详情` : '选择一条'}>
                {detail && (() => {
                  const d = applyTalentEnrichment(detail, { queue: 'anticorruption' });
                  return (
                  <TalentDetailPanel
                    name={d.name}
                    subtitle={d.formerRole}
                    verifyRecord={d}
                    crossLinks={<CrossRefLinks record={d} queue="anticorruption" />}
                    avatar={<FigureAvatar {...figureAvatarProps(d)} size={56} ring eager />}
                    badges={(
                      <>
                        {d.level && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.12)', color: 'var(--china-red)' }}>{d.level}</span>}
                        {d.caseType === '典型' && <TypicalBadge />}
                        {d.yearBucket && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>{d.yearBucket}</span>}
                      </>
                    )}
                    tags={normalizeTags(d.tags)}
                    tagAccent="#c41e3a"
                    sections={buildTalentDetailSections(d, {
                      queue: 'anticorruption',
                      bioLabel: '案件公开要点',
                      baseSections: [
                      {
                        title: '基本信息',
                        fields: [
                          { label: '原机构', value: d.org ? `${d.org}${d.sector ? `（${d.sector}）` : ''}` : null },
                          { label: '关联地域', value: d.province },
                          { label: '系统', value: d.sector },
                          { label: '案类', value: d.category },
                        ],
                      },
                      {
                        title: '案件进程',
                        fields: [
                          { label: '官宣日期', value: d.announcementDate, accent: 'var(--cyber-cyan)' },
                          { label: '归年', value: d.year ? `${d.year} · ${d.yearBucket}` : d.yearBucket },
                          { label: '处置', value: d.status, accent: '#e8a317' },
                          { label: '案例类型', value: d.caseType === '典型' ? '全国性典型案例' : d.caseType },
                        ],
                      },
                      ...(d.notes ? [{
                        title: '备注',
                        content: <ExpandableText text={d.notes} maxLen={120} />,
                      }] : []),
                    ],
                    })}
                    timeline={eventsToTimeline(d)}
                    timelineExpandable
                    timelineAccent="var(--china-red)"
                    queueNote="// 公开报道口径 · 司法细节以法院公开裁判为准"
                    footer={buildDetailFooter(d)}
                  />
                  );
                })()}
              </Card>
              </div>
            </div>
          )}
        </>
      )}

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        数据来源：{ANTI_CORRUPTION_META.sources.join('、')} · {ANTI_CORRUPTION_META.notes} · 研究参考，不代表官方立场
      </p>
    </section>
  );
}
