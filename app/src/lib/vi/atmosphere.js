// ============================================================================
// VI 2.0 · 全局氛围：卡片聚光 + 浑仪水印
// ----------------------------------------------------------------------------
// 聚光：一个文档级 pointermove 监听，把指针坐标写进最近 .os-card 的
// --mx / --my，并置 .vi-spot-on；渲染全由 CSS 完成（styles/vi2/material.css）。
// 触屏与「减弱动效」下不启用。
// ============================================================================

const CARD_SELECTOR = '.os-card';

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function finePointer() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches;
}

export function initSpotlight() {
  if (typeof document === 'undefined' || !finePointer() || prefersReducedMotion()) return () => {};

  let active = null;
  let frame = 0;
  let last = null;

  const clear = () => {
    if (!active) return;
    active.classList.remove('vi-spot-on');
    active.style.setProperty('--spot', '0');
    active = null;
  };

  const apply = () => {
    frame = 0;
    if (!last) return;
    const card = last.target instanceof Element ? last.target.closest(CARD_SELECTOR) : null;
    if (card !== active) {
      clear();
      if (card) {
        active = card;
        card.classList.add('vi-spot-on');
        card.style.setProperty('--spot', '1');
      }
    }
    if (active) {
      const r = active.getBoundingClientRect();
      active.style.setProperty('--mx', `${last.clientX - r.left}px`);
      active.style.setProperty('--my', `${last.clientY - r.top}px`);
    }
  };

  const onMove = (e) => {
    last = e;
    if (!frame) frame = requestAnimationFrame(apply);
  };

  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', clear);
  window.addEventListener('blur', clear);
  return () => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', clear);
    window.removeEventListener('blur', clear);
    if (frame) cancelAnimationFrame(frame);
  };
}

/** 浑仪：外刻度环 + 两道倾斜子午 / 赤道环 + 内环，描边取 currentColor */
export function armillarySvg() {
  const c = 200;
  const ticks = [];
  for (let deg = 0; deg < 360; deg += 3) {
    const major = deg % 30 === 0;
    const mid = deg % 15 === 0;
    const r1 = 196;
    const r2 = major ? 178 : mid ? 185 : 190;
    const a = (deg * Math.PI) / 180;
    ticks.push(
      `<line x1="${(c + r1 * Math.cos(a)).toFixed(1)}" y1="${(c + r1 * Math.sin(a)).toFixed(1)}" x2="${(c + r2 * Math.cos(a)).toFixed(1)}" y2="${(c + r2 * Math.sin(a)).toFixed(1)}" stroke-width="${major ? 1.4 : 0.7}"/>`,
    );
  }
  return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" aria-hidden="true">
  <circle cx="${c}" cy="${c}" r="196" stroke-width="1.2"/>
  <circle cx="${c}" cy="${c}" r="170" stroke-width="0.6" stroke-dasharray="1 5"/>
  ${ticks.join('')}
  <ellipse cx="${c}" cy="${c}" rx="160" ry="54" stroke-width="1" transform="rotate(-23.5 ${c} ${c})"/>
  <ellipse cx="${c}" cy="${c}" rx="160" ry="54" stroke-width="0.8" transform="rotate(66.5 ${c} ${c})"/>
  <ellipse cx="${c}" cy="${c}" rx="54" ry="160" stroke-width="0.8" transform="rotate(12 ${c} ${c})"/>
  <circle cx="${c}" cy="${c}" r="110" stroke-width="0.8"/>
  <circle cx="${c}" cy="${c}" r="62" stroke-width="0.6" stroke-dasharray="2 4"/>
  <circle cx="${c}" cy="${c}" r="4" fill="currentColor" stroke="none"/>
</svg>`;
}

export function initArmillaryWatermark() {
  if (typeof document === 'undefined' || document.querySelector('.vi-armillary-watermark')) return;
  const el = document.createElement('div');
  el.className = 'vi-armillary-watermark';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = armillarySvg();
  document.body.prepend(el);
}

export function initAtmosphere() {
  initArmillaryWatermark();
  return initSpotlight();
}
