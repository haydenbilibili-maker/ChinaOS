/** 数据事实观察看板 · 渲染与刷新 */

import { OBSERVATIONS, OBS_AS_OF, OBS_FETCHED_AT, OBS_SOURCE_NOTE } from './observationData.js';
import { computeObservationHint, fmtDelta, fmtValue } from './observationLogic.js';

const SIGNAL_LABEL = { red: '红', amber: '琥珀', green: '绿' };

/**
 * @param {HTMLElement | null} root #sd-app
 * @param {{ onHintsChange?: (summary: { red: number, amber: number, green: number }) => void }} [opts]
 */
export function initObservationBoard(root, opts = {}) {
  if (!root) return () => {};

  const $ = (id) => root.querySelector(`#${String(id).replace(/^#/, '')}`);
  const cleanups = [];
  /** @type {import('./observationData.js').Observation[]} */
  let data = [...OBSERVATIONS];

  function tally(hints) {
    let red = 0; let amber = 0; let green = 0;
    hints.forEach((h) => {
      if (h.signal === 'red') red += 1;
      else if (h.signal === 'green') green += 1;
      else amber += 1;
    });
    return { red, amber, green };
  }

  function renderSummary(hints) {
    const t = tally(hints);
    const el = $('#sd-obsSummary');
    if (el) {
      el.innerHTML = `绿灯 <b class="sd-obs-g">${t.green}</b> · 琥珀 <b class="sd-obs-a">${t.amber}</b> · 红灯 <b class="sd-obs-r">${t.red}</b>`;
    }
    opts.onHintsChange?.(t);
    return t;
  }

  function renderTable() {
    const tbody = $('#sd-obsBody');
    const meta = $('#sd-obsMeta');
    if (meta) {
      meta.innerHTML = `基准 <b>${OBS_AS_OF}</b> · 刷新 ${OBS_FETCHED_AT.slice(0, 10)} · ${OBS_SOURCE_NOTE}`;
    }
    if (!tbody) return [];

    const hints = [];
    const groups = [...new Set(data.map((o) => o.group))];
    tbody.innerHTML = '';

    groups.forEach((group) => {
      const sectionRows = data.filter((o) => o.group === group);
      const trGroup = document.createElement('tr');
      trGroup.className = 'sd-obs-group-row';
      trGroup.innerHTML = `<td colspan="7"><span class="sd-obs-group">${group}</span></td>`;
      tbody.appendChild(trGroup);

      sectionRows.forEach((obs) => {
        const hint = computeObservationHint(obs, data);
        hints.push(hint);
        const tr = document.createElement('tr');
        tr.className = `sd-obs-row s-${hint.signal}`;
        const linked = (obs.linkedSignals || []).map((s) => `<span class="sd-obs-link">${s}</span>`).join('');
        tr.innerHTML = `
          <td class="sd-obs-name">${obs.label}${linked ? `<div class="sd-obs-links">${linked}</div>` : ''}</td>
          <td class="sd-obs-val"><span class="sd-obs-num">${fmtValue(obs)}</span><span class="sd-obs-unit">${obs.unit}</span></td>
          <td class="sd-obs-delta">${fmtDelta(obs.yoy)}</td>
          <td class="sd-obs-delta">${fmtDelta(obs.mom)}</td>
          <td class="sd-obs-date">${obs.period || '—'}</td>
          <td class="sd-obs-hint"><span class="sd-obs-lamp s-${hint.signal}"></span>${hint.label}</td>
          <td class="sd-obs-reason">${hint.reason}</td>`;
        tbody.appendChild(tr);
      });
    });

    renderSummary(hints);
    return hints;
  }

  async function refreshFromPublic() {
    const btn = $('#sd-obsRefreshBtn');
    const status = $('#sd-obsStatus');
    if (btn) btn.disabled = true;
    if (status) status.textContent = '正在拉取…';
    try {
      const res = await fetch(`/data/signal_observations.json?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      if (Array.isArray(payload.observations) && payload.observations.length) {
        data = payload.observations;
        if (status) status.textContent = `已更新 · ${payload.fetchedAt?.slice(0, 10) || '—'}`;
      } else {
        throw new Error('empty payload');
      }
    } catch {
      data = [...OBSERVATIONS];
      if (status) status.textContent = '使用内置快照（运行 npm run fetch:signals 刷新源数据）';
    } finally {
      renderTable();
      if (btn) btn.disabled = false;
    }
  }

  renderTable();

  const refreshBtn = $('#sd-obsRefreshBtn');
  refreshBtn?.addEventListener('click', refreshFromPublic);
  cleanups.push(() => refreshBtn?.removeEventListener('click', refreshFromPublic));

  return () => cleanups.forEach((fn) => fn());
}

/** 供 signalInit 标签切换 */
export function bindSignalTabs(root) {
  if (!root) return () => {};
  const tabs = root.querySelectorAll('.sd-tab');
  const panels = {
    regime: root.querySelector('#sd-tab-regime'),
    observe: root.querySelector('#sd-tab-observe'),
  };
  const cleanups = [];

  tabs.forEach((tab) => {
    const onClick = () => {
      const key = tab.getAttribute('data-tab');
      tabs.forEach((t) => t.classList.toggle('on', t === tab));
      Object.entries(panels).forEach(([k, el]) => {
        if (el) el.hidden = k !== key;
      });
    };
    tab.addEventListener('click', onClick);
    cleanups.push(() => tab.removeEventListener('click', onClick));
  });

  return () => cleanups.forEach((fn) => fn());
}

export { SIGNAL_LABEL };
