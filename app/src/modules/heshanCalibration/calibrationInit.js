/** 重构河山 · 交互初始化 */
import {
  HESHAN_AS_OF,
  HESHAN_CALIBRATION_REGIONS,
  HESHAN_DATA_NOTE,
} from '../shared/heshanData.js';

export function initHeshanCalibration(root) {
  if (!root) return () => {};
  const cleanups = [];
  try {
    const REGIONS = HESHAN_CALIBRATION_REGIONS;

    function fmtPop(w) {
      return w >= 10000
        ? `${(w / 10000).toFixed(2).replace(/\.?0+$/, '')}亿`
        : `${Math.round(w)}万`;
    }
    function fmtGdp(y) {
      return y >= 10000
        ? `${(y / 10000).toFixed(2).replace(/\.?0+$/, '')}万亿`
        : `${Math.round(y)}亿`;
    }

    const dataRoot = root.querySelector('#root');
    if (!dataRoot) return () => {};

    const asOfEl = root.querySelector('#hs-cal-asof');
    if (asOfEl) asOfEl.textContent = HESHAN_AS_OF;
    const noteEl = root.querySelector('#hs-cal-note');
    if (noteEl) noteEl.textContent = HESHAN_DATA_NOTE;

    REGIONS.forEach((reg) => {
      const sec = document.createElement('div');
      sec.className = 'region';
      let html = `<div class="region-head"><span class="rdot" style="background:${reg.color}"></span><h2>${reg.name}</h2></div>`;
      reg.provs.forEach((p) => {
        const tp = p.cities.reduce((a, c) => a + c[1], 0);
        const tg = p.cities.reduce((a, c) => a + c[2], 0);
        const cls = p.flag ? 'prov flag' : p.muni ? 'prov muni' : 'prov';
        const chips = p.cities
          .map(
            (c) =>
              `<span class="city"><b>${c[0]}</b><span class="n">${Math.round(c[1])}万/${Math.round(c[2])}亿</span></span>`
          )
          .join('');
        html += `<div class="${cls}"><div class="ph"><div class="pn">${p.n} <span style="font-size:11px;color:var(--muted);font-weight:400">${p.o}</span></div>
          <div class="pt">合计 ≈ <b>${fmtPop(tp)}</b> 人 · <b>${fmtGdp(tg)}</b></div></div>
          <div class="cities">${chips}</div>
          ${reg.note ? `<div class="note-row">⚑ ${reg.note}</div>` : ''}</div>`;
      });
      sec.innerHTML = html;
      dataRoot.appendChild(sec);
    });

    let allP = 0;
    let allG = 0;
    let cnt = 0;
    REGIONS.forEach((r) =>
      r.provs.forEach((p) => {
        allP += p.cities.reduce((a, c) => a + c[1], 0);
        allG += p.cities.reduce((a, c) => a + c[2], 0);
        cnt += 1;
      })
    );
    const tot = document.createElement('div');
    tot.className = 'region';
    tot.innerHTML = `<div class="prov" style="border-left-color:var(--cinnabar);text-align:center"><div class="pn" style="margin-bottom:6px">新设/重组单元小计</div>
      <div class="pt" style="font-size:15px">共 <b>${cnt}</b> 个单元 · 覆盖人口 ≈ <b>${fmtPop(allP)}</b> · GDP ≈ <b>${fmtGdp(allG)}</b><br>
      <span style="font-size:12px;color:var(--muted)">（其余约20个保留单元未计入 · 与<a href="/modules/heshan/fiscal" style="color:var(--cinnabar)">财政沙盘</a>底表同源）</span></div></div>`;
    dataRoot.appendChild(tot);
  } catch (err) {
    console.warn('[initHeshanCalibration]', err);
  }
  return () => {
    cleanups.forEach((fn) => {
      try {
        fn();
      } catch (_) {}
    });
  };
}
