// ============================================================================
// ECharts 画布不认 CSS 变量：option 里的 'var(--x)' 会被当成无效色（常见表现为纯黑描边）。
// 在 setOption 前把字符串里的 var(--name[, fallback]) 换成当前主题的计算值。
// 结构共享：子树无变化时原样返回同一引用，避免复制大数据数组。
// ============================================================================

const VAR_RE = /var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g;

/**
 * @param {unknown} value
 * @param {(name: string) => string} lookup 返回变量的计算值（空串表示未定义）
 * @param {number} depth
 */
export function resolveCssVars(value, lookup, depth = 0) {
  if (typeof value === 'string') {
    if (!value.includes('var(')) return value;
    let out = value;
    // 允许变量值本身再引用变量：最多展开 4 轮
    for (let i = 0; i < 4 && out.includes('var('); i += 1) {
      out = out.replace(VAR_RE, (_, name, fallback) => {
        const v = lookup(name);
        return v || (fallback != null ? fallback.trim() : '');
      });
    }
    return out;
  }
  if (depth > 12 || value == null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((v) => {
      const r = resolveCssVars(v, lookup, depth + 1);
      if (r !== v) changed = true;
      return r;
    });
    return changed ? next : value;
  }
  // 只处理普通对象；渐变等 echarts 实例对象原样保留
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) return value;
  let changed = false;
  const next = {};
  for (const k of Object.keys(value)) {
    const v = value[k];
    const r = resolveCssVars(v, lookup, depth + 1);
    if (r !== v) changed = true;
    next[k] = r;
  }
  return changed ? next : value;
}

/** 以 <html> 上的计算样式为准的查找器（同一次解析内缓存） */
export function documentVarLookup() {
  if (typeof document === 'undefined') return () => '';
  const cs = getComputedStyle(document.documentElement);
  const cache = new Map();
  return (name) => {
    if (!cache.has(name)) cache.set(name, cs.getPropertyValue(name).trim());
    return cache.get(name);
  };
}
