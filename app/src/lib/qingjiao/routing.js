/** 高校青椒与过剩博士 GY-33 · 页签 deep-link 路由(第三十一子集) */

export const QINGJIAO_PANELS = {
  q1: 'qj-p-q1',
  q2: 'qj-p-q2',
  q3: 'qj-p-q3',
  q4: 'qj-p-q4',
  q5: 'qj-p-q5',
  q6: 'qj-p-q6',
  q7: 'qj-p-q7',
  watch: 'qj-p-watch',
};

const VALID_TABS = new Set(Object.keys(QINGJIAO_PANELS));

export function resolveQingjiaoTab(tab) {
  if (!tab) return 'q1';
  return VALID_TABS.has(tab) ? tab : 'q1';
}

export const QINGJIAO_TAB_LABELS = {
  q1: 'Q1 · 学历顶端过剩',
  q2: 'Q2 · 非升即走 up or out',
  q3: 'Q3 · 学术内卷军备',
  q4: 'Q4 · 高学历低保障期',
  q5: 'Q5 · 出路分流',
  q6: 'Q6 · 政治形态学',
  q7: 'Q7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const QINGJIAO_TABS = Object.entries(QINGJIAO_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'q6' ? '#5d7489' : '#b5483a',
}));

export function qingjiaoPanelId(tab) {
  return QINGJIAO_PANELS[resolveQingjiaoTab(tab)];
}

export function qingjiaoPath(tab = 'q1') {
  const id = resolveQingjiaoTab(tab);
  return id === 'q1' ? '/modules/qingjiao' : `/modules/qingjiao?tab=${id}`;
}
