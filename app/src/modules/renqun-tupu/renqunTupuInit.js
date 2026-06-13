/** 人群画像总图谱 GY-00 · 页签 / 切片点亮 / 模块跳转（命名空间 chinaos.atlas.v2） */
import { GY_MODULES } from '../../lib/gy/registry.js';
import { renqunTupuPanelId } from '../../lib/renqun-tupu/routing.js';
import { withGyInit } from '../shared/gy/enhanceMethodology.js';

const NS = 'chinaos.atlas.v2';
const NS_LEGACY = 'chinaos.atlas.v1';

/** GY-03…28 全部已上线人群切片 */
const DEFAULT_LIT = Object.entries(GY_MODULES)
  .filter(([, m]) => m.group === 'population' && m.id !== 'renqunTupu')
  .map(([num]) => `GY-${num}`)
  .sort();

const TOTAL = DEFAULT_LIT.length;

/** @param {HTMLElement | null} root @param {{ tab?: string }} deepLink */
function initRenqunTupuCore(root, deepLink = {}) {
  if (!root) return () => {};

  const cleanups = [];

  const nav = root.querySelectorAll('.at-nav button');
  const activatePanel = (panelId) => {
    nav.forEach((b) => b.classList.toggle('is-active', b.dataset.panel === panelId));
    root.querySelectorAll('section.at-panel').forEach((p) => {
      p.classList.toggle('is-active', p.id === panelId);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  nav.forEach((btn) => {
    const onClick = () => activatePanel(btn.dataset.panel);
    btn.addEventListener('click', onClick);
    cleanups.push(() => btn.removeEventListener('click', onClick));
  });

  let memStore = null;
  const load = () => {
    try {
      const v = localStorage.getItem(NS);
      if (v) return JSON.parse(v);
      const legacy = localStorage.getItem(NS_LEGACY);
      if (legacy) return JSON.parse(legacy);
      return DEFAULT_LIT.slice();
    } catch {
      return memStore || DEFAULT_LIT.slice();
    }
  };
  const save = (arr) => {
    try {
      localStorage.setItem(NS, JSON.stringify(arr));
    } catch {
      memStore = arr;
    }
  };

  let lit = load();

  const isLit = (code) => lit.indexOf(code) !== -1;

  const renderRing = () => {
    const n = lit.length;
    const ring = root.querySelector('#at-ring');
    const circ = 169.6;
    if (ring) ring.setAttribute('stroke-dashoffset', (circ * (1 - n / TOTAL)).toFixed(1));
    const ringTxt = root.querySelector('#at-ring-txt');
    if (ringTxt) ringTxt.textContent = `${n}/${TOTAL}`;
    const doneN = root.querySelector('#at-done-n');
    if (doneN) doneN.textContent = String(n);
    const todoN = root.querySelector('#at-todo-n');
    if (todoN) todoN.textContent = String(Math.max(0, TOTAL - n));
  };

  const renderLitState = () => {
    root.querySelectorAll('.at-slice').forEach((s) => {
      s.classList.toggle('is-lit', isLit(s.dataset.code));
    });
    root.querySelectorAll('.at-axis-node[data-code]').forEach((n) => {
      n.classList.toggle('lit', isLit(n.dataset.code));
    });
  };

  const toggle = (code) => {
    const i = lit.indexOf(code);
    if (i === -1) lit.push(code);
    else lit.splice(i, 1);
    save(lit);
    renderLitState();
    renderRing();
  };

  const navigateSlice = (route) => {
    if (!route) return;
    window.location.hash = route.startsWith('#') ? route : `#${route}`;
  };

  root.querySelectorAll('.at-slice').forEach((s) => {
    const code = s.dataset.code;
    const route = s.dataset.route;

    const onDotClick = (e) => {
      e.stopPropagation();
      toggle(code);
    };
    const dot = s.querySelector('.at-slice-dot');
    if (dot) {
      dot.addEventListener('click', onDotClick);
      cleanups.push(() => dot.removeEventListener('click', onDotClick));
    }

    const onSliceClick = (e) => {
      if (e.target.closest('.at-slice-dot')) return;
      if (e.shiftKey || e.metaKey || e.ctrlKey) {
        toggle(code);
        return;
      }
      if (route) navigateSlice(route);
      else toggle(code);
    };
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (e.shiftKey) toggle(code);
        else if (route) navigateSlice(route);
        else toggle(code);
      }
    };
    s.addEventListener('click', onSliceClick);
    s.addEventListener('keydown', onKey);
    cleanups.push(() => {
      s.removeEventListener('click', onSliceClick);
      s.removeEventListener('keydown', onKey);
    });
  });

  root.querySelectorAll('.at-axis-node[data-route]').forEach((node) => {
    const onClick = () => navigateSlice(node.dataset.route);
    node.addEventListener('click', onClick);
    node.style.cursor = 'pointer';
    cleanups.push(() => node.removeEventListener('click', onClick));
  });

  const resetBtn = root.querySelector('#at-reset');
  if (resetBtn) {
    const onReset = () => {
      lit = DEFAULT_LIT.slice();
      save(lit);
      renderLitState();
      renderRing();
    };
    resetBtn.addEventListener('click', onReset);
    cleanups.push(() => resetBtn.removeEventListener('click', onReset));
  }

  renderLitState();
  renderRing();
  activatePanel(renqunTupuPanelId(deepLink.tab));

  return () => cleanups.forEach((fn) => fn());
}

export const initRenqunTupu = withGyInit(initRenqunTupuCore);
