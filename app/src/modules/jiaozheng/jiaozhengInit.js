/** 社区矫正与刑释人员 GY-44 · 页签 / 观测哨(命名空间 chinaos.jc.v1) */
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';
import { jiaozhengPanelId } from '../../lib/jiaozheng/routing.js';
import { withGyInit } from '../shared/gy/enhanceMethodology.js';

const NS = 'chinaos.jc.v1';

/** @param {HTMLElement | null} root @param {{ tab?: string }} deepLink */
function initJiaozhengCore(root, deepLink = {}) {
  if (!root) return () => {};

  const cleanups = [];

  const nav = root.querySelectorAll('.jc-nav button');
  const activatePanel = (panelId) => {
    nav.forEach((b) => b.classList.toggle('is-active', b.dataset.panel === panelId));
    root.querySelectorAll('section.jc-panel').forEach((p) => {
      p.classList.toggle('is-active', p.id === panelId);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
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

  const stateEl = root.querySelector('#jc-storage-state');
  if (stateEl) {
    stateEl.textContent = persistent ? '本机持久化 · 已启用' : '沙箱预览 · 仅内存暂存';
  }

  const data = loadAll();
  const STATUS_LABEL = { good: '向好', flat: '中性', bad: '恶化' };

  const stamp = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  root.querySelectorAll('#jc-watch-list .jc-watch-item').forEach((item) => {
    const key = item.dataset.key;
    const btns = item.querySelectorAll('.jc-status-btn');
    const note = item.querySelector('.jc-watch-note');
    const stampEl = item.querySelector('.jc-watch-stamp');
    const rec = data[key] || {};

    const render = () => {
      btns.forEach((b) => {
        b.classList.remove('on-good', 'on-flat', 'on-bad');
        if (rec.status === b.dataset.status) b.classList.add(`on-${rec.status}`);
      });
      if (note.value !== (rec.note || '')) note.value = rec.note || '';
      stampEl.textContent = rec.updated
        ? `更新 ${rec.updated}${rec.status ? ` · ${STATUS_LABEL[rec.status]}` : ''}`
        : `基准 ${AS_OF_BASELINE} · 待观测`;
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

  activatePanel(jiaozhengPanelId(deepLink.tab));

  return () => cleanups.forEach((fn) => fn());
}

export const initJiaozheng = withGyInit(initJiaozhengCore);
