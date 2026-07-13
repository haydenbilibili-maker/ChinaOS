import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import * as echarts from 'echarts';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import worldGeo from './world.geo.json';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import SectionSimulator from './SectionSimulator.jsx';
import SectionBalance from './SectionBalance.jsx';
import SectionAntifragile from './SectionAntifragile.jsx';
import SectionValues from './SectionValues.jsx';
import SectionRisk from './SectionRisk.jsx';
import SectionPrinciples from './SectionPrinciples.jsx';
import SectionShanhai from './SectionShanhai.jsx';
import SectionLifePlan from './SectionLifePlan.jsx';
import { AXIS, LABEL, GRID_LINE, CHART_SERIES_PALETTE } from '../shared/chartHelpers.js';

// ============================================================================
// 私享切片 · 李贺 / 独菽 / Hayden（GY-∞ · 不入公开图谱）
// ----------------------------------------------------------------------------
// 一个 1992 年从东北小镇 spawn 的进程的迁移日志：高考换页到江南，毕业进京挂载
// 互联网内核，赶上出海红利被调度到东亚/东南亚多个地域，又选择 fork 一次创业，
// 最后回迁到距出生地 32 公里的长春——在 35 岁的时钟中断里重新寻找调度策略。
// 口径：本人自述 + 简历公开口径，自画像、仅自用；非任何机构人事评价。
// ============================================================================


// —— 迁移日志（时间轴）——
const MIGRATION = [
  { period: '1992 · 起点', title: '东辽·白泉镇', accent: '#64748b',
    desc: '吉林省东辽县白泉镇出生。东北小镇的默认进程：资源有限、半径很小，但读书是唯一一条可被全国调度的出口。' },
  { period: '2011 · 换页', title: '无锡·江南大学', accent: '#22d3ee',
    desc: '高考把进程从东北换页到江南——江南大学（211 / 双一流 / 教育部直属）日语专业。第一次跨地域迁移，也是第一次把方言、气候与生活半径全部重写。' },
  { period: '2015 · 挂载内核', title: '北京·内容运营起步', accent: '#10b981',
    desc: '毕业进京，挂载互联网内核。优酷土豆短视频 UGC（单月引入 7.6 万条原创）、大鱼号、播客主播——在内容分发的底层练手，攒下第一段「从 0 搭体系」的肌肉记忆。' },
  { period: '2018 · 出海', title: '快手·东亚区域', accent: '#e8a317',
    desc: '赶上出海红利窗口。快手国际区域运营负责人，带 30 人团队做东亚/东南亚；在越南输出「老铁文化」，推 Kwai 登顶双榜第一、日活 50W+，主导 Snack Video 0-1 冷启动。' },
  { period: '2020 · 中枢', title: '杭州·支付宝分发', accent: '#8b5cf6',
    desc: '蚂蚁集团支付宝搜索推荐运营专家，做亿级流量首页分发与内容化转型冷启动。从「出海开拓」切回「巨型中枢调度」，看清了流量这门生意的另一面。' },
  { period: '2021 · 1 号位', title: 'B站·国家经理', accent: '#c41e3a',
    desc: '哔哩哔哩菲律宾/东南亚 1 号员工，从零搭 20 人本地团队，DAU 从 0 突破 300 万、次留 50%+、ACG 圈层渗透 0→17%。出海生涯的峰值校准点。' },
  { period: '2023 · fork', title: 'AI 社交·增长创业', accent: '#fb923c',
    desc: 'MetaDream（Bondee / Vibbe.ai）东南亚增长运营负责人，转身扑进 AIGC：用 Gemini/Flux 微调 200+ NPC、大五人格构虚拟生态，Cursor 写过 10W+ 行代码。从打工的确定性 fork 出一条自负盈亏的进程。' },
  { period: '2026 · 回迁', title: '长春·重新调度', accent: '#94a3b8',
    desc: '回到东北，落在长春——距白泉镇 32 公里的原点附近。出海十年攒下的 SOP 在这里水土不服，红利窗口在身后关闭，35 岁的时钟里有迷茫，也有第一次为自己而非为平台调度资源的清醒。' },
];

// —— 城市迁移（真实经纬度，接入 ECharts geo 世界地图）——
const ME_MAP = 'me-world';
if (!echarts.getMap(ME_MAP)) echarts.registerMap(ME_MAP, worldGeo);

const CITY_GEO = [
  { name: '白泉镇', coord: [124.95, 42.98], kind: 'origin' },  // 吉林东辽县白泉镇
  { name: '长春', coord: [125.32, 43.82], kind: 'now' },
  { name: '无锡', coord: [120.31, 31.49] },
  { name: '上海', coord: [121.47, 31.23] },
  { name: '北京', coord: [116.40, 39.90] },
  { name: '杭州', coord: [120.15, 30.27] },
  { name: '首尔', coord: [126.98, 37.57] },
  { name: '东京', coord: [139.69, 35.68] },
  { name: '胡志明', coord: [106.63, 10.82] },
  { name: '马尼拉', coord: [120.98, 14.60] },
  { name: '雅加达', coord: [106.85, -6.21] },
  { name: '曼谷', coord: [100.50, 13.75] },
  { name: '新加坡', coord: [103.82, 1.35] },
  { name: '圣保罗', coord: [-46.63, -23.55] },  // 巴西
];
const COORD_OF = Object.fromEntries(CITY_GEO.map((c) => [c.name, c.coord]));
// 迁徙轨迹（成段连线）：东北原点 → 江南/进京 → 出海东亚东南亚 → 越洋巴西 → 回迁长春
const CITY_EDGES = [
  ['白泉镇', '无锡'], ['无锡', '上海'], ['上海', '北京'], ['北京', '首尔'],
  ['首尔', '东京'], ['北京', '胡志明'], ['胡志明', '马尼拉'], ['首尔', '杭州'],
  ['杭州', '雅加达'], ['雅加达', '曼谷'], ['曼谷', '新加坡'], ['新加坡', '圣保罗'],
  ['圣保罗', '长春'],
];

// —— 多维定位：出海期 vs 回迁期 ——
const RADAR_DIMS = ['地域跨度', '行业红利', '国际化', '组织规模', '风险敞口', '本地适应'];
const RADAR_SERIES = [
  { name: '出海峰值期（2018–2022）', color: '#e8a317', value: [95, 90, 92, 80, 45, 70] },
  { name: '回迁创业期（2023–2026）', color: '#22d3ee', value: [55, 40, 70, 30, 88, 45] },
];

// —— 互联网/出海红利窗口 vs 个人节奏 ——
const DIVIDEND_YEARS = ['2015', '2017', '2019', '2021', '2023', '2025', '2026'];
const DIVIDEND_WAVE = [55, 78, 92, 88, 62, 38, 30]; // 出海红利大势（示意）
const SELF_RHYTHM = [40, 65, 90, 95, 72, 50, 48]; // 个人在浪上的位置（示意）

// —— 履历锚点 ——
const CAREER = [
  { co: 'MetaDream · Bondee / Vibbe.ai', role: '东南亚增长运营负责人', span: '2023.11–至今', win: 'AI Agent 社交冷启动 · Gemini/Flux 微调 200+ NPC · 大五人格虚拟生态', color: '#fb923c' },
  { co: '哔哩哔哩 Bilibili', role: '国家经理 & 内容中台负责人', span: '2021.11–2022.12', win: '菲律宾/东南亚 1 号位 · DAU 0→300 万 · 次留 50%+ · ACG 渗透 0→17%', color: '#c41e3a' },
  { co: '蚂蚁集团 · 支付宝', role: '搜索推荐运营专家', span: '2020.07–2021.11', win: '亿级流量首页分发 · 内容化转型 Tab3 冷启动 · 行为经济学分析', color: '#8b5cf6' },
  { co: '快手 Kuaishou International', role: '东亚区域运营负责人', span: '2018.05–2020.07', win: '越南「老铁文化」出海 · Kwai 双榜第一 · 日活 50W+ · Snack Video 0-1', color: '#e8a317' },
  { co: '阿里 · 优酷土豆 + 青蜜科技', role: 'UGC 运营 / 大鱼号 / 播客主播', span: '2015.05–2018.05', win: '土豆短视频 UGC 单月 7.6 万条 · 内容签约结算 SOP · 高校科幻活动', color: '#10b981' },
];

// —— 能力栈 ——
const SKILLS = ['国际化增长 Global Growth', '社区生态构建', '跨国团队管理（中/印/菲/泰/越 50+）', 'P&L 经营分析', 'AIGC 应用', 'Gemini / Flux / Comfy UI', 'Cursor 10W+ 行', 'SEO & 增长策略', '日语 N2 · 英语 CET-6'];

// —— 35 岁的系统张力 ——
const TENSIONS = [
  { title: '红利窗口的关闭', subtitle: '时机不可重放', body: '2018–2022 出海红利是被时代调度上的那班车；窗口关上后，同样的打法不再有同样的弹性。',
    pillars: [['路径依赖', '出海 SOP 是资产也是包袱'], ['窗口', '不可逆的时间结构'], ['再校准', '从乘势到造势']] },
  { title: '地域的水土不服', subtitle: '东京湾的图纸落在松花江', body: '十年攒在一线与海外的方法论，回到东北中等城市后，节奏、资源密度、人才半径全部错配——回迁不是回家，是又一次跨地域迁移。',
    pillars: [['错配', '一线 SOP × 三线土壤'], ['半径', '人才与资本的稀薄'], ['重学', '把本地当新市场'] ] },
  { title: '35 岁的时钟中断', subtitle: '为自己而非为平台调度', body: '同辈时钟、创业现金流、身份从「大厂操盘手」重写为「独立进程」——迷茫是真的，但第一次，资源的分配权也真的在自己手里。',
    pillars: [['同辈时钟', '社会的默认计时器'], ['现金流', '自负盈亏的清醒'], ['主体性', '调度权的回收']] },
];

function migrationMapOption(full = false) {
  const colorOf = (n) => (n.kind === 'now' ? '#22d3ee' : n.kind === 'origin' ? '#c41e3a' : '#e8a317');
  const lines = CITY_EDGES.map(([s, t]) => ({ coords: [COORD_OF[s], COORD_OF[t]], fromName: s, toName: t }));
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: (p) => (p.seriesType === 'lines' ? `${p.data.fromName} → ${p.data.toName}` : p.name) },
    geo: {
      map: ME_MAP, roam: true, zoom: full ? 1.05 : 0.9, center: [48, 14],
      scaleLimit: { min: 0.6, max: 8 },
      itemStyle: { areaColor: '#1b2740', borderColor: 'rgba(148,163,184,0.32)', borderWidth: 0.5 },
      emphasis: { disabled: true },
      label: { show: false },
    },
    series: [
      // 迁徙航线 + 动态拖尾
      { type: 'lines', coordinateSystem: 'geo', zlevel: 1, data: lines,
        effect: { show: true, period: 5, trailLength: 0.5, symbol: 'arrow', symbolSize: 6, color: '#e8a317' },
        lineStyle: { color: 'rgba(232,163,23,0.45)', width: 1.4, curveness: 0.25 } },
      // 城市节点
      { type: 'scatter', coordinateSystem: 'geo', zlevel: 2,
        symbolSize: (v, p) => (CITY_GEO[p.dataIndex]?.kind ? 13 : 9),
        itemStyle: { color: (p) => colorOf(CITY_GEO[p.dataIndex]) },
        label: { show: true, position: 'right', formatter: (p) => p.name, color: LABEL.color, fontSize: 11, fontFamily: 'var(--font-mono)' },
        data: CITY_GEO.map((c) => ({ name: c.name, value: c.coord, itemStyle: { color: colorOf(c) } })) },
      // 起点/终点高亮涟漪
      { type: 'effectScatter', coordinateSystem: 'geo', zlevel: 3, rippleEffect: { scale: 3, brushType: 'stroke' },
        symbolSize: 12, data: CITY_GEO.filter((c) => c.kind).map((c) => ({ name: c.name, value: c.coord, itemStyle: { color: colorOf(c) } })) },
    ],
  };
}

function radarOption() {
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 11 }, data: RADAR_SERIES.map((s) => s.name) },
    radar: {
      indicator: RADAR_DIMS.map((d) => ({ name: d, max: 100 })),
      axisName: { color: LABEL.color, fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: GRID_LINE.lineStyle.color } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: RADAR_SERIES.map((s) => ({
        name: s.name, value: s.value,
        lineStyle: { color: s.color, width: 2 }, itemStyle: { color: s.color },
        areaStyle: { color: s.color, opacity: 0.12 },
      })),
    }],
  };
}

function dividendOption() {
  return {
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 11 }, data: ['出海红利大势', '个人在浪上的位置'] },
    grid: { left: 36, right: 16, top: 30, bottom: 28 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: DIVIDEND_YEARS, boundaryGap: false, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color }, axisTick: { show: false } },
    yAxis: { type: 'value', max: 100, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color }, splitLine: { lineStyle: { color: GRID_LINE.lineStyle.color } } },
    series: [
      { name: '出海红利大势', type: 'line', smooth: true, symbol: 'none', areaStyle: { color: '#e8a317', opacity: 0.14 }, lineStyle: { width: 2, color: '#e8a317' }, data: DIVIDEND_WAVE,
        markLine: { silent: true, symbol: 'none', lineStyle: { color: 'rgba(196,30,58,0.5)', type: 'dashed' }, data: [{ xAxis: '2022', label: { formatter: '窗口收口', color: '#c41e3a', fontSize: 10 } }] } },
      { name: '个人在浪上的位置', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { width: 2, color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, data: SELF_RHYTHM },
    ],
  };
}

// ============================================================================
// 扩展层：时代背景 / 个人选择 / 代际与东北 / 未来趋势 / 未来路径 / 系统坐标
// ============================================================================

// —— ⑧ 时代背景：个人里程碑叠加宏观浪潮（示意标定）——
const ERA_YEARS = ['1992', '1998', '2004', '2010', '2016', '2022', '2026'];
const ERA_NET = [2, 8, 20, 38, 58, 75, 80];        // 中国互联网/移动互联网渗透大势（示意 %）
const ERA_GLOBAL = [5, 12, 25, 40, 70, 55, 42];     // 中国 APP 出海窗口热度（示意）
const ERA_MARKS = [
  { year: '1992', label: '南方谈话·市场经济' },
  { year: '2001', label: 'WTO 入世' },
  { year: '2010', label: '移动互联网起飞' },
  { year: '2018', label: '出海红利高峰' },
  { year: '2022', label: '人口负增长·窗口收口' },
];
const ERA_NOTE = '出生即抽签：1992 年生人正好踩在「市场经济起飞 → 入世全球化 → 移动互联网 → APP 出海」这条上升直线上，又在 35 岁这年撞上人口拐点与出海退潮。个人努力是真的，但被时代抽中哪一段，先于努力。';

// —— ⑨ 个人选择：关键分叉 + 反事实 ——
const DECISIONS = [
  { id: 'major', node: '专业 · 日语 vs 热门', taken: '选日语（小语种）', why: '高考分数与地域约束下的次优解',
    counter: '若选金融/计算机：起点更高，但未必踩中出海——日语反成东亚出海的隐性凭证', color: '#22d3ee' },
  { id: 'city', node: '毕业 · 北京 vs 留无锡', taken: '进京', why: '互联网内核只在一线挂载',
    counter: '留长三角：生活成本更友好，但错过 2015-2018 的内容/出海风口窗口', color: '#10b981' },
  { id: 'sea', node: '路线 · 出海 vs 国内', taken: '出海东亚东南亚', why: '增量在海外、竞争相对蓝海',
    counter: '深耕国内大厂：稳定度更高，但天花板与不可替代性都更低', color: '#e8a317' },
  { id: 'startup', node: '体制 · 大厂 vs 创业', taken: 'fork 创业（AI 社交）',
    why: '想把调度权从平台收回自己手里', counter: '继续大厂：现金流确定，但 35 岁后的议价权随红利退潮下行', color: '#fb923c' },
  { id: 'back', node: '地域 · 回东北 vs 留一线', taken: '回迁长春', why: '家庭/成本/赌区域低位',
    counter: '留一线：资源密度高、但创业成本与同辈内卷也最高——回迁是一次高风险逆向下注', color: '#94a3b8' },
];

// —— ⑩ 代际与东北坐标（含跨切片链接）——
const GENERATION = [
  ['90 后 · 独生末班', '计划生育与城镇化交汇处出生，独生子女的全部期待与赡养压力一肩挑'],
  ['迁徙的一代', '小镇 → 高校 → 一线 → 海外 → 回流：用脚投票的完整闭环，正反两个方向都走过'],
  ['数字红利原住民前夜', '赶在移动互联网起飞前入场，吃到平台扩张期的全部弹性'],
  ['35 岁结构性拐点', '红利退潮叠加年龄议价拐点，「中年」提前到来'],
];
const SLICE_LINKS = [
  { to: '/modules/qingnian', label: 'GY-03 青年', note: '退出与迷茫的暗物质' },
  { to: '/modules/zhongnv', label: 'GY-17 中年', note: '提前到来的中年坐标' },
  { to: '/modules/minqi', label: 'GY-42 中小民企主', note: '自负盈亏的创业进程' },
  { to: '/modules/manjiu', label: 'GY-34 慢就业青年', note: '红利退潮后的就业压力' },
];
const NORTHEAST = {
  text: '我既是东北人口外流大潮里的一员（离开），又是逆流回迁的极少数（回来）。区域数据看东北是「财政承压·人口净流出·投资环境靠后」的样本，但个人微观的回迁，赌的正是这块洼地的低位与未被定价的机会——逆向下注与水土不服，是同一枚硬币。',
  links: [
    { to: '/econ-dashboard', label: '经济大盘 · 区域下钻', note: '辽宁/吉林承压热力图' },
    { to: '/chronicle', label: '国运时间轴', note: '东北的兴衰长波' },
  ],
};

// —— ⑪ 未来趋势：趋势强度 × 个人契合度（象限散点）——
const TRENDS = [
  { name: 'AI Agent / 超级个体', strength: 92, fit: 85, color: '#fb923c' },
  { name: '中国品牌出海 2.0', strength: 78, fit: 88, color: '#e8a317' },
  { name: '银发经济', strength: 70, fit: 40, color: '#10b981' },
  { name: '东北/区域振兴', strength: 55, fit: 58, color: '#94a3b8' },
  { name: '个人 IP / 内容创作', strength: 68, fit: 72, color: '#22d3ee' },
  { name: '跨境电商 / 全球供给', strength: 74, fit: 62, color: '#8b5cf6' },
];
const TREND_NOTE = '右上象限（高趋势 × 高契合）是「AI 超级个体」与「出海 2.0」——十年出海操盘 + AIGC 实战正好叠在这条线上；银发经济趋势在但契合低；东北振兴契合中等、强度待验证。';

// —— ⑫ 未来路径：35 → 45 的几种 fork（情景）——
const PATHS = [
  { id: 'super', label: 'AI 超级个体 · 一人公司', prob: 'A', fit: 90,
    desc: '用 AI Agent 把「管 50 人团队」的能力压缩进一个人，做高毛利、轻团队的出海产品/工具。', risk: '现金流与孤独感是最大约束', color: '#fb923c' },
  { id: 'sea2', label: '出海 2.0 操盘手', prob: 'A-', fit: 86,
    desc: '回到「中国供给 × 全球市场」的增长操盘位，但这次为自己或小团队而非大厂打。', risk: '红利不如上一波、需找新蓝海', color: '#e8a317' },
  { id: 'region', label: '区域产业 · 东北落子', prob: 'B', fit: 60,
    desc: '把一线/海外方法论嫁接到东北某个细分产业（文旅/农产品上行/本地服务），做区域操盘。', risk: '人才与资本半径稀薄、节奏慢', color: '#94a3b8' },
  { id: 'return', label: '回归平台 · 大厂出海线', prob: 'B', fit: 70,
    desc: '重新挂载大厂出海/AI 业务的确定性，换现金流与体系，暂存创业野心。', risk: '议价权随年龄与红利下行', color: '#c41e3a' },
];

// —— ⑬ 系统坐标：这片切片在全站的位置 ——
const SYSTEM_LINKS = [
  { to: '/modules/renqun-tupu', label: '人群画像总图谱', note: '回到母索引看全部切片' },
  { to: '/cognition', label: '康波周期', note: '个人节奏踩在长波的哪一段' },
  { to: '/middleincometrap', label: '中等收入陷阱', note: '个人天花板 × 国家天花板' },
  { to: '/econ-dashboard', label: '经济大盘', note: '出海退潮与红利收口的宏观底座' },
  { to: '/techtree', label: '科技图谱', note: 'AI 攻关与超级个体的技术前提' },
];

function eraOption() {
  return {
    legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 11 }, data: ['互联网渗透大势', 'APP 出海窗口热度'] },
    grid: { left: 36, right: 16, top: 30, bottom: 28 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ERA_YEARS, boundaryGap: false, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color }, axisTick: { show: false } },
    yAxis: { type: 'value', max: 100, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color }, splitLine: { lineStyle: { color: GRID_LINE.lineStyle.color } } },
    series: [
      { name: '互联网渗透大势', type: 'line', smooth: true, symbol: 'none', areaStyle: { color: '#22d3ee', opacity: 0.12 }, lineStyle: { width: 2, color: '#22d3ee' }, data: ERA_NET },
      { name: 'APP 出海窗口热度', type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 2, color: '#e8a317' }, data: ERA_GLOBAL,
        markLine: { silent: true, symbol: 'none', lineStyle: { color: 'rgba(148,163,184,0.4)', type: 'dashed' },
          label: { color: LABEL.color, fontSize: 9, formatter: (p) => p.data.label },
          data: ERA_MARKS.map((m) => ({ xAxis: m.year, label: { formatter: m.label } })) } },
    ],
  };
}

function trendQuadrantOption() {
  return {
    grid: { left: 48, right: 24, top: 24, bottom: 44 },
    tooltip: { trigger: 'item', formatter: (p) => `${p.data.name}<br/>趋势强度 ${p.value[0]} · 个人契合 ${p.value[1]}` },
    xAxis: { type: 'value', name: '趋势强度 →', min: 30, max: 100, nameTextStyle: { color: LABEL.color, fontSize: 10 }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color }, splitLine: { lineStyle: { color: GRID_LINE.lineStyle.color } } },
    yAxis: { type: 'value', name: '个人契合 →', min: 30, max: 100, nameTextStyle: { color: LABEL.color, fontSize: 10 }, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color }, splitLine: { lineStyle: { color: GRID_LINE.lineStyle.color } } },
    series: [{
      type: 'scatter',
      symbolSize: (v) => 14 + (v[0] + v[1]) / 12,
      label: { show: true, position: 'right', color: LABEL.color, fontSize: 10, formatter: (p) => p.data.name },
      data: TRENDS.map((t) => ({ name: t.name, value: [t.strength, t.fit], itemStyle: { color: t.color } })),
      markLine: { silent: true, symbol: 'none', lineStyle: { color: 'rgba(148,163,184,0.25)', type: 'dashed' }, data: [{ xAxis: 70 }, { yAxis: 65 }] },
    }],
  };
}

export default function Page() {
  const [stage, setStage] = useState(MIGRATION.length - 1); // 默认停在「回迁·长春」
  const [decIdx, setDecIdx] = useState(0);

  const [mapFull, setMapFull] = useState(false);
  const graphOpt = useMemo(() => migrationMapOption(false), []);
  const graphOptFull = useMemo(() => migrationMapOption(true), []);
  useEffect(() => {
    if (!mapFull) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMapFull(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mapFull]);
  const radarOpt = useMemo(radarOption, []);
  const divOpt = useMemo(dividendOption, []);
  const eraOpt = useMemo(eraOption, []);
  const trendOpt = useMemo(trendQuadrantOption, []);

  const LinkCard = ({ to, label, note }) => (
    <Link to={to} className="os-card p-3 block no-underline" style={{ borderLeft: '3px solid #22d3ee' }}>
      <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label} <span style={{ color: '#22d3ee' }}>↗</span></div>
      <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{note}</div>
    </Link>
  );
  const dec = DECISIONS[decIdx];

  return (
    <div>
      <PageHeader
        badge="私享切片 · GY-∞ · 不入公开图谱"
        title="李贺 / 独菽 / Hayden · 一个进程的迁移日志"
        subtitle="1992 东辽白泉镇 spawn · 高考换页江南 · 进京挂载互联网 · 出海东亚东南亚 · fork 一次创业 · 回迁长春"
      />
      <IntroCard>
        把自己也当成一片人群切片来读：一个 1992 年从东北小镇启动的进程，靠高考被全国调度网捕获，
        在北京挂载互联网内核，赶上出海红利窗口被分发到东亚与东南亚多个地域，又主动 fork 出一次 AI 创业，
        最后回迁到距出生地 32 公里的长春。本页用全站一致的「系统 / 调度」语言，给这条轨迹做一次冷静的自我标定——
        既看清十年攒下的资产，也直面 35 岁这次时钟中断里的迷茫与不适应。口径：本人自述 + 简历公开口径，自画像、仅自用。
      </IntroCard>

      <Grid cols={{ sm: 2, md: 4 }} className="mb-8">
        <Stat value="1992" label="启动年 · 东辽白泉镇" accent="#c41e3a" />
        <Stat value="7" label="迁居城市 · 含 5 国出海" accent="#22d3ee" />
        <Stat value="10年+" label="泛娱乐出海操盘" accent="#e8a317" />
        <Stat value="35" label="当前年龄 · 回迁长春" accent="#94a3b8" />
      </Grid>

      {/* ① 迁移日志 */}
      <Card title="① 迁移日志 · 一条被时代调度的轨迹">
        <TimelineBar stages={MIGRATION} activeIdx={stage} onSelect={setStage} />
      </Card>

      {/* ② 地理迁徙图 + 红利窗口 */}
      <Grid cols={{ sm: 1, lg: 2 }} className="mt-6">
        <Card title="② 地理迁徙轨迹 · 换页路径（真实地图）">
          <div className="os-chart-panel" style={{ position: 'relative', minHeight: 420 }}>
            <EChart option={graphOpt} style={{ height: '100%', minHeight: 420 }} />
            <button
              type="button"
              onClick={() => setMapFull(true)}
              title="全屏查看"
              className="mono text-xs"
              style={{ position: 'absolute', top: 6, right: 6, zIndex: 5, padding: '4px 10px', borderRadius: 6, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >⛶ 全屏</button>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
            红=出生地（白泉镇）· 青=当前（长春）· 金=途经枢纽。轨迹从东北原点经江南与京沪，扩散到东亚、东南亚乃至越洋的圣保罗，最后一条边又把半径收回长春。可滚轮缩放 / 拖动平移，点「全屏」展开。
          </p>
        </Card>
        <Card title="③ 红利窗口 vs 个人节奏 · 踩在浪上的十年">
          <div className="os-chart-panel" style={{ minHeight: 360 }}>
            <EChart option={divOpt} style={{ height: '100%', minHeight: 360 }} />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
            个人节奏几乎贴着出海红利大势爬升（2018–2021 同步见顶）；2022 窗口收口之后，势退而人未退——这正是回迁与迷茫的时间起点。（示意标定）
          </p>
        </Card>
      </Grid>

      {/* ④ 多维定位雷达 */}
      <Card title="④ 多维定位 · 出海峰值期 vs 回迁创业期" className="mt-6">
        <div className="os-chart-row">
          <div className="os-chart-panel" style={{ minHeight: 380 }}>
            <EChart option={radarOpt} style={{ height: '100%', minHeight: 380 }} />
          </div>
          <p className="text-xs m-0" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          同一个进程，两个版本：出海期地域跨度/红利/规模拉满、风险敞口低；回迁创业期规模与红利收缩、风险敞口陡升，
          国际化的底子还在，但「本地适应」成了新的短板维度。（自评示意）
          </p>
        </div>
      </Card>

      {/* ⑤ 能力栈 */}
      <Card title="⑤ 能力栈 · 十年攒下的资产" className="mt-6">
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span key={s} className="text-xs mono px-3 py-1.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>{s}</span>
          ))}
        </div>
      </Card>

      {/* ⑥ 履历锚点 */}
      <Card title="⑥ 履历锚点 · 公开战绩" className="mt-6">
        <div className="space-y-2">
          {CAREER.map((c) => (
            <div key={c.co} className="os-card p-4" style={{ borderLeft: `3px solid ${c.color}` }}>
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.co}</span>
                <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{c.span}</span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: c.color }}>{c.role}</div>
              <div className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{c.win}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ⑦ 35 岁的系统张力 */}
      <div className="mt-6">
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>⑦ 35 岁的系统张力 · 迷茫的结构</h3>
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          迷茫不是软弱，是几股力在同一时刻拉扯：窗口的不可重放、地域的错配、时钟的中断。把它拆开看，至少不再是一团模糊的焦虑。
        </p>
        <FrameworkTrio cards={TENSIONS} />
      </div>

      {/* ⑧ 时代背景 */}
      <Card title="⑧ 时代背景 · 出生即抽签" className="mt-6">
        <EChart option={eraOpt} style={{ height: 340 }} />
        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{ERA_NOTE}</p>
      </Card>

      {/* ⑨ 个人选择 · 分叉与反事实 */}
      <Card title="⑨ 个人选择 · 关键分叉与反事实" className="mt-6">
        <SelectorBar
          items={DECISIONS.map((d) => ({ key: d.id, label: d.node, accent: d.color }))}
          activeKey={dec.id}
          onSelect={(k) => setDecIdx(DECISIONS.findIndex((d) => d.id === k))}
        />
        <div className="os-card p-4 mt-3" style={{ borderLeft: `3px solid ${dec.color}` }}>
          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{dec.node}</div>
          <div className="grid md:grid-cols-3 gap-3 mt-3">
            <div>
              <div className="text-[11px] mono mb-1" style={{ color: dec.color }}>实际选择</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{dec.taken}<br /><span style={{ color: 'var(--text-tertiary)' }}>· {dec.why}</span></div>
            </div>
            <div className="md:col-span-2">
              <div className="text-[11px] mono mb-1" style={{ color: '#94a3b8' }}>反事实 · 没走的那条路</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{dec.counter}</div>
            </div>
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          每一次分叉都不是「对错」，是「在当时的约束下选了哪条」。路径依赖让早年的次优选择（日语/出海）后来变成了独特凭证——这正是个人进程里最像「制度」的部分。
        </p>
      </Card>

      {/* ⑩ 代际与东北坐标 */}
      <Grid cols={{ sm: 1, lg: 2 }} className="mt-6">
        <Card title="⑩ 代际坐标 · 1992 的世代签">
          <div className="space-y-2">
            {GENERATION.map(([t, d]) => (
              <div key={t} className="os-card p-3">
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
          <div className="text-[11px] mono mt-3 mb-2" style={{ color: 'var(--text-tertiary)' }}>同代切片 · 横向比对</div>
          <div className="grid grid-cols-2 gap-2">
            {SLICE_LINKS.map((l) => <LinkCard key={l.to} {...l} />)}
          </div>
        </Card>
        <Card title="⑪ 东北性 · 离开与回来">
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.85 }}>{NORTHEAST.text}</p>
          <div className="text-[11px] mono mt-3 mb-2" style={{ color: 'var(--text-tertiary)' }}>区域底座 · 把个人放回数据里</div>
          <div className="space-y-2">
            {NORTHEAST.links.map((l) => <LinkCard key={l.to} {...l} />)}
          </div>
        </Card>
      </Grid>

      {/* ⑫ 未来趋势 · 趋势×禀赋象限 */}
      <Card title="⑫ 未来趋势 · 趋势强度 × 个人契合度" className="mt-6">
        <EChart option={trendOpt} style={{ height: 400 }} />
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{TREND_NOTE}</p>
      </Card>

      {/* ⑬ 未来路径 · 35→45 的 fork */}
      <Card title="⑬ 未来路径 · 35 → 45 的几种 fork" className="mt-6">
        <div className="grid md:grid-cols-2 gap-3">
          {PATHS.map((p) => (
            <div key={p.id} className="os-card p-4" style={{ borderLeft: `3px solid ${p.color}` }}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                <span className="text-[11px] mono" style={{ color: p.color }}>可能性 {p.prob} · 契合 {p.fit}</span>
              </div>
              <div className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{p.desc}</div>
              <div className="text-[11px] mt-1.5" style={{ color: '#c41e3a' }}>风险：{p.risk}</div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          没有标准答案——四条路按「个人契合度 × 趋势强度」排序，超级个体与出海 2.0 在前。35 岁的优势是：第一次可以不为时钟、只为自己的禀赋曲线选择 fork。（情景示意，非承诺）
        </p>
      </Card>

      {/* ⑭ 系统坐标 · 横向打通 */}
      <Card title="⑭ 系统坐标 · 这片切片在全站的位置" className="mt-6">
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
          一个人不是孤立的进程：把自己接回康波长波、中等收入天花板、出海退潮的宏观底座，迷茫才有了可被定位的坐标系。
        </p>
        <div className="grid md:grid-cols-3 gap-2">
          {SYSTEM_LINKS.map((l) => <LinkCard key={l.to} {...l} />)}
        </div>
      </Card>

      {/* ⑮ 人生路径推演器（旗舰交互） */}
      <div className="mt-6"><SectionSimulator /></div>

      {/* ㉑ 山海造物 · 副业实体（推演器「AI超级个体/东北落子」的现实落子） */}
      <div className="mt-6"><SectionShanhai /></div>

      {/* ⑯ 能力资产负债表 */}
      <div className="mt-6"><SectionBalance /></div>

      {/* ⑰ 反脆弱杠铃 */}
      <div className="mt-6"><SectionAntifragile /></div>

      {/* ⑱ 价值观与驱动力 */}
      <div className="mt-6"><SectionValues /></div>

      {/* ⑲ 风险地图 */}
      <div className="mt-6"><SectionRisk /></div>

      {/* ⑳ 个人操作系统 · 决策原则 */}
      <div className="mt-6"><SectionPrinciples /></div>

      {/* ㉒ 人生决策框架 · 养老/医疗/教育/储蓄（收尾） */}
      <div className="mt-6"><SectionLifePlan /></div>

      {/* 地图全屏覆盖层（Portal 到 body，规避祖先 transform 对 fixed 的限制）*/}
      {mapFull && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}
          role="dialog"
          aria-label="地理迁徙轨迹 · 全屏"
        >
          <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid var(--border-subtle)', flex: '0 0 auto' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>② 地理迁徙轨迹 · 全屏 <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>· 滚轮缩放 / 拖动平移</span></span>
            <button
              type="button"
              onClick={() => setMapFull(false)}
              className="mono text-xs"
              style={{ padding: '5px 12px', borderRadius: 6, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >✕ 退出全屏 (Esc)</button>
          </div>
          <div style={{ flex: '1 1 auto', minHeight: 0 }}>
            <EChart option={graphOptFull} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>,
        document.body,
      )}

      <ModuleFooter
        moduleId="haydenSlice"
        disclaimer="私享自画像 · 本人自述与简历公开口径 · 仅自用，非任何机构人事评价"
        sourceNote="数据锚点：个人简历（2026-01）· 迁徙/红利/雷达/趋势/路径/推演为本人自评示意标定，非预测、非承诺"
      />
    </div>
  );
}
