/** 塔尖 · 高净值与企业家 GY-10 · 页签 deep-link 路由 */

export const TAJIAN_PANELS = {
  t1: 'tj-p-t1',
  t2: 'tj-p-t2',
  t3: 'tj-p-t3',
  t4: 'tj-p-t4',
  t5: 'tj-p-t5',
  t6: 'tj-p-t6',
  t7: 'tj-p-t7',
  t8: 'tj-p-t8',
  watch: 'tj-p-watch',
};

const VALID_TABS = new Set(Object.keys(TAJIAN_PANELS));

export function resolveTajianTab(tab) {
  if (!tab) return 't1';
  return VALID_TABS.has(tab) ? tab : 't1';
}

export const TAJIAN_TAB_LABELS = {
  t1: 'T1 · 缩量的塔尖',
  t2: 'T2 · 安全感账本',
  t3: 'T3 · 征用语法',
  t4: 'T4 · 退出不对称',
  t5: 'T5 · 二代不接班',
  t6: 'T6 · 隐性谈判',
  t7: 'T7 · 政治形态学',
  t8: 'T8 · 形态推演',
  watch: '合成 · 观测哨',
};

export const TAJIAN_TABS = Object.entries(TAJIAN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 't6' ? '#5e8c7a' : '#b5483a',
}));

export function tajianPanelId(tab) {
  return TAJIAN_PANELS[resolveTajianTab(tab)];
}

export function tajianPath(tab = 't1') {
  const id = resolveTajianTab(tab);
  return id === 't1' ? '/modules/tajian' : `/modules/tajian?tab=${id}`;
}
