import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat } from '../../app/ui.jsx';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { useBusinessElite } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  BUSINESS_ELITE_SEED_PKG,
  BUSINESS_ELITE_META,
  BUSINESS_ELITE_COUNT,
} from '../../lib/db/businessEliteSeed.js';

const short = (p) => (p || '').replace(/(省|市|自治区|回族|壮族|维吾尔)/g, '');
const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(232,163,23,0.14)', color: '#e8a317', border: '1px solid rgba(232,163,23,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };

const TAB_LABEL = { founder: '创始人', executive: '高管', investor: '投资人', industry_leader: '行业领袖' };
const CAT_RANK = { founder: 0, executive: 1, investor: 2, industry_leader: 3 };
const HONOR_PATTERNS = [
  ['工商联', /工商联/],
  ['人大代表/政协', /人大代表|全国政协委员/],
  ['院士', /院士/],
  ['首富/富豪榜', /首富|富豪榜/],
  ['改革先锋', /改革先锋/],
  ['慈善', /慈善/],
  ['已故', /已故/],
];

function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((r) => { const k = keyFn(r); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function honorTags(r) {
  const hay = [r.title, r.honors, r.notes, r.background].filter(Boolean).join(' ');
  const tags = HONOR_PATTERNS.filter(([, re]) => re.test(hay)).map(([k]) => k);
  if (r.notes?.includes('已故')) tags.push('已故');
  return [...new Set(tags)];
}

function preview(text, max = 52) {
  if (!text) return '';
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

function DistBars({ data, color = '#e8a317', max, onPick, active }) {
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
        background: on ? 'rgba(232,163,23,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${on ? '#e8a317' : 'var(--border-subtle)'}`,
        cursor: 'pointer', padding: dense ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-2">
        <FigureAvatar name={r.name} size={dense ? 28 : 32} ring={on} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>{TAB_LABEL[r.category] || r.category}</span>
            {r.province && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{short(r.province)}</span>}
            {r.industry && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>{preview(r.industry, 8)}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {r.company}{r.title ? ` · ${r.title}` : ''}
          </div>
          {honors.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {honors.slice(0, 3).map((h) => (
                <span key={h} className="text-[8px] mono px-1 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>{h}</span>
              ))}
            </div>
          )}
          {r.achievements && (
            <div className="text-[10px] mt-1 truncate" style={{ color: 'var(--cyber-cyan)', opacity: 0.85 }}>
              {preview(r.achievements)}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function BusinessEliteSection() {
  const { rows, ready } = useBusinessElite();
  const [catTab, setCatTab] = useState('founder');
  const [q, setQ] = useState('');
  const [industry, setIndustry] = useState('');
  const [province, setProvince] = useState('');
  const [honor, setHonor] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('list');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);

  const list = rows || [];
  const tabList = useMemo(() => list.filter((r) => r.category === catTab), [list, catTab]);

  const industries = useMemo(() => [...new Set(tabList.map((r) => r.industry).filter(Boolean))].sort(), [tabList]);
  const provinces = useMemo(() => [...new Set(tabList.map((r) => r.province).filter(Boolean))].sort(), [tabList]);
  const honorOpts = useMemo(() => {
    const set = new Set();
    tabList.forEach((r) => honorTags(r).forEach((h) => set.add(h)));
    return [...set].sort();
  }, [tabList]);

  const filtered = useMemo(() => {
    const out = tabList.filter((r) => {
      const hay = [r.name, r.company, r.industry, r.title, r.achievements, r.honors, r.background, r.province, r.notes, r.source].join(' ');
      const honorMatch = !honor || honorTags(r).includes(honor);
      return (!industry || r.industry === industry)
        && (!province || r.province === province)
        && honorMatch
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'category') out.sort((a, b) => (CAT_RANK[a.category] ?? 9) - (CAT_RANK[b.category] ?? 9));
    else if (sort === 'province') out.sort((a, b) => (a.province || '').localeCompare(b.province || '', 'zh'));
    return out;
  }, [tabList, q, industry, province, honor, sort]);

  const detail = sel || filtered[0] || null;
  const founderCount = list.filter((r) => r.category === 'founder').length;
  const execCount = list.filter((r) => r.category === 'executive').length;
  const investorCount = list.filter((r) => r.category === 'investor').length;
  const leaderCount = list.filter((r) => r.category === 'industry_leader').length;

  const distIndustry = tally(filtered, (r) => r.industry);
  const distProvince = tally(filtered, (r) => short(r.province) || r.province);

  const industryChart = {
    grid: { left: 100, right: 16, top: 12, bottom: 24 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    yAxis: { type: 'category', data: distIndustry.slice(0, 12).map(([k]) => k).reverse(), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'bar', data: distIndustry.slice(0, 12).map(([, n]) => n).reverse(), barWidth: 14, itemStyle: { color: '#e8a317', borderRadius: 3 } }],
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  };

  const regionMapData = distProvince.slice(0, 20);
  const regionChart = regionMapData.length ? {
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 16, top: 8, bottom: 24 },
    xAxis: { type: 'category', data: regionMapData.map(([k]) => k), axisLabel: { color: '#93a1b5', fontSize: 10, rotate: 35 }, axisLine: { lineStyle: { color: '#27324a' } } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    series: [{ type: 'bar', data: regionMapData.map(([, n]) => n), barWidth: '55%', itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } }],
  } : null;

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖商业精英数据集（${BUSINESS_ELITE_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...BUSINESS_ELITE_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const clearAll = () => { setQ(''); setIndustry(''); setProvince(''); setHonor(''); setSel(null); };
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    industry && ['行业', industry, () => setIndustry('')],
    province && ['省份', short(province), () => setProvince('')],
    honor && ['标签', honor, () => setHonor('')],
  ].filter(Boolean);

  const pickByIndex = useCallback((idx) => {
    const r = filtered[idx];
    if (r) setSel(r);
  }, [filtered]);

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

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载商业精英库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>
          <Lucide.Briefcase size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>商业精英 · 民营经济的权力节点</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            人才库子模块 · 创始人 / 高管 / 投资人 / 行业领袖 —— 内置 {BUSINESS_ELITE_COUNT.total} 条，截至 {BUSINESS_ELITE_META.asOf}
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px,1fr))' }}>
        <Stat value={founderCount} label="创始人" accent="#e8a317" />
        <Stat value={execCount} label="高管" accent="#22d3ee" />
        <Stat value={investorCount} label="投资人" accent="#10b981" />
        <Stat value={leaderCount} label="行业领袖" accent="#a78bfa" />
        <Stat value={industries.length} label="行业门类" accent="#f0abfc" />
        <Stat value={filtered.length} label="当前命中" />
      </div>

      <div className="flex gap-1 flex-wrap mb-4">
        {Object.entries(TAB_LABEL).map(([k, label]) => (
          <button key={k} type="button" onClick={() => { setCatTab(k); setSel(null); clearAll(); }}
            className="text-sm px-3 py-1.5 mono"
            style={{ background: catTab === k ? 'rgba(232,163,23,0.2)' : 'var(--bg-elevated)', color: catTab === k ? '#fff' : 'var(--text-secondary)', border: catTab === k ? '1px solid rgba(232,163,23,0.5)' : '1px solid transparent', borderRadius: 6, cursor: 'pointer' }}>
            {label} ({list.filter((r) => r.category === k).length})
          </button>
        ))}
      </div>

      {list.length < 10 && (
        <Card title="一键载入商业精英库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（business-elite-2026-06），与政治人才 figures 及文化精英库隔离。来源：{BUSINESS_ELITE_META.sources.slice(0, 4).join('、')}等。
            也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${BUSINESS_ELITE_META.label}（${BUSINESS_ELITE_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="数据集为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置商业精英名单。</p></Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 公司 / 行业 / 成就" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={inp}><option value="">全部行业</option>{industries.map((d) => <option key={d} value={d}>{d}</option>)}</select>
              <select value={province} onChange={(e) => setProvince(e.target.value)} style={inp}><option value="">全部省份</option>{provinces.map((p) => <option key={p} value={p}>{short(p) || p}</option>)}</select>
              {honorOpts.length > 0 && (
                <select value={honor} onChange={(e) => setHonor(e.target.value)} style={inp}><option value="">全部标签</option>{honorOpts.map((h) => <option key={h} value={h}>{h}</option>)}</select>
              )}
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="name">按名称</option>
                <option value="province">按省份</option>
                <option value="category">按类别</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(232,163,23,0.18)' : 'var(--bg-base)', color: on ? '#e8a317' : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
              {list.length < BUSINESS_ELITE_COUNT.total && (
                <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={{ ...inp, cursor: 'pointer', color: '#10b981', borderColor: 'rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lucide.RefreshCw size={13} />{loading ? '载入中…' : `补全 ${BUSINESS_ELITE_COUNT.total} 条`}
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
              {TAB_LABEL[catTab]} · 命中 {filtered.length} / {tabList.length} 条 · ↑↓ 或 j/k 切换 · {BUSINESS_ELITE_META.scope}
            </p>
          </Card>

          {view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <div className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>
                // 行业/地域分布基于当前筛选 {filtered.length} 条；资本与产业的交叉节点
              </div>
              <Grid cols={2}>
                <Card title="行业分布"><EChart option={industryChart} style={{ height: Math.max(240, distIndustry.slice(0, 12).length * 22) }} /></Card>
                {regionChart && <Card title="地域分布"><EChart option={regionChart} style={{ height: 260 }} /></Card>}
              </Grid>
              <Grid cols={2}>
                <Card title="行业（点选筛选）"><DistBars data={distIndustry.slice(0, 10)} onPick={(k) => setIndustry(industry === k ? '' : k)} active={industry} /></Card>
                <Card title="省份（点选筛选）"><DistBars data={distProvince.slice(0, 10)} color="#22d3ee" onPick={(k) => { const full = provinces.find((p) => short(p) === k); setProvince(province === full ? '' : full); }} active={short(province)} /></Card>
              </Grid>
              <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>// 数据边界：{BUSINESS_ELITE_META.notes}</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', maxHeight: 620, overflowY: 'auto' }}>
              {filtered.map((r) => (
                <EliteCard key={r.id || r.name} r={r} on={detail === r} onClick={() => setSel(r)} dense />
              ))}
              {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
              <Card title={`${TAB_LABEL[catTab]} (${filtered.length}/${tabList.length})`}>
                <div className="space-y-1.5" style={{ maxHeight: 560, overflowY: 'auto' }}>
                  {filtered.map((r) => (
                    <EliteCard key={r.id || r.name} r={r} on={detail === r} onClick={() => setSel(r)} />
                  ))}
                  {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                </div>
              </Card>

              <Card title={detail ? `${detail.name} · 详情` : '选择一位'}>
                {detail && (
                  <>
                    <div className="flex items-center gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <FigureAvatar name={detail.name} size={44} ring />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{detail.name}</span>
                          <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(232,163,23,0.12)', color: '#e8a317' }}>{TAB_LABEL[detail.category]}</span>
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{detail.title}{detail.company ? ` · ${detail.company}` : ''}</div>
                        {honorTags(detail).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {honorTags(detail).map((h) => (
                              <span key={h} className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>{h}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-1.5 text-xs mb-3" style={{ gridTemplateColumns: 'auto 1fr' }}>
                      {detail.company && <><span style={{ color: 'var(--text-tertiary)' }}>公司/机构</span><span style={{ color: 'var(--text-secondary)' }}>{detail.company}</span></>}
                      {detail.industry && <><span style={{ color: 'var(--text-tertiary)' }}>行业</span><span style={{ color: 'var(--text-secondary)' }}>{detail.industry}</span></>}
                      {detail.province && <><span style={{ color: 'var(--text-tertiary)' }}>省份</span><span style={{ color: 'var(--text-secondary)' }}>{detail.province}</span></>}
                      {detail.achievements && <><span style={{ color: 'var(--text-tertiary)' }}>代表成就</span><span style={{ color: 'var(--cyber-cyan)' }}>{detail.achievements}</span></>}
                      {detail.honors && detail.honors !== '—' && <><span style={{ color: 'var(--text-tertiary)' }}>荣誉</span><span style={{ color: '#d4af37' }}>{detail.honors}</span></>}
                      {detail.background && <><span style={{ color: 'var(--text-tertiary)' }}>背景</span><span style={{ color: 'var(--text-secondary)' }}>{detail.background}</span></>}
                      {detail.source && <><span style={{ color: 'var(--text-tertiary)' }}>来源</span><span style={{ color: 'var(--text-tertiary)' }}>{detail.source}</span></>}
                      {detail.notes && <><span style={{ color: 'var(--text-tertiary)' }}>备注</span><span style={{ color: 'var(--text-secondary)' }}>{detail.notes}</span></>}
                    </div>
                    <p className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
                      // 公开信息口径 · 与 <Link to="/enterprise500" className="mono" style={{ color: 'var(--cyber-cyan)' }}>民企500强</Link> 公司视角互补
                    </p>
                  </>
                )}
              </Card>
            </div>
          )}
        </>
      )}

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        数据来源：{BUSINESS_ELITE_META.sources.join('、')} · {BUSINESS_ELITE_META.notes} · 研究参考
      </p>
    </section>
  );
}
