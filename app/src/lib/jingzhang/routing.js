/** 精神障碍者与被监护人 GY-55 · 页签 deep-link 路由(人群画像分层第五十三子集 · 精神卫生与监护制度视角、不病理化不渲染不污名为危险) */

export const JINGZHANG_PANELS = {
  j1: 'jh-p-j1',
  j2: 'jh-p-j2',
  j3: 'jh-p-j3',
  j4: 'jh-p-j4',
  j5: 'jh-p-j5',
  watch: 'jh-p-watch',
};

const VALID_TABS = new Set(Object.keys(JINGZHANG_PANELS));

export function resolveJingzhangTab(tab) {
  if (!tab) return 'j1';
  return VALID_TABS.has(tab) ? tab : 'j1';
}

export const JINGZHANG_TAB_LABELS = {
  j1: 'J1 · 被看见最少',
  j2: 'J2 · 执行权限代理',
  j3: 'J3 · 被精神病争议',
  j4: 'J4 · 处理程序短缺',
  j5: 'J5 · 政治形态学',
  watch: '合成 · 观测哨',
};

export const JINGZHANG_TABS = Object.entries(JINGZHANG_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'j5' ? '#5d7489' : '#5e8c7a',
}));

export function jingzhangPanelId(tab) {
  return JINGZHANG_PANELS[resolveJingzhangTab(tab)];
}

export function jingzhangPath(tab = 'j1') {
  const id = resolveJingzhangTab(tab);
  return id === 'j1' ? '/modules/jingzhang' : `/modules/jingzhang?tab=${id}`;
}
