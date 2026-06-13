/** 网约车司机 GY-40 · 页签 deep-link 路由(人群画像分层第三十八子集) */

export const WANGYUE_PANELS = {
  w1: 'wy-p-w1',
  w2: 'wy-p-w2',
  w3: 'wy-p-w3',
  w4: 'wy-p-w4',
  w5: 'wy-p-w5',
  w6: 'wy-p-w6',
  w7: 'wy-p-w7',
  watch: 'wy-p-watch',
};

const VALID_TABS = new Set(Object.keys(WANGYUE_PANELS));

export function resolveWangyueTab(tab) {
  if (!tab) return 'w1';
  return VALID_TABS.has(tab) ? tab : 'w1';
}

export const WANGYUE_TAB_LABELS = {
  w1: 'W1 · 谁失业都能跑',
  w2: 'W2 · 竞价定价',
  w3: 'W3 · 重资产车贷',
  w4: 'W4 · 运力饱和',
  w5: 'W5 · 载人特殊性',
  w6: 'W6 · 政治形态学',
  w7: 'W7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const WANGYUE_TABS = Object.entries(WANGYUE_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'w7' ? '#5d7489' : '#b5483a',
}));

export function wangyuePanelId(tab) {
  return WANGYUE_PANELS[resolveWangyueTab(tab)];
}

export function wangyuePath(tab = 'w1') {
  const id = resolveWangyueTab(tab);
  return id === 'w1' ? '/modules/wangyue' : `/modules/wangyue?tab=${id}`;
}
