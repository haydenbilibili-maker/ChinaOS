/** 戒毒与社区康复人员 GY-49 · 页签 deep-link 路由(人群画像分层第四十七子集 · 公共卫生+社会矫治框架) */

export const JIEDU_PANELS = {
  j1: 'jd-p-j1',
  j2: 'jd-p-j2',
  j3: 'jd-p-j3',
  j4: 'jd-p-j4',
  j5: 'jd-p-j5',
  watch: 'jd-p-watch',
};

const VALID_TABS = new Set(Object.keys(JIEDU_PANELS));

export function resolveJieduTab(tab) {
  if (!tab) return 'j1';
  return VALID_TABS.has(tab) ? tab : 'j1';
}

export const JIEDU_TAB_LABELS = {
  j1: 'J1 · 康复事实戒断远多于在册',
  j2: 'J2 · 疾病模型vs道德模型',
  j3: 'J3 · 残留标记歧视',
  j4: 'J4 · 回归就业家庭复发防控',
  j5: 'J5 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const JIEDU_TABS = Object.entries(JIEDU_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'j5' ? '#5d7489' : '#5e8c7a',
}));

export function jieduPanelId(tab) {
  return JIEDU_PANELS[resolveJieduTab(tab)];
}

export function jieduPath(tab = 'j1') {
  const id = resolveJieduTab(tab);
  return id === 'j1' ? '/modules/jiedu' : `/modules/jiedu?tab=${id}`;
}
