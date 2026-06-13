/** 数字原住民 · 10 后与屏幕养大的一代 GY-26 · 页签 deep-link 路由(第二十四子集 · 第二批收官) */

export const SHUZI_PANELS = {
  d1: 'sz-p-d1',
  d2: 'sz-p-d2',
  d3: 'sz-p-d3',
  d4: 'sz-p-d4',
  d5: 'sz-p-d5',
  d6: 'sz-p-d6',
  d7: 'sz-p-d7',
  watch: 'sz-p-watch',
};

const VALID_TABS = new Set(Object.keys(SHUZI_PANELS));

export function resolveShuziTab(tab) {
  if (!tab) return 'd1';
  return VALID_TABS.has(tab) ? tab : 'd1';
}

export const SHUZI_TAB_LABELS = {
  d1: 'D1 · 唯一正在成形的人群',
  d2: 'D2 · 社会化平台化',
  d3: 'D3 · 注意力结构重写',
  d4: 'D4 · 鸡娃军备最新前线',
  d5: 'D5 · 防沉迷攻防',
  d6: 'D6 · AI陪伴与社会化未知',
  d7: 'D7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const SHUZI_TABS = Object.entries(SHUZI_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'd6' ? '#5d7489' : '#b5483a',
}));

export function shuziPanelId(tab) {
  return SHUZI_PANELS[resolveShuziTab(tab)];
}

export function shuziPath(tab = 'd1') {
  const id = resolveShuziTab(tab);
  return id === 'd1' ? '/modules/shuzi' : `/modules/shuzi?tab=${id}`;
}
