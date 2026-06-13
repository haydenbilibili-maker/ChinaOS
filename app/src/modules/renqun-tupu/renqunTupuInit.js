/** 人群画像总图谱 GY-00 · 页签 / 切片点亮（命名空间 chinaos.atlas.v1） */
import { renqunTupuPanelId } from '../../lib/renqun-tupu/routing.js';
import { withGyInit } from '../shared/gy/enhanceMethodology.js';

const NS = 'chinaos.atlas.v1';
const DEFAULT_LIT = ['GY-03', 'GY-04', 'GY-05'];
const TOTAL = 25;

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
      return v ? JSON.parse(v) : DEFAULT_LIT.slice();
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
    if (todoN) todoN.textContent = String(TOTAL - n);
  };

  const renderSlices = () => {
    root.querySelectorAll('.at-slice').forEach((s) => {
      s.classList.toggle('is-lit', isLit(s.dataset.code));
    });
  };

  const toggle = (code) => {
    const i = lit.indexOf(code);
    if (i === -1) lit.push(code);
    else lit.splice(i, 1);
    save(lit);
    renderSlices();
    renderRing();
  };

  root.querySelectorAll('.at-slice').forEach((s) => {
    const code = s.dataset.code;
    const onClick = () => toggle(code);
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(code);
      }
    };
    s.addEventListener('click', onClick);
    s.addEventListener('keydown', onKey);
    cleanups.push(() => {
      s.removeEventListener('click', onClick);
      s.removeEventListener('keydown', onKey);
    });
  });

  const resetBtn = root.querySelector('#at-reset');
  if (resetBtn) {
    const onReset = () => {
      lit = DEFAULT_LIT.slice();
      save(lit);
      renderSlices();
      renderRing();
    };
    resetBtn.addEventListener('click', onReset);
    cleanups.push(() => resetBtn.removeEventListener('click', onReset));
  }

  renderSlices();
  renderRing();
  activatePanel(renqunTupuPanelId(deepLink.tab));

  return () => cleanups.forEach((fn) => fn());
}

export const initRenqunTupu = withGyInit(initRenqunTupuCore);
