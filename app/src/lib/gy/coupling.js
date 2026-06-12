/**
 * GY-01（国运推演）↔ GY-02（意识形态架构）双向耦合 · 单一数据源
 *
 * 张力层 ↔ 推演变量/情景
 *   T-01 安全约束 ⟂ 发展引擎  ↔  VAR-A · 情景一（韧性僵局）
 *   T-02 民族主义 ⟂ 外交弹性  ↔  VAR-C
 *   T-03 复兴叙事 ⟂ 停滞可能  ↔  情景三（日本化加深）
 *
 * 观测哨联动
 *   W-01 二十一大人事  ↔  Y-06 接班与梯队话语
 */

export const GUOYUN_PANELS = {
  qiju: 'p-qiju',
  duizhang: 'p-duizhang',
  tuiyan: 'p-tuiyan',
  watch: 'p-watch',
};

export const YISHI_PANELS = {
  overview: 'ys-p-overview',
  comps: 'ys-p-comps',
  twin: 'ys-p-twin',
  tension: 'ys-p-tension',
  watch: 'ys-p-watch',
};

const VALID_GUOYUN_PANEL = new Set(Object.values(GUOYUN_PANELS));
const VALID_YISHI_TAB = new Set(Object.keys(YISHI_PANELS));

export function resolveGuoyunPanel(panel) {
  if (!panel) return null;
  if (VALID_GUOYUN_PANEL.has(panel)) return panel;
  return GUOYUN_PANELS[panel] || null;
}

export function resolveYishiTab(tab) {
  if (!tab) return 'overview';
  return VALID_YISHI_TAB.has(tab) ? tab : 'overview';
}

/** @param {{ tab?: string, panel?: string, scenario?: string, var?: string, watch?: string }} opts */
export function buildGuoyunSimLink(opts = {}) {
  const params = new URLSearchParams();
  const panel = resolveGuoyunPanel(opts.panel);
  if (panel) params.set('panel', panel);
  if (opts.scenario) params.set('scenario', opts.scenario);
  if (opts.var) params.set('var', opts.var);
  if (opts.watch) params.set('watch', opts.watch);
  const qs = params.toString();
  return `/modules/guoyun${qs ? `?${qs}` : ''}`;
}

/** @param {{ tab?: string, tension?: string, watch?: string, comp?: string }} opts */
export function buildYishiLink(opts = {}) {
  const params = new URLSearchParams();
  const tab = resolveYishiTab(opts.tab);
  if (tab !== 'overview') params.set('tab', tab);
  if (opts.tension) params.set('tension', opts.tension);
  if (opts.watch) params.set('watch', opts.watch);
  if (opts.comp) params.set('comp', opts.comp);
  const qs = params.toString();
  return `/modules/yishixingtai${qs ? `?${qs}` : ''}`;
}

/** GY-02 张力 → GY-01 深链目标 */
export const TENSION_TO_GUOYUN = {
  t01: { panel: 'p-tuiyan', var: 'a', scenario: 'base' },
  t02: { panel: 'p-tuiyan', var: 'c' },
  t03: { panel: 'p-tuiyan', scenario: 'down' },
};

/** GY-01 → GY-02 张力 */
export const GUOYUN_TO_TENSION = {
  'var:a': 't01',
  'var:c': 't02',
  'scenario:base': 't01',
  'scenario:down': 't03',
};

export const WATCH_PAIR = { w1: 'y6', y6: 'w1' };

export function guoyunLinkForTension(tensionId) {
  return buildGuoyunSimLink(TENSION_TO_GUOYUN[tensionId] || { panel: 'p-tuiyan' });
}

export function yishiLinkForGuoyunTarget({ var: v, scenario, watch } = {}) {
  if (watch && WATCH_PAIR[watch]) {
    return buildYishiLink({ tab: 'watch', watch: WATCH_PAIR[watch] });
  }
  const key = v ? `var:${v}` : scenario ? `scenario:${scenario}` : null;
  const tension = key ? GUOYUN_TO_TENSION[key] : null;
  if (tension) return buildYishiLink({ tab: 'tension', tension });
  return buildYishiLink({ tab: 'tension' });
}
