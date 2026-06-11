// ============================================================================
// 中枢看板 · Polymarket 预测市场概率层（浏览器直连 Gamma API）
// ----------------------------------------------------------------------------
// 数据源（免费 · 无 key · 支持 CORS）：
//   https://gamma-api.polymarket.com/markets?closed=false&order=volume24hr&ascending=false&limit=80
// 字段：question / outcomes(JSON 字符串) / outcomePrices(JSON 字符串) / volume24hr / endDate / slug
// 免责：Polymarket 公开预测市场概率（聚合交易者定价，非本项目观点），
//       仅作群体预期参考，非投资建议；已过滤地缘敏感议题（涉台/战争/军事类市场不展示）。
// ============================================================================

import { useState, useEffect } from 'react';

const API_URL =
  'https://gamma-api.polymarket.com/markets?closed=false&order=volume24hr&ascending=false&limit=80';

/** 主题白名单：宏观/中国经济/能源/科技相关市场 */
const INCLUDE_RE = /china|chinese|yuan|renminbi|pboc|fed |fedfunds|interest rate|gdp|oil |brent|bitcoin|ai |gpt|nvidia/i;
/** 地缘敏感黑名单：涉台/战争/军事议题一律剔除 */
const EXCLUDE_RE = /taiwan|war|invade|invasion|military|strike|nuclear|missile/i;

const pad2 = (n) => String(n).padStart(2, '0');

/** JSON.parse 安全封装：失败返回 null，不抛异常 */
function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

/** 24h 成交量格式化：1234567 → $1.2M；340000 → $340K；820 → $820 */
function formatVol(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return '—';
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${Math.round(n)}`;
}

/** endDate ISO 字符串 → MM-DD；无效给 '—' */
function formatEnd(iso) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return '—';
  return `${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/** 问题文案截断（≤64 字符） */
function truncQ(q) {
  return q.length > 64 ? `${q.slice(0, 63)}…` : q;
}

/**
 * 拉取并筛选预测市场；失败返回 { markets: null, error }，不抛异常
 * 筛选：主题白名单 ∧ 非地缘敏感 ∧ 二元 Yes/No 市场 ∧ 0<yes<1；按 24h 成交量降序取 6 条
 */
async function fetchMarkets() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000); // 10s 超时
  try {
    const res = await fetch(API_URL, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();
    if (!Array.isArray(list)) throw new Error('bad payload');

    const markets = [];
    for (const m of list) {
      const question = typeof m.question === 'string' ? m.question : '';
      if (!INCLUDE_RE.test(question) || EXCLUDE_RE.test(question)) continue;
      const outcomes = safeParse(m.outcomes); // 形如 '["Yes","No"]'
      const prices = safeParse(m.outcomePrices); // 形如 '["0.43","0.57"]'
      if (!Array.isArray(outcomes) || !Array.isArray(prices)) continue;
      const yesIdx = outcomes.indexOf('Yes');
      if (yesIdx < 0) continue; // 仅保留二元 Yes/No 市场
      const yes = Number(prices[yesIdx]);
      if (!(yes > 0 && yes < 1)) continue; // 剔除已定局/无效定价
      markets.push({
        q: truncQ(question),
        yes: Math.round(yes * 100),
        vol: formatVol(m.volume24hr),
        end: formatEnd(m.endDate),
        slug: m.slug || '',
        _v: Number(m.volume24hr) || 0, // 排序用，输出前剥离
      });
    }
    markets.sort((a, b) => b._v - a._v);
    const top = markets.slice(0, 6).map(({ _v, ...rest }) => rest);
    if (!top.length) throw new Error('empty');
    return { markets: top, fetchedAt: new Date(), error: null };
  } catch (e) {
    const msg = e && e.name === 'AbortError' ? '请求超时（10 秒）' : '预测市场数据获取失败';
    return { markets: null, fetchedAt: null, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

// 模块级缓存：多个组件实例共享，避免重复请求
let _cache = { markets: null, fetchedAt: null, error: null };
let _pending = null; // 进行中的请求 Promise（并发去重）

function loadShared(force = false) {
  if (!force && _cache.markets) return Promise.resolve(_cache);
  if (!_pending) {
    _pending = fetchMarkets().then((res) => {
      _pending = null;
      if (res.markets) _cache = res; // 仅成功才覆盖缓存
      return res;
    });
  }
  return _pending;
}

/**
 * Polymarket 预测市场 Hook
 * @param {number} refreshMs 自动刷新间隔（默认 10 分钟）
 * @returns {{ markets: object[]|null, fetchedAt: Date|null, loading: boolean, error: string|null }}
 */
export function useLiveMarkets(refreshMs = 600000) {
  const [state, setState] = useState(() => ({
    markets: _cache.markets,
    fetchedAt: _cache.fetchedAt,
    loading: !_cache.markets,
    error: null,
  }));

  useEffect(() => {
    let alive = true;
    const apply = (res) => {
      if (!alive) return;
      setState({ markets: res.markets, fetchedAt: res.fetchedAt, loading: false, error: res.error });
    };
    loadShared().then(apply); // 首次挂载即取数（命中缓存则直接回填）
    const timer = setInterval(() => loadShared(true).then(apply), refreshMs);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [refreshMs]);

  return state;
}

/**
 * 概率→语义色：高概率绿 / 胶着黄 / 低概率红
 * @param {number} yes 0-100 的 Yes 概率
 */
export function probColor(yes) {
  if (yes >= 65) return '#10b981';
  if (yes >= 35) return '#e8a317';
  return '#c41e3a';
}
