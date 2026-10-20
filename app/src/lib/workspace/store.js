// ============================================================================
// 个人工作台 · 本地优先存储
// ----------------------------------------------------------------------------
// 收藏、最近访问、关注指标、笔记。全部存 localStorage（无账号也能用），
// 结构带版本号，后续接云同步时整体迁移。变更派发 WORKSPACE_EVENT，
// 同页多处订阅即时刷新；跨标签页通过 storage 事件同步。
// ============================================================================

import { useCallback, useEffect, useState } from 'react';

export const WORKSPACE_EVENT = 'chinaos:workspace-changed';

const KEYS = {
  favorites: 'chinaos.ws.favorites.v1',
  recents: 'cos-recent', // 沿用 1.x 足迹键，保留历史
  watchlist: 'chinaos.ws.watchlist.v1',
  notes: 'chinaos.ws.notes.v1',
};

export const DEFAULT_WATCHLIST = ['gdp_h1', 'cpi', 'pmi_mfg', 'm2'];
const MAX_RECENTS = 16;
const MAX_NOTES = 500;

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 隐私模式 / 配额不足：静默降级为仅本次会话 */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(WORKSPACE_EVENT, { detail: { key } }));
  }
}

/* ── 收藏 ─────────────────────────────────────────── */
export function getFavorites() {
  const v = read(KEYS.favorites, []);
  return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
}

export function isFavorite(path) {
  return getFavorites().includes(path);
}

export function toggleFavorite(path) {
  const cur = getFavorites();
  const next = cur.includes(path) ? cur.filter((p) => p !== path) : [path, ...cur];
  write(KEYS.favorites, next);
  return next.includes(path);
}

/* ── 最近访问 ─────────────────────────────────────── */
export function getRecents() {
  const v = read(KEYS.recents, []);
  return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
}

export function pushRecent(path) {
  if (!path || path === '/' || path === '/dashboard' || path === '/workspace') return;
  const next = [path, ...getRecents().filter((p) => p !== path)].slice(0, MAX_RECENTS);
  write(KEYS.recents, next);
}

export function clearRecents() {
  write(KEYS.recents, []);
}

/* ── 关注指标 ─────────────────────────────────────── */
export function getWatchlist() {
  const v = read(KEYS.watchlist, null);
  return Array.isArray(v) ? v : DEFAULT_WATCHLIST;
}

export function setWatchlist(ids) {
  write(KEYS.watchlist, [...new Set(ids)]);
}

/* ── 笔记 ─────────────────────────────────────────── */
/** @typedef {{ id: string, title: string, body: string, source?: { path: string, label: string, quote?: string }, color?: 'cinnabar'|'brass'|'celadon', createdAt: number, updatedAt: number }} Note */

export function getNotes() {
  const v = read(KEYS.notes, []);
  return Array.isArray(v) ? v : [];
}

function newId() {
  return `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/** @param {Partial<Note>} patch */
export function addNote(patch) {
  const now = Date.now();
  const note = { id: newId(), title: '', body: '', createdAt: now, updatedAt: now, ...patch };
  write(KEYS.notes, [note, ...getNotes()].slice(0, MAX_NOTES));
  return note;
}

export function updateNote(id, patch) {
  write(KEYS.notes, getNotes().map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)));
}

export function deleteNote(id) {
  write(KEYS.notes, getNotes().filter((n) => n.id !== id));
}

/* ── React 订阅 ───────────────────────────────────── */
export function useWorkspace(selector) {
  const [value, setValue] = useState(selector);
  const sel = useCallback(selector, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sync = () => setValue(sel());
    const onStorage = (e) => {
      if (!e.key || Object.values(KEYS).includes(e.key)) sync();
    };
    window.addEventListener(WORKSPACE_EVENT, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(WORKSPACE_EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, [sel]);

  return value;
}
