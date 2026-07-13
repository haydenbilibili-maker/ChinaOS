// 排版密度 · 舒适(comfortable) / 紧凑(compact)
// ----------------------------------------------------------------------------
// data-density 写在 <html> 上；CSS 令牌按属性切换；持久化 localStorage。

export const DENSITY_KEY = 'chinaos.density.v1';
export const DENSITY_EVENT = 'c2os-density-change';

export function getStoredDensity() {
  try {
    const v = localStorage.getItem(DENSITY_KEY);
    if (v === 'compact' || v === 'comfortable') return v;
  } catch {
    /* localStorage 不可用时忽略 */
  }
  return null;
}

/** 当前生效密度：优先读 DOM，回退存储，默认舒适 */
export function getDensity() {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-density');
    if (attr === 'compact' || attr === 'comfortable') return attr;
  }
  return getStoredDensity() || 'comfortable';
}

export function applyDensityAttribute(density) {
  const d = density === 'compact' ? 'compact' : 'comfortable';
  document.documentElement.setAttribute('data-density', d);
}

export function setDensity(density, { persist = true } = {}) {
  const d = density === 'compact' ? 'compact' : 'comfortable';
  applyDensityAttribute(d);
  if (persist) {
    try {
      localStorage.setItem(DENSITY_KEY, d);
    } catch {
      /* 忽略写入失败 */
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DENSITY_EVENT, { detail: { density: d } }));
  }
  return d;
}

export function toggleDensity() {
  return setDensity(getDensity() === 'compact' ? 'comfortable' : 'compact');
}

export function initDensity() {
  const initial = getStoredDensity() || 'comfortable';
  applyDensityAttribute(initial);
  return initial;
}

export function subscribeDensity(cb) {
  const handler = (e) => cb(e.detail?.density || getDensity());
  window.addEventListener(DENSITY_EVENT, handler);
  return () => window.removeEventListener(DENSITY_EVENT, handler);
}
