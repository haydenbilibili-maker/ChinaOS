/** 中小民营企业主 GY-42 · 页签 deep-link 路由(人群画像分层第四十子集) */

export const MINQI_PANELS = {
  q1: 'mq-p-q1',
  q2: 'mq-p-q2',
  q3: 'mq-p-q3',
  q4: 'mq-p-q4',
  q5: 'mq-p-q5',
  q6: 'mq-p-q6',
  watch: 'mq-p-watch',
};

const VALID_TABS = new Set(Object.keys(MINQI_PANELS));

export function resolveMinqiTab(tab) {
  if (!tab) return 'q1';
  return VALID_TABS.has(tab) ? tab : 'q1';
}

export const MINQI_TAB_LABELS = {
  q1: 'Q1 · 资本三层',
  q2: 'Q2 · 两头IO阻塞',
  q3: 'Q3 · 信心与预期',
  q4: 'Q4 · 安抚与立法',
  q5: 'Q5 · 沉默承载者',
  q6: 'Q6 · 形态推演',
  watch: '合成 · 观测哨',
};

export const MINQI_TABS = Object.entries(MINQI_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'q6' ? '#5d7489' : '#b5483a',
}));

export function minqiPanelId(tab) {
  return MINQI_PANELS[resolveMinqiTab(tab)];
}

export function minqiPath(tab = 'q1') {
  const id = resolveMinqiTab(tab);
  return id === 'q1' ? '/modules/minqi' : `/modules/minqi?tab=${id}`;
}
