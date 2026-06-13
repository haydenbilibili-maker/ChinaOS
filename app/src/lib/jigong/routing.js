/** 制造业技术工人 · 被需要却不被向往 GY-22 · 页签 deep-link 路由(第二十子集) */

export const JIGONG_PANELS = {
  j1: 'jg-p-j1',
  j2: 'jg-p-j2',
  j3: 'jg-p-j3',
  j4: 'jg-p-j4',
  j5: 'jg-p-j5',
  j6: 'jg-p-j6',
  j7: 'jg-p-j7',
  watch: 'jg-p-watch',
};

const VALID_TABS = new Set(Object.keys(JIGONG_PANELS));

export function resolveJigongTab(tab) {
  if (!tab) return 'j1';
  return VALID_TABS.has(tab) ? tab : 'j1';
}

export const JIGONG_TAB_LABELS = {
  j1: 'J1 · 规模与缺口',
  j2: 'J2 · 价值地位背离',
  j3: 'J3 · 激励反向产出',
  j4: 'J4 · 双元制学不来',
  j5: 'J5 · 机器换人双向挤压',
  j6: 'J6 · 政治形态学',
  j7: 'J7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const JIGONG_TABS = Object.entries(JIGONG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'j2' ? '#5e8c7a' : '#b5483a',
}));

export function jigongPanelId(tab) {
  return JIGONG_PANELS[resolveJigongTab(tab)];
}

export function jigongPath(tab = 'j1') {
  const id = resolveJigongTab(tab);
  return id === 'j1' ? '/modules/jigong' : `/modules/jigong?tab=${id}`;
}
