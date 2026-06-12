/** 体制内人群 GY-07 · 页签 deep-link 路由 */

export const TIZHINEI_PANELS = {
  b1: 'tz-p-b1',
  b2: 'tz-p-b2',
  b3: 'tz-p-b3',
  b4: 'tz-p-b4',
  b5: 'tz-p-b5',
  b6: 'tz-p-b6',
  b7: 'tz-p-b7',
  b8: 'tz-p-b8',
  watch: 'tz-p-watch',
};

const VALID_TABS = new Set(Object.keys(TIZHINEI_PANELS));

export function resolveTizhineiTab(tab) {
  if (!tab) return 'b1';
  return VALID_TABS.has(tab) ? tab : 'b1';
}

export const TIZHINEI_TAB_LABELS = {
  b1: 'B1 · 规模口径',
  b2: 'B2 · 刚兑债券',
  b3: 'B3 · 入口窄门',
  b4: 'B4 · 内部分层',
  b5: 'B5 · 财政地基',
  b6: 'B6 · 行为生态',
  b7: 'B7 · 政治功能',
  b8: 'B8 · 形态推演',
  watch: '合成 · 观测哨',
};

export const TIZHINEI_TABS = Object.entries(TIZHINEI_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'b5' ? '#5e8c7a' : '#b5483a',
}));

export function tizhineiPanelId(tab) {
  return TIZHINEI_PANELS[resolveTizhineiTab(tab)];
}

export function tizhineiPath(tab = 'b1') {
  const id = resolveTizhineiTab(tab);
  return id === 'b1' ? '/modules/tizhinei' : `/modules/tizhinei?tab=${id}`;
}
