import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_WATCHLIST, addNote, deleteNote, getFavorites, getNotes, getRecents, getWatchlist,
  isFavorite, pushRecent, setWatchlist, toggleFavorite, updateNote,
} from '../store.js';

function mockStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    clear: () => m.clear(),
  };
}

describe('workspace store', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', mockStorage());
    vi.stubGlobal('window', { dispatchEvent: vi.fn() });
    vi.stubGlobal('CustomEvent', class { constructor(type, init) { this.type = type; this.detail = init?.detail; } });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('toggles favorites, newest first', () => {
    expect(toggleFavorite('/a')).toBe(true);
    expect(toggleFavorite('/b')).toBe(true);
    expect(getFavorites()).toEqual(['/b', '/a']);
    expect(toggleFavorite('/a')).toBe(false);
    expect(isFavorite('/a')).toBe(false);
    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  it('keeps recents unique, capped, and skips hub routes', () => {
    pushRecent('/dashboard');
    pushRecent('/workspace');
    for (let i = 0; i < 20; i += 1) pushRecent(`/m${i}`);
    pushRecent('/m3');
    const r = getRecents();
    expect(r[0]).toBe('/m3');
    expect(r).toHaveLength(16);
    expect(new Set(r).size).toBe(16);
    expect(r).not.toContain('/dashboard');
  });

  it('defaults and dedupes the watchlist', () => {
    expect(getWatchlist()).toEqual(DEFAULT_WATCHLIST);
    setWatchlist(['cpi', 'cpi', 'm2']);
    expect(getWatchlist()).toEqual(['cpi', 'm2']);
  });

  it('creates, updates and deletes notes', () => {
    const n = addNote({ title: 't', source: { path: '/x', label: 'X', quote: 'q' } });
    expect(getNotes()[0].id).toBe(n.id);
    updateNote(n.id, { body: 'b' });
    expect(getNotes()[0].body).toBe('b');
    deleteNote(n.id);
    expect(getNotes()).toEqual([]);
  });

  it('survives corrupted storage', () => {
    localStorage.setItem('chinaos.ws.favorites.v1', '{oops');
    expect(getFavorites()).toEqual([]);
  });
});
