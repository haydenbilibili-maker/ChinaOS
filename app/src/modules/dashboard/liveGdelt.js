// ============================================================================
// 中枢看板 · GDELT 全球涉华舆情流（英文源涉华条目）
// ----------------------------------------------------------------------------
// 数据源：GDELT DOC 2.0 API（免 key · CORS 开放）
//   https://api.gdeltproject.org/api/v2/doc/doc
// 实测返回 { articles: [{ url, title, domain, seendate(YYYYMMDDTHHMMSSZ),
//   language, sourcecountry, ... }] }；限频时返回非 JSON 纯文本（HTTP 429），
//   解析必须 try/catch 兜底。
// 免责：本模块为 GDELT 全球新闻索引（英文源涉华条目），标题与链接来自第三方
//   媒体，不代表本项目立场；点击外链跳转原文。
// ============================================================================

import { useState, useEffect } from 'react';

/** @typedef {{ title: string, url: string, domain: string, when: Date|null, country: string }} GdeltArticle */

const GDELT_URL =
  'https://api.gdeltproject.org/api/v2/doc/doc' +
  '?query=%22china%22%20sourcelang:english' +
  '&mode=ArtList&format=json&maxrecords=20&timespan=6h&sort=datedesc';
const FETCH_TIMEOUT_MS = 25000; // 10s 超时
const MAX_ITEMS = 12;           // 去重后取前 12 条
const DEDUPE_PREFIX = 40;       // 按标题前 40 字符去重

// ---------------------------------------------------------------------------
// 解析工具
// ---------------------------------------------------------------------------

/** seendate '20260611T083000Z' → Date（UTC）；格式不符返回 null */
function parseSeendate(s) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(String(s || ''));
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** 全大写垃圾标题判定：字母数 ≥8 且全为大写（如爬虫抓到的导航/广告块） */
function isShoutingJunk(title) {
  const letters = String(title).replace(/[^A-Za-z]/g, '');
  return letters.length >= 8 && letters === letters.toUpperCase();
}

/** articles 原始数组 → 过滤 + 去重（标题前 40 字符）+ 截前 12 条 */
function normalizeArticles(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const out = [];
  for (const a of raw) {
    const title = typeof a?.title === 'string' ? a.title.trim() : '';
    const url = typeof a?.url === 'string' ? a.url : '';
    if (!title || !url) continue;          // 标题/链接为空 → 丢弃
    if (isShoutingJunk(title)) continue;   // 全大写垃圾 → 丢弃
    const key = title.slice(0, DEDUPE_PREFIX).toLowerCase();
    if (seen.has(key)) continue;           // 标题前 40 字符重复 → 丢弃
    seen.add(key);
    out.push({
      title,
      url,
      domain: typeof a?.domain === 'string' ? a.domain : '',
      when: parseSeendate(a?.seendate),
      country: typeof a?.sourcecountry === 'string' ? a.sourcecountry : '',
    });
    if (out.length >= MAX_ITEMS) break;
  }
  return out;
}

// ---------------------------------------------------------------------------
// 取数管线
// ---------------------------------------------------------------------------

/** 拉取并解析；任何失败都不抛，返回 { articles:null, fetchedAt:null, error:中文原因 } */
async function fetchGdelt() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(GDELT_URL, { signal: ctrl.signal });
    if (res.status === 429) return { articles: null, fetchedAt: null, error: 'GDELT 限频（请稍后自动重试）' };
    if (!res.ok) return { articles: null, fetchedAt: null, error: `GDELT 请求失败（HTTP ${res.status}）` };
    // 限频/异常时可能返回纯文本而非 JSON → 手动解析并 try/catch
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return { articles: null, fetchedAt: null, error: 'GDELT 返回非 JSON（可能限频）' };
    }
    const articles = normalizeArticles(json?.articles);
    if (!articles.length) return { articles: null, fetchedAt: null, error: 'GDELT 暂无可用条目' };
    return { articles, fetchedAt: new Date(), error: null };
  } catch (e) {
    const msg = e && e.name === 'AbortError' ? 'GDELT 请求超时（10 秒）' : 'GDELT 舆情流获取失败';
    return { articles: null, fetchedAt: null, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

// 模块级缓存：多个组件实例共享，避免重复请求
let _cache = { articles: null, fetchedAt: null, error: null };
let _pending = null; // 进行中的请求 Promise（并发去重）

function loadShared(force = false) {
  if (!force && _cache.articles) return Promise.resolve(_cache);
  if (!_pending) {
    _pending = fetchGdelt().then(async (res) => {
      if (res.articles) {
        res.source = 'gdelt';
      } else {
        // GDELT 浏览器端常无 CORS/限频 → 切 HN Algolia 兜底（保证活流）
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 8000);
          const articles = await fetchHnFallback(ctrl.signal);
          clearTimeout(t);
          if (articles.length) res = { articles, fetchedAt: new Date(), error: null, source: 'hn' };
        } catch (_) { /* 双源皆败，保留原 error */ }
      }
      _pending = null;
      if (res.articles) _cache = res; // 仅成功才覆盖缓存
      return res;
    });
  }
  return _pending;
}

/**
 * GDELT 全球涉华舆情流 Hook
 * @param {number} refreshMs 自动刷新间隔（默认 5 分钟）
 * @returns {{ articles: GdeltArticle[]|null, fetchedAt: Date|null, loading: boolean, error: string|null }}
 */

// —— HN Algolia 兜底源（CORS 确定开放）：GDELT 浏览器跨域受限时切换 ——
async function fetchHnFallback(signal) {
  const res = await fetch('https://hn.algolia.com/api/v1/search_by_date?query=china&tags=story&hitsPerPage=20', { signal });
  if (!res.ok) throw new Error(`HN HTTP ${res.status}`);
  const j = await res.json();
  const seen = new Set();
  const out = [];
  for (const h of j.hits || []) {
    const title = (h.title || '').trim();
    if (!title) continue;
    const k = title.slice(0, 40).toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    let domain = 'news.ycombinator.com';
    try { if (h.url) domain = new URL(h.url).hostname; } catch (_) { /* noop */ }
    out.push({
      title,
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      domain,
      when: new Date(h.created_at),
      country: '',
    });
    if (out.length >= 12) break;
  }
  return out;
}

export function useGdeltNews(refreshMs = 300000) {
  const [state, setState] = useState(() => ({
    articles: _cache.articles,
    fetchedAt: _cache.fetchedAt,
    source: _cache.source || null,
    loading: !_cache.articles,
    error: null,
  }));

  useEffect(() => {
    let alive = true;
    const apply = (res) => {
      if (!alive) return;
      // 失败但有旧缓存时沿用旧数据，仅提示 error
      if (!res.articles && _cache.articles) {
        setState({ articles: _cache.articles, fetchedAt: _cache.fetchedAt, source: _cache.source || null, loading: false, error: res.error });
        return;
      }
      setState({ articles: res.articles, fetchedAt: res.fetchedAt, source: res.source || null, loading: false, error: res.error });
    };
    loadShared().then(apply); // 首次挂载即取数（命中缓存则直接回填）
    const timer = setInterval(() => loadShared(true).then(apply), Math.max(refreshMs, 60000));
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [refreshMs]);

  return state;
}

// ---------------------------------------------------------------------------
// 展示工具
// ---------------------------------------------------------------------------

/**
 * 中文相对时间：'刚刚 / 3 分钟前 / 2 小时前 / 1 天前'
 * @param {Date|null} date
 * @returns {string}
 */
export function timeAgo(date) {
  const t = date instanceof Date ? date.getTime() : NaN;
  if (!Number.isFinite(t)) return '--';
  const diff = Date.now() - t;
  if (diff < 0) return '刚刚';
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  return `${Math.floor(hr / 24)} 天前`;
}

/**
 * 域名徽标：去 www. 前缀，过长截取主域名（从尾部保留完整标签），≤18 字符
 * @param {string} domain 如 'telecom.economictimes.indiatimes.com'
 * @returns {string} 如 'indiatimes.com'
 */
export function domainBadge(domain) {
  let d = String(domain || '').trim().toLowerCase().replace(/^www\./, '');
  if (!d) return '--';
  if (d.length <= 18) return d;
  // 从尾部保留尽量多的完整标签（主域名优先），仍超长则硬截断
  const parts = d.split('.');
  let kept = parts[parts.length - 1];
  for (let i = parts.length - 2; i >= 0; i--) {
    const next = `${parts[i]}.${kept}`;
    if (next.length > 18) break;
    kept = next;
  }
  return kept.length <= 18 ? kept : d.slice(0, 18);
}
