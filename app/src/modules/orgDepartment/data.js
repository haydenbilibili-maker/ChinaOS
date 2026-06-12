// ============================================================================
// 组织部 · 推演沙盘结构化数据
// asOf: 2026-06-11 · 教学用途示意，非真实组织系统
// ============================================================================

import { categoryX, valueY, GRID, LEGEND, donutOpt, stackedBarOpt } from '../shared/chartHelpers.js';

export const AS_OF = '2026-06-11';

export const QUEUE_TYPES = [
  { key: 'resume', label: '中国政要', accent: '#c41e3a', count: 2840, tab: 'resume' },
  { key: 'knowledge', label: '知识精英', accent: '#22d3ee', count: 1260, tab: 'knowledge' },
  { key: 'business', label: '商业精英', accent: '#e8a317', count: 890, tab: 'business' },
  { key: 'anticorruption', label: '反腐透视', accent: '#64748b', count: 420, tab: 'anticorruption' },
  { key: 'taiwan', label: '港澳台政要', accent: '#8b5cf6', count: 380, tab: 'taiwan' },
  { key: 'dissident', label: '异见人士', accent: '#94a3b8', count: 210, tab: 'dissident' },
  { key: 'overseas', label: '海外人才', accent: '#10b981', count: 560, tab: 'overseas' },
  { key: 'thinktank', label: '智库', accent: '#f0abfc', count: 340, tab: 'thinktank' },
];

export const PROFILE_TAGS = {
  ageTier: ['35岁以下', '35-45岁', '45-55岁', '55岁以上'],
  region: ['京畿', '长三角', '珠三角', '成渝', '东北', '西北', '边疆'],
  field: ['党政综合', '经济金融', '科技产业', '政法维稳', '人文社科', '基层治理'],
  depth: ['履历浅', '履历中', '履历深', '跨域复合'],
  risk: ['无标记', '关注项', '合规审查'],
  echelon: ['后备梯队', '现任主官', '专业干部', '学术智库', '企业领军'],
};

export const MOCK_PROFILES = [
  { id: 'org-01', name: '张××', queue: 'resume', ageTier: '45-55岁', region: '长三角', field: '党政综合', depth: '履历深', risk: '无标记', echelon: '现任主官', score: 91, province: '江苏', talentLink: { tab: 'resume', q: '江苏' } },
  { id: 'org-02', name: '李××', queue: 'knowledge', ageTier: '45-55岁', region: '京畿', field: '人文社科', depth: '跨域复合', risk: '无标记', echelon: '学术智库', score: 88, province: '北京', talentLink: { tab: 'knowledge', q: '人文' } },
  { id: 'org-03', name: '王××', queue: 'business', ageTier: '35-45岁', region: '珠三角', field: '科技产业', depth: '履历深', risk: '关注项', echelon: '企业领军', score: 85, province: '广东', talentLink: { tab: 'business', q: '科技' } },
  { id: 'org-04', name: '赵××', queue: 'resume', ageTier: '35-45岁', region: '成渝', field: '基层治理', depth: '履历中', risk: '无标记', echelon: '后备梯队', score: 87, province: '四川', talentLink: { tab: 'resume', q: '四川' } },
  { id: 'org-05', name: '陈××', queue: 'thinktank', ageTier: '55岁以上', region: '京畿', field: '经济金融', depth: '履历深', risk: '无标记', echelon: '学术智库', score: 92, province: '北京', talentLink: { tab: 'thinktank', q: '经济' } },
  { id: 'org-06', name: '刘××', queue: 'overseas', ageTier: '35-45岁', region: '长三角', field: '科技产业', depth: '跨域复合', risk: '合规审查', echelon: '专业干部', score: 83, province: '上海', talentLink: { tab: 'overseas', q: '科技' } },
  { id: 'org-07', name: '孙××', queue: 'resume', ageTier: '45-55岁', region: '东北', field: '经济金融', depth: '履历深', risk: '无标记', echelon: '现任主官', score: 86, province: '辽宁', talentLink: { tab: 'resume', q: '辽宁' } },
  { id: 'org-08', name: '周××', queue: 'knowledge', ageTier: '35-45岁', region: '西北', field: '人文社科', depth: '履历中', risk: '无标记', echelon: '后备梯队', score: 84, province: '陕西', talentLink: { tab: 'knowledge', q: '陕西' } },
  { id: 'org-09', name: '吴××', queue: 'business', ageTier: '45-55岁', region: '长三角', field: '经济金融', depth: '履历深', risk: '关注项', echelon: '企业领军', score: 82, province: '浙江', talentLink: { tab: 'business', q: '浙江' } },
  { id: 'org-10', name: '郑××', queue: 'resume', ageTier: '35岁以下', region: '边疆', field: '政法维稳', depth: '履历浅', risk: '无标记', echelon: '后备梯队', score: 80, province: '新疆', talentLink: { tab: 'resume', q: '新疆' } },
  { id: 'org-11', name: '钱××', queue: 'anticorruption', ageTier: '45-55岁', region: '京畿', field: '政法维稳', depth: '履历深', risk: '合规审查', echelon: '专业干部', score: 78, province: '北京', talentLink: { tab: 'anticorruption' } },
  { id: 'org-12', name: '许××', queue: 'taiwan', ageTier: '55岁以上', region: '珠三角', field: '党政综合', depth: '跨域复合', risk: '关注项', echelon: '现任主官', score: 76, province: '台湾', talentLink: { tab: 'taiwan' } },
  { id: 'org-13', name: '马××', queue: 'dissident', ageTier: '45-55岁', region: '京畿', field: '人文社科', depth: '履历深', risk: '合规审查', echelon: '学术智库', score: 72, province: '北京', talentLink: { tab: 'dissident' } },
  { id: 'org-14', name: '黄××', queue: 'resume', ageTier: '35-45岁', region: '珠三角', field: '科技产业', depth: '履历中', risk: '无标记', echelon: '专业干部', score: 89, province: '深圳', talentLink: { tab: 'resume', q: '深圳' } },
  { id: 'org-15', name: '林××', queue: 'overseas', ageTier: '35-45岁', region: '长三角', field: '科技产业', depth: '跨域复合', risk: '无标记', echelon: '后备梯队', score: 90, province: '杭州', talentLink: { tab: 'overseas', q: '杭州' } },
  { id: 'org-16', name: '何××', queue: 'thinktank', ageTier: '45-55岁', region: '成渝', field: '经济金融', depth: '履历深', risk: '无标记', echelon: '学术智库', score: 87, province: '重庆', talentLink: { tab: 'thinktank', q: '重庆' } },
];

export function filterProfiles({ queues = [], tags = {}, minScore = 70 } = {}) {
  return MOCK_PROFILES.filter((p) => {
    if (queues.length && !queues.includes(p.queue)) return false;
    if (p.score < minScore) return false;
    for (const [dim, vals] of Object.entries(tags)) {
      if (vals?.length && !vals.includes(p[dim])) return false;
    }
    return true;
  }).sort((a, b) => b.score - a.score);
}

export function buildQueueSankey() {
  const nodes = [
    ...QUEUE_TYPES.map((q) => ({ name: q.label })),
    ...PROFILE_TAGS.echelon.map((e) => ({ name: e })),
    ...PROFILE_TAGS.region.slice(0, 5).map((r) => ({ name: r })),
  ];
  const links = [
    { source: '中国政要', target: '现任主官', value: 42 },
    { source: '中国政要', target: '后备梯队', value: 28 },
    { source: '知识精英', target: '学术智库', value: 35 },
    { source: '知识精英', target: '后备梯队', value: 18 },
    { source: '商业精英', target: '企业领军', value: 30 },
    { source: '智库', target: '学术智库', value: 22 },
    { source: '海外人才', target: '专业干部', value: 20 },
    { source: '现任主官', target: '京畿', value: 18 },
    { source: '现任主官', target: '长三角', value: 22 },
    { source: '后备梯队', target: '成渝', value: 12 },
    { source: '学术智库', target: '京畿', value: 25 },
    { source: '企业领军', target: '珠三角', value: 20 },
  ];
  return {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'sankey', left: 8, right: 100, top: 10, bottom: 10,
      data: nodes, links,
      nodeWidth: 14, nodeGap: 10,
      emphasis: { focus: 'adjacency' },
      label: { color: '#93a1b5', fontSize: 10 },
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.45 },
    }],
  };
}

export function buildEchelonPyramid() {
  const tiers = ['省部级梯队', '厅局级梯队', '县处级梯队', '乡科级梯队', '专业骨干池'];
  return stackedBarOpt({
    categories: tiers,
    series: [
      { name: '党政综合', data: [12, 28, 45, 62, 38], itemStyle: { color: '#c41e3a' } },
      { name: '经济金融', data: [8, 22, 35, 48, 30], itemStyle: { color: '#e8a317' } },
      { name: '科技产业', data: [5, 15, 28, 40, 55], itemStyle: { color: '#22d3ee' } },
      { name: '基层治理', data: [3, 10, 32, 58, 42], itemStyle: { color: '#10b981' } },
    ],
    horizontal: true,
  });
}

export function buildRegionBar() {
  const regions = PROFILE_TAGS.region;
  const counts = [420, 380, 310, 260, 180, 150, 120];
  return {
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(regions),
    yAxis: valueY({ name: '画像数' }),
    series: [{
      type: 'bar', barWidth: 20,
      data: counts.map((v, i) => ({ value: v, itemStyle: { color: ['#c41e3a', '#22d3ee', '#e8a317', '#10b981', '#64748b', '#8b5cf6', '#f0abfc'][i] } })),
    }],
  };
}

export function buildFilterHeatmap(profiles) {
  const queues = profiles.length ? [...new Set(profiles.map((p) => p.queue))] : QUEUE_TYPES.slice(0, 5).map((q) => q.key);
  const fields = PROFILE_TAGS.field;
  const qLabels = queues.map((k) => QUEUE_TYPES.find((q) => q.key === k)?.label || k);
  const data = [];
  queues.forEach((q, yi) => {
    fields.forEach((f, xi) => {
      const n = profiles.filter((p) => p.queue === q && p.field === f).length || Math.floor(Math.random() * 4);
      data.push([xi, yi, n]);
    });
  });
  return {
    grid: { left: 72, right: 16, top: 16, bottom: 48 },
    tooltip: { position: 'top' },
    xAxis: { type: 'category', data: fields, axisLabel: { color: '#93a1b5', fontSize: 9, rotate: 30 } },
    yAxis: { type: 'category', data: qLabels, axisLabel: { color: '#93a1b5', fontSize: 10 } },
    visualMap: { min: 0, max: 5, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#1e293b', '#22d3ee', '#c41e3a'] }, textStyle: { color: '#93a1b5' } },
    series: [{ type: 'heatmap', data, label: { show: true, fontSize: 10, color: '#e8edf6' } }],
  };
}

export function buildQueueDonut() {
  return donutOpt(QUEUE_TYPES.map((q) => ({
    name: q.label,
    value: q.count,
    itemStyle: { color: q.accent },
  })));
}

export const FRAMEWORK = {
  salt: {
    body: '组织部掌握干部信息垄断权——人事档案、考核评价与任用建议构成组织体系的「盐铁专营」接口。',
    pillars: [['信息垄断', '档案颗粒'], ['筛选阀门', '部务会商'], ['画像标尺', '多维标签']],
  },
  stone: {
    body: '试点选拔—画像迭代—制度固化：年轻干部、专业干部等标签在不同阶段试错，成功后写入组织工作规范。',
    pillars: [['标签试点', '灰度刻画'], ['模拟筛选', '条件组合'], ['结果回流', '任用衔接']],
  },
  path: {
    body: '从全域画像到精准筛选：队列聚合 → 颗粒标签 → 模拟部务会 → 短名单输出，对接党校班次与岗位配置。',
    pillars: [['全域聚合', '多队列'], ['颗粒刻画', '多维标签'], ['部务会商', '短名单']],
  },
};
