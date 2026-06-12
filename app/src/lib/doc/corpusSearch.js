// ============================================================================
// 语料阅读器 · 文内关键词搜索与高亮
// 大小写不敏感；支持中文（Unicode 属性 u）
// ============================================================================

/** @param {string} s */
export function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * @param {string} query
 * @returns {RegExp | null}
 */
export function buildSearchRegex(query) {
  const q = String(query || '').trim();
  if (!q) return null;
  try {
    return new RegExp(escapeRegExp(q), 'giu');
  } catch {
    return null;
  }
}

/**
 * @param {string} text
 * @param {string} query
 * @returns {number}
 */
export function countMatches(text, query) {
  const re = buildSearchRegex(query);
  if (!re || !text) return 0;
  const m = String(text).match(re);
  return m ? m.length : 0;
}

/**
 * @param {string} text
 * @param {string} query
 * @returns {{ text: string, match: boolean, matchIndex?: number }[]}
 */
export function splitByMatches(text, query) {
  const src = String(text ?? '');
  const re = buildSearchRegex(query);
  if (!re || !src) return [{ text: src, match: false }];

  const parts = [];
  let lastIndex = 0;
  let matchIndex = 0;
  re.lastIndex = 0;
  let m = re.exec(src);
  while (m) {
    if (m.index > lastIndex) {
      parts.push({ text: src.slice(lastIndex, m.index), match: false });
    }
    parts.push({ text: m[0], match: true, matchIndex });
    matchIndex += 1;
    lastIndex = m.index + m[0].length;
    if (m[0].length === 0) {
      re.lastIndex += 1;
    }
    m = re.exec(src);
  }
  if (lastIndex < src.length) {
    parts.push({ text: src.slice(lastIndex), match: false });
  }
  return parts.length ? parts : [{ text: src, match: false }];
}

/**
 * 滚动至第 n 个匹配（0-based）
 * @param {HTMLElement | null} root
 * @param {number} index
 */
export function scrollToMatch(root, index) {
  if (!root || index < 0) return;
  const el = root.querySelector(`[data-search-match="${index}"]`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
