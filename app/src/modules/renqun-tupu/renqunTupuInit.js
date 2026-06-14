/** 人群画像总图谱 GY-00 · 页签 / 切片点亮 / 模块跳转（命名空间 chinaos.atlas.v2） */
import { mountAtlasDom } from '../../lib/renqun-tupu/atlasRender.js';
import { POPULATION_SLICE_COUNT, POPULATION_SLICE_GY_NUMS } from '../../lib/gy/registry.js';
import { renqunTupuPanelId } from '../../lib/renqun-tupu/routing.js';
import { withGyInit } from '../shared/gy/enhanceMethodology.js';

const NS = 'chinaos.atlas.v2';
const NS_LEGACY = 'chinaos.atlas.v1';
const META_NS = 'chinaos.atlas.v2.meta';

/** GY-03…58 全部已上线人群切片 */
const DEFAULT_LIT = POPULATION_SLICE_GY_NUMS.map((num) => `GY-${num}`);
const ALL_CODES = new Set(DEFAULT_LIT);
const TOTAL = POPULATION_SLICE_COUNT;

/** @returns {{ sliceCount?: number } | null} */
function loadMeta() {
  try {
    const raw = localStorage.getItem(META_NS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {{ sliceCount: number }} meta */
function saveMeta(meta) {
  try {
    localStorage.setItem(META_NS, JSON.stringify(meta));
  } catch {
    /* ignore quota */
  }
}

/**
 * 与 registry 对齐：剔除失效编号；registry 扩容时自动点亮新上线切片。
 * @param {unknown} stored
 * @returns {{ lit: string[], changed: boolean }}
 */
function normalizeLit(stored) {
  const meta = loadMeta();
  const prevCount = meta?.sliceCount ?? 0;
  const arr = Array.isArray(stored) ? stored : [];
  const valid = arr.filter((code) => ALL_CODES.has(code));
  const litSet = new Set(valid);
  let changed = valid.length !== arr.length;

  if (TOTAL > prevCount) {
    for (const code of DEFAULT_LIT) {
      if (!litSet.has(code)) {
        valid.push(code);
        litSet.add(code);
        changed = true;
      }
    }
  }

  if (prevCount !== TOTAL) {
    saveMeta({ sliceCount: TOTAL });
    changed = true;
  }

  return { lit: valid, changed };
}

/** @param {HTMLElement | null} root @param {{ tab?: string }} deepLink */
function initRenqunTupuCore(root, deepLink = {}) {
  if (!root) return () => {};

  mountAtlasDom(root);

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
      if (v) {
        const { lit, changed } = normalizeLit(JSON.parse(v));
        if (changed) save(lit);
        return lit;
      }
      const legacy = localStorage.getItem(NS_LEGACY);
      if (legacy) {
        const { lit, changed } = normalizeLit(JSON.parse(legacy));
        save(lit);
        return lit;
      }
      saveMeta({ sliceCount: TOTAL });
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

  const litCount = () => lit.filter((code) => ALL_CODES.has(code)).length;

  const renderRing = () => {
    const n = litCount();
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
