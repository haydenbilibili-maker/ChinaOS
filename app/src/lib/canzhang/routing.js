/** 残障人群 · 可见性的零点 GY-18 · 页签 deep-link 路由(第十六子集) */

export const CANZHANG_PANELS = {
  c1: 'cz-p-c1',
  c2: 'cz-p-c2',
  c3: 'cz-p-c3',
  c4: 'cz-p-c4',
  c5: 'cz-p-c5',
  c6: 'cz-p-c6',
  c7: 'cz-p-c7',
  watch: 'cz-p-watch',
};

const VALID_TABS = new Set(Object.keys(CANZHANG_PANELS));

export function resolveCanzhangTab(tab) {
  if (!tab) return 'c1';
  return VALID_TABS.has(tab) ? tab : 'c1';
}

export const CANZHANG_TAB_LABELS = {
  c1: 'C1 · 八千万离线设备',
  c2: 'C2 · 驱逐基础设施化',
  c3: 'C3 · 就业空转',
  c4: 'C4 · 特教隔离',
  c5: 'C5 · 被监护困境',
  c6: 'C6 · 组织化零点对照',
  c7: 'C7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const CANZHANG_TABS = Object.entries(CANZHANG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'c6' ? '#5e8c7a' : '#b5483a',
}));

export function canzhangPanelId(tab) {
  return CANZHANG_PANELS[resolveCanzhangTab(tab)];
}

export function canzhangPath(tab = 'c1') {
  const id = resolveCanzhangTab(tab);
  return id === 'c1' ? '/modules/canzhang' : `/modules/canzhang?tab=${id}`;
}
