/** 青年 GY-03 · 页签 / 章节跳转 / 观测哨（命名空间 chinaos.qingnian.v1） */
import { qingnianPanelId, resolveQingnianTab } from '../../lib/qingnian/routing.js';

const NS = 'chinaos.qingnian.v1';

/** @param {HTMLElement | null} root @param {{ tab?: string }} deepLink */
export function initQingnian(root, deepLink = {}) {
  if (!root) return () => {};

  const cleanups = [];

  const nav = root.querySelectorAll('.qn-nav button');
  const activatePanel = (panelId) => {
    nav.forEach((b) => b.classList.toggle('is-active', b.dataset.panel === panelId));
    root.querySelectorAll('section.qn-panel').forEach((p) => {
      p.classList.toggle('is-active', p.id === panelId);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  nav.forEach((btn) => {
    const onClick = () => activatePanel(btn.dataset.panel);
    btn.addEventListener('click', onClick);
    cleanups.push(() => btn.removeEventListener('click', onClick));
  });

  root.querySelectorAll('.qn-ch.is-done').forEach((ch) => {
    const go = () => {
      const t = ch.dataset.goto;
      if (t) activatePanel(t);
    };
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    };
    ch.addEventListener('click', go);
    ch.addEventListener('keydown', onKey);
    cleanups.push(() => {
      ch.removeEventListener('click', go);
      ch.removeEventListener('keydown', onKey);
    });
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

  const stateEl = root.querySelector('#qn-storage-state');
  if (stateEl) {
    stateEl.textContent = persistent ? '本机持久化 · 已启用' : '沙箱预览 · 仅内存暂存';
  }

  const data = loadAll();
  const STATUS_LABEL = { good: '向好', flat: '中性', bad: '恶化' };

  const stamp = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  root.querySelectorAll('#qn-watch-list .qn-watch-item').forEach((item) => {
    const key = item.dataset.key;
    const btns = item.querySelectorAll('.qn-status-btn');
    const note = item.querySelector('.qn-watch-note');
    const stampEl = item.querySelector('.qn-watch-stamp');
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

  root.querySelectorAll('#qn-p-ch02 .qn-led-note').forEach((ta) => {
    const key = ta.dataset.key;
    const rec = data[key] || {};
    if (rec.note) ta.value = rec.note;

    let t2;
    const onInput = () => {
      clearTimeout(t2);
      t2 = setTimeout(() => {
        rec.note = ta.value;
        rec.updated = stamp();
        data[key] = rec;
        saveAll(data);
      }, 500);
    };
    ta.addEventListener('input', onInput);
    cleanups.push(() => {
      clearTimeout(t2);
      ta.removeEventListener('input', onInput);
    });
  });

  activatePanel(qingnianPanelId(deepLink.tab));

  return () => cleanups.forEach((fn) => fn());
}
