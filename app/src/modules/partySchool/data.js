// ============================================================================
// 中央党校 · 推演沙盘结构化数据
// asOf: 2026-06-11 · 教学用途示意，非真实组织系统
// ============================================================================

import { categoryX, valueY, GRID, radarOpt, donutOpt, AXIS, LABEL, LEGEND } from '../shared/chartHelpers.js';

export const AS_OF = '2026-06-11';

export const COURSE_MODULES = [
  { key: 'marx', label: '马列经典', hours: 48, accent: '#c41e3a', desc: '马克思主义基本原理、政治经济学批判与历史唯物主义方法论。', tags: ['理论素养', '党性修养'] },
  { key: 'xjp', label: '习近平新时代中国特色社会主义思想', hours: 72, accent: '#e8a317', desc: '系统阐释新时代治国理政新理念新思想新战略。', tags: ['政策解读', '理论素养'] },
  { key: 'party', label: '党史党建', hours: 56, accent: '#22d3ee', desc: '百年党史脉络、党的建设制度与自我革命逻辑。', tags: ['党性修养', '组织纪律'] },
  { key: 'economy', label: '经济治理', hours: 40, accent: '#10b981', desc: '宏观调控、新质生产力与财政金融治理框架。', tags: ['政策解读', '治理能力'] },
  { key: 'diplomacy', label: '外交战略', hours: 32, accent: '#8b5cf6', desc: '大国外交、周边安全与全球治理参与。', tags: ['战略思维', '政策解读'] },
  { key: 'law', label: '法治与依规治党', hours: 28, accent: '#64748b', desc: '党内法规体系、依法治国与纪律规矩。', tags: ['党性修养', '制度执行'] },
];

export const COHORTS = [
  {
    key: 'provincial',
    label: '省部级后备',
    accent: '#c41e3a',
    quota: 120,
    criteria: { minAge: 45, maxAge: 58, minTenure: 8, domains: ['党政综合', '经济金融', '政法维稳'] },
    desc: '面向副省级、正厅级后备干部的专题研修班次，侧重战略视野与全局统筹能力。',
    dimensions: ['战略研判', '政策执行', '班子协同', '党性示范', '应急处突'],
  },
  {
    key: 'youth',
    label: '中青年干部',
    accent: '#22d3ee',
    quota: 200,
    criteria: { minAge: 35, maxAge: 48, minTenure: 5, domains: ['基层治理', '科技创新', '对外开放'] },
    desc: '中青班梯队建设核心班次，强调基层历练、专业素养与政治忠诚的综合锻造。',
    dimensions: ['理论素养', '基层经验', '专业深度', '创新意识', '组织认同'],
  },
  {
    key: 'county',
    label: '县委书记研修班',
    accent: '#e8a317',
    quota: 280,
    criteria: { minAge: 38, maxAge: 52, minTenure: 3, domains: ['县域经济', '乡村振兴', '基层维稳'] },
    desc: '一线主官能力升级班次，聚焦县域治理、项目落地与矛盾化解实操。',
    dimensions: ['执行穿透', '群众工作', '财政统筹', '产业招商', '风险防控'],
  },
  {
    key: 'thinktank',
    label: '智库讲学者班',
    accent: '#8b5cf6',
    quota: 60,
    criteria: { minAge: 40, maxAge: 65, minTenure: 10, domains: ['人文社科', '政策研究', '国际问题'] },
    desc: '从知识精英/智库队列遴选讲学人才，侧重政策解读与教学转化能力。',
    dimensions: ['理论阐释', '教学表达', '政策对接', '学术声誉', '意识形态安全'],
  },
];

export const INSTRUCTORS = [
  { id: 'ins-01', name: '周××', queue: 'knowledge', field: '马克思主义理论', org: '某重点高校', scores: [92, 88, 85, 90], talentLink: { tab: 'knowledge', q: '马克思主义' } },
  { id: 'ins-02', name: '林××', queue: 'thinktank', field: '宏观经济政策', org: '国务院发展研究中心', scores: [86, 94, 82, 88], talentLink: { tab: 'thinktank', q: '宏观' } },
  { id: 'ins-03', name: '陈××', queue: 'knowledge', field: '党史党建', org: '中央党史文献研究院', scores: [90, 87, 91, 93], talentLink: { tab: 'knowledge', q: '党史' } },
  { id: 'ins-04', name: '黄××', queue: 'thinktank', field: '外交与国际关系', org: '中国现代国际关系研究院', scores: [84, 90, 88, 85], talentLink: { tab: 'thinktank', q: '外交' } },
  { id: 'ins-05', name: '吴××', queue: 'knowledge', field: '经济治理', org: '某财经院校', scores: [88, 91, 80, 86], talentLink: { tab: 'knowledge', q: '经济' } },
  { id: 'ins-06', name: '郑××', queue: 'research', field: '基层治理', org: '某社科院', scores: [82, 85, 89, 90], talentLink: { tab: 'research', q: '治理' } },
];

export const ASSESSMENT_DIMS = ['理论素养', '政策解读', '教学能力', '党性修养'];

export const CANDIDATES = [
  { id: 'cand-p01', name: '张××', cohort: 'provincial', province: '江苏', age: 52, domain: '党政综合', tenure: 12, scores: [88, 85, 82, 91], tags: ['班子历练', '经济专班'] },
  { id: 'cand-p02', name: '李××', cohort: 'provincial', province: '四川', age: 49, domain: '经济金融', tenure: 10, scores: [82, 92, 78, 86], tags: ['财政背景', '援疆经历'] },
  { id: 'cand-p03', name: '王××', cohort: 'provincial', province: '广东', age: 55, domain: '政法维稳', tenure: 15, scores: [90, 80, 85, 94], tags: ['政法系统', '大湾区'] },
  { id: 'cand-y01', name: '刘××', cohort: 'youth', province: '浙江', age: 42, domain: '基层治理', tenure: 7, scores: [86, 88, 90, 87], tags: ['乡镇书记', '数字化治理'] },
  { id: 'cand-y02', name: '赵××', cohort: 'youth', province: '湖北', age: 38, domain: '科技创新', tenure: 6, scores: [84, 91, 86, 88], tags: ['高新区', '产学研'] },
  { id: 'cand-y03', name: '孙××', cohort: 'youth', province: '陕西', age: 44, domain: '对外开放', tenure: 8, scores: [88, 86, 84, 90], tags: ['自贸区', '中欧班列'] },
  { id: 'cand-y04', name: '钱××', cohort: 'youth', province: '福建', age: 40, domain: '基层治理', tenure: 5, scores: [90, 84, 88, 92], tags: ['脱贫攻坚', '山海协作'] },
  { id: 'cand-c01', name: '周××', cohort: 'county', province: '河南', age: 45, domain: '县域经济', tenure: 4, scores: [85, 87, 90, 88], tags: ['粮食大县', '产业承接'] },
  { id: 'cand-c02', name: '吴××', cohort: 'county', province: '贵州', age: 41, domain: '乡村振兴', tenure: 3, scores: [82, 88, 92, 86], tags: ['易地搬迁', '特色农业'] },
  { id: 'cand-c03', name: '郑××', cohort: 'county', province: '黑龙江', age: 48, domain: '基层维稳', tenure: 6, scores: [88, 82, 86, 90], tags: ['边境县', '民族地区'] },
  { id: 'cand-t01', name: '马××', cohort: 'thinktank', province: '北京', age: 56, domain: '政策研究', tenure: 20, scores: [94, 92, 88, 85], tags: ['智库首席', '内参执笔'] },
  { id: 'cand-t02', name: '许××', cohort: 'thinktank', province: '上海', age: 48, domain: '人文社科', tenure: 15, scores: [90, 88, 94, 82], tags: ['学术领军', '教学名师'] },
];

export const GOVERNANCE_CASES = [
  { period: '第1周', title: '长三角一体化', desc: '以示范区制度创新为案例，推演央地协同、要素流动与利益再分配机制。', accent: '#22d3ee' },
  { period: '第2周', title: '县域债务化解', desc: '模拟「三保」压力下的财政统筹、平台转型与风险缓释路径选择。', accent: '#e8a317' },
  { period: '第3周', title: '边疆稳边固防', desc: '兴边富民、对口支援与反恐维稳「三位一体」的治理组合推演。', accent: '#c41e3a' },
  { period: '第4周', title: '新质生产力布局', desc: '从产业政策到园区招商的全链条沙盘，对接算力主权与链主培育。', accent: '#10b981' },
];

export const SCHEDULE_BLOCKS = [
  { day: '周一', slots: ['马列经典', '习近平新时代中国特色社会主义思想', '分组研讨', '自习'] },
  { day: '周二', slots: ['党史党建', '经济治理', '案例教学', '党性教育'] },
  { day: '周三', slots: ['外交战略', '法治与依规治党', '现场教学', '研讨'] },
  { day: '周四', slots: ['专题报告', '治理案例推演', '小组答辩', '自习'] },
  { day: '周五', slots: ['结业考核', '学习总结', '部务会商模拟', '返程'] },
];

export function getCohort(key) {
  return COHORTS.find((c) => c.key === key) || COHORTS[0];
}

export function filterCandidates(cohortKey, minScore = 0) {
  const cohort = getCohort(cohortKey);
  return CANDIDATES
    .filter((c) => c.cohort === cohortKey)
    .map((c) => {
      const avg = Math.round(c.scores.reduce((a, b) => a + b, 0) / c.scores.length);
      const fit = c.scores.reduce((s, v, i) => s + v * (0.9 + i * 0.05), 0) / 4;
      return { ...c, avg, fit: Math.round(fit), pass: avg >= minScore && c.age >= cohort.criteria.minAge && c.age <= cohort.criteria.maxAge };
    })
    .filter((c) => c.pass)
    .sort((a, b) => b.fit - a.fit);
}

export function compositeScore(scores) {
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function buildCourseDonut() {
  return donutOpt(COURSE_MODULES.map((m) => ({
    name: m.label.length > 8 ? m.label.slice(0, 8) + '…' : m.label,
    value: m.hours,
    itemStyle: { color: m.accent },
  })));
}

export function buildAssessmentRadar(scores, { name = '综合', color = '#c41e3a' } = {}) {
  return radarOpt(ASSESSMENT_DIMS, scores, { name, color });
}

export function buildCohortRadar(cohort, candidate) {
  const dims = cohort.dimensions || ASSESSMENT_DIMS;
  const values = candidate.scores.length >= dims.length
    ? candidate.scores.slice(0, dims.length)
    : [...candidate.scores, ...Array(dims.length - candidate.scores.length).fill(75)];
  return radarOpt(dims, values, { name: candidate.name, color: cohort.accent });
}

export function buildLeaderboard(cohortKey) {
  const list = filterCandidates(cohortKey, 75);
  return {
    grid: { left: 72, right: 24, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis' },
    xAxis: valueY({ name: '综合分', max: 100 }),
    yAxis: categoryX(list.map((c) => c.name)),
    series: [{
      type: 'bar', barWidth: 14,
      data: list.map((c) => ({ value: c.fit, itemStyle: { color: c.fit >= 90 ? '#10b981' : c.fit >= 85 ? '#22d3ee' : '#e8a317' } })),
      label: { show: true, position: 'right', color: LABEL.color, formatter: '{c}' },
    }],
  };
}

export function buildCaseTimeline() {
  return {
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(GOVERNANCE_CASES.map((g) => g.period)),
    yAxis: valueY({ name: '参与度', max: 100 }),
    series: [{
      type: 'line', smooth: true,
      data: [72, 85, 78, 92],
      lineStyle: { color: '#c41e3a', width: 2 },
      areaStyle: { color: 'rgba(196,30,58,0.1)' },
      markPoint: { data: GOVERNANCE_CASES.map((g, i) => ({ name: g.title, coord: [i, [72, 85, 78, 92][i]], value: g.title })) },
    }],
  };
}

export function buildScheduleHeatmap() {
  const days = SCHEDULE_BLOCKS.map((s) => s.day);
  const slots = ['上午一', '上午二', '下午一', '下午二'];
  const courseIdx = Object.fromEntries(COURSE_MODULES.map((m, i) => [m.label, i]));
  const data = [];
  SCHEDULE_BLOCKS.forEach((block, yi) => {
    block.slots.forEach((slot, xi) => {
      const idx = courseIdx[slot] ?? (slot.includes('研讨') ? 2 : slot.includes('考核') ? 0 : 4);
      data.push([xi, yi, idx + 1]);
    });
  });
  return {
    grid: { left: 56, right: 16, top: 16, bottom: 48 },
    tooltip: { position: 'top' },
    xAxis: { type: 'category', data: slots, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    yAxis: { type: 'category', data: days, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    visualMap: { min: 1, max: 7, calculable: false, orient: 'horizontal', left: 'center', bottom: 0, inRange: { color: ['#1e293b', '#c41e3a', '#e8a317', '#22d3ee'] }, textStyle: { color: LABEL.color } },
    series: [{ type: 'heatmap', data, label: { show: true, fontSize: 9, color: '#e8edf6' } }],
  };
}

export const FRAMEWORK = {
  salt: {
    body: '党校是意识形态与组织能力的「盐铁专营」——理论解释权、干部培训权与梯队筛选权构成政治忠诚的供给垄断。',
    pillars: [['理论垄断', '阐释权集中'], ['班次筛选', '梯队阀门'], ['考核标尺', '党性量规']],
  },
  stone: {
    body: '班次试点—专题迭代—制度固化：中青班、县委书记班等在不同阶段试错，成功后写入组织工作条例。',
    pillars: [['专题班', '灰度试验'], ['案例推演', '情景压力'], ['部务会商', '结果回流']],
  },
  path: {
    body: '从课堂学习到岗位胜任：教学人才推演 → 组织筛选 → 人才考核 → 岗位配置，形成闭环梯队建设路径。',
    pillars: [['讲学遴选', '智库接口'], ['画像匹配', '岗位需求'], ['考核出口', '任用衔接']],
  },
};
