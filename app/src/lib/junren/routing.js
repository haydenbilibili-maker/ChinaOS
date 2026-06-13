/** 现役军人 GY-47 · 页签 deep-link 路由(人群画像分层第四十五子集 · 仅政治社会学/制度分析) */

export const JUNREN_PANELS = {
  n1: 'jr-p-n1',
  n2: 'jr-p-n2',
  n3: 'jr-p-n3',
  n4: 'jr-p-n4',
  n5: 'jr-p-n5',
  n6: 'jr-p-n6',
  n7: 'jr-p-n7',
  watch: 'jr-p-watch',
};

const VALID_TABS = new Set(Object.keys(JUNREN_PANELS));

export function resolveJunrenTab(tab) {
  if (!tab) return 'n1';
  return VALID_TABS.has(tab) ? tab : 'n1';
}

export const JUNREN_TAB_LABELS = {
  n1: 'N1 · 作为人群的军队',
  n2: 'N2 · 内核态封闭性与隔离',
  n3: 'N3 · 党指挥枪访问控制',
  n4: 'N4 · 兵源谁来当兵',
  n5: 'N5 · 社会契约尊崇与保障',
  n6: 'N6 · 政治与社会角色',
  n7: 'N7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const JUNREN_TABS = Object.entries(JUNREN_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 'n7' ? '#5d7489' : '#b5483a',
}));

export function junrenPanelId(tab) {
  return JUNREN_PANELS[resolveJunrenTab(tab)];
}

export function junrenPath(tab = 'n1') {
  const id = resolveJunrenTab(tab);
  return id === 'n1' ? '/modules/junren' : `/modules/junren?tab=${id}`;
}
