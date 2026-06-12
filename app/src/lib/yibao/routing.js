/** 医保里的人 · 慢病与老龄财政 GY-15 · 页签 deep-link 路由 */

export const YIBAO_PANELS = {
  y1: 'yb-p-y1',
  y2: 'yb-p-y2',
  y3: 'yb-p-y3',
  y4: 'yb-p-y4',
  y5: 'yb-p-y5',
  y6: 'yb-p-y6',
  y7: 'yb-p-y7',
  y8: 'yb-p-y8',
  watch: 'yb-p-watch',
};

const VALID_TABS = new Set(Object.keys(YIBAO_PANELS));

export function resolveYibaoTab(tab) {
  if (!tab) return 'y1';
  return VALID_TABS.has(tab) ? tab : 'y1';
}

export const YIBAO_TAB_LABELS = {
  y1: 'Y1 · 全员接口',
  y2: 'Y2 · 退保信号',
  y3: 'Y3 · 集采',
  y4: 'Y4 · DRG',
  y5: 'Y5 · 白发风波',
  y6: 'Y6 · 双轨裸奔层',
  y7: 'Y7 · 救命钱语法',
  y8: 'Y8 · 形态推演',
  watch: '合成 · 观测哨',
};

export const YIBAO_TABS = Object.entries(YIBAO_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'y6' ? '#5e8c7a' : '#b5483a',
}));

export function yibaoPanelId(tab) {
  return YIBAO_PANELS[resolveYibaoTab(tab)];
}

export function yibaoPath(tab = 'y1') {
  const id = resolveYibaoTab(tab);
  return id === 'y1' ? '/modules/yibao' : `/modules/yibao?tab=${id}`;
}
