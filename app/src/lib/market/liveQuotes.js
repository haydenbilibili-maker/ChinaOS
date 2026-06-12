// ============================================================================
// 实时行情 · 多源聚合（Sina / Frankfurter / Yahoo 代理）+ 离线种子
// AS_OF 2026-06-11 · 开发环境经 Vite 代理规避 CORS
// ============================================================================

export const AS_OF_MARKET = '2026-06-11';
export const REFRESH_INTERVAL_MS = 90_000;
export const FETCH_TIMEOUT_MS = 8000;

/** @typedef {'equity'|'bond'|'fx'|'commodity'|'spread'} MarketCategory */
/** @typedef {'cn'|'intl'} MarketConvention */

/**
 * @typedef {Object} MarketQuote
 * @property {string} id
 * @property {string} name
 * @property {MarketCategory} category
 * @property {number|null} price
 * @property {number|null} change
 * @property {number|null} changePct
 * @property {string} unit
 * @property {MarketConvention} convention
 * @property {'live'|'seed'} mode
 * @property {string} [hint]
 */

/** @type {MarketQuote[]} */
export const MARKET_SEED = [
  { id: 'sse', name: '上证指数', category: 'equity', price: 3993.23, change: -16.8, changePct: -0.42, unit: '点', convention: 'cn', mode: 'seed' },
  { id: 'szse', name: '深证成指', category: 'equity', price: 14954.1, change: -314.61, changePct: -2.06, unit: '点', convention: 'cn', mode: 'seed' },
  { id: 'chinext', name: '创业板指', category: 'equity', price: 3854.79, change: -106.96, changePct: -2.7, unit: '点', convention: 'cn', mode: 'seed' },
  { id: 'hsi', name: '恒生指数', category: 'equity', price: 24407.96, change: -157.94, changePct: -0.64, unit: '点', convention: 'cn', mode: 'seed' },
  { id: 'spx', name: '标普500', category: 'equity', price: 7266.99, change: -119.66, changePct: -1.62, unit: '点', convention: 'intl', mode: 'seed' },
  { id: 'ndx', name: '纳斯达克', category: 'equity', price: 25169.5, change: -509.32, changePct: -1.98, unit: '点', convention: 'intl', mode: 'seed' },
  { id: 'cn10y', name: '10Y 国债(中)', category: 'bond', price: 1.68, change: -0.02, changePct: -1.18, unit: '%', convention: 'intl', mode: 'seed' },
  { id: 'us10y', name: '10Y 国债(美)', category: 'bond', price: 4.32, change: 0.03, changePct: 0.7, unit: '%', convention: 'intl', mode: 'seed' },
  { id: 'usdcny', name: 'USD/CNY', category: 'fx', price: 7.2485, change: -0.0062, changePct: -0.09, unit: '', convention: 'intl', mode: 'seed' },
  { id: 'eurcny', name: 'EUR/CNY', category: 'fx', price: 7.8137, change: -0.027, changePct: -0.35, unit: '', convention: 'intl', mode: 'seed' },
  { id: 'dxy', name: '美元指数 DXY', category: 'fx', price: 100.04, change: 0.08, changePct: 0.08, unit: '点', convention: 'intl', mode: 'seed' },
  { id: 'gold', name: '伦敦金', category: 'commodity', price: 4094.33, change: -192.07, changePct: -4.49, unit: 'USD/oz', convention: 'intl', mode: 'seed' },
  { id: 'shgold', name: '沪金ETF', category: 'commodity', price: 8.737, change: -0.268, changePct: -2.98, unit: '元/g', convention: 'cn', mode: 'seed' },
  { id: 'wti', name: 'WTI 原油', category: 'commodity', price: 91.8, change: 3.6, changePct: 4.08, unit: 'USD/bbl', convention: 'intl', mode: 'seed' },
  { id: 'brent', name: 'Brent 原油', category: 'commodity', price: 94.66, change: 3.06, changePct: 3.34, unit: 'USD/bbl', convention: 'intl', mode: 'seed' },
  { id: 'copper', name: 'COMEX 铜', category: 'commodity', price: 620.13, change: -12.07, changePct: -1.91, unit: '美分/lb', convention: 'intl', mode: 'seed' },
  { id: 'iron', name: '铁矿石', category: 'commodity', price: 98.5, change: -1.2, changePct: -1.2, unit: 'USD/t', convention: 'intl', mode: 'seed', hint: '62% 普氏示意' },
];

const SEED_MAP = Object.fromEntries(MARKET_SEED.map((q) => [q.id, q]));

/** Sina 列表代码 → 行情 id */
const SINA_CODES = {
  s_sh000001: 'sse',
  s_sz399001: 'szse',
  s_sz399006: 'chinext',
  rt_hkHSI: 'hsi',
  gb_inx: 'spx',
  gb_ixic: 'ndx',
  hf_GC: 'gold',
  sh518880: 'shgold',
  hf_CL: 'wti',
  hf_OIL: 'brent',
  hf_HG: 'copper',
  fx_susdcny: 'usdcny',
  fx_seurcny: 'eurcny',
  DINIW: 'dxy',
};

const SINA_LIST = Object.keys(SINA_CODES).join(',');

function apiUrl(path, directUrl) {
  if (import.meta.env.DEV) return path;
  return directUrl;
}

async function fetchText(url, referer) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: referer ? { Referer: referer } : undefined,
    });
    if (!res.ok) throw new Error(String(res.status));
    return res.text();
  } finally {
    clearTimeout(timer);
  }
}

function num(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function pctFromChange(price, change) {
  if (price == null || change == null || price === 0) return null;
  const prev = price - change;
  if (!prev) return null;
  return +((change / prev) * 100).toFixed(2);
}

function mergeQuote(id, patch) {
  const base = SEED_MAP[id];
  if (!base) return null;
  return { ...base, ...patch, id, mode: patch.mode || 'live' };
}

/** 解析 Sina hq.sinajs.cn 返回的 JS 变量 */
export function parseSinaResponse(text) {
  /** @type {Record<string, MarketQuote>} */
  const out = {};
  const re = /var hq_str_(\w+)="([^"]*)";/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const code = m[1];
    const id = SINA_CODES[code];
    if (!id) continue;
    const parts = m[2].split(',');
    if (!parts.length || parts.every((p) => !p)) continue;

    const base = SEED_MAP[id];
    let price = null;
    let change = null;
    let changePct = null;

    if (code.startsWith('s_')) {
      price = num(parts[1]);
      change = num(parts[2]);
      changePct = num(parts[3]);
    } else if (code === 'rt_hkHSI') {
      price = num(parts[6]);
      change = num(parts[7]);
      changePct = num(parts[8]);
    } else if (code.startsWith('gb_')) {
      price = num(parts[1]);
      changePct = num(parts[2]);
      change = num(parts[4]);
    } else if (code.startsWith('hf_')) {
      price = num(parts[0]);
      const prev = num(parts[7]);
      if (price != null && prev != null) {
        change = +(price - prev).toFixed(4);
        changePct = pctFromChange(price, change);
      }
    } else if (code.startsWith('fx_')) {
      price = num(parts[8] ?? parts[1]);
      change = num(parts[10]);
      changePct = num(parts[11]);
      if (changePct != null && Math.abs(changePct) < 1) changePct = +(changePct * 100).toFixed(2);
    } else if (code === 'DINIW') {
      price = num(parts[8] ?? parts[1]);
      const open = num(parts[5]);
      if (price != null && open != null) {
        change = +(price - open).toFixed(4);
        changePct = pctFromChange(price, change);
      }
    } else if (code.startsWith('sh')) {
      price = num(parts[1]);
      const prev = num(parts[2]);
      if (price != null && prev != null) {
        change = +(price - prev).toFixed(4);
        changePct = pctFromChange(price, change);
      }
    }

    if (price == null) continue;
    const q = mergeQuote(id, { price, change, changePct, mode: 'live' });
    if (q) out[id] = q;
  }
  return out;
}

async function fetchSinaQuotes() {
  const url = apiUrl(
    `/api/sina/list=${SINA_LIST}`,
    `https://hq.sinajs.cn/list=${SINA_LIST}`,
  );
  const text = await fetchText(url, 'https://finance.sina.com.cn');
  return parseSinaResponse(text);
}

async function fetchFrankfurterFx() {
  const url = apiUrl(
    '/api/frankfurter/latest?from=USD&to=CNY,EUR',
    'https://api.frankfurter.app/latest?from=USD&to=CNY,EUR',
  );
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ac.signal });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    /** @type {Record<string, MarketQuote>} */
    const out = {};
    const usdCny = json?.rates?.CNY;
    if (usdCny != null) {
      const seed = SEED_MAP.usdcny;
      const change = seed?.price != null ? +(usdCny - seed.price).toFixed(4) : null;
      out.usdcny = mergeQuote('usdcny', {
        price: +usdCny.toFixed(4),
        change,
        changePct: change != null && seed?.price ? pctFromChange(usdCny, change) : seed?.changePct ?? null,
        mode: 'live',
        hint: json.date ? `ECB ${json.date}` : undefined,
      });
    }
    const usdEur = json?.rates?.EUR;
    if (usdCny != null && usdEur != null) {
      const eurCny = usdCny / usdEur;
      const seed = SEED_MAP.eurcny;
      const change = seed?.price != null ? +(eurCny - seed.price).toFixed(4) : null;
      out.eurcny = mergeQuote('eurcny', {
        price: +eurCny.toFixed(4),
        change,
        changePct: change != null && seed?.price ? pctFromChange(eurCny, change) : seed?.changePct ?? null,
        mode: 'live',
        hint: 'EUR/CNY 交叉',
      });
    }
    return out;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchYahooBonds() {
  const symbols = ['^TNX', 'CN10Y.BD'];
  const query = symbols.map(encodeURIComponent).join(',');
  const url = apiUrl(
    `/api/yahoo/v8/finance/chart/${query}?interval=1d&range=1d`,
    `https://query1.finance.yahoo.com/v8/finance/chart/${query}?interval=1d&range=1d`,
  );
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ac.signal });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    /** @type {Record<string, MarketQuote>} */
    const out = {};
    const map = { '^TNX': 'us10y', 'CN10Y.BD': 'cn10y' };
    for (const result of json?.chart?.result || []) {
      const sym = result?.meta?.symbol;
      const id = map[sym];
      if (!id) continue;
      const price = result?.meta?.regularMarketPrice;
      const prev = result?.meta?.previousClose ?? result?.meta?.chartPreviousClose;
      if (price == null) continue;
      const change = prev != null ? +(price - prev).toFixed(3) : null;
      out[id] = mergeQuote(id, {
        price: +price.toFixed(2),
        change,
        changePct: change != null ? pctFromChange(price, change) : null,
        mode: 'live',
      });
    }
    return out;
  } finally {
    clearTimeout(timer);
  }
}

function computeSpread(quotes) {
  const cn = quotes.cn10y?.price;
  const us = quotes.us10y?.price;
  if (cn == null || us == null) return null;
  const spreadBps = Math.round((us - cn) * 100);
  return mergeQuote('spread', {
    id: 'spread',
    name: '中美利差',
    category: 'spread',
    price: spreadBps,
    change: null,
    changePct: null,
    unit: 'bp',
    convention: 'intl',
    mode: quotes.cn10y?.mode === 'live' || quotes.us10y?.mode === 'live' ? 'live' : 'seed',
    hint: `美 ${us}% − 中 ${cn}%`,
  });
}

/**
 * 拉取并合并行情；单品种失败则保留种子。
 * @returns {Promise<{ quotes: MarketQuote[], mode: 'live'|'mixed'|'seed', updatedAt: string, error?: string, liveCount: number }>}
 */
export async function fetchLiveMarketQuotes() {
  const merged = { ...SEED_MAP };
  let liveCount = 0;
  const errors = [];

  const tasks = [
    fetchSinaQuotes().then((q) => ({ src: 'sina', q })).catch((e) => { errors.push(`Sina: ${e.message}`); return { src: 'sina', q: {} }; }),
    fetchFrankfurterFx().then((q) => ({ src: 'fx', q })).catch((e) => { errors.push(`FX: ${e.message}`); return { src: 'fx', q: {} }; }),
    fetchYahooBonds().then((q) => ({ src: 'bond', q })).catch((e) => { errors.push(`Bond: ${e.message}`); return { src: 'bond', q: {} }; }),
  ];

  const results = await Promise.all(tasks);
  for (const { q } of results) {
    for (const [id, quote] of Object.entries(q)) {
      merged[id] = quote;
      if (quote.mode === 'live') liveCount += 1;
    }
  }

  const spread = computeSpread(merged);
  if (spread) merged.spread = spread;

  const quotes = MARKET_SEED.map((s) => merged[s.id]).filter(Boolean);
  if (spread) quotes.push(spread);

  let mode = 'seed';
  if (liveCount >= quotes.length * 0.6) mode = 'live';
  else if (liveCount > 0) mode = 'mixed';

  return {
    quotes,
    mode,
    updatedAt: new Date().toISOString(),
    liveCount,
    error: errors.length ? errors.join(' · ') : undefined,
  };
}

export function formatPrice(quote) {
  if (quote.price == null) return '—';
  const p = quote.price;
  if (quote.category === 'bond') return p.toFixed(2);
  if (quote.category === 'fx' && !quote.unit) return p.toFixed(4);
  if (quote.category === 'spread') return `${Math.round(p)}`;
  if (quote.id === 'shgold') return p.toFixed(3);
  if (p >= 1000) return p.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (p >= 100) return p.toFixed(2);
  return p.toFixed(2);
}

export function formatChangePct(pct) {
  if (pct == null) return '—';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

/** 涨跌色：A 股/港股红涨绿跌；国际绿涨红跌 */
export function quoteColor(quote, pct = quote.changePct) {
  if (pct == null || pct === 0) return 'var(--text-secondary)';
  const up = pct > 0;
  if (quote.convention === 'cn') return up ? 'var(--market-up-cn)' : 'var(--market-down-cn)';
  return up ? 'var(--market-up-intl)' : 'var(--market-down-intl)';
}

export const MARKET_GROUPS = [
  { key: 'equity', label: '股市' },
  { key: 'bond', label: '债市' },
  { key: 'fx', label: '汇市' },
  { key: 'commodity', label: '商品' },
  { key: 'spread', label: '利差' },
];
