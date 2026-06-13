/** 失独与计生后遗人群 · 政策账单的活体 GY-25 · 页签 deep-link 路由(第二十三子集) */

export const SHIDU_PANELS = {
  s1: 'sd-p-s1',
  s2: 'sd-p-s2',
  s3: 'sd-p-s3',
  s4: 'sd-p-s4',
  s5: 'sd-p-s5',
  s6: 'sd-p-s6',
  s7: 'sd-p-s7',
  watch: 'sd-p-watch',
};

const VALID_TABS = new Set(Object.keys(SHIDU_PANELS));

export function resolveShiduTab(tab) {
  if (!tab) return 's1';
  return VALID_TABS.has(tab) ? tab : 's1';
}

export const SHIDU_TAB_LABELS = {
  s1: 'S1 · 政策塑造的一代',
  s2: 'S2 · 政策反转代际套牢',
  s3: 'S3 · 唯一子线程终止',
  s4: 'S4 · 421 不可能算术',
  s5: 'S5 · 执行者责任悬置',
  s6: 'S6 · 政治形态学',
  s7: 'S7 · 形态推演',
  watch: '合成 · 观测哨',
};

export const SHIDU_TABS = Object.entries(SHIDU_TAB_LABELS).map(([id, label]) => ({
  id,
  label,
  accent: id === 'watch' ? '#b39657' : id === 's4' ? '#5d7489' : '#b5483a',
}));

export function shiduPanelId(tab) {
  return SHIDU_PANELS[resolveShiduTab(tab)];
}

export function shiduPath(tab = 's1') {
  const id = resolveShiduTab(tab);
  return id === 's1' ? '/modules/shidu' : `/modules/shidu?tab=${id}`;
}
