/** 意识形态架构 GY-02 · 页签 / 卷宗 / 观测哨（命名空间 chinaos.yishi.v1） */
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';
import { resolveYishiTab, yishiPanelId } from '../../lib/yishixingtai/routing.js';
import { withGyInit } from '../shared/gy/enhanceMethodology.js';

const NS = 'chinaos.yishi.v1';

function scrollToEl(el) {
  if (!el) return;
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

/** @param {HTMLElement | null} root @param {{ tab?: string, tension?: string, watch?: string, comp?: string }} deepLink */
function initYishixingtaiCore(root, deepLink = {}) {
  if (!root) return () => {};

  const cleanups = [];

  const nav = root.querySelectorAll('.ys-nav button');
  const activatePanel = (panelId) => {
    nav.forEach((b) => b.classList.toggle('is-active', b.dataset.panel === panelId));
    root.querySelectorAll('section.ys-panel').forEach((p) => {
      p.classList.toggle('is-active', p.id === panelId);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  nav.forEach((btn) => {
    const onClick = () => activatePanel(btn.dataset.panel);
    btn.addEventListener('click', onClick);
    cleanups.push(() => btn.removeEventListener('click', onClick));
  });

  const toggleDossier = (d, forceOpen) => {
    const open = forceOpen === true ? true : !d.classList.contains('is-open');
    d.classList.toggle('is-open', open);
    const toggle = d.querySelector('.ys-dossier-toggle');
    if (toggle) toggle.textContent = open ? '收起 −' : '展开 +';
  };

  root.querySelectorAll('.ys-dossier').forEach((d) => {
    const head = d.querySelector('.ys-dossier-head');
    if (!head) return;
    const onClick = () => toggleDossier(d);
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDossier(d);
      }
    };
    head.addEventListener('click', onClick);
    head.addEventListener('keydown', onKey);
    cleanups.push(() => {
      head.removeEventListener('click', onClick);
      head.removeEventListener('keydown', onKey);
    });
  });

  root.querySelectorAll('.ys-stratum').forEach((s) => {
    const drill = () => {
      const comp = s.dataset.comp;
      activatePanel('ys-p-comps');
      const d = root.querySelector(`#ys-d-${comp}`);
      if (d) {
        toggleDossier(d, true);
        scrollToEl(d);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        drill();
      }
    };
    s.addEventListener('click', drill);
    s.addEventListener('keydown', onKey);
    cleanups.push(() => {
      s.removeEventListener('click', drill);
      s.removeEventListener('keydown', onKey);
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

  const stateEl = root.querySelector('#ys-storage-state');
  if (stateEl) {
    stateEl.textContent = persistent ? '本机持久化 · 已启用' : '沙箱预览 · 仅内存暂存';
  }

  const data = loadAll();
  const STATUS_LABEL = { good: '向好', flat: '中性', bad: '恶化' };

  const stamp = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  root.querySelectorAll('#ys-watch-list .ys-watch-item').forEach((item) => {
    const key = item.dataset.key;
    const btns = item.querySelectorAll('.ys-status-btn');
    const note = item.querySelector('.ys-watch-note');
    const stampEl = item.querySelector('.ys-watch-stamp');
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

  const tab = resolveYishiTab(deepLink.tab);
  activatePanel(yishiPanelId(tab));

  if (deepLink.tension) {
    scrollToEl(root.querySelector(`#ys-tension-${deepLink.tension}`));
  }
  if (deepLink.watch) {
    const item = root.querySelector(`#ys-watch-list .ys-watch-item[data-key="${deepLink.watch}"]`);
    scrollToEl(item);
  }
  if (deepLink.comp) {
    activatePanel('ys-p-comps');
    const d = root.querySelector(`#ys-d-${deepLink.comp}`);
    if (d) {
      toggleDossier(d, true);
      scrollToEl(d);
    }
  }

  return () => cleanups.forEach((fn) => fn());
}

export const initYishixingtai = withGyInit(initYishixingtaiCore);
