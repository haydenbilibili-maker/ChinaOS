/**
 * 人群切片方法论页脚 · DOM 增强器 v3
 * 真网格叙事/侧栏 · 章节单面板切换 · 子卡片分区
 */
import { GY_MODULES, gyModulePath, normalizeGyNum, parseGyRefList } from '../../../lib/gy/registry.js';

const POPULATION_ROOTS = new Set([
  'gy-app', 'ys-app',
  'qn-app', 'xs-app', 'lg-app', 'nm-app', 'tz-app', 'zc-app', 'ln-app',
  'tj-app', 'zx-app', 'ty-app', 'ym-app', 'lp-app', 'yb-app', 'la-app',
  'zn-app', 'cz-app', 'ds-app', 'xy-app', 'xm-app', 'jg-app', 'mb-app', 'ms-app', 'sd-app', 'sz-app',
]);

const PHASE_RE = /\b([YHX]\d+)\s+([^:：]+):/g;

const NAMED_SECTION_RE =
  /(?:^|(?<=[。；;]))((?:核心命题|规模与(?:构成|口径)|市场总览|寺庙经济|玄学青年|防火墙红区|供给侧政治学|历史的押韵|形态推演|预装组织力四件套|2018 建部|赎买成色|怨恨语法|政治双重态|三态|双轨与裸奔层|救命钱语法|彩票分布|彩票化激励|MCN 圈占|打赏下沉|数据锚定)[^:：]{0,20}):/g;

const APPENDIX_RE =
  /(数据锚定[^:：]*[:：]|作为人群画像[^。；]*[:：]|来源[:：]|注[:：]|注记[:：])/;

const MOBILE_MQ = '(max-width: 768px)';

const APPENDIX_MARKERS = [
  { key: 'anchors', label: '数据锚点', icon: '◇' },
  { key: 'note', label: '注记', icon: '※' },
  { key: 'coupling', label: '模块耦合', icon: '↔' },
  { key: 'sources', label: '来源', icon: '◎' },
];

const TIMELINE_RE = /^(\d{4}(?:-\d{2})?)\s+(.+)$/;

/** @param {string} text */
function stripMethodologyPrefix(text) {
  return text.replace(/^方法论[:：]\s*/, '').trim();
}

/** @param {string} text */
function extractModel(text) {
  const m = text.match(/以「([^」]+)」模型刻画/);
  if (!m) return { model: null, modelEn: null, rest: text };
  const model = m[1];
  const enMatch = model.match(/^([^(（]+)(?:[（(]([^)）]+)[)）])?/);
  return {
    model: enMatch ? enMatch[1].trim() : model,
    modelEn: enMatch?.[2]?.trim() || null,
    rest: text.replace(m[0], '').replace(/^——\s*/, '——').trim(),
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
      isPhase,
    });
  }
  if (markers.length < 2) return null;

  const intro = text.slice(0, markers[0].index).trim();
  const sections = markers.map((mk, i) => ({
    id: mk.id,
    label: mk.isPhase
      ? (mk.title.length <= 18 ? `${mk.id} · ${mk.title}` : mk.id)
      : mk.title,
    title: mk.title,
    isPhase: mk.isPhase,
    body: text.slice(mk.index + mk.len, i + 1 < markers.length ? markers[i + 1].index : text.length).trim(),
  }));
  return { intro, sections };
}

/** @param {string} text */
function parseSections(text) {
  const { main, appendix } = splitAppendix(text);
  const phase = splitByRegex(main, PHASE_RE);
  if (phase) return { ...phase, appendix, mode: 'phase' };

  NAMED_SECTION_RE.lastIndex = 0;
  const named = splitByRegex(main, NAMED_SECTION_RE);
  if (named && named.sections.length >= 2) return { ...named, appendix, mode: 'named' };

  const coreIdx = main.indexOf('核心命题:');
  if (coreIdx > 0 && coreIdx < main.length * 0.4) {
    return {
      intro: main.slice(0, coreIdx).trim(),
      sections: [{ id: 'core', label: '核心命题', title: '核心命题', isPhase: false, body: main.slice(coreIdx + '核心命题:'.length).trim() }],
      appendix,
      mode: 'named',
    };
  }

  return {
    intro: '',
    sections: [{ id: 'full', label: '全文', title: '方法论', isPhase: false, body: main }],
    appendix,
    mode: 'solo',
  };
}

/** @param {string} intro */
function extractPullQuote(intro) {
  if (!intro) return { lead: '', quote: '' };

  const dashMatch = intro.match(/——([^。；;]+[。；;]?)/);
  if (dashMatch) {
    const quote = dashMatch[1].replace(/[。；;]$/, '').trim();
    const lead = intro
      .slice(0, dashMatch.index)
      .concat(intro.slice(dashMatch.index + dashMatch[0].length))
      .replace(/^——\s*/, '')
      .trim();
    if (quote.length >= 8) return { lead, quote };
  }

  const termMatch = intro.match(/([^。；;]*「[^」]+」[^。；;]*[。；;])/);
  if (termMatch && termMatch[1].length >= 12 && termMatch[1].length <= 120) {
    const quote = termMatch[1].replace(/[。；;]$/, '').trim();
    const lead = intro.replace(termMatch[0], '').replace(/^——\s*/, '').trim();
    return { lead, quote };
  }

  return { lead: intro.replace(/^——\s*/, '').trim(), quote: '' };
}

/** @param {string} text */
function highlightTerms(text) {
  return text.replace(/「([^」]+)」/g, '<mark class="gy-method-term">「$1」</mark>');
}

/** @param {string} text */
function linkifyGy(text) {
  let out = text;
  out = out.replace(/↗\s*GY-(\d{2}(?:\/\d{2})+)/g, (_match, rest) => {
    const nums = rest.split('/').map((n) => n.padStart(2, '0'));
    return nums
      .map((n) => {
        const path = gyModulePath(n);
        const mod = GY_MODULES[n];
        if (!path || !mod) return `GY-${n}`;
        return `<a class="gy-method-link gy-method-gy-chip" href="${path}">GY-${n}</a>`;
      })
      .join('<span class="gy-method-sep">/</span>');
  });
  out = out.replace(/↗\s*GY-(\d{2})(?:\s*(?:L\d+|CH-\d+|Z\d+))?/g, (_, n) => {
    const path = gyModulePath(n);
    const mod = GY_MODULES[n];
    if (!path || !mod) return `↗ GY-${n}`;
    return `<a class="gy-method-link gy-method-gy-chip" href="${path}">↗ GY-${n}</a>`;
  });
  out = out.replace(/\bGY-(\d{2})(?:\s*(?:L\d+|CH-\d+|Z\d+))?\b/g, (match, n) => {
    const path = gyModulePath(n);
    const mod = GY_MODULES[n];
    if (!path || !mod) return match;
    return `<a class="gy-method-link gy-method-gy-chip" href="${path}">${match}</a>`;
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

/**
 * 把一段叙事拆成可扫读的「论点」列表（核心命题专用）。
 * 每个句子是一个论点，首句作为题眼放大。
 * @param {string} text
 */
function formatPoints(text) {
  const pts = text
    .split(/(?<=[。；;])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (pts.length < 2) return `<div class="gy-method-prose">${formatBody(text)}</div>`;
  return `<ol class="gy-method-points">${pts
    .map(
      (p, i) =>
        `<li class="gy-method-point${i === 0 ? ' is-lead' : ''}"><span class="gy-method-point-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="gy-method-point-text">${linkifyGy(highlightTerms(p))}</span></li>`,
    )
    .join('')}</ol>`;
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
    const body = appendix.slice(start, end).trim().replace(/[。；;]$/, '').trim();
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
function isTimelineData(text) {
  const items = parseStatItems(text);
  if (items.length < 2) return false;
  const dated = items.filter((item) => TIMELINE_RE.test(item));
  return dated.length >= Math.ceil(items.length * 0.4);
}

/** @param {string} text */
function formatTimeline(text) {
  const items = parseStatItems(text);
  return `<ol class="gy-method-timeline">${items
    .map((item) => {
      const m = item.match(TIMELINE_RE);
      if (m) {
        return `<li class="gy-method-timeline-item"><time class="gy-method-timeline-date">${m[1]}</time><span class="gy-method-timeline-text">${linkifyGy(highlightTerms(m[2]))}</span></li>`;
      }
      return `<li class="gy-method-timeline-item gy-method-timeline-item--plain"><span class="gy-method-timeline-text">${linkifyGy(highlightTerms(item))}</span></li>`;
    })
    .join('')}</ol>`;
}

/** @param {string} text */
function formatStatGrid(text) {
  if (isTimelineData(text)) return formatTimeline(text);

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

/** @param {string} body @param {string} key */
function formatAppendixBody(body, key) {
  if (key === 'anchors') return formatStatGrid(body);
  if (key === 'coupling') return formatCouplingBody(body);
  return formatBody(body);
}

/** @param {string} text */
function formatCouplingBody(text) {
  const linked = linkifyGy(highlightTerms(text));
  const gyChips = [...text.matchAll(/\bGY-(\d{2})\b/g)]
    .map((m) => m[1])
    .filter((n, i, arr) => arr.indexOf(n) === i)
    .map((n) => {
      const path = gyModulePath(n);
      const mod = GY_MODULES[n];
      if (!path || !mod) return '';
      return `<a class="gy-method-chip" href="${path}">GY-${n} · ${mod.label}</a>`;
    })
    .filter(Boolean)
    .join('');

  const prose = formatBody(text);
  return `${prose}${gyChips ? `<div class="gy-method-coupling-chips">${gyChips}</div>` : ''}`;
}

/** @param {ReturnType<typeof parseAppendixBlocks>} blocks */
function buildAppendixGrid(blocks) {
  if (!blocks.length) return '';

  const keys = blocks.map((b) => b.key);
  const hasNote = keys.includes('note');
  const hasSources = keys.includes('sources');
  // 仅当整组就是「注记 + 来源」两块时才半分；多块时按各自 span 排布
  const shortPair = blocks.length === 2 && hasNote && hasSources;

  return `<div class="gy-method-appendix-zone"><div class="gy-method-appendix-grid${shortPair ? ' gy-method-appendix-grid--paired' : ''}">${blocks
    .map((block) => {
      const bodyHtml = formatAppendixBody(block.body, block.key);
      const spanClass =
        block.key === 'anchors' && hasNote ? ' gy-method-appendix-cell--wide' :
        block.key === 'coupling' ? ' gy-method-appendix-cell--full' :
        block.key === 'note' || block.key === 'sources' ? ' gy-method-appendix-cell--half' : '';
      return `
        <section class="gy-method-appendix-cell gy-method-appendix-cell--${block.key}${spanClass}">
          <h4 class="gy-method-appendix-label">
            <span class="gy-method-appendix-icon" aria-hidden="true">${block.icon}</span>
            ${block.label}
          </h4>
          <div class="gy-method-appendix-body">${bodyHtml}</div>
        </section>`;
    })
    .join('')}</div></div>`;
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
function buildMetaBar(meta) {
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

  const facts = [];
  facts.push(
    `<span class="gy-method-fact"><span class="gy-method-fact-k">模块</span><span class="gy-method-fact-v">${self ? `GY-${gyNum} · ${self.label}` : meta.raw[0] || '—'}</span></span>`,
  );
  if (meta.version) facts.push(`<span class="gy-method-fact"><span class="gy-method-fact-k">版本</span><span class="gy-method-fact-v gy-method-mono">${meta.version}</span></span>`);
  if (meta.generated) facts.push(`<span class="gy-method-fact"><span class="gy-method-fact-k">生成</span><span class="gy-method-fact-v">${meta.generated}</span></span>`);
  if (meta.subset) facts.push(`<span class="gy-method-fact"><span class="gy-method-fact-k">定位</span><span class="gy-method-fact-v">${meta.subset}</span></span>`);

  const relHtml = chips
    ? `<div class="gy-method-archive-rel"><span class="gy-method-fact-k">关联</span><div class="gy-method-chips">${chips}</div></div>`
    : '';

  return `
    <div class="gy-method-archive" aria-label="模块档案">
      <div class="gy-method-archive-facts">${facts.join('<span class="gy-method-fact-div" aria-hidden="true">·</span>')}</div>
      ${relHtml}
    </div>`;
}

/** @param {ReturnType<typeof parseMeta>} meta */
function buildHeadMetaSummary(meta) {
  const gyNum = normalizeGyNum(meta.gyCode);
  const parts = [];
  if (gyNum) parts.push(`GY-${gyNum}`);
  if (meta.version) parts.push(meta.version);
  if (!parts.length) return '';
  return `<span class="gy-method-head-meta">${parts.join(' · ')}</span>`;
}

/** @param {string | null} model @param {string | null} modelEn */
function buildTitleBlock(model, modelEn) {
  if (!model) return '';
  const enHtml = modelEn ? `<span class="gy-method-subtitle">${modelEn}</span>` : '';
  return `<div class="gy-method-title-block"><h3 class="gy-method-title">${model}</h3>${enHtml}</div>`;
}

/** @param {{ id: string, label: string, title: string, body: string }[]} sections */
function buildPhaseTabs(sections) {
  return `<div class="gy-method-tabs" role="tablist">
    ${sections.map((s, i) => `<button type="button" class="gy-method-tab${i === 0 ? ' is-active' : ''}" role="tab" data-tab="${s.id}" aria-selected="${i === 0}">${s.label}</button>`).join('')}
  </div>`;
}

/** @param {{ id: string, label: string, title: string, body: string }[]} sections @param {boolean} subCard */
function buildSectionPanels(sections, subCard = false) {
  return sections
    .map((s, i) => {
      const active = i === 0 ? ' is-active' : '';
      const body = formatBody(s.body);
      if (subCard) {
        return `<div class="gy-method-panel gy-method-sec-card${active}" role="tabpanel" data-panel="${s.id}" id="gy-sec-${s.id}">
          <h4 class="gy-method-sec-label">${s.title}</h4>
          <div class="gy-method-sec-body">${body}</div>
        </div>`;
      }
      return `<div class="gy-method-panel${active}" role="tabpanel" data-panel="${s.id}">${body}</div>`;
    })
    .join('');
}

/** @param {{ id: string, label: string, title: string, body: string }[]} sections */
function buildSectionChips(sections) {
  return `<nav class="gy-method-section-chips" role="tablist" aria-label="章节导航">${sections
    .map(
      (s, i) =>
        `<button type="button" class="gy-method-sec-chip${i === 0 ? ' is-active' : ''}" role="tab" data-tab="${s.id}" aria-selected="${i === 0}">${s.title}</button>`,
    )
    .join('')}</nav>`;
}

/** @param {HTMLElement} footer @param {string} prefix */
function buildMethodologyPanel(footer, prefix) {
  const para = footer.querySelector('p');
  const metaEl = footer.querySelector(`.${prefix}-foot-meta`);
  if (!para || !metaEl) return null;

  const rawText = stripMethodologyPrefix(para.textContent || '');
  const { model, modelEn, rest } = extractModel(rawText);
  const { intro, sections, appendix, mode } = parseSections(rest);
  const meta = parseMeta(metaEl);
  const { lead, quote } = extractPullQuote(intro);

  const usePhaseTabs = mode === 'phase' && sections.length > 1;
  const useNamedFilter = mode === 'named' && sections.length > 1;

  const titleBlock = buildTitleBlock(model, modelEn);
  const headMeta = buildHeadMetaSummary(meta);
  const leadHtml = lead ? `<div class="gy-method-lead">${formatBody(lead)}</div>` : '';

  const tabsHtml = usePhaseTabs ? buildPhaseTabs(sections) : '';
  const chipsHtml = useNamedFilter ? buildSectionChips(sections) : '';

  let narrativeBody = '';
  let coreEyebrow = '';
  if (usePhaseTabs) {
    narrativeBody = `<div class="gy-method-panels">${buildSectionPanels(sections, false)}</div>`;
  } else if (useNamedFilter) {
    narrativeBody = `<div class="gy-method-panels gy-method-panels--named">${buildSectionPanels(sections, true)}</div>`;
  } else {
    const soloBody = sections[0]?.body || '';
    const soloTitle = sections[0]?.title;
    if (soloTitle && soloTitle !== '方法论' && soloTitle !== '全文') {
      coreEyebrow = `<div class="gy-method-core-eyebrow"><span class="gy-method-core-tick" aria-hidden="true"></span>${soloTitle}</div>`;
    }
    narrativeBody = `<div class="gy-method-panels"><div class="gy-method-panel gy-method-panel--solo is-active">${formatPoints(soloBody)}</div></div>`;
  }

  // 模型论点（tagline）提升为题眼，置于头部之下，不再做孤立的居中引用块
  const thesisHtml = quote
    ? `<blockquote class="gy-method-thesis"><span class="gy-method-thesis-bar" aria-hidden="true"></span><span class="gy-method-thesis-text">${linkifyGy(highlightTerms(quote))}</span></blockquote>`
    : '';

  const appendixHtml = appendix ? buildAppendixGrid(parseAppendixBlocks(appendix)) : '';

  const isMobile = typeof window !== 'undefined' && window.matchMedia(MOBILE_MQ).matches;

  footer.classList.add('gy-method', 'is-enhanced', 'gy-method--v3');
  footer.innerHTML = `
    <div class="gy-method-card">
      <header class="gy-method-head">
        <div class="gy-method-head-stack">
          <span class="gy-method-label">方法论</span>
          <div class="gy-method-head-row">
            ${titleBlock || '<div class="gy-method-title-block"><h3 class="gy-method-title gy-method-title--fallback">分析框架</h3></div>'}
            <div class="gy-method-head-right">
              ${headMeta}
              <button type="button" class="gy-method-toggle" aria-expanded="${!isMobile}">
                <svg class="gy-method-toggle-icon" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5L6 8.5L10 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                <span class="gy-method-toggle-label">${isMobile ? '展开' : '收起'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div class="gy-method-collapsible${isMobile ? ' is-collapsed' : ''}">
        <div class="gy-method-collapsible-inner">
          ${thesisHtml}
          ${buildMetaBar(meta)}
          ${leadHtml}
          ${tabsHtml}
          ${chipsHtml}
          ${coreEyebrow}
          <div class="gy-method-narrative">
            ${narrativeBody}
          </div>
          ${appendixHtml}
        </div>
      </div>
    </div>`;

  return footer;
}

/** @param {HTMLElement} footer */
function wireTabGroup(footer, tabSelector, panelSelector, collapsible, toggle, toggleLabel) {
  const cleanups = [];
  const tabs = footer.querySelectorAll(tabSelector);
  const panels = footer.querySelectorAll(panelSelector);

  tabs.forEach((tab) => {
    const onClick = () => {
      const id = tab.dataset.tab;
      tabs.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === id));
      if (collapsible?.classList.contains('is-collapsed')) {
        collapsible.classList.remove('is-collapsed');
        toggle?.setAttribute('aria-expanded', 'true');
        if (toggleLabel) toggleLabel.textContent = '收起';
      }
    };
    tab.addEventListener('click', onClick);
    cleanups.push(() => tab.removeEventListener('click', onClick));
  });

  return cleanups;
}

/** @param {HTMLElement} footer */
function wireInteractions(footer) {
  const cleanups = [];

  const toggle = footer.querySelector('.gy-method-toggle');
  const toggleLabel = footer.querySelector('.gy-method-toggle-label');
  const collapsible = footer.querySelector('.gy-method-collapsible');
  if (toggle && collapsible) {
    const onToggle = () => {
      const collapsed = collapsible.classList.toggle('is-collapsed');
      toggle.setAttribute('aria-expanded', String(!collapsed));
      if (toggleLabel) toggleLabel.textContent = collapsed ? '展开' : '收起';
    };
    toggle.addEventListener('click', onToggle);
    cleanups.push(() => toggle.removeEventListener('click', onToggle));
  }

  cleanups.push(
    ...wireTabGroup(footer, '.gy-method-tab', '.gy-method-panel', collapsible, toggle, toggleLabel),
    ...wireTabGroup(footer, '.gy-method-sec-chip', '.gy-method-panel', collapsible, toggle, toggleLabel),
  );

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
    zn: 'zn', cz: 'cz', ds: 'ds', xy: 'xy', xm: 'xm', jg: 'jg', mb: 'mb', ms: 'ms', sd: 'sd', sz: 'sz',
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
