import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as echarts from 'echarts';
import * as Lucide from 'lucide-react';
import { Card, Grid, Stat, DistBar } from '../../app/ui.jsx';
import FigureAvatar from '../../lib/ui/FigureAvatar.jsx';
import { figureAvatarProps, prefetchFigureAvatars } from '../../lib/ui/figureAvatarResolve.js';
import EChart from '../../lib/viz/EChart.jsx';
import DataBus from '../../lib/data/DataBus.js';
import { chartTextColor } from '../shared/chartHelpers.js';
import { getTheme, THEME_EVENT } from '../../lib/theme.js';
import { useDiplomaticCorps } from '../../lib/db/useDataset.js';
import * as DB from '../../lib/db/localdb.js';
import {
  DIPLOMATIC_CORPS_SEED_PKG,
  DIPLOMATIC_CORPS_META,
  DIPLOMATIC_CORPS_DEDUPED_COUNT,
  dedupeDiplomaticCorps,
  DC_REGIONS,
  DC_TAB_LABEL,
  dcKey,
} from '../../lib/db/diplomaticCorpsSeed.js';
import { useTalentDeepLink } from '../../lib/talent/routing.js';
import TalentDetailPanel, { DetailBodyText, ExpandableText } from './TalentDetailPanel.jsx';
import { buildDetailFooter } from '../../lib/talent/metadata.jsx';

const inp = { background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 6, padding: '6px 10px', fontSize: 13 };
const btn = { background: 'rgba(245,158,11,0.14)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 6, padding: '6px 14px', fontSize: 13, cursor: 'pointer' };
const ACCENT = '#f59e0b';

const REGION_COLOR = {
  亚太: '#0ea5e9', 欧洲: '#a78bfa', 北美: '#22d3ee', 拉美: '#10b981',
  非洲: '#e8a317', 中东: '#f97316', 国际组织: '#64748b',
};

const COUNTRY_LABEL = {
  US: '美国', CA: '加拿大', GB: '英国', FR: '法国', DE: '德国', IT: '意大利', ES: '西班牙',
  NL: '荷兰', BE: '比利时', PL: '波兰', SE: '瑞典', CH: '瑞士', AT: '奥地利', GR: '希腊',
  PT: '葡萄牙', HU: '匈牙利', CZ: '捷克', RO: '罗马尼亚', FI: '芬兰', DK: '丹麦', NO: '挪威',
  IE: '爱尔兰', RS: '塞尔维亚', UA: '乌克兰', BY: '白俄罗斯', RU: '俄罗斯',
  JP: '日本', KR: '韩国', IN: '印度', AU: '澳大利亚', NZ: '新西兰', PK: '巴基斯坦',
  ID: '印度尼西亚', TH: '泰国', VN: '越南', PH: '菲律宾', MY: '马来西亚', SG: '新加坡',
  MM: '缅甸', KH: '柬埔寨', LA: '老挝', NP: '尼泊尔', BD: '孟加拉国', LK: '斯里兰卡',
  MV: '马尔代夫', MN: '蒙古', KZ: '哈萨克斯坦', UZ: '乌兹别克斯坦', TM: '土库曼斯坦',
  KG: '吉尔吉斯斯坦', TJ: '塔吉克斯坦', AF: '阿富汗', BN: '文莱', TL: '东帝汶',
  HK: '香港', MO: '澳门', FJ: '菲律宾', BR: '巴西', AR: '阿根廷', MX: '墨西哥', CL: '智利',
  PE: '秘鲁', CO: '哥伦比亚', VE: '委内瑞拉', CU: '古巴', EC: '厄瓜多尔', BO: '玻利维亚',
  UY: '乌拉圭', CR: '哥斯达黎加', PA: '巴拿马', JM: '牙买加', BB: '巴巴多斯',
  ZA: '南非', EG: '埃及', NG: '尼日利亚', KE: '肯尼亚', ET: '埃塞俄比亚', TZ: '坦桑尼亚',
  GH: '加纳', DZ: '阿尔及利亚', MA: '摩洛哥', TN: '突尼斯', AO: '安哥拉', ZM: '赞比亚',
  ZW: '津巴布韦', CM: '喀麦隆', CD: '刚果(金)', SD: '苏丹', SS: '南苏丹', RW: '卢旺达',
  UG: '乌干达', SN: '塞内加尔', CI: '科特迪瓦', MU: '毛里求斯', SC: '塞舌尔', MG: '马达加斯加',
  BW: '博茨瓦纳', NA: '纳米比亚', MZ: '莫桑比克', LR: '利比里亚', SL: '塞拉利昂', GN: '几内亚',
  ML: '马里', NE: '尼日尔', TD: '乍得', CF: '中非', CG: '刚果(布)', GA: '加蓬', GQ: '赤道几内亚',
  DJ: '吉布提', ER: '厄立特里亚', SO: '索马里', MW: '马拉维', LS: '莱索托', SZ: '斯威士兰',
  CV: '佛得角', GW: '几内亚比绍', GM: '冈比亚', TG: '多哥', BJ: '贝宁', MR: '毛里塔尼亚',
  KM: '科摩罗', ST: '圣多美和普林西比',
  SA: '沙特阿拉伯', AE: '阿联酋', IR: '伊朗', IL: '以色列', TR: '土耳其', IQ: '伊拉克',
  JO: '约旦', LB: '黎巴嫩', SY: '叙利亚', QA: '卡塔尔', KW: '科威特', BH: '巴林', OM: '阿曼',
  YE: '也门', PS: '巴勒斯坦',
  UN: '联合国', WTO: '世贸组织', EU: '欧盟', ASEAN: '东盟', AUCOM: '非盟', LAS: '阿盟',
  OIC: '伊斯兰合作组织', WHO: '世卫组织', IAEA: '国际原子能机构', UNESCO: '教科文组织',
  IMO: '国际海事组织', FAO: '粮农组织', ILO: '劳工组织', WIPO: '知识产权组织',
  ICAO: '民航组织', UNIDO: '工发组织', SCO: '上合组织', BRICS: '金砖',
};

const TAB_DESC = '驻外使节公开任职图谱；与境内政要/知识精英队列分轨';

const worldMapState = { registered: false, promise: null };

function loadWorldMap({ force = false } = {}) {
  if (force) {
    worldMapState.registered = false;
    worldMapState.promise = null;
    DataBus.clearCache();
  }
  if (worldMapState.registered) return Promise.resolve();
  if (!worldMapState.promise) {
    worldMapState.promise = DataBus.worldGeo()
      .then((geo) => {
        echarts.registerMap('world', geo);
        worldMapState.registered = true;
      });
  }
  return worldMapState.promise;
}

function tally(arr, keyFn) {
  const m = new Map();
  arr.forEach((r) => { const k = keyFn(r); if (k) m.set(k, (m.get(k) || 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function EnvoyCard({ r, on, onClick, dense = false }) {
  const country = COUNTRY_LABEL[r.hostCountry] || r.hostCountry;
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded"
      style={{
        background: on ? 'rgba(245,158,11,0.14)' : 'var(--bg-elevated)',
        border: `1px solid ${on ? ACCENT : 'var(--border-subtle)'}`,
        cursor: 'pointer', padding: dense ? '8px 10px' : '10px 12px',
      }}>
      <div className="flex items-start gap-2">
        <FigureAvatar {...figureAvatarProps(r)} size={dense ? 28 : 32} ring={on} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
            {r.nameEn && <span className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{r.nameEn}</span>}
            <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: `${REGION_COLOR[r.region] || ACCENT}22`, color: REGION_COLOR[r.region] || ACCENT }}>{r.role}</span>
            {country && <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--cyber-cyan)' }}>{country}</span>}
          </div>
          <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
            {r.hostCity}{r.rank ? ` · ${r.rank}` : ''}
          </div>
          {r.careerHighlights && (
            <div className="text-[10px] mt-1 truncate" style={{ color: 'var(--text-tertiary)' }}>{r.careerHighlights}</div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function DiplomaticCorpsSection() {
  const { rows, ready } = useDiplomaticCorps();
  const [searchParams, setSearchParams] = useSearchParams();
  const dcParam = searchParams.get('dc');
  const [regionTab, setRegionTab] = useState(dcParam && DC_REGIONS.includes(dcParam) ? dcParam : 'all');
  const [q, setQ] = useState('');
  const [hostCountry, setHostCountry] = useState('');
  const [role, setRole] = useState('');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('map');
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapStatus, setMapStatus] = useState('loading');
  const [theme, setTheme] = useState(getTheme);
  const chartRef = useRef(null);

  const { list, regionCounts } = useMemo(() => {
    const { rows: deduped } = dedupeDiplomaticCorps(rows || []);
    const counts = Object.fromEntries(DC_REGIONS.map((k) => [k, 0]));
    deduped.forEach((r) => { if (counts[r.region] != null) counts[r.region] += 1; });
    return { list: deduped, regionCounts: counts };
  }, [rows]);

  const tabList = useMemo(() => (
    regionTab === 'all' ? list : list.filter((r) => r.region === regionTab)
  ), [list, regionTab]);

  const countries = useMemo(() => [...new Set(tabList.map((r) => r.hostCountry).filter(Boolean))].sort(), [tabList]);
  const roles = useMemo(() => [...new Set(tabList.map((r) => r.role).filter(Boolean))].sort(), [tabList]);
  const countryCount = useMemo(() => new Set(list.map((r) => r.hostCountry).filter(Boolean)).size, [list]);
  const ambassadorCount = useMemo(() => list.filter((r) => r.role === '大使' || r.role === '特命全权大使').length, [list]);
  const consulCount = useMemo(() => list.filter((r) => r.role === '总领事').length, [list]);
  const envoyCount = useMemo(() => list.filter((r) => r.role === '公使').length, [list]);

  const filtered = useMemo(() => {
    const out = tabList.filter((r) => {
      const hay = [r.name, r.nameEn, r.role, r.hostCountry, r.hostCity, r.region, r.careerHighlights,
        ...(r.previousPosts || []), COUNTRY_LABEL[r.hostCountry]].join(' ');
      return (!hostCountry || r.hostCountry === hostCountry)
        && (!role || r.role === role)
        && (!q || hay.toLowerCase().includes(q.toLowerCase()));
    });
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    else if (sort === 'country') out.sort((a, b) => (a.hostCountry || '').localeCompare(b.hostCountry || ''));
    else if (sort === 'region') out.sort((a, b) => DC_REGIONS.indexOf(a.region) - DC_REGIONS.indexOf(b.region));
    return out;
  }, [tabList, q, hostCountry, role, sort]);

  useEffect(() => {
    if (filtered.length) prefetchFigureAvatars(filtered, 56);
  }, [filtered]);

  const detail = useMemo(() => {
    if (sel) {
      const hit = filtered.find((r) => dcKey(r) === dcKey(sel));
      if (hit) return hit;
    }
    return searchParams.get('id') ? null : (filtered[0] || null);
  }, [sel, filtered, searchParams]);

  const { selectEntity } = useTalentDeepLink({
    searchParams, setSearchParams, filtered, allList: list, sel, setSel, ready,
    preserveKeys: ['dc'], keyFn: dcKey,
  });

  const fetchWorldMap = useCallback((force = false) => {
    setMapStatus('loading');
    loadWorldMap({ force })
      .then(() => setMapStatus('ready'))
      .catch(() => setMapStatus('error'));
  }, []);

  useEffect(() => { fetchWorldMap(); }, [fetchWorldMap]);

  useEffect(() => {
    const onTheme = () => setTheme(getTheme());
    window.addEventListener(THEME_EVENT, onTheme);
    return () => window.removeEventListener(THEME_EVENT, onTheme);
  }, []);

  const mapScatter = useMemo(() => {
    const byCountry = new Map();
    filtered.forEach((r) => {
      if (r.lat == null || r.lng == null) return;
      const k = r.hostCountry;
      if (!byCountry.has(k)) {
        byCountry.set(k, { country: k, region: r.region, lat: r.lat, lng: r.lng, envoys: [] });
      }
      byCountry.get(k).envoys.push(r);
    });
    return [...byCountry.values()];
  }, [filtered]);

  const mapOption = useMemo(() => {
    if (mapStatus !== 'ready' || !mapScatter.length) return null;
    const isDark = theme !== 'light';
    const series = DC_REGIONS.filter((reg) => mapScatter.some((d) => d.region === reg)).map((reg) => ({
      name: reg,
      type: 'scatter',
      coordinateSystem: 'geo',
      symbolSize: (val) => Math.min(28, 8 + (val[2] || 1) * 3),
      itemStyle: { color: REGION_COLOR[reg], opacity: 0.85 },
      data: mapScatter.filter((d) => d.region === reg).map((d) => ({
        name: COUNTRY_LABEL[d.country] || d.country,
        value: [d.lng, d.lat, d.envoys.length],
        hostCountry: d.country,
        envoys: d.envoys,
      })),
    }));
    return {
      geo: {
        map: 'world',
        roam: true,
        zoom: 1.15,
        center: [20, 20],
        itemStyle: {
          areaColor: isDark ? '#0f1623' : '#e8edf4',
          borderColor: isDark ? '#27324a' : 'rgba(58,70,89,0.22)',
        },
        emphasis: {
          itemStyle: { areaColor: isDark ? '#1a2438' : 'rgba(8,145,178,0.25)' },
        },
      },
      legend: { bottom: 0, textStyle: { color: chartTextColor(), fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
      tooltip: {
        trigger: 'item',
        formatter: (p) => {
          const d = p.data;
          if (!d?.envoys) return p.name;
          const names = d.envoys.slice(0, 4).map((e) => `${e.name}（${e.role}）`).join('<br/>');
          const more = d.envoys.length > 4 ? `<br/>…等 ${d.envoys.length} 位` : '';
          return `<b>${p.name}</b><br/>驻节 ${d.envoys.length} 人<br/>${names}${more}`;
        },
      },
      series,
    };
  }, [mapStatus, mapScatter, theme]);

  const onMapReady = useCallback((chart) => {
    chartRef.current = chart;
    chart.off('click');
    chart.on('click', (params) => {
      const code = params.data?.hostCountry;
      if (code) {
        setHostCountry((prev) => (prev === code ? '' : code));
        if (params.data?.envoys?.length === 1) selectEntity(params.data.envoys[0]);
      }
    });
  }, [selectEntity]);

  useEffect(() => {
    if (chartRef.current && mapOption) chartRef.current.setOption(mapOption, true);
  }, [mapOption]);

  const distRegion = tally(filtered, (r) => r.region);
  const distRole = tally(filtered, (r) => r.role);

  const loadSeed = async (replace = false) => {
    if (replace && list.length && !window.confirm(`将覆盖外交人才数据集（${DIPLOMATIC_CORPS_DEDUPED_COUNT.total} 条），继续？`)) return;
    setLoading(true);
    await DB.putDataset({ ...DIPLOMATIC_CORPS_SEED_PKG, stampMs: Date.now() });
    setLoading(false);
  };

  const clearAll = () => { setQ(''); setHostCountry(''); setRole(''); setSel(null); };
  const activeChips = [
    q && ['搜索', `“${q}”`, () => setQ('')],
    hostCountry && ['驻在国', COUNTRY_LABEL[hostCountry] || hostCountry, () => setHostCountry('')],
    role && ['职务', role, () => setRole('')],
  ].filter(Boolean);

  const pickByIndex = useCallback((idx) => {
    const r = filtered[idx];
    if (r) selectEntity(r);
  }, [filtered, selectEntity]);

  useEffect(() => {
    const onKey = (e) => {
      if (!filtered.length || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      const cur = detail ? filtered.findIndex((r) => dcKey(r) === dcKey(detail)) : 0;
      if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); pickByIndex(Math.min(cur + 1, filtered.length - 1)); }
      else if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); pickByIndex(Math.max(cur - 1, 0)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, detail, pickByIndex]);

  if (!ready) return <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 加载外交人才库…</div>;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'rgba(245,158,11,0.12)', color: ACCENT }}>
          <Lucide.Landmark size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>外交人才 · 驻外使节全图</h2>
          <p className="text-[11px] mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {TAB_DESC} —— 内置 {DIPLOMATIC_CORPS_DEDUPED_COUNT.total} 条，覆盖 {countryCount} 个驻在国/组织，截至 {DIPLOMATIC_CORPS_META.asOf}。外交部长见<Link to="/talent" className="mx-0.5" style={{ color: 'var(--cyber-cyan)' }}>中国政要</Link>。
          </p>
        </div>
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px,1fr))' }}>
        <Stat value={countryCount} label="覆盖国家/组织" accent="#22d3ee" />
        <Stat value={ambassadorCount} label="大使" accent={ACCENT} />
        <Stat value={consulCount} label="总领事" accent="#0ea5e9" />
        <Stat value={envoyCount || '—'} label="公使" accent="#a78bfa" />
        <Stat value={filtered.length} label="当前命中" />
      </div>

      <div className="flex gap-1 flex-wrap mb-4">
        <button type="button" onClick={() => { setRegionTab('all'); setSel(null); clearAll(); const n = new URLSearchParams(searchParams); n.delete('dc'); n.delete('id'); setSearchParams(n, { replace: true }); }}
          className={`text-sm px-3 py-1.5 mono os-filter-chip ${regionTab === 'all' ? 'is-active' : ''}`} style={{ '--chip-accent': ACCENT }}>
          全部 ({list.length})
        </button>
        {DC_REGIONS.map((k) => (
          <button key={k} type="button" onClick={() => {
            setRegionTab(k); setSel(null); clearAll();
            const next = new URLSearchParams(searchParams);
            next.set('dc', k); next.delete('id');
            setSearchParams(next, { replace: true });
          }}
            className={`text-sm px-3 py-1.5 mono os-filter-chip ${regionTab === k ? 'is-active' : ''}`}
            style={{ '--chip-accent': REGION_COLOR[k] }}>
            {DC_TAB_LABEL[k]} ({regionCounts[k] ?? 0})
          </button>
        ))}
      </div>

      {list.length < 10 && (
        <Card title="一键载入外交人才库" className="mb-4">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            独立数据集（diplomatic-corps-2026-06），与政要/海外人才隔离。也可到 <Link to="/foundation" className="mono" style={{ color: 'var(--cyber-cyan)' }}>数据底座</Link> 载入。
          </p>
          <button type="button" onClick={() => loadSeed(false)} disabled={loading} style={btn}>
            {loading ? '载入中…' : `载入 ${DIPLOMATIC_CORPS_META.label}（${DIPLOMATIC_CORPS_DEDUPED_COUNT.total} 条）`}
          </button>
        </Card>
      )}

      {!list.length ? (
        <Card title="驻外使节队列为空"><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>点击上方按钮载入内置外交人才数据集。</p></Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-1.5 px-2 rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: 180 }}>
                <Lucide.Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="姓名 / 驻在国 / 城市 / 职务" style={{ ...inp, background: 'transparent', border: 'none', flex: 1, padding: '6px 0' }} />
              </div>
              <select value={hostCountry} onChange={(e) => setHostCountry(e.target.value)} style={inp}>
                <option value="">全部驻在国</option>
                {countries.map((c) => <option key={c} value={c}>{COUNTRY_LABEL[c] || c}</option>)}
              </select>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={inp}>
                <option value="">全部职务</option>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
                <option value="name">按名称</option>
                <option value="country">按驻在国</option>
                <option value="region">按大区</option>
              </select>
              <div className="flex rounded overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                {[['map', 'Globe2'], ['list', 'List'], ['grid', 'LayoutGrid'], ['stats', 'BarChart3']].map(([v, ic]) => {
                  const I = Lucide[ic]; const on = view === v;
                  return <button key={v} type="button" onClick={() => setView(v)} style={{ padding: '6px 9px', background: on ? 'rgba(245,158,11,0.18)' : 'var(--bg-base)', color: on ? ACCENT : 'var(--text-tertiary)', border: 'none', cursor: 'pointer' }}><I size={15} /></button>;
                })}
              </div>
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
              {regionTab === 'all' ? '全球' : DC_TAB_LABEL[regionTab]} · 命中 {filtered.length} / {tabList.length} 条 · 点击地图散点筛选驻在国 · ↑↓ 或 j/k 切换
            </p>
          </Card>

          {view === 'map' ? (
            <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
              <Card title={`中国驻外使节全图 · ${filtered.length} 处驻节`}>
                {mapOption ? (
                  <EChart option={mapOption} style={{ height: 420 }} onReady={onMapReady} />
                ) : (
                  <div className="py-20 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {mapStatus === 'error' ? (
                      <div className="space-y-3">
                        <div>// 世界地图加载失败，请切换列表视图</div>
                        <button type="button" onClick={() => fetchWorldMap(true)} style={btn}>重试加载地图</button>
                      </div>
                    ) : '// 加载世界地图…'}
                  </div>
                )}
                <p className="text-[10px] mono mt-2" style={{ color: 'var(--text-tertiary)' }}>// 散点大小=驻节人数 · 颜色=大区 · 点击筛选</p>
              </Card>
              <Card title={detail ? `${detail.name} · 详情` : '选择使节'}>
                {detail ? (
                  <TalentDetailPanel
                    name={detail.name}
                    subtitle={`${detail.role} · ${COUNTRY_LABEL[detail.hostCountry] || detail.hostCountry} ${detail.hostCity}`}
                    avatar={<FigureAvatar {...figureAvatarProps(detail)} size={56} ring eager />}
                    verifyRecord={detail}
                    badges={(
                      <>
                        {detail.nameEn && <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{detail.nameEn}</span>}
                        <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: `${REGION_COLOR[detail.region]}22`, color: REGION_COLOR[detail.region] }}>{detail.region}</span>
                        {detail.rank && <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>{detail.rank}</span>}
                      </>
                    )}
                    sections={[
                      {
                        title: '任职信息',
                        fields: [
                          { label: '职务', value: detail.role, accent: ACCENT },
                          { label: '驻在国', value: COUNTRY_LABEL[detail.hostCountry] || detail.hostCountry, accent: 'var(--cyber-cyan)' },
                          { label: '驻在城市', value: detail.hostCity },
                          { label: '任命', value: detail.appointedDate },
                          { label: '递交国书', value: detail.credentialsDate },
                          { label: '衔级', value: detail.rank },
                        ],
                      },
                      ...(detail.careerHighlights ? [{
                        title: '履历要点',
                        content: <ExpandableText text={detail.careerHighlights} maxLen={180} />,
                      }] : []),
                      ...(detail.previousPosts?.length ? [{
                        title: '既往任职',
                        content: (
                          <DetailBodyText>
                            {detail.previousPosts.map((post, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && <span style={{ color: 'var(--text-tertiary)' }}> → </span>}
                                {post}
                              </React.Fragment>
                            ))}
                          </DetailBodyText>
                        ),
                      }] : []),
                      {
                        title: '溯源',
                        fields: [
                          { label: '来源', value: detail.source || detail.provenance },
                          { label: '备注', value: detail.notes },
                        ],
                      },
                    ]}
                    queueNote="// 驻外使节队列 · 公开任职口径 · 不含外交部长等境内主职"
                    footer={buildDetailFooter(detail)}
                  />
                ) : (
                  <div className="space-y-1.5" style={{ maxHeight: 400, overflowY: 'auto' }}>
                    {filtered.slice(0, 20).map((r) => (
                      <EnvoyCard key={dcKey(r)} r={r} on={false} onClick={() => selectEntity(r)} dense />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ) : view === 'stats' ? (
            <div className="space-y-4 mb-4">
              <Grid cols={2}>
                <Card title="大区分布"><DistBar data={distRegion} onPick={(k) => setRegionTab(k)} active={regionTab !== 'all' ? regionTab : ''} /></Card>
                <Card title="职务分布"><DistBar data={distRole} color="#a78bfa" onPick={(k) => setRole(role === k ? '' : k)} active={role} /></Card>
              </Grid>
            </div>
          ) : (
            <div className="talent-split talent-split--list-detail mb-4">
              <Card title={`检索结果 (${filtered.length}/${tabList.length})`} asSection={false} className="talent-split__list-card">
                {view === 'grid' ? (
                  <div className="talent-split__scroll grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))' }}>
                    {filtered.map((r) => <EnvoyCard key={dcKey(r)} r={r} on={detail === r} onClick={() => selectEntity(r)} dense />)}
                    {!filtered.length && <div className="py-12 text-center mono text-sm col-span-full" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                  </div>
                ) : (
                  <div className="talent-split__scroll space-y-1.5">
                    {filtered.map((r) => <EnvoyCard key={dcKey(r)} r={r} on={detail === r} onClick={() => selectEntity(r)} />)}
                    {!filtered.length && <div className="py-12 text-center mono text-sm" style={{ color: 'var(--text-tertiary)' }}>// 无匹配</div>}
                  </div>
                )}
              </Card>
              <div className="talent-split__detail">
              <Card title={detail ? `${detail.name} · 详情` : '选择使节'} asSection={false}>
                {detail && (
                  <TalentDetailPanel
                    name={detail.name}
                    subtitle={`${detail.role} · ${COUNTRY_LABEL[detail.hostCountry] || detail.hostCountry}`}
                    avatar={<FigureAvatar {...figureAvatarProps(detail)} size={56} ring eager />}
                    verifyRecord={detail}
                    badges={<span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: `${REGION_COLOR[detail.region]}22`, color: REGION_COLOR[detail.region] }}>{detail.region}</span>}
                    sections={[
                      { title: '任职', fields: [{ label: '职务', value: detail.role }, { label: '驻地', value: `${detail.hostCity}（${COUNTRY_LABEL[detail.hostCountry] || detail.hostCountry}）` }, { label: '任命', value: detail.appointedDate }] },
                      ...(detail.careerHighlights ? [{ title: '履历', content: <ExpandableText text={detail.careerHighlights} maxLen={160} /> }] : []),
                    ]}
                    queueNote="// 驻外使节队列"
                    footer={buildDetailFooter(detail)}
                  />
                )}
              </Card>
              </div>
            </div>
          )}
        </>
      )}

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        数据来源：{DIPLOMATIC_CORPS_META.sources.join('、')} · {DIPLOMATIC_CORPS_META.notes} · 研究参考
      </p>
    </section>
  );
}
