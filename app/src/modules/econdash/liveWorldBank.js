// ============================================================================
// 经济仪表盘 · World Bank 实时长序列数据层（浏览器直连 World Bank Open Data）
// ----------------------------------------------------------------------------
// 数据源（免费 · 无 key · CORS 开放 · 已实测浏览器 fetch 可用）：
//   GET https://api.worldbank.org/v2/country/CHN/indicator/{CODE}
//       ?format=json&per_page=70&date=1990:2024
//   返回 [meta, rows]；rows 按年份降序，元素形如
//     { date:'2024', value:18743803170827.2, indicator:{...}, country:{...} }
//   可能含 value:null 空洞（某年缺测），需剔除。
// 免责：World Bank Open Data 为权威长序列年度口径，与国家统计局月度/季度口径
//   及最新发布存在时滞与统计差异；本模块仅作公开统计梳理 · 示意标定 ·
//   非投资建议 · 非预测。
// ============================================================================

import { useState, useEffect } from 'react';

/**
 * 精选指标注册表
 * @typedef {{
 *   key: string, code: string, label: string, unit: string,
 *   kind: 'money'|'pct'|'index'|'count', short: string,
 *   source: string, note: string
 * }} WbIndicator
 */

/** @type {WbIndicator[]} 精选 12 项中国宏观长序列指标 */
export const WB_INDICATORS = [
  { key: 'gdp',       code: 'NY.GDP.MKTP.CD',     label: 'GDP（现价美元）', unit: '美元',   kind: 'money', short: '美元', source: 'World Bank', note: '现价美元口径国内生产总值，受汇率波动影响' },
  { key: 'gdpPerCap', code: 'NY.GDP.PCAP.CD',     label: '人均 GDP',        unit: '美元',   kind: 'money', short: '美元', source: 'World Bank', note: '现价美元口径人均国内生产总值' },
  { key: 'gdpGrowth', code: 'NY.GDP.MKTP.KD.ZG',  label: 'GDP 实际增速',    unit: '%',     kind: 'pct',   short: '%',   source: 'World Bank', note: '按不变价计算的 GDP 年增长率' },
  { key: 'cpi',       code: 'FP.CPI.TOTL.ZG',     label: '通胀率（CPI）',   unit: '%',     kind: 'pct',   short: '%',   source: 'World Bank', note: '消费者价格指数年度同比，反映整体物价' },
  { key: 'agri',      code: 'NV.AGR.TOTL.ZS',     label: '第一产业占比',    unit: '%',     kind: 'pct',   short: '%',   source: 'World Bank', note: '农林牧渔增加值占 GDP 比重' },
  { key: 'ind',       code: 'NV.IND.TOTL.ZS',     label: '第二产业占比',    unit: '%',     kind: 'pct',   short: '%',   source: 'World Bank', note: '工业（含建筑业）增加值占 GDP 比重' },
  { key: 'srv',       code: 'NV.SRV.TOTL.ZS',     label: '第三产业占比',    unit: '%',     kind: 'pct',   short: '%',   source: 'World Bank', note: '服务业增加值占 GDP 比重' },
  { key: 'manuf',     code: 'NV.IND.MANF.ZS',     label: '制造业占比',      unit: '%',     kind: 'pct',   short: '%',   source: 'World Bank', note: '制造业增加值占 GDP 比重（第二产业子项）' },
  { key: 'gini',      code: 'SI.POV.GINI',        label: '基尼系数',        unit: '指数',   kind: 'index', short: '',    source: 'World Bank', note: '收入分配不平等指数，0—100 越高越不均，年份稀疏' },
  { key: 'urban',     code: 'SP.URB.TOTL.IN.ZS',  label: '城镇化率',        unit: '%',     kind: 'pct',   short: '%',   source: 'World Bank', note: '城镇常住人口占总人口比重' },
  { key: 'unemp',     code: 'SL.UEM.TOTL.ZS',     label: '失业率（建模估计）', unit: '%',  kind: 'pct',   short: '%',   source: 'World Bank', note: 'ILO 建模估计失业率，口径异于国内城镇调查失业率' },
  { key: 'fdi',       code: 'BX.KLT.DINV.WD.GD.ZS', label: '外商直接投资占比', unit: '%',  kind: 'pct',   short: '%',   source: 'World Bank', note: 'FDI 净流入占 GDP 比重，反映外资活跃度' },
];

/** key → 指标定义 速查表 */
const _BY_KEY = WB_INDICATORS.reduce((m, ind) => { m[ind.key] = ind; return m; }, {});

/** 全部指标 key 列表 */
export const WB_KEYS = WB_INDICATORS.map((ind) => ind.key);

const FETCH_TIMEOUT_MS = 9000; // 9s 超时
const DATE_RANGE = '1990:2024';
const PER_PAGE = 70;

// ---------------------------------------------------------------------------
// 取数管线
// ---------------------------------------------------------------------------

/** 拼装 World Bank 单指标请求 URL */
function buildUrl(code) {
  return (
    `https://api.worldbank.org/v2/country/CHN/indicator/${code}` +
    `?format=json&per_page=${PER_PAGE}&date=${DATE_RANGE}`
  );
}

/**
 * 拉取单指标长序列；任何失败都不抛，返回 { ..., error:中文原因 }
 * @param {string} key WB_INDICATORS 中的 key
 * @returns {Promise<{ key:string, series:{year:number,value:number}[], latest:{year:number,value:number}|null, source:string, error:string|null }>}
 */
export async function fetchIndicator(key) {
  const ind = _BY_KEY[key];
  if (!ind) {
    return { key, series: [], latest: null, source: 'World Bank', error: `未知指标 key：${key}` };
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(buildUrl(ind.code), { signal: ctrl.signal });
    if (!res.ok) {
      return { key, series: [], latest: null, source: ind.source, error: `World Bank 请求失败（HTTP ${res.status}）` };
    }
    // 限频/异常可能返回非 JSON → 手动解析兜底
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return { key, series: [], latest: null, source: ind.source, error: 'World Bank 返回非 JSON（可能限频）' };
    }
    // 正常形如 [meta, rows]；meta 携带 message 时为接口报错
    if (!Array.isArray(json) || json.length < 2 || !Array.isArray(json[1])) {
      const apiMsg = Array.isArray(json) && json[0] && Array.isArray(json[0].message) && json[0].message[0]
        ? json[0].message[0].value
        : null;
      return { key, series: [], latest: null, source: ind.source, error: apiMsg ? `World Bank：${apiMsg}` : 'World Bank 暂无该指标数据' };
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
      return { key, series: [], latest: null, source: ind.source, error: 'World Bank 该指标全为空值' };
    }
    const latest = series[series.length - 1];
    return { key, series, latest, source: ind.source, error: null };
  } catch (e) {
    const msg = e && e.name === 'AbortError' ? 'World Bank 请求超时（9 秒）' : 'World Bank 数据获取失败';
    return { key, series: [], latest: null, source: ind.source, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

// 模块级缓存：多组件实例共享 + 并发去重
const _cache = {};   // { [key]: 成功结果 }
const _pending = {}; // { [key]: 进行中的 Promise }

/**
 * 取单指标（缓存优先 + 并发去重）
 * @param {string} key
 * @param {boolean} force 强制刷新（忽略缓存）
 */
export async function loadIndicator(key, force = false) {
  if (!force && _cache[key]) return _cache[key];
  if (!_pending[key]) {
    _pending[key] = fetchIndicator(key).then((res) => {
      _pending[key] = null;
      if (res.series.length) _cache[key] = res; // 仅成功才覆盖缓存
      return res;
    });
  }
  return _pending[key];
}

/**
 * World Bank 实时长序列 Hook
 * @param {string[]} keys 需要的指标 key（默认全部）
 * @param {number} refreshMs 自动刷新间隔（默认 6 小时，最小 1 小时）
 * @returns {{ data: Record<string,{series:any[],latest:any,source:string,error:string|null}>, loading: boolean, fetchedAt: Date|null, error: string|null }}
 */
export function useWorldBank(keys = WB_KEYS, refreshMs = 21600000) {
  const keysSig = keys.join(',');
  const [state, setState] = useState(() => {
    const data = {};
    let cached = 0;
    keys.forEach((k) => {
      if (_cache[k]) { data[k] = _cache[k]; cached += 1; }
    });
    return {
      data,
      loading: cached < keys.length, // 任一未命中缓存即首屏 loading
      fetchedAt: null,
      error: null,
    };
  });

  useEffect(() => {
    let alive = true;
    const ks = keysSig ? keysSig.split(',') : [];

    const run = (force) => {
      Promise.all(ks.map((k) => loadIndicator(k, force))).then((results) => {
        if (!alive) return;
        const data = {};
        const errs = [];
        results.forEach((r) => {
          data[r.key] = { series: r.series, latest: r.latest, source: r.source, error: r.error };
          if (r.error) errs.push(`${r.key}：${r.error}`);
        });
        const allFailed = results.length > 0 && results.every((r) => !r.series.length);
        setState({
          data,
          loading: false,
          fetchedAt: new Date(),
          error: allFailed ? (errs[0] || 'World Bank 数据获取失败') : null,
        });
      });
    };

    run(false); // 首次挂载即取数（命中缓存即时回填）
    const period = Math.max(refreshMs, 3600000); // 最小 1 小时
    const timer = setInterval(() => run(true), period);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [keysSig, refreshMs]);

  return state;
}

// ---------------------------------------------------------------------------
// 展示工具
// ---------------------------------------------------------------------------

/** 千分位整数（保留小数位由 digits 控制） */
function thousands(n, digits = 0) {
  const fixed = Number(n).toFixed(digits);
  const [int, dec] = fixed.split('.');
  const sign = int.startsWith('-') ? '-' : '';
  const body = (sign ? int.slice(1) : int).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + body + (dec ? `.${dec}` : '');
}

/**
 * 数值 → 人类可读字符串
 * @param {number|null} value
 * @param {'money'|'pct'|'index'|'count'} kind
 * @returns {string}
 */
export function wbStat(value, kind) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  switch (kind) {
    case 'money': {
      const sign = n < 0 ? '-' : '';
      const abs = Math.abs(n);
      const YI = 1e8;        // 亿
      const WANYI = 1e12;    // 万亿
      const WAN = 1e4;       // 万
      if (abs >= WANYI) return `${sign}$${(abs / WANYI).toFixed(1)}万亿`;
      if (abs >= YI)    return `${sign}$${(abs / YI).toFixed(1)}亿`;
      if (abs >= WAN)   return `${sign}$${(abs / WAN).toFixed(1)}万`;
      return `${sign}$${thousands(abs, 0)}`;
    }
    case 'pct':
      return `${n.toFixed(1)}%`;
    case 'index':
      return `${n.toFixed(1)}`;
    case 'count':
      return thousands(n, 0);
    default:
      return String(n);
  }
}

/**
 * 最新值同比（升序序列尾部两点）
 * @param {{year:number,value:number}[]} series
 * @returns {string|null} 形如 '+5.2%' / '-1.3%'；无前值或前值为 0 时返回 null
 */
export function fmtYoY(series) {
  if (!Array.isArray(series) || series.length < 2) return null;
  const latest = series[series.length - 1];
  const prev = series[series.length - 2];
  if (!latest || !prev || prev.value === 0 || prev.value == null) return null;
  const pct = ((latest.value - prev.value) / Math.abs(prev.value)) * 100;
  if (!Number.isFinite(pct)) return null;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}
