/** 工程移民与生态移民 GY-56 · 页签 deep-link 路由(人群画像分层第五十四子集 · 移民安置制度视角、记录成就也分析融合难题、尊重不渲染) */

export const GONGYI_PANELS = {
  g1: 'gc-p-g1',
  g2: 'gc-p-g2',
  g3: 'gc-p-g3',
  g4: 'gc-p-g4',
  g5: 'gc-p-g5',
  watch: 'gc-p-watch',
};

const VALID_TABS = new Set(Object.keys(GONGYI_PANELS));

export function resolveGongyiTab(tab) {
  if (!tab) return 'g1';
  return VALID_TABS.has(tab) ? tab : 'g1';
}

export const GONGYI_TAB_LABELS = {
  g1: 'G1 · 三类整体迁移',
  g2: 'G2 · 物理迁移vs社会融合',
  g3: 'G3 · 安置方式与融合差异',
  g4: 'G4 · 后期扶持与代际',
  g5: 'G5 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const GONGYI_TABS = Object.entries(GONGYI_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'g5' ? '#5d7489' : '#5e8c7a',
}));

export function gongyiPanelId(tab) {
  return GONGYI_PANELS[resolveGongyiTab(tab)];
}

export function gongyiPath(tab = 'g1') {
  const id = resolveGongyiTab(tab);
  return id === 'g1' ? '/modules/gongyi' : `/modules/gongyi?tab=${id}`;
}
