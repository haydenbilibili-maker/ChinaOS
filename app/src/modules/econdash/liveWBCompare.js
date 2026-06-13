// ============================================================================
// 经济观测台 · World Bank 多国实时对比层（浏览器直连 World Bank Open Data）
// ----------------------------------------------------------------------------
// 国际横向对比：同一指标、多国近 10 年长序列。数据源（免费 · 无 key · CORS 开放）：
//   GET https://api.worldbank.org/v2/country/{ISO3}/indicator/{CODE}
//       ?format=json&per_page=40&date=2015:2024
//   返回 [meta, rows]；rows 按年份降序，元素形如
//     { date:'2024', value:..., countryiso3code:'CHN', ... }；含 value:null 空洞需剔。
//
// 取数纪律（World Bank 限频敏感，必须严守）：
//   · 逐国串行（for…of + await），每国之间 sleep 200ms 错峰；
//   · 禁止分号多国端点（'CHN;USA;IND' 不稳定且触发限频）；
//   · 禁止 Promise.all 并发突发多国；
//   · 每国独立 12s 超时 + 独立降级（失败不抛，按国返回 error）；
//   · 模块级缓存 _cache[key+iso] + _pending 去重，多组件实例共享。
//
// 免责：World Bank 为权威长序列年度口径，各国统计口径/发布时滞存在差异；
//   本模块仅作公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

import { useState, useEffect } from 'react';

/**
 * 对比国家清单（默认对比 CHN/USA/IND，其余可选；color 与 econUI 四色一致）
 * @typedef {{ iso:string, name:string, color:string }} CompareCountry
 */
/** @type {CompareCountry[]} */
export const COMPARE_COUNTRIES = [
  { iso: 'CHN', name: '中国', color: '#c44e3d' }, // 朱砂
  { iso: 'USA', name: '美国', color: '#8090c6' }, // 黛
  { iso: 'IND', name: '印度', color: '#c99a4e' }, // 赭
  { iso: 'JPN', name: '日本', color: '#62a89e' }, // 青
  { iso: 'DEU', name: '德国', color: '#94a3b8' }, // 中性灰
];

/** 默认对比三国 */
export const DEFAULT_ISOS = ['CHN', 'USA', 'IND'];

/**
 * 对比指标注册表
 * @typedef {{ key:string, code:string, label:string, unit:string, kind:'money'|'pct'|'index', note:string }} CompareIndicator
 */
/** @type {CompareIndicator[]} */
export const COMPARE_INDICATORS = [
  { key: 'gdpPerCap', code: 'NY.GDP.PCAP.CD',    label: '人均 GDP',   unit: '美元', kind: 'money', note: '现价美元口径人均国内生产总值，受汇率波动影响' },
  { key: 'gdpGrowth', code: 'NY.GDP.MKTP.KD.ZG', label: 'GDP 增速',   unit: '%',   kind: 'pct',   note: '按不变价计算的 GDP 年增长率' },
  { key: 'cpi',       code: 'FP.CPI.TOTL.ZG',    label: '通胀率',     unit: '%',   kind: 'pct',   note: '消费者价格指数年度同比，反映整体物价' },
  { key: 'manuf',     code: 'NV.IND.MANF.ZS',    label: '制造业占比', unit: '%',   kind: 'pct',   note: '制造业增加值占 GDP 比重' },
  { key: 'urban',     code: 'SP.URB.TOTL.IN.ZS', label: '城镇化率',   unit: '%',   kind: 'pct',   note: '城镇常住人口占总人口比重' },
  { key: 'rnd',       code: 'GB.XPD.RSDV.GD.ZS', label: '研发占比',   unit: '%',   kind: 'pct',   note: '研发支出占 GDP 比重，反映创新投入强度，年份稀疏' },
  { key: 'gini',      code: 'SI.POV.GINI',       label: '基尼系数',   unit: '指数', kind: 'index', note: '收入分配不平等指数，0—100 越高越不均，年份稀疏' },
];

/** key → 指标定义 速查表 */
const _BY_KEY = COMPARE_INDICATORS.reduce((m, ind) => { m[ind.key] = ind; return m; }, {});

/** 全部指标 key 列表 */
export const COMPARE_KEYS = COMPARE_INDICATORS.map((ind) => ind.key);

const FETCH_TIMEOUT_MS = 12000; // 每国独立 12s 超时
const STAGGER_MS = 200;         // 逐国错峰间隔（限频保护）
const DATE_RANGE = '2015:2024'; // 近 10 年
const PER_PAGE = 40;

/** 睡眠（错峰用） */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// 取数管线
// ---------------------------------------------------------------------------

/** 拼装 World Bank 单国单指标请求 URL（绝不用分号多国端点） */
function buildUrl(iso, code) {
  return (
    `https://api.worldbank.org/v2/country/${iso}/indicator/${code}` +
    `?format=json&per_page=${PER_PAGE}&date=${DATE_RANGE}`
  );
}

/**
 * 拉取单国单指标近 10 年序列；任何失败都不抛，返回 { ..., error:中文原因 }
 * @param {string} iso ISO3 国家码
 * @param {string} code World Bank 指标代码
 * @returns {Promise<{ iso:string, series:{year:number,value:number}[], latest:{year:number,value:number}|null, error:string|null }>}
 */
export async function fetchCountrySeries(iso, code) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(buildUrl(iso, code), { signal: ctrl.signal });
    if (!res.ok) {
      return { iso, series: [], latest: null, error: `World Bank 请求失败（HTTP ${res.status}）` };
    }
    // 限频/异常可能返回非 JSON → 手动解析兜底
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return { iso, series: [], latest: null, error: 'World Bank 返回非 JSON（可能限频）' };
    }
    // 正常形如 [meta, rows]；meta 携带 message 时为接口报错
    if (!Array.isArray(json) || json.length < 2 || !Array.isArray(json[1])) {
      const apiMsg = Array.isArray(json) && json[0] && Array.isArray(json[0].message) && json[0].message[0]
        ? json[0].message[0].value
        : null;
      return { iso, series: [], latest: null, error: apiMsg ? `World Bank：${apiMsg}` : 'World Bank 暂无该指标数据' };
    }
    const rows = json[1];
    const series = [];
    for (const r of rows) {
      const v = r && r.value;
      if (v == null) continue;                 // 剔除 value:null 空洞
      const year = Number(r.date);
      const value = Number(v);
      if (Number.isNaN(year) || Number.isNaN(value)) continue;
      series.push({ year, value });
    }
    series.sort((a, b) => a.year - b.year);      // 升序（接口降序，翻转）
    if (!series.length) {
      return { iso, series: [], latest: null, error: 'World Bank 该指标全为空值' };
    }
    const latest = series[series.length - 1];
    return { iso, series, latest, error: null };
  } catch (e) {
    const msg = e && e.name === 'AbortError' ? 'World Bank 请求超时（12 秒）' : 'World Bank 数据获取失败';
    return { iso, series: [], latest: null, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

// 模块级缓存：多组件实例共享 + 并发去重，键 = `${indicatorKey}|${iso}`
const _cache = {};   // { [key|iso]: 成功结果 }
const _pending = {}; // { [key|iso]: 进行中的 Promise }

/** 单国取数（缓存优先 + 并发去重） */
function loadOne(indicatorKey, iso, code, force) {
  const ck = `${indicatorKey}|${iso}`;
  if (!force && _cache[ck]) return Promise.resolve(_cache[ck]);
  if (!_pending[ck]) {
    _pending[ck] = fetchCountrySeries(iso, code).then((res) => {
      _pending[ck] = null;
      if (res.series.length) _cache[ck] = res; // 仅成功才覆盖缓存
      return res;
    });
  }
  return _pending[ck];
}

/**
 * 多国对比取数 —— 逐国串行 + 200ms 错峰（严禁 Promise.all 并发突发）。
 * 已命中缓存的国家不计入错峰节流（无需等待）。
 * @param {string} indicatorKey COMPARE_INDICATORS 中的 key
 * @param {string[]} isos 国家 ISO3 列表
 * @param {boolean} [force] 强制刷新（忽略缓存）
 * @returns {Promise<{ indicatorKey:string, byCountry:Record<string,{series:any[],latest:any,error:string|null}>, fetchedAt:Date }>}
 */
export async function loadCompare(indicatorKey, isos, force = false) {
  const ind = _BY_KEY[indicatorKey];
  const list = Array.isArray(isos) && isos.length ? isos : DEFAULT_ISOS;
  const byCountry = {};
  if (!ind) {
    list.forEach((iso) => { byCountry[iso] = { series: [], latest: null, error: `未知指标 key：${indicatorKey}` }; });
    return { indicatorKey, byCountry, fetchedAt: new Date() };
  }

  let networkHits = 0; // 仅对真正发起网络请求的国家错峰
  for (const iso of list) {
    const ck = `${indicatorKey}|${iso}`;
    const cached = !force && _cache[ck];
    if (!cached && networkHits > 0) {
      await sleep(STAGGER_MS); // 国家之间错峰，避免限频
    }
    if (!cached) networkHits += 1;
    // 串行 await：上一国完成才取下一国，杜绝并发突发
    // eslint-disable-next-line no-await-in-loop
    const res = await loadOne(indicatorKey, iso, ind.code, force);
    byCountry[iso] = { series: res.series, latest: res.latest, error: res.error };
  }

  return { indicatorKey, byCountry, fetchedAt: new Date() };
}

/**
 * World Bank 多国对比 Hook
 * @param {string} indicatorKey 指标 key（默认人均 GDP）
 * @param {string[]} isos 国家 ISO3 列表（默认 CHN/USA/IND）
 * @param {number} refreshMs 自动刷新间隔（默认 6 小时，最小 1 小时）
 * @returns {{ data:{byCountry:Record<string,{series:any[],latest:any,error:string|null}>}, loading:boolean, error:string|null, fetchedAt:Date|null }}
 */
export function useWBCompare(indicatorKey = 'gdpPerCap', isos = DEFAULT_ISOS, refreshMs = 21600000) {
  const list = Array.isArray(isos) && isos.length ? isos : DEFAULT_ISOS;
  const isosSig = list.join(',');

  const [state, setState] = useState(() => {
    // 首屏命中缓存即时回填
    const byCountry = {};
    let cached = 0;
    list.forEach((iso) => {
      const ck = `${indicatorKey}|${iso}`;
      if (_cache[ck]) {
        const c = _cache[ck];
        byCountry[iso] = { series: c.series, latest: c.latest, error: c.error };
        cached += 1;
      }
    });
    return {
      data: { byCountry },
      loading: cached < list.length, // 任一未命中缓存即首屏 loading
      error: null,
      fetchedAt: null,
    };
  });

  useEffect(() => {
    let alive = true;
    const ks = isosSig ? isosSig.split(',') : DEFAULT_ISOS;

    const run = (force) => {
      loadCompare(indicatorKey, ks, force).then((res) => {
        if (!alive) return;
        const entries = Object.values(res.byCountry);
        const allFailed = entries.length > 0 && entries.every((c) => !c.series || !c.series.length);
        const firstErr = (entries.find((c) => c && c.error) || {}).error || null;
        setState({
          data: { byCountry: res.byCountry },
          loading: false,
          error: allFailed ? (firstErr || 'World Bank 数据获取失败') : null,
          fetchedAt: res.fetchedAt,
        });
      });
    };

    // indicatorKey/isos 变化时进入加载态后重新取数
    setState((s) => ({ ...s, loading: true }));
    run(false);

    const period = Math.max(refreshMs, 3600000); // 最小 1 小时
    const timer = setInterval(() => run(true), period);
    return () => {
      alive = false; // alive 守卫：卸载后不再 setState
      clearInterval(timer);
    };
  }, [indicatorKey, isosSig, refreshMs]);

  return state;
}

// ---------------------------------------------------------------------------
// 展示工具
// ---------------------------------------------------------------------------

/** 千分位整数 */
function thousands(n, digits = 0) {
  const fixed = Number(n).toFixed(digits);
  const [int, dec] = fixed.split('.');
  const sign = int.startsWith('-') ? '-' : '';
  const body = (sign ? int.slice(1) : int).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + body + (dec ? `.${dec}` : '');
}

/**
 * 数值 → 人类可读字符串（中文量级）
 * @param {number|null|undefined} value
 * @param {'money'|'pct'|'index'} kind
 * @returns {string}
 */
export function wbCompareStat(value, kind) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  switch (kind) {
    case 'money': {
      const sign = n < 0 ? '-' : '';
      const abs = Math.abs(n);
      const WANYI = 1e12; // 万亿
      const YI = 1e8;     // 亿
      const WAN = 1e4;    // 万
      if (abs >= WANYI) return `${sign}$${(abs / WANYI).toFixed(2)}万亿`;
      if (abs >= YI)    return `${sign}$${(abs / YI).toFixed(2)}亿`;
      if (abs >= WAN)   return `${sign}$${(abs / WAN).toFixed(2)}万`;
      return `${sign}$${thousands(abs, 0)}`;
    }
    case 'pct':
      return `${n.toFixed(1)}%`;
    case 'index':
      return `${n.toFixed(1)}`;
    default:
      return String(n);
  }
}
