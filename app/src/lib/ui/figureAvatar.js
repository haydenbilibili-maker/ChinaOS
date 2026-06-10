const CACHE_KEY = 'c2os-figure-avatars-v1';
const MISS = '__miss__';
const QUEUE_DELAY_MS = 220;

const memory = new Map();
const listeners = new Map();
const pendingResolvers = new Map();
const queue = [];
let draining = false;

function hydrate() {
  if (memory.size) return;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    Object.entries(obj).forEach(([k, v]) => memory.set(k, v === null ? MISS : v));
  } catch { /* ignore corrupt cache */ }
}

function persist() {
  try {
    const obj = {};
    memory.forEach((v, k) => { obj[k] = v === MISS ? null : v; });
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch { /* quota / private mode */ }
}

function cacheKey(name, avatarUrl) {
  return avatarUrl ? `url:${avatarUrl}` : `name:${name}`;
}

function notify(key) {
  const subs = listeners.get(key);
  if (!subs) return;
  const val = memory.get(key);
  const url = val === MISS ? null : (val || null);
  subs.forEach((fn) => fn(url));
}

async function wikiThumb(name, lang) {
  const api = `https://${lang}.wikipedia.org/w/api.php`;
  const params = new URLSearchParams({
    action: 'query',
    titles: name,
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '240',
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${api}?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined) return null;
  return page.thumbnail?.source || null;
}

async function resolveFromNetwork(name) {
  let url = await wikiThumb(name, 'zh');
  if (!url) url = await wikiThumb(name, 'en');
  return url;
}

function drainQueue() {
  if (draining || !queue.length) return;
  draining = true;
  const tick = async () => {
    const job = queue.shift();
    if (!job) { draining = false; return; }
    const { key, name } = job;
    try {
      const url = await resolveFromNetwork(name);
      memory.set(key, url || MISS);
      persist();
      notify(key);
      pendingResolvers.get(key)?.forEach((r) => r(url));
    } catch {
      memory.set(key, MISS);
      persist();
      notify(key);
      pendingResolvers.get(key)?.forEach((r) => r(null));
    } finally {
      pendingResolvers.delete(key);
      setTimeout(tick, QUEUE_DELAY_MS);
    }
  };
  tick();
}

/** @returns {Promise<string|null>} */
export function fetchFigureAvatarUrl(name, avatarUrl) {
  hydrate();
  const key = cacheKey(name, avatarUrl);
  if (avatarUrl) {
    if (!memory.has(key)) {
      memory.set(key, avatarUrl);
      persist();
    }
    return Promise.resolve(avatarUrl);
  }
  if (memory.has(key)) {
    const v = memory.get(key);
    return Promise.resolve(v === MISS ? null : v);
  }
  return new Promise((resolve) => {
    const waiters = pendingResolvers.get(key) || [];
    waiters.push(resolve);
    pendingResolvers.set(key, waiters);
    if (!queue.some((j) => j.key === key)) queue.push({ key, name });
    drainQueue();
  });
}

/** Subscribe to cache updates for a figure avatar key. */
export function subscribeFigureAvatar(name, avatarUrl, cb) {
  hydrate();
  const key = cacheKey(name, avatarUrl);
  const subs = listeners.get(key) || new Set();
  subs.add(cb);
  listeners.set(key, subs);
  if (memory.has(key)) {
    const v = memory.get(key);
    cb(v === MISS ? null : (v || null));
  }
  return () => {
    subs.delete(cb);
    if (!subs.size) listeners.delete(key);
  };
}

const HUES = [185, 350, 42, 160, 270, 25, 210, 320];

export function figureMonogramColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return `hsl(${HUES[h % HUES.length]}, 52%, 38%)`;
}

export function figureMonogramChar(name = '') {
  const ch = (name || '?').trim()[0];
  return ch || '?';
}
