// 主题管理 · 日览(light) / 夜览(dark) 切换
// ----------------------------------------------------------------------------
// 单一真相源：data-theme 写在 <html> 上，CSS 令牌按属性切换；选择持久化到
// localStorage；切换时派发 c2os-theme-change 事件，图表等监听后即时重渲染。
// 默认夜览（与既有玻璃拟态深色科技感一致），首访尊重系统 prefers-color-scheme。

import { applyChartTheme } from '../modules/shared/chartHelpers.js';

export const THEME_KEY = 'c2os-theme';
export const THEME_EVENT = 'c2os-theme-change';

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* localStorage 不可用时忽略 */
  }
  return null;
}

export function getSystemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'dark';
}

/** 当前生效主题：优先读 DOM 属性，回退存储/系统，最终默认夜览 */
export function getTheme() {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
  }
  return getStoredTheme() || 'dark';
}

/** 仅写 DOM 属性（无副作用，供无闪烁内联脚本与正式初始化复用） */
export function applyThemeAttribute(theme) {
  const t = theme === 'light' ? 'light' : 'dark';
  const root = document.documentElement;
  root.setAttribute('data-theme', t);
  // 兼容 tailwind darkMode:'class'
  root.classList.toggle('dark', t === 'dark');
}

export function setTheme(theme, { persist = true } = {}) {
  const t = theme === 'light' ? 'light' : 'dark';
  applyThemeAttribute(t);
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* 忽略写入失败 */
    }
  }
  applyChartTheme(t);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme: t } }));
  }
  return t;
}

export function toggleTheme() {
  return setTheme(getTheme() === 'light' ? 'dark' : 'light');
}

/** 应用启动时调用：确定初始主题（存储 > 系统 > 夜览）并同步图表调色板 */
export function initTheme() {
  const initial = getStoredTheme() || getSystemTheme();
  // 不重复持久化系统推断结果，待用户显式切换再写入
  applyThemeAttribute(initial);
  applyChartTheme(initial);
  return initial;
}

/** 订阅主题变更，返回取消订阅函数 */
export function subscribeTheme(cb) {
  const handler = (e) => cb(e.detail?.theme || getTheme());
  window.addEventListener(THEME_EVENT, handler);
  return () => window.removeEventListener(THEME_EVENT, handler);
}
