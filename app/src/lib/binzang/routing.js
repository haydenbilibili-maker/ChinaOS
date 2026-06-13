/** 殡葬与临终关怀从业者 GY-46 · 页签 deep-link 路由(人群画像分层第四十四子集 · 第四批收官) */

export const BINZANG_PANELS = {
  b1: 'bz-p-b1',
  b2: 'bz-p-b2',
  b3: 'bz-p-b3',
  b4: 'bz-p-b4',
  b5: 'bz-p-b5',
  b6: 'bz-p-b6',
  watch: 'bz-p-watch',
};

const VALID_TABS = new Set(Object.keys(BINZANG_PANELS));

export function resolveBinzangTab(tab) {
  if (!tab) return 'b1';
  return VALID_TABS.has(tab) ? tab : 'b1';
}

export const BINZANG_TAB_LABELS = {
  b1: 'B1 · 死亡高峰负载激增',
  b2: 'B2 · 进程回收器',
  b3: 'B3 · 殡葬争议死不起',
  b4: 'B4 · 临终关怀',
  b5: 'B5 · 禁忌遮蔽下的必需者',
  b6: 'B6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const BINZANG_TABS = Object.entries(BINZANG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'b6' ? '#5d7489' : '#b5483a',
}));

export function binzangPanelId(tab) {
  return BINZANG_PANELS[resolveBinzangTab(tab)];
}

export function binzangPath(tab = 'b1') {
  const id = resolveBinzangTab(tab);
  return id === 'b1' ? '/modules/binzang' : `/modules/binzang?tab=${id}`;
}
