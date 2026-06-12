/** 国运推演 · 页签与观测哨 localStorage（命名空间 chinaos.guoyun.v1） */
import { resolveGuoyunPanel } from '../../lib/gy/coupling.js';

const NS = 'chinaos.guoyun.v1';

function scrollToEl(el) {
  if (!el) return;
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

function highlightEl(el) {
  if (!el) return;
  el.classList.add('gy-deep-focus');
  setTimeout(() => el.classList.remove('gy-deep-focus'), 2400);
}

/** @param {HTMLElement | null} root @param {{ panel?: string, scenario?: string, var?: string, watch?: string }} deepLink */
export function initGuoyun(root, deepLink = {}) {
  if (!root) return () => {};

  const cleanups = [];

  const nav = root.querySelectorAll('.gy-nav button');
  const activatePanel = (panelId) => {
    nav.forEach((b) => {
      b.classList.toggle('is-active', b.dataset.panel === panelId);
    });
    root.querySelectorAll('section.gy-panel').forEach((p) => {
      p.classList.toggle('is-active', p.id === panelId);
    });
  };

  nav.forEach((btn) => {
    const onClick = () => activatePanel(btn.dataset.panel);
    btn.addEventListener('click', onClick);
    cleanups.push(() => btn.removeEventListener('click', onClick));
  });

  let memStore = {};
  const loadAll = () => {
    try {
      return JSON.parse(localStorage.getItem(NS)) || {};
    } catch {
      return memStore;
    }
  };
  const saveAll = (data) => {
    try {
      localStorage.setItem(NS, JSON.stringify(data));
      return true;
    } catch {
      memStore = data;
      return false;
    }
  };

  const persistent = (() => {
    try {
      localStorage.setItem(`${NS}.ping`, '1');
      localStorage.removeItem(`${NS}.ping`);
      return true;
    } catch {
      return false;
    }
  })();

  const stateEl = root.querySelector('#gy-storage-state');
  if (stateEl) {
    stateEl.textContent = persistent ? '本机持久化 · 已启用' : '沙箱预览 · 仅内存暂存';
  }

  const data = loadAll();
  const STATUS_LABEL = { good: '向好', flat: '中性', bad: '恶化' };

  const stamp = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  root.querySelectorAll('#gy-watch-list .gy-watch-item').forEach((item) => {
    const key = item.dataset.key;
    const btns = item.querySelectorAll('.gy-status-btn');
    const note = item.querySelector('.gy-watch-note');
    const stampEl = item.querySelector('.gy-watch-stamp');
    const rec = data[key] || {};

    const render = () => {
      btns.forEach((b) => {
        b.classList.remove('on-good', 'on-flat', 'on-bad');
        if (rec.status === b.dataset.status) b.classList.add(`on-${rec.status}`);
      });
      if (note.value !== (rec.note || '')) note.value = rec.note || '';
      stampEl.textContent = rec.updated
        ? `更新 ${rec.updated}${rec.status ? ` · ${STATUS_LABEL[rec.status]}` : ''}`
        : '';
    };

    btns.forEach((b) => {
      const onClick = () => {
        rec.status = rec.status === b.dataset.status ? null : b.dataset.status;
        rec.updated = stamp();
        data[key] = rec;
        saveAll(data);
        render();
      };
      b.addEventListener('click', onClick);
      cleanups.push(() => b.removeEventListener('click', onClick));
    });

    let t;
    const onInput = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        rec.note = note.value;
        rec.updated = stamp();
        data[key] = rec;
        saveAll(data);
        render();
      }, 500);
    };
    note.addEventListener('input', onInput);
    cleanups.push(() => {
      clearTimeout(t);
      note.removeEventListener('input', onInput);
    });

    render();
  });

  const panel = resolveGuoyunPanel(deepLink.panel) || 'p-tuiyan';
  if (deepLink.panel || deepLink.scenario || deepLink.var || deepLink.watch) {
    activatePanel(panel);
  }

  if (deepLink.var) {
    const el = root.querySelector(`#gy-var-${deepLink.var}`);
    scrollToEl(el);
    highlightEl(el);
  }
  if (deepLink.scenario) {
    const el = root.querySelector(`#gy-scenario-${deepLink.scenario}`);
    scrollToEl(el);
    highlightEl(el);
  }
  if (deepLink.watch) {
    const el = root.querySelector(`#gy-watch-list .gy-watch-item[data-key="${deepLink.watch}"]`);
    activatePanel('p-watch');
    scrollToEl(el);
    highlightEl(el);
  }

  return () => cleanups.forEach((fn) => fn());
}
