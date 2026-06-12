import { AVATAR_OVERRIDES_BY_ID, AVATAR_OVERRIDES_BY_NAME } from '../db/avatarOverrides.js';
import {
  VERIFY_TIER,
  canAttemptVerifiedFetch,
  isBadImageUrl,
  isDisambiguationPage,
  resolveStaticAvatar,
  verifyPortraitCandidate,
  wikiTitleMatchesPerson,
} from './avatarVerify.js';

const CACHE_KEY = 'c2os-avatar-cache-v3';
const MISS = '__miss__';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const QUEUE_DELAY_MS = 180;
const PREFETCH_CONCURRENCY = 3;

const memory = new Map();
const cacheMeta = new Map();
const listeners = new Map();
const pendingResolvers = new Map();
const queue = [];
let draining = false;
let activeFetches = 0;

function hydrate() {
  if (memory.size) return;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const { entries = {}, meta = {} } = JSON.parse(raw);
    const now = Date.now();
    Object.entries(entries).forEach(([k, v]) => {
      const ts = meta[k] || 0;
      if (now - ts < CACHE_TTL_MS) memory.set(k, v === null ? MISS : v);
    });
    Object.entries(meta).forEach(([k, ts]) => cacheMeta.set(k, ts));
  } catch { /* corrupt cache */ }
}

function persist() {
  try {
    const entries = {};
    const meta = {};
    memory.forEach((v, k) => { entries[k] = v === MISS ? null : v; meta[k] = cacheMeta.get(k) || Date.now(); });
    localStorage.setItem(CACHE_KEY, JSON.stringify({ v: 3, entries, meta }));
  } catch { /* quota / private mode */ }
}

/** @param {string} key @param {{ url: string|null, tier: string }} result */
function setCache(key, result) {
  const payload = result?.url && result.tier === VERIFY_TIER.VERIFIED
    ? { url: result.url, tier: VERIFY_TIER.VERIFIED }
    : MISS;
  memory.set(key, payload);
  cacheMeta.set(key, Date.now());
  persist();
}

/** @param {string} key @returns {{ url: string|null, tier: string }} */
function readCache(key) {
  const v = memory.get(key);
  if (v === MISS || v === undefined) return { url: null, tier: VERIFY_TIER.EMPTY };
  if (typeof v === 'string') return { url: v, tier: VERIFY_TIER.VERIFIED };
  if (v?.tier === VERIFY_TIER.VERIFIED && v?.url) return { url: v.url, tier: VERIFY_TIER.VERIFIED };
  return { url: null, tier: VERIFY_TIER.EMPTY };
}

/** @param {{ id?: string, name: string, nameEn?: string, wikiTitle?: string, wikiLang?: string, avatarUrl?: string, verifyTier?: string, source?: string }} meta */
function resolveMeta(meta) {
  const name = meta?.name || '';
  const id = meta?.id || '';
  const ov = (id && AVATAR_OVERRIDES_BY_ID[id]) || AVATAR_OVERRIDES_BY_NAME[name] || {};
  return {
    id,
    name,
    nameEn: meta?.nameEn || ov.nameEn || '',
    wikiTitle: meta?.wikiTitle || ov.wikiTitle || '',
    wikiLang: meta?.wikiLang || ov.wikiLang || 'zh',
    avatarUrl: meta?.avatarUrl || ov.avatarUrl || '',
    verifyTier: meta?.verifyTier || ov.verifyTier || '',
    source: meta?.source || ov.source || '',
  };
}

function cacheKey(meta) {
  const m = resolveMeta(meta);
  if (m.id) return `id:${m.id}`;
  return `name:${m.name}`;
}

function notify(key) {
  const subs = listeners.get(key);
  if (!subs) return;
  subs.forEach((fn) => fn(readCache(key)));
}

async function fetchCommonsMeta(fileName) {
  if (!fileName?.trim()) return { description: '' };
  const params = new URLSearchParams({
    action: 'query',
    titles: `File:${fileName.trim()}`,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
  if (!res.ok) return { description: '' };
  const data = await res.json();
  const page = Object.values(data?.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  const desc = info?.extmetadata?.ImageDescription?.value
    || info?.extmetadata?.ObjectName?.value
    || '';
  return { description: desc, url: info?.url || '' };
}

/**
 * 仅对指定 wiki 标题拉取并核验肖像（禁止搜索兜底）。
 * @param {string} title
 * @param {string} lang
 * @param {string} personName
 * @param {string} [nameEn]
 */
async function fetchVerifiedWikiPortrait(title, lang, personName, nameEn = '') {
  if (!title?.trim() || !wikiTitleMatchesPerson(title, personName, nameEn)) {
    return { url: null, tier: VERIFY_TIER.EMPTY };
  }

  const api = `https://${lang || 'zh'}.wikipedia.org/w/api.php`;
  const params = new URLSearchParams({
    action: 'query',
    titles: title.trim(),
    prop: 'pageimages|pageprops|categories',
    piprop: 'thumbnail|name',
    pithumbsize: '320',
    cllimit: '20',
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${api}?${params}`);
  if (!res.ok) return { url: null, tier: VERIFY_TIER.EMPTY };

  const data = await res.json();
  const page = Object.values(data?.query?.pages || {})[0];
  if (isDisambiguationPage(page)) return { url: null, tier: VERIFY_TIER.EMPTY };

  const thumbUrl = page?.thumbnail?.source;
  const fileName = page?.pageimage || page?.thumbnail?.name || '';
  if (!thumbUrl) return { url: null, tier: VERIFY_TIER.EMPTY };

  const commons = await fetchCommonsMeta(fileName);
  const check = verifyPortraitCandidate(thumbUrl, fileName, commons.description);
  if (!check.ok) return { url: null, tier: VERIFY_TIER.EMPTY };
  if (isBadImageUrl(check.url)) return { url: null, tier: VERIFY_TIER.EMPTY };

  return { url: check.url, tier: VERIFY_TIER.VERIFIED };
}

/** @param {ReturnType<typeof resolveMeta>} m */
async function resolveFromNetwork(m) {
  const staticResult = resolveStaticAvatar(m);
  if (staticResult.url) return staticResult;

  if (!canAttemptVerifiedFetch(m)) {
    return { url: null, tier: VERIFY_TIER.EMPTY };
  }

  if (m.wikiTitle) {
    const langs = [m.wikiLang || 'zh'];
    if (m.wikiLang !== 'en' && m.nameEn) langs.push('en');

    for (const lang of langs) {
      try {
        const result = await fetchVerifiedWikiPortrait(m.wikiTitle, lang, m.name, m.nameEn);
        if (result.url) return result;
      } catch { /* offline */ }
    }
  }

  return { url: null, tier: VERIFY_TIER.EMPTY };
}

function drainQueue() {
  if (draining || !queue.length) return;
  draining = true;
  const tick = async () => {
    while (activeFetches >= PREFETCH_CONCURRENCY && queue.length) {
      await new Promise((r) => setTimeout(r, QUEUE_DELAY_MS));
    }
    const job = queue.shift();
    if (!job) { draining = false; return; }
    const { key, meta } = job;
    activeFetches += 1;
    try {
      const result = await resolveFromNetwork(meta);
      setCache(key, result);
      notify(key);
      pendingResolvers.get(key)?.forEach((r) => r(result));
    } catch {
      const empty = { url: null, tier: VERIFY_TIER.EMPTY };
      setCache(key, empty);
      notify(key);
      pendingResolvers.get(key)?.forEach((r) => r(empty));
    } finally {
      activeFetches -= 1;
      pendingResolvers.delete(key);
      setTimeout(tick, QUEUE_DELAY_MS);
    }
  };
  tick();
}

/**
 * @param {string|{ id?: string, name: string, nameEn?: string, wikiTitle?: string, wikiLang?: string, avatarUrl?: string, verifyTier?: string, source?: string }} nameOrMeta
 * @param {string} [avatarUrl]
 * @returns {Promise<{ url: string|null, tier: string }>}
 */
export function fetchFigureAvatar(nameOrMeta, avatarUrl) {
  hydrate();
  const meta = typeof nameOrMeta === 'string'
    ? resolveMeta({ name: nameOrMeta, avatarUrl })
    : resolveMeta(nameOrMeta);
  const key = cacheKey(meta);

  const staticResult = resolveStaticAvatar(meta);
  if (staticResult.url) {
    if (!memory.has(key)) setCache(key, staticResult);
    return Promise.resolve(staticResult);
  }

  if (!canAttemptVerifiedFetch(meta)) {
    return Promise.resolve({ url: null, tier: VERIFY_TIER.EMPTY });
  }

  if (memory.has(key)) {
    return Promise.resolve(readCache(key));
  }

  return new Promise((resolve) => {
    const waiters = pendingResolvers.get(key) || [];
    waiters.push(resolve);
    pendingResolvers.set(key, waiters);
    if (!queue.some((j) => j.key === key)) queue.push({ key, meta });
    drainQueue();
  });
}

/** @deprecated 使用 fetchFigureAvatar */
export function fetchFigureAvatarUrl(nameOrMeta, avatarUrl) {
  return fetchFigureAvatar(nameOrMeta, avatarUrl).then((r) => r.url);
}

/** Subscribe to cache updates for a figure avatar key. */
export function subscribeFigureAvatar(nameOrMeta, avatarUrl, cb) {
  hydrate();
  const meta = typeof nameOrMeta === 'string'
    ? resolveMeta({ name: nameOrMeta, avatarUrl })
    : resolveMeta(nameOrMeta);
  const key = cacheKey(meta);
  const subs = listeners.get(key) || new Set();
  subs.add(cb);
  listeners.set(key, subs);

  const staticResult = resolveStaticAvatar(meta);
  if (staticResult.url) {
    if (!memory.has(key)) setCache(key, staticResult);
    cb(staticResult);
  } else if (memory.has(key)) {
    cb(readCache(key));
  } else if (!canAttemptVerifiedFetch(meta)) {
    cb({ url: null, tier: VERIFY_TIER.EMPTY });
  }

  return () => {
    subs.delete(cb);
    if (!subs.size) listeners.delete(key);
  };
}

/** 批量预取可见列表头像（仅已核验/curated，限流后台队列） */
export function prefetchFigureAvatarBatch(metaList, limit = 48) {
  hydrate();
  (metaList || []).slice(0, limit).forEach((raw) => {
    const meta = resolveMeta(raw);
    const key = cacheKey(meta);
    const staticResult = resolveStaticAvatar(meta);
    if (staticResult.url) {
      if (!memory.has(key)) setCache(key, staticResult);
      return;
    }
    if (!canAttemptVerifiedFetch(meta)) return;
    if (memory.has(key)) return;
    if (!queue.some((j) => j.key === key)) queue.push({ key, meta });
  });
  drainQueue();
}

const HUES = [185, 350, 42, 160, 270, 25, 210, 320, 95, 300];

function hashName(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

export function figureMonogramColor(name = '') {
  return `hsl(${HUES[hashName(name) % HUES.length]}, 38%, 32%)`;
}

/** 单色背景（无照片时的首字母占位，非 identicon） */
export function figureMonogramBackground(name = '') {
  return figureMonogramColor(name);
}

/** @deprecated 使用 figureMonogramBackground */
export function figureMonogramGradient(name = '') {
  return figureMonogramBackground(name);
}

export function figureMonogramChar(name = '') {
  const trimmed = (name || '?').trim();
  if (!trimmed) return '?';
  const isLatin = /^[A-Za-z]/.test(trimmed);
  if (isLatin) {
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return trimmed.slice(0, 2).toUpperCase();
  }
  return trimmed[0];
}
