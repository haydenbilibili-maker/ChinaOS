/** 罕见病与大病自救群体 GY-53 · 页签 deep-link 路由(人群画像分层第五十一子集 · 健康与医保救助框架 · 尊重患者、不渲染) */

export const HANJIAN_PANELS = {
  h1: 'hj-p-h1',
  h2: 'hj-p-h2',
  h3: 'hj-p-h3',
  h4: 'hj-p-h4',
  h5: 'hj-p-h5',
  watch: 'hj-p-watch',
};

const VALID_TABS = new Set(Object.keys(HANJIAN_PANELS));

export function resolveHanjianTab(tab) {
  if (!tab) return 'h1';
  return VALID_TABS.has(tab) ? tab : 'h1';
}

export const HANJIAN_TAB_LABELS = {
  h1: 'H1 · 2000 万悖论',
  h2: 'H2 · 诊断奥德赛',
  h3: 'H3 · 孤儿药与医保砍价',
  h4: 'H4 · 患者自救',
  h5: 'H5 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const HANJIAN_TABS = Object.entries(HANJIAN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'h5' ? '#5d7489' : '#5e8c7a',
}));

export function hanjianPanelId(tab) {
  return HANJIAN_PANELS[resolveHanjianTab(tab)];
}

export function hanjianPath(tab = 'h1') {
  const id = resolveHanjianTab(tab);
  return id === 'h1' ? '/modules/hanjian' : `/modules/hanjian?tab=${id}`;
}
