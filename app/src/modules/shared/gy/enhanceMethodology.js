/**
 * 人群切片方法论页脚 · DOM 增强器
 * 将 footer 内 wall-of-text 解析为结构化面板（阶段标签 / GY 链接 / 元数据侧栏）
 */
import { GY_MODULES, gyModulePath, normalizeGyNum, parseGyRefList } from '../../../lib/gy/registry.js';

const POPULATION_ROOTS = new Set([
  'gy-app', 'ys-app',
  'qn-app', 'xs-app', 'lg-app', 'nm-app', 'tz-app', 'zc-app', 'ln-app',
  'tj-app', 'zx-app', 'ty-app', 'ym-app', 'lp-app', 'yb-app', 'la-app',
]);

const PHASE_RE = /\b([YHX]\d+)\s+([^:：]+):/g;

const NAMED_SECTION_RE =
  /(?:^|(?<=[。；;]))((?:核心命题|规模与(?:构成|口径)|市场总览|寺庙经济|玄学青年|防火墙红区|供给侧政治学|历史的押韵|形态推演|预装组织力四件套|2018 建部|赎买成色|怨恨语法|政治双重态|三态|双轨与裸奔层|救命钱语法|彩票分布|彩票化激励|MCN 圈占|打赏下沉|数据锚定)[^:：]{0,20}):/g;

const APPENDIX_RE =
  /(数据锚定[^:：]*[:：]|作为人群画像[^。；]*[:：]|来源[:：]|注[:：]|注记[:：])/;

const MOBILE_MQ = '(max-width: 768px)';

const APPENDIX_MARKERS = [
  { key: 'anchors', label: '数据锚定', icon: '◇' },
  { key: 'note', label: '注记', icon: '※' },
  { key: 'coupling', label: '模块耦合', icon: '↔' },
  { key: 'sources', label: '来源', icon: '◎' },
];

/** @param {string} text */
function stripMethodologyPrefix(text) {
  return text.replace(/^方法论[:：]\s*/, '').trim();
}

/** @param {string} text */
function extractModel(text) {
  const m = text.match(/以「([^」]+)」模型刻画/);
  if (!m) return { model: null, rest: text };
  return {
    model: m[1],
    rest: text.replace(m[0], '').replace(/^——/, '').trim(),
  };
}

/** @param {string} text */
function splitAppendix(text) {
  const m = APPENDIX_RE.exec(text);
  if (!m || m.index < text.length * 0.35) return { main: text, appendix: '' };
  return {
    main: text.slice(0, m.index).trim(),
    appendix: text.slice(m.index).trim(),
  };
}

/** @param {string} text @param {RegExp} re */
function splitByRegex(text, re) {
  const markers = [];
  re.lastIndex = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    const isPhase = /^[YHX]\d+$/.test(m[1]);
    const title = (m[2] || m[1]).trim();
    markers.push({
      id: isPhase ? m[1] : `n${markers.length + 1}`,
      title,
      index: m.index,
      len: m[0].length,
    });
  }
  if (markers.length < 2) return null;

  const intro = text.slice(0, markers[0].index).trim();
  const sections = markers.map((mk, i) => ({
    id: mk.id,
    label: /^[YHX]\d+$/.test(mk.id)
      ? (mk.title.length <= 18 ? `${mk.id} · ${mk.title}` : mk.id)
      : mk.title,
    title: mk.title,
    body: text.slice(mk.index + mk.len, i + 1 < markers.length ? markers[i + 1].index : text.length).trim(),
  }));
  return { intro, sections };
}

/** @param {string} text */
function parseSections(text) {
  const { main, appendix } = splitAppendix(text);
  const phase = splitByRegex(main, PHASE_RE);
  if (phase) return { ...phase, appendix };

  NAMED_SECTION_RE.lastIndex = 0;
  const named = splitByRegex(main, NAMED_SECTION_RE);
  if (named && named.sections.length >= 2) return { ...named, appendix };

  const coreIdx = main.indexOf('核心命题:');
  if (coreIdx > 0 && coreIdx < main.length * 0.4) {
    return {
      intro: main.slice(0, coreIdx).trim(),
      sections: [{ id: 'core', label: '核心命题', title: '核心命题', body: main.slice(coreIdx + '核心命题:'.length).trim() }],
      appendix,
    };
  }

  return { intro: '', sections: [{ id: 'full', label: '全文', title: '方法论', body: main }], appendix };
}

/** @param {string} text */
function highlightTerms(text) {
  return text.replace(/「([^」]+)」/g, '<mark class="gy-method-term">「$1」</mark>');
}

/** @param {string} text */
function linkifyGy(text) {
  let out = text;
  out = out.replace(/↗\s*GY-(\d{2}(?:\/\d{2})+)/g, (match, rest) => {
    const nums = rest.split('/').map((n) => n.padStart(2, '0'));
    return nums
      .map((n) => {
        const path = gyModulePath(n);
        const mod = GY_MODULES[n];
        if (!path || !mod) return `GY-${n}`;
        return `<a class="gy-method-link" href="${path}">GY-${n}</a>`;
      })
      .join('<span class="gy-method-sep">/</span>');
  });
  out = out.replace(/↗\s*GY-(\d{2})(?:\s*(?:L\d+|CH-\d+|Z\d+))?/g, (_, n) => {
    const path = gyModulePath(n);
    const mod = GY_MODULES[n];
    if (!path || !mod) return `↗ GY-${n}`;
    return `<a class="gy-method-link" href="${path}">↗ GY-${n}</a>`;
  });
  out = out.replace(/\bGY-(\d{2})(?:\s*(?:L\d+|CH-\d+|Z\d+))?\b/g, (match, n) => {
    const path = gyModulePath(n);
    const mod = GY_MODULES[n];
    if (!path || !mod) return match;
    return `<a class="gy-method-link" href="${path}">${match}</a>`;
  });
  return out;
}

/** @param {string} text */
function formatBody(text) {
  if (!text) return '';
  const linked = linkifyGy(highlightTerms(text));
  return linked
    .split(/(?<=[。；;])\s*/)
    .filter(Boolean)
    .map((p) => `<p>${p}</p>`)
    .join('');
}

/** @param {string} text */
function findAppendixHits(text) {
  /** @type {{ key: string, index: number, len: number }[]} */
  const hits = [];

  const tryAdd = (key, re) => {
    const m = re.exec(text);
    if (m) hits.push({ key, index: m.index, len: m[0].length });
  };

  tryAdd('anchors', /数据锚定(?:\([^)]*\))?[:：]/);

  const noteM = /(?:^|(?<=[。；;]))(注(?:记)?[:：])/.exec(text);
  if (noteM) {
    hits.push({ key: 'note', index: noteM.index + noteM[0].length - noteM[1].length, len: noteM[1].length });
  }

  const couplingIdx = text.search(/作为人群画像/);
  if (couplingIdx >= 0) hits.push({ key: 'coupling', index: couplingIdx, len: 0 });

  tryAdd('sources', /来源[:：]/);

  hits.sort((a, b) => a.index - b.index);

  return hits.filter((hit, i) => i === 0 || hit.index >= hits[i - 1].index + 2);
}

/** @param {string} appendix */
function parseAppendixBlocks(appendix) {
  if (!appendix) return [];

  const hits = findAppendixHits(appendix);
  if (!hits.length) {
    return [{ key: 'misc', label: '附录', icon: '·', body: appendix }];
  }

  return hits.map((hit, i) => {
    const meta = APPENDIX_MARKERS.find((m) => m.key === hit.key) || { key: hit.key, label: hit.key, icon: '·' };
    const start = hit.index + hit.len;
    const end = i + 1 < hits.length ? hits[i + 1].index : appendix.length;
    let body = appendix.slice(start, end).trim().replace(/[。；;]$/, '').trim();
    return { ...meta, body };
  });
}

/** @param {string} text */
function parseStatItems(text) {
  return text
    .split(/[;；]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** @param {string} text */
function formatStatGrid(text) {
  const items = parseStatItems(text);
  if (items.length < 2) return formatBody(text);

  return `<dl class="gy-method-stat-grid">${items
    .map((item) => {
      const numMatch = item.match(/^([\d.]+[%+万亿级]*\s*[^、,，(（]{0,28})/);
      const dt = numMatch ? numMatch[1].trim() : item.slice(0, Math.min(24, item.length));
      const dd = numMatch ? item.slice(numMatch[0].length).replace(/^[、,，\s]+/, '') : '';
      if (dd) {
        return `<div class="gy-method-stat"><dt>${linkifyGy(highlightTerms(dt))}</dt><dd>${linkifyGy(highlightTerms(dd))}</dd></div>`;
      }
      return `<div class="gy-method-stat gy-method-stat--solo"><dd>${linkifyGy(highlightTerms(item))}</dd></div>`;
    })
    .join('')}</dl>`;
}

/** @param {string} appendix */
function formatAppendix(appendix) {
  if (!appendix) return '';

  const blocks = parseAppendixBlocks(appendix);
  return `<div class="gy-method-appendix-wrap">${blocks
    .map((block) => {
      const bodyHtml =
        block.key === 'anchors'
          ? formatStatGrid(block.body)
          : formatBody(block.body);
      return `
        <section class="gy-method-appendix-block gy-method-appendix-block--${block.key}">
          <h4 class="gy-method-appendix-label"><span class="gy-method-appendix-icon" aria-hidden="true">${block.icon}</span>${block.label}</h4>
          <div class="gy-method-appendix-body">${bodyHtml}</div>
        </section>`;
    })
    .join('')}</div>`;
}

/** @param {HTMLElement} metaEl */
function parseMeta(metaEl) {
  const raw = metaEl.innerHTML
    .split(/<br\s*\/?>/i)
    .map((l) => l.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  let gyCode = '';
  let version = '';
  let generated = '';
  let subset = '';
  let related = '';
  const notes = [];

  raw.forEach((line, i) => {
    if (i === 0) {
      const m = line.match(/GY-(\d{2})/);
      if (m) gyCode = m[1];
      const v = line.match(/v[\d.]+/i);
      if (v) version = v[0];
      return;
    }
    if (/^生成/.test(line)) {
      generated = line.replace(/^生成\s*/, '');
      return;
    }
    if (/关联|全系列/.test(line)) {
      related = line;
      return;
    }
    if (/子集|人群画像/.test(line) && !subset) {
      subset = line;
      return;
    }
    if (/^注记[:：]/.test(line)) {
      notes.push(line.replace(/^注记[:：]\s*/, ''));
      return;
    }
    notes.push(line);
  });

  const relatedNums = related ? parseGyRefList(related) : [];
  return { gyCode, version, generated, subset, related, relatedNums, notes, raw };
}

/** @param {ReturnType<typeof parseMeta>} meta */
function buildMetaAside(meta) {
  const gyNum = normalizeGyNum(meta.gyCode);
  const self = gyNum ? GY_MODULES[gyNum] : null;
  const chips = meta.relatedNums
    .filter((n) => n !== gyNum)
    .map((n) => {
      const mod = GY_MODULES[n];
      const path = gyModulePath(n);
      if (!mod || !path) return '';
      return `<a class="gy-method-chip" href="${path}">GY-${n} · ${mod.label}</a>`;
    })
    .join('');

  const noteHtml = meta.notes.length
    ? `<div class="gy-method-meta-notes">${meta.notes.map((n) => `<p>${n}</p>`).join('')}</div>`
    : '';

  return `
    <aside class="gy-method-meta" aria-label="模块元数据">
      <div class="gy-method-meta-card">
        <div class="gy-method-meta-head">模块档案</div>
        <div class="gy-method-meta-row">
          <span class="gy-method-meta-k">模块</span>
          <span class="gy-method-meta-v">${self ? `GY-${gyNum} · ${self.label}` : meta.raw[0] || '—'}</span>
        </div>
        ${versionRow(meta.version)}
        ${meta.generated ? `<div class="gy-method-meta-row"><span class="gy-method-meta-k">生成</span><span class="gy-method-meta-v">${meta.generated}</span></div>` : ''}
        ${meta.subset ? `<div class="gy-method-meta-row"><span class="gy-method-meta-k">定位</span><span class="gy-method-meta-v">${meta.subset}</span></div>` : ''}
        ${chips ? `<div class="gy-method-meta-row gy-method-meta-row--chips"><span class="gy-method-meta-k">关联</span><div class="gy-method-chips">${chips}</div></div>` : ''}
        ${noteHtml}
      </div>
    </aside>`;
}

/** @param {string} version */
function versionRow(version) {
  if (!version) return '';
  return `<div class="gy-method-meta-row"><span class="gy-method-meta-k">版本</span><span class="gy-method-meta-v gy-method-mono">${version}</span></div>`;
}

/** @param {HTMLElement} footer @param {string} prefix */
function buildMethodologyPanel(footer, prefix) {
  const para = footer.querySelector('p');
  const metaEl = footer.querySelector(`.${prefix}-foot-meta`);
  if (!para || !metaEl) return null;

  const rawText = stripMethodologyPrefix(para.textContent || '');
  const { model, rest } = extractModel(rawText);
  const { intro, sections, appendix } = parseSections(rest);
  const meta = parseMeta(metaEl);

  const tabs = sections.length > 1
    ? `<div class="gy-method-tabs" role="tablist">
        ${sections.map((s, i) => `<button type="button" class="gy-method-tab${i === 0 ? ' is-active' : ''}" role="tab" data-tab="${s.id}" aria-selected="${i === 0}">${s.label}</button>`).join('')}
      </div>`
    : '';

  const panels = sections
    .map(
      (s, i) =>
        `<div class="gy-method-panel${i === 0 ? ' is-active' : ''}${sections.length === 1 ? ' gy-method-panel--solo' : ''}" role="tabpanel" data-panel="${s.id}" ${sections.length > 1 ? `aria-labelledby="tab-${s.id}"` : ''}>${formatBody(s.body)}</div>`,
    )
    .join('');

  const badge = model
    ? `<span class="gy-method-badge" title="分析模型"><span class="gy-method-badge-main">${model.split('(')[0].trim()}</span>${model.includes('(') ? `<span class="gy-method-badge-sub">${model.match(/\(([^)]+)\)/)?.[1] || ''}</span>` : ''}</span>`
    : '';

  const introHtml = intro ? `<div class="gy-method-intro">${formatBody(intro)}</div>` : '';
  const appendixHtml = appendix ? formatAppendix(appendix) : '';

  const isMobile = typeof window !== 'undefined' && window.matchMedia(MOBILE_MQ).matches;

  footer.classList.add('gy-method', 'is-enhanced');
  footer.innerHTML = `
    <div class="gy-method-layout">
      <div class="gy-method-main">
        <header class="gy-method-head">
          <div class="gy-method-head-left">
            <h3 class="gy-method-title">方法论</h3>
            ${badge}
          </div>
          <button type="button" class="gy-method-toggle" aria-expanded="${!isMobile}">
            <span class="gy-method-toggle-icon" aria-hidden="true">${isMobile ? '＋' : '−'}</span>
            <span class="gy-method-toggle-label">${isMobile ? '展开' : '收起'}</span>
          </button>
        </header>
        <div class="gy-method-body${isMobile ? ' is-collapsed' : ''}">
          ${introHtml}
          ${tabs}
          <div class="gy-method-panels">${panels}</div>
          ${appendixHtml}
        </div>
      </div>
      ${buildMetaAside(meta)}
    </div>`;

  return footer;
}

/** @param {HTMLElement} footer */
function wireInteractions(footer) {
  const cleanups = [];

  const toggle = footer.querySelector('.gy-method-toggle');
  const toggleIcon = footer.querySelector('.gy-method-toggle-icon');
  const toggleLabel = footer.querySelector('.gy-method-toggle-label');
  const body = footer.querySelector('.gy-method-body');
  if (toggle && body) {
    const onToggle = () => {
      const collapsed = body.classList.toggle('is-collapsed');
      toggle.setAttribute('aria-expanded', String(!collapsed));
      if (toggleLabel) toggleLabel.textContent = collapsed ? '展开' : '收起';
      if (toggleIcon) toggleIcon.textContent = collapsed ? '＋' : '−';
    };
    toggle.addEventListener('click', onToggle);
    cleanups.push(() => toggle.removeEventListener('click', onToggle));
  }

  const tabs = footer.querySelectorAll('.gy-method-tab');
  const panels = footer.querySelectorAll('.gy-method-panel');
  tabs.forEach((tab) => {
    const onClick = () => {
      const id = tab.dataset.tab;
      tabs.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === id));
      if (body?.classList.contains('is-collapsed')) {
        body.classList.remove('is-collapsed');
        toggle?.setAttribute('aria-expanded', 'true');
        if (toggleLabel) toggleLabel.textContent = '收起';
        if (toggleIcon) toggleIcon.textContent = '−';
      }
    };
    tab.addEventListener('click', onClick);
    cleanups.push(() => tab.removeEventListener('click', onClick));
  });

  return () => cleanups.forEach((fn) => fn());
}

/**
 * @param {HTMLElement | null} root
 * @returns {(() => void) | undefined}
 */
export function enhanceMethodology(root) {
  if (!root || !POPULATION_ROOTS.has(root.id)) return undefined;

  const prefix = root.id.replace(/-app$/, '').slice(0, 2);
  const prefixMap = {
    gy: 'gy', ys: 'ys',
    qn: 'qn', xs: 'xs', lg: 'lg', nm: 'nm', tz: 'tz', zc: 'zc', ln: 'ln',
    tj: 'tj', zx: 'zx', ty: 'ty', ym: 'ym', lp: 'lp', yb: 'yb', la: 'la',
  };
  const pfx = prefixMap[prefix];
  if (!pfx) return undefined;

  const footer = root.querySelector(`footer.${pfx}-foot`);
  if (!footer || footer.classList.contains('is-enhanced')) return undefined;

  const built = buildMethodologyPanel(footer, pfx);
  if (!built) return undefined;

  return wireInteractions(built);
}

/**
 * 包装人群模块 init,自动挂载方法论增强
 * @template {(...args: any[]) => (() => void) | void} T
 * @param {T} initFn
 * @returns {T}
 */
export function withGyInit(initFn) {
  return (/** @type {Parameters<T>} */ ...args) => {
    const root = args[0];
    const cleanup = initFn(...args);
    const methCleanup = enhanceMethodology(root);
    return () => {
      methCleanup?.();
      if (typeof cleanup === 'function') cleanup();
    };
  };
}
