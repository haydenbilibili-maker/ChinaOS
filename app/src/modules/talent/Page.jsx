import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { useFigures } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import { FIGURE_SEED, FIGURE_CATALOG_META } from '../../lib/db/figureSeed.js';

const CUR_YEAR = 2026;
const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };

const ROLE_OPTS = ['总书记', '总理', '副总理', '国务委员', '人大委员长', '政协主席', '政协副主席', '政协秘书长', '纪委书记', '外交部长', '政法委书记', '中组部部长', '统战部部长', '中宣部部长', '人大副委员长', '人大秘书长', '监委主任', '军委副主席', '港澳办主任', '党委书记', '市委书记', '省委副书记', '省长', '市长', '常务副省长', '常务副市长', '常务副主席', '自治区主席', '部长', '国防部长', '署长', '局长', '主任', '主席', '董事长', '总经理', '最高法院长', '最高检检察长'];
const SECTOR_OPTS = ['国务院', '党中央', '国家机关', '全国政协', '国务院直属机构', '央企', '省属国企', '军队', '地方'];
const LEVEL_RANK = { '党和国家领导人': 0, '副国级': 1, '正部级': 2, '省部级': 3, '副部级': 4, '正厅级': 5 };

// 派生字段
const birthYear = (f) => { const m = (f.fields?.birth || '').match(/(\d{4})/); return m ? +m[1] : null; };
const ageOf = (f) => { const y = birthYear(f); return y ? CUR_YEAR - y : null; };
const decadeOf = (f) => { const y = birthYear(f); return y ? `${String(Math.floor(y / 10) * 10).slice(2)}后` : '未知'; };
const nativeProv = (f) => { const n = f.fields?.native || ''; const m = n.match(/^(北京|上海|天津|重庆|河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|广西|海南|四川|贵州|云南|陕西|甘肃|青海|宁夏|新疆|西藏|内蒙古)/); return m ? m[1] : (n ? '其他' : '未知'); };
const tenureYears = (f) => { const cur = (f.career || []).find((c) => !c.to); if (!cur) return null; const m = (cur.from || '').match(/(\d{4})/); return m ? CUR_YEAR - +m[1] : null; };

// 分布统计
function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((f) => { const k = keyFn(f); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

// 内联横条分布
function DistBars({ data, color = '#22d3ee', max, onPick, active }) {
  const top = max || (data[0]?.[1] || 1);
  return (
    <div className="space-y-1.5">
      {data.map(([k, n]) => (
        <button key={k} onClick={onPick ? () => onPick(k) : undefined} className="w-full flex items-center gap-2 text-left"
          style={{ cursor: onPick ? 'pointer' : 'default', opacity: active && active !== k ? 0.45 : 1 }}>
          <span className="text-[11px] mono shrink-0 text-right" style={{ width: 70, color: active === k ? color : 'var(--text-secondary)' }}>{k}</span>
          <span className="flex-1 rounded-sm" style={{ height: 13, background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
            <span style={{ position: 'absolute', inset: 0, width: `${(n / top) * 100}%`, background: color, opacity: 0.7, borderRadius: 2 }} />
          </span>
          <span className="text-[11px] mono shrink-0" style={{ width: 26, color: 'var(--text-tertiary)' }}>{n}</span>
        </button>
      ))}
    </div>
  );
}

export default function Page() {
  const figures = useFigures();
  const [q, setQ] = useState('');
  const [prov, setProv] = useState('');
  const [level, setLevel] = useState('');
  const [role, setRole] = useState('');
  const [sector, setSector] = useState('');
  const [decade, setDecade] = useState('');
  const [minority, setMinority] = useState(false);
  const [sort, setSort] = useState('default');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const provinces = useMemo(() => [...new Set((figures || []).map((f) => f.province).filter(Boolean))].sort(), [figures]);
  const levels = useMemo(() => [...new Set((figures || []).map((f) => f.level).filter(Boolean))].sort((a, b) => (LEVEL_RANK[a] ?? 9) - (LEVEL_RANK[b] ?? 9)), [figures]);
  const sectors = useMemo(() => [...new Set((figures || []).map((f) => f.sector).filter(Boolean))], [figures]);
  const decades = useMemo(() => [...new Set((figures || []).map(decadeOf).filter((d) => d !== '未知'))].sort(), [figures]);

  const viceCount = (figures || []).filter((f) => f.level === '副国级').length;
  const ministerCount = (figures || []).filter((f) => f.level === '省部级' && f.province === '中央').length;
  const secCount = (figures || []).filter((f) => f.role === '党委书记').length;
  const citySecCount = (figures || []).filter((f) => ['党委书记', '省长', '市长', '自治区主席'].includes(f.role)).length;
  const minorityCount = (figures || []).filter((f) => f.fields?.ethnic && f.fields.ethnic !== '汉族').length;
  const ages = (figures || []).map(ageOf).filter(Boolean);
  const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : null;

  const filtered = useMemo(() => {
    const list = (figures || []).filter((f) => {
      const hay = [f.name, f.org, f.fields?.title, f.fields?.institution, f.fields?.rank, f.fields?.native, f.fields?.cityTier, f.province, short(f.province), f.role, f.level, f.sector, f.raw, ...(f.career || []).map((c) => c.desc)].join(' ');
      const sectorMatch = !sector || f.sector === sector || (sector === '地方' && f.province && f.province !== '中央');
      return (!prov || f.province === prov)
        && (!level || f.level === level)
        && (!role || f.role === role)
        && sectorMatch
        && (!decade || decadeOf(f) === decade)
        && (!minority || (f.fields?.ethnic && f.fields.ethnic !== '汉族'))
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'ageAsc') list.sort((a, b) => (ageOf(a) || 999) - (ageOf(b) || 999));
    else if (sort === 'ageDesc') list.sort((a, b) => (ageOf(b) || 0) - (ageOf(a) || 0));
    else if (sort === 'level') list.sort((a, b) => (LEVEL_RANK[a.level] ?? 9) - (LEVEL_RANK[b.level] ?? 9));
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    return list;
  }, [figures, q, prov, level, role, sector, decade, minority, sort]);

  const detail = sel || filtered[0] || null;
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')], prov && ['省份', short(prov), () => setProv('')],
    sector && ['系统', sector, () => setSector('')], level && ['层级', level, () => setLevel('')],
    role && ['职务', role, () => setRole('')], decade && ['年代', decade, () => setDecade('')],
    minority && ['民族', '少数民族', () => setMinority(false)],
  ].filter(Boolean);

  const loadSeed = async () => {
    setLoading(true);
    let ts = Date.now();
    for (const r of FIGURE_SEED) await DB.putFigure({ ...r, updatedAt: ts++ });
    setLoading(false);
  };
  const clearAll = () => { setQ(''); setProv(''); setLevel(''); setRole(''); setSector(''); setDecade(''); setMinority(false); };

  if (figures === null) return <div className="py-20 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载人才库…</div>;

  // 分布数据
  const distLevel = tally(filtered, (f) => f.level);
  const distSector = tally(filtered, (f) => f.sector || (f.province && f.province !== '中央' ? '地方' : ''));
  const distDecade = tally(filtered, decadeOf).sort((a, b) => a[0].localeCompare(b[0]));
  const distNative = tally(filtered, nativeProv).filter(([k]) => k !== '未知').slice(0, 12);
  const distProv = tally(filtered.filter((f) => f.province && f.province !== '中央'), (f) => short(f.province)).slice(0, 14);
  const ageHist = (() => {
    const buckets = [['≤50', 0], ['51-55', 0], ['56-58', 0], ['59-60', 0], ['61-62', 0], ['≥63', 0]];
    filtered.forEach((f) => { const a = ageOf(f); if (!a) return; if (a <= 50) buckets[0][1]++; else if (a <= 55) buckets[1][1]++; else if (a <= 58) buckets[2][1]++; else if (a <= 60) buckets[3][1]++; else if (a <= 62) buckets[4][1]++; else buckets[5][1]++; });
    return buckets;
  })();
  const ageBar = {
    grid: { left: 38, right: 12, top: 12, bottom: 22 },
    xAxis: { type: 'category', data: ageHist.map((b) => b[0]), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { color: '#93a1b5', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    tooltip: { trigger: 'axis' },
    series: [{ type: 'bar', data: ageHist.map((b) => b[1]), itemStyle: { color: '#c41e3a' }, barWidth: '60%' }],
  };

  return (
    <div>
      <PageHeader badge="Talent · 人才库" title="省部级公开履历人才库"
        subtitle={`地方 + 中央部委 / 国家机关 —— 内置 ${FIGURE_CATALOG_META.breakdown?.total || FIGURE_SEED.length} 条，截至 ${FIGURE_CATALOG_META.asOf}`} />
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px,1fr))' }}>
        <Stat value={figures.length} label="简历总数" accent="#22d3ee" />
        <Stat value={viceCount || '—'} label="副国级" accent="#c41e3a" />
        <Stat value={ministerCount || '—'} label="中央部委/机关" accent="#10b981" />
        <Stat value={citySecCount || secCount || '—'} label="书记/主官" accent="#e8a317" />
        <Stat value={avgAge || '—'} label="平均年龄" accent="#8b5cf6" />
        <Stat value={minorityCount || '—'} label="少数民族" accent="#fb923c" />
      </div>

      {figures.length < 10 && (
        <Card title="一键载入省部级公开履历" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            内置 {FIGURE_SEED.length} 条：省级 {FIGURE_CATALOG_META.breakdown?.provincial} + 中央 {FIGURE_CATALOG_META.breakdown?.central} + 扩展 {FIGURE_CATALOG_META.breakdown?.extended} + 城市 {FIGURE_CATALOG_META.breakdown?.municipal} + 机构 {FIGURE_CATALOG_META.breakdown?.org}。来源：{FIGURE_CATALOG_META.sources.join('、')}。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座 · 政治人物简历</Link> 增量导入或粘贴更新。
          </p>
          <button type="button" onClick={loadSeed} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${FIGURE_CATALOG_META.label}（${FIGURE_SEED.length} 条）`}
          </button>
        </Card>
      )}

      {!figures.length ? (
        <Card title="人才库为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置数据集，或到数据底座批量导入。</p></Card>
      ) : (
        <>
          {/* 工具条 */}
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 现任 / 籍贯 / 履历关键词" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={prov} onChange={(e) => setProv(e.target.value)} style={inp}><option value="">全部省份</option>{provinces.map((p) => <option key={p} value={p}>{short(p)}</option>)}</select>
              <select value={sector} onChange={(e) => setSector(e.target.value)} style={inp}><option value="">全部系统</option>{[...SECTOR_OPTS, ...sectors.filter((s) => !SECTOR_OPTS.includes(s))].map((s) => <option key={s} value={s}>{s}</option>)}</select>
              <select value={level} onChange={(e) => setLevel(e.target.value)} style={inp}><option value="">全部层级</option>{levels.map((l) => <option key={l} value={l}>{l}</option>)}</select>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={inp}><option value="">全部职务</option>{ROLE_OPTS.map((r) => <option key={r} value={r}>{r}</option>)}</select>
              <select value={decade} onChange={(e) => setDecade(e.target.value)} style={inp}><option value="">全部年代</option>{decades.map((d) => <option key={d} value={d}>{d}</option>)}</select>
              <button onClick={() => setMinority((v) => !v)} style={{ ...inp, cursor: 'pointer', background: minority ? 'rgba(251,146,60,0.18)' : 'var(--bg-base)', color: minority ? '#fb923c' : 'var(--text-secondary)', borderColor: minority ? '#fb923c' : 'var(--border-subtle)' }}>少数民族</button>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="default">默认排序</option><option value="ageAsc">年龄 ↑</option><option value="ageDesc">年龄 ↓</option><option value="level">按层级</option><option value="name">按姓名</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(34,211,238,0.18)' : 'var(--bg-base)', color: on ? 'var(--cyber-cyan)' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
              {figures.length < FIGURE_SEED.length && (
                <button onClick={loadSeed} disabled={loading} title="补全到最新内置库" style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lucide.RefreshCw size={13} />{loading ? '载入中…' : `补全 ${FIGURE_SEED.length} 条`}
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
            <div className="text-[11px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>命中 {filtered.length} / {figures.length} 条 · 平均 {avgAge}岁</div>
          </Card>

          {view === 'stats' ? (
            <Grid cols={2} className="mb-4">
              <Card title={`年龄结构 · 命中 ${filtered.length} 人`}><EChart option={ageBar} style={{ height: 200 }} /><p className="text-[10px] mono mt-1" style={{ color: 'var(--text-tertiary)' }}>// 按公开出生年份折算，截至 {CUR_YEAR}</p></Card>
              <Card title="层级分布"><DistBars data={distLevel} color="#c41e3a" onPick={(k) => setLevel(level === k ? '' : k)} active={level} /></Card>
              <Card title="出生年代"><DistBars data={distDecade} color="#8b5cf6" onPick={(k) => setDecade(decade === k ? '' : k)} active={decade} /></Card>
              <Card title="系统分布"><DistBars data={distSector} color="#10b981" /></Card>
              <Card title="籍贯 · 人才输出地 Top"><DistBars data={distNative} color="#e8a317" /></Card>
              <Card title="现任地域分布 Top"><DistBars data={distProv} color="#22d3ee" onPick={(k) => { const full = provinces.find((p) => short(p) === k); setProv(prov === full ? '' : full); }} active={short(prov)} /></Card>
            </Grid>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
              <Card title={`检索结果 (${filtered.length}/${figures.length})`}>
                {view === 'grid' ? (
                  <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', maxHeight: 540, overflowY: 'auto' }}>
                    {filtered.map((f) => (
                      <button key={f.id} onClick={() => setSel(f)} className="text-left p-2.5 rounded" style={{ background: detail?.id === f.id ? 'rgba(196,30,58,0.14)' : 'var(--bg-elevated)', border: `1px solid ${detail?.id === f.id ? 'var(--china-red)' : 'var(--border-subtle)'}`, cursor: 'pointer' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex items-center justify-center rounded-full shrink-0 text-xs font-bold" style={{ width: 26, height: 26, background: 'var(--bg-base)', color: 'var(--cyber-cyan)' }}>{f.name[0]}</span>
                          <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {f.province && <span className="text-[9px] mono px-1 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(f.province)}</span>}
                          {ageOf(f) && <span className="text-[9px] mono px-1 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>{ageOf(f)}岁</span>}
                        </div>
                        <div className="text-[10px] mt-1 truncate" style={{ color: 'var(--text-tertiary)' }}>{f.role || f.fields?.title || ''}</div>
                      </button>
                    ))}
                    {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                  </div>
                ) : (
                  <div className="space-y-1.5" style={{ maxHeight: 560, overflowY: 'auto' }}>
                    {filtered.map((f) => {
                      const on = detail?.id === f.id; const age = ageOf(f);
                      return (
                        <button key={f.id} onClick={() => setSel(f)} className="w-full text-left px-3 py-2 rounded" style={{ background: on ? 'rgba(196,30,58,0.14)' : 'var(--bg-elevated)', border: `1px solid ${on ? 'var(--china-red)' : 'transparent'}`, cursor: 'pointer' }}>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                            {age && <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{age}岁·{decadeOf(f)}</span>}
                            {f.level && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.12)', color: 'var(--china-red)' }}>{f.level}</span>}
                            {f.province && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(f.province)}</span>}
                            {f.role && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-base)', color: 'var(--text-tertiary)' }}>{f.role}</span>}
                            {f.sector && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>{f.sector}</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{f.fields?.title || f.org || ''}</span>
                            {f.fields?.native && <span className="text-[10px] mono shrink-0" style={{ color: 'var(--text-tertiary)' }}>籍 {nativeProv(f)}</span>}
                          </div>
                        </button>
                      );
                    })}
                    {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                  </div>
                )}
              </Card>

              <Card title={detail ? `${detail.name} · 履历详情` : '选择一位'}>
                {detail && (() => {
                  const age = ageOf(detail); const ten = tenureYears(detail);
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <span className="flex items-center justify-center rounded-full shrink-0 text-lg font-bold" style={{ width: 44, height: 44, background: 'var(--bg-base)', color: 'var(--cyber-cyan)' }}>{detail.name[0]}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{detail.name}</span>
                            {detail.level && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(196,30,58,0.12)', color: 'var(--china-red)' }}>{detail.level}</span>}
                            {age && <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{age}岁 · {decadeOf(detail)}</span>}
                          </div>
                          <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{detail.fields?.title || ''}</div>
                        </div>
                      </div>
                      <div className="grid gap-1.5 text-xs mb-3" style={{ gridTemplateColumns: 'auto 1fr' }}>
                        {detail.org && <><span style={{ color: 'var(--text-tertiary)' }}>机构</span><span style={{ color: 'var(--text-secondary)' }}>{detail.org}{detail.sector ? `（${detail.sector}）` : ''}</span></>}
                        {detail.province && <><span style={{ color: 'var(--text-tertiary)' }}>关联地域</span><span style={{ color: 'var(--text-secondary)' }}>{detail.province === '中央' ? '中央/国家机构' : detail.province}</span></>}
                        {detail.fields?.native && <><span style={{ color: 'var(--text-tertiary)' }}>籍贯</span><span style={{ color: 'var(--text-secondary)' }}>{detail.fields.native}</span></>}
                        {detail.fields?.ethnic && detail.fields.ethnic !== '汉族' && <><span style={{ color: 'var(--text-tertiary)' }}>民族</span><span style={{ color: '#fb923c' }}>{detail.fields.ethnic}</span></>}
                        {detail.fields?.birth && <><span style={{ color: 'var(--text-tertiary)' }}>出生</span><span style={{ color: 'var(--text-secondary)' }}>{detail.fields.birth}{age ? ` · 现 ${age} 岁` : ''}</span></>}
                        {detail.fields?.rank && <><span style={{ color: 'var(--text-tertiary)' }}>中委身份</span><span style={{ color: 'var(--text-secondary)' }}>{detail.fields.rank}</span></>}
                        {ten != null && <><span style={{ color: 'var(--text-tertiary)' }}>现职任期</span><span style={{ color: 'var(--text-secondary)' }}>约 {ten} 年</span></>}
                        {detail.fields?.edu && <><span style={{ color: 'var(--text-tertiary)' }}>学历</span><span style={{ color: 'var(--text-secondary)' }}>{detail.fields.edu}</span></>}
                        {detail.fields?.note && <><span style={{ color: 'var(--text-tertiary)' }}>备注</span><span style={{ color: '#e8a317' }}>{detail.fields.note}</span></>}
                      </div>
                      {detail.career?.length > 0 ? (
                        <div>
                          <div className="text-[10px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>公开任职时间线 · {detail.career.length} 条</div>
                          <div className="space-y-2">
                            {detail.career.map((c, i) => (
                              <div key={i} className="flex gap-2.5" style={{ position: 'relative' }}>
                                <span className="text-[11px] mono shrink-0 text-right pt-px" style={{ width: 78, color: 'var(--cyber-cyan)' }}>{c.from}{c.to ? `–${c.to}` : '–今'}</span>
                                <span className="shrink-0" style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 5, background: c.to ? 'var(--text-tertiary)' : 'var(--china-red)' }} />
                                <span className="text-xs flex-1" style={{ color: 'var(--text-secondary)' }}>{c.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>暂无结构化履历条目。</p>}
                      <div className="mt-3 pt-3 text-[11px] flex flex-wrap gap-x-3" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                        <span>来源：{detail.source || '用户导入'}</span>
                        {detail.asOf && <span>截至：{detail.asOf}</span>}
                      </div>
                    </>
                  );
                })()}
              </Card>
            </div>
          )}
        </>
      )}
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        仅收录公开任职履历，不含私人信息（住址/家庭/联系方式/财产）；年龄按公开出生年份折算，任免以新华社/人民网/中国政府网发布为准。
        {FIGURE_CATALOG_META.notes && ` ${FIGURE_CATALOG_META.notes}。`}
        与治国沙盒「可选简历」按省联动。
      </p>
    </div>
  );
}
