import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 一、战略板块数据（八大区域战略 · 示意值）
// ---------------------------------------------------------------------------
const STRATEGIES = [
  {
    key: 'jjj', label: '京津冀', accent: '#c41e3a',
    position: '政治中枢减负工程 · 首都功能疏解',
    gdp: '~10.4 万亿', pop: '~1.1 亿', gdpShare: 8.3, popShare: 7.8,
    engine: '北京（科创+总部）→ 雄安（疏解承接）→ 天津/河北（制造与港口）',
    weakness: '河北断崖：京津虹吸三十年，河北人均 GDP 不足北京 1/3；产业落差大于长三角任何省际边界。',
    synergy: [68, 55, 82, 52, 70, 75],
    note: '京津冀的本质不是经济区，而是政治地理工程：用空间手段为首都减压，用行政力量再造一个「平替核心」（雄安）。市场自发集聚与行政疏解方向相反，是其根本张力。',
  },
  {
    key: 'csj', label: '长三角', accent: '#22d3ee',
    position: '体系最完整的经济引擎 · 一体化示范',
    gdp: '~30.5 万亿', pop: '~2.4 亿', gdpShare: 24.4, popShare: 16.7,
    engine: '上海（金融+开放门户）+ 苏州/杭州/合肥（制造/数字/科创三角）',
    weakness: '行政边界仍切割要素：医保结算、轨交制式、产业招商竞争在示范区内尚未完全拉平。',
    synergy: [92, 88, 90, 80, 78, 88],
    note: '长三角是中国最接近「功能性经济区」的板块——三省一市产业互补真实存在，G60 走廊与示范区是制度试验田。它回答的问题是：行政区经济能否被市场经济溶解。',
  },
  {
    key: 'dwq', label: '大湾区', accent: '#e8a317',
    position: '一国两制下的制度接口 · 外向门户',
    gdp: '~14 万亿', pop: '~8700 万', gdpShare: 11.2, popShare: 6.2,
    engine: '深圳（科创硬件）+ 广州（商贸枢纽）+ 香港（离岸金融与法域接口）',
    weakness: '三套法律、三种货币、两种关税区——制度落差既是套利空间也是协同摩擦；香港角色再定位未完成。',
    synergy: [88, 72, 85, 60, 65, 90],
    note: '大湾区是唯一内嵌「制度断层线」的城市群：要素跨境流动本身就是政治议题。其试验意义在于测试一国之内多法域能否形成统一要素市场。',
  },
  {
    key: 'cy', label: '成渝双圈', accent: '#a78bfa',
    position: '第四极叙事 · 战略腹地与备份基地',
    gdp: '~8.2 万亿', pop: '~9800 万', gdpShare: 6.5, popShare: 7.0,
    engine: '成都（消费+电子信息）/ 重庆（汽车+笔电制造）双核相向发展',
    weakness: '双核中间塌陷：成渝主轴沿线缺乏次级强市，「哑铃结构」导致辐射断档；人均水平距东部仍有代差。',
    synergy: [72, 68, 78, 65, 72, 70],
    note: '成渝被赋予「第四极」与产业备份双重使命——在外部脱钩风险下，向西纵深的制造与算力布局带有明确的安全冗余逻辑，而非纯市场选择。',
  },
  {
    key: 'cjjjd', label: '长江经济带', accent: '#10b981',
    position: '横贯东中西的流域轴线 · 生态优先',
    gdp: '~58 万亿', pop: '~6 亿', gdpShare: 46.5, popShare: 42.9,
    engine: '黄金水道 + 沿江产业梯度转移（上海→武汉→重庆三段式）',
    weakness: '「共抓大保护、不搞大开发」将生态约束置于增长之前，沿江化工带搬迁成本由地方承担。',
    synergy: [78, 75, 82, 62, 85, 68],
    note: '长江经济带是流域治理对行政区划的覆盖：11 省市被一条生态红线串联。它标志区域政策从「给政策」转向「立规矩」——负面清单成为主要治理工具。',
  },
  {
    key: 'hh', label: '黄河流域', accent: '#f97316',
    position: '生态屏障 + 能源粮食安全带',
    gdp: '~32 万亿', pop: '~4.2 亿', gdpShare: 25.6, popShare: 30.0,
    engine: '能源金三角（蒙陕宁）+ 中原粮仓 + 山东龙头出海口',
    weakness: '水资源刚性约束（人均水资源不足全国均值 1/4 的省份连片），增长模式高度倚重资源与重化工。',
    synergy: [58, 52, 68, 55, 80, 60],
    note: '黄河战略的关键词是「约束」而非「开发」：以水定城、以水定产。它是为国家安全底座（能源、粮食、生态）定价的区域战略，增长目标天然让位于安全目标。',
  },
  {
    key: 'db', label: '东北振兴', accent: '#64748b',
    position: '老工业基地 · 粮食与装备双安全底牌',
    gdp: '~6 万亿', pop: '~9500 万', gdpShare: 4.8, popShare: 6.8,
    engine: '装备制造（沈阳/大连/哈尔滨）+ 商品粮基地（占全国调出量 1/3 量级）',
    weakness: '人口净流出 + 体制成本：央企占比高、市场化程度低，二十年三轮振兴政策未能逆转份额下滑。',
    synergy: [55, 45, 70, 60, 68, 50],
    note: '东北是计划经济遗产最重的板块，也是「政策无法替代制度」的样本：转移支付维持了财政与社保运转，却未能再造增长引擎。其战略价值正从经济极重新锚定为安全极。',
  },
  {
    key: 'zb', label: '中部崛起', accent: '#06b6d4',
    position: '承东启西的腹地枢纽 · 产业备份带',
    gdp: '~27 万亿', pop: '~3.6 亿', gdpShare: 21.6, popShare: 25.7,
    engine: '武汉/长沙/郑州/合肥四核 + 米字型高铁网 + 沿海产业内迁承接',
    weakness: '六省内部分化加剧：合肥武汉跻身科创第二梯队，而部分省份仍依赖劳务输出与土地财政。',
    synergy: [75, 78, 85, 68, 70, 72],
    note: '中部是统一大市场叙事的最大受益者：物流地理使其成为内循环的物理枢纽。沿海产能内迁不是自然外溢，而是成本曲线、产业政策与安全考量三重力的合成。',
  },
];

const SYNERGY_DIMS = ['产业互补', '要素流动', '基建联通', '公共服务均等', '生态共治', '机制创新'];

// ---------------------------------------------------------------------------
// 二、四大板块对比（示意）
// ---------------------------------------------------------------------------
const plateCompareOpt = stackedBarOpt({
  categories: ['GDP 占比 %', '人口占比 %', '一般公共预算收入占比 %', '上市公司数占比 %'],
  series: [
    { name: '东部', data: [52, 40, 58, 70], itemStyle: { color: '#c41e3a' } },
    { name: '中部', data: [22, 26, 18, 13], itemStyle: { color: '#22d3ee' } },
    { name: '西部', data: [21, 27, 18, 12], itemStyle: { color: '#e8a317' } },
    { name: '东北', data: [5, 7, 6, 5], itemStyle: { color: '#10b981' } },
  ],
});

const perCapitaOpt = {
  tooltip: { trigger: 'axis' },
  grid: GRID,
  xAxis: categoryX(['东部', '中部', '西部', '东北']),
  yAxis: valueY({ axisLabel: { formatter: '{value} 万' } }),
  series: [{
    type: 'bar', barWidth: 32,
    data: [
      { value: 11.8, itemStyle: { color: '#c41e3a', borderRadius: 4 } },
      { value: 7.5, itemStyle: { color: '#22d3ee', borderRadius: 4 } },
      { value: 7.1, itemStyle: { color: '#e8a317', borderRadius: 4 } },
      { value: 6.3, itemStyle: { color: '#10b981', borderRadius: 4 } },
    ],
    label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10, formatter: '{c} 万' },
  }],
};

// 四大板块 GDP 占比演进（保留原堆叠图骨架，扩展年份）
const gdpStack = {
  grid: { left: 40, right: 16, top: 32, bottom: 24 },
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
  xAxis: categoryX(['2000', '2005', '2010', '2015', '2020', '2024']),
  yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  series: [
    { name: '东部', type: 'line', stack: 'gdp', smooth: true, symbol: 'none', data: [53, 56, 55, 53, 51, 52], lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.25)' } },
    { name: '中部', type: 'line', stack: 'gdp', smooth: true, symbol: 'none', data: [20, 19, 19, 21, 22, 22], lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.2)' } },
    { name: '西部', type: 'line', stack: 'gdp', smooth: true, symbol: 'none', data: [17, 17, 18, 19, 21, 21], lineStyle: { color: '#e8a317' }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.2)' } },
    { name: '东北', type: 'line', stack: 'gdp', smooth: true, symbol: 'none', data: [10, 8, 8, 7, 6, 5], lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.2)' } },
  ],
};

// ---------------------------------------------------------------------------
// 三、南北 / 东西差距演进（示意）
// ---------------------------------------------------------------------------
const northSouthOpt = {
  tooltip: { trigger: 'axis' },
  grid: { left: 44, right: 16, top: 32, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
  xAxis: categoryX(['2000', '2005', '2010', '2013', '2016', '2019', '2022', '2024']),
  yAxis: valueY({ min: 30, max: 70, axisLabel: { formatter: '{value}%' } }),
  series: [
    { name: '南方 GDP 占比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [57.4, 57.0, 57.2, 57.8, 59.5, 62.0, 64.4, 65.0], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
    { name: '北方 GDP 占比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [42.6, 43.0, 42.8, 42.2, 40.5, 38.0, 35.6, 35.0], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    {
      name: '南北差值', type: 'line', smooth: true, symbol: 'none',
      data: [14.8, 14.0, 14.4, 15.6, 19.0, 24.0, 28.8, 30.0],
      lineStyle: { color: '#e8a317', width: 1.5, type: 'dashed' }, itemStyle: { color: '#e8a317' },
    },
  ],
};

// ---------------------------------------------------------------------------
// 四、转移支付（示意）
// ---------------------------------------------------------------------------
const transferScaleOpt = {
  tooltip: { trigger: 'axis' },
  grid: { left: 48, right: 16, top: 32, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
  xAxis: categoryX(['2012', '2015', '2018', '2020', '2022', '2024', '2025E']),
  yAxis: valueY({ axisLabel: { formatter: '{value} 万亿' } }),
  series: [
    { name: '中央对地方转移支付', type: 'bar', barWidth: 18, data: [4.0, 5.5, 7.0, 8.3, 9.7, 10.2, 10.3], itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
    { name: '占地方一般预算支出比重(右轴示意%)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [3.7, 3.7, 3.7, 3.9, 4.3, 4.2, 4.1], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
  ],
};

const fiscalFlowOpt = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (ps) => ps.map((p) => `${p.name}: ${p.value > 0 ? '+' : ''}${p.value} 千亿（示意）`).join('<br/>') },
  grid: { left: 60, right: 36, top: 16, bottom: 24 },
  xAxis: valueY({ axisLabel: { formatter: '{value}' } }),
  yAxis: { type: 'category', data: ['黑龙江', '甘肃', '广西', '河南', '四川', '辽宁', '山东', '江苏', '浙江', '北京', '上海', '广东'].reverse(), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
  series: [{
    type: 'bar', barWidth: 12,
    data: [9.5, 8.0, 5.5, 4.0, 3.0, 2.5, -1.5, -5.0, -5.5, -6.0, -8.0, -10.0].reverse().map((v) => ({
      value: v,
      itemStyle: { color: v > 0 ? '#e8a317' : '#22d3ee', borderRadius: v > 0 ? [0, 3, 3, 0] : [3, 0, 0, 3] },
    })),
    label: { show: true, position: 'right', color: '#93a1b5', fontSize: 9, formatter: ({ value }) => (value > 0 ? `+${value}` : `${value}`) },
  }],
};

// ---------------------------------------------------------------------------
// 五、城市群层级（示意）
// ---------------------------------------------------------------------------
const clusterDonut = donutOpt([
  { value: 32, name: '5 个优化提升级（京津冀/长三角/珠三角/成渝/长江中游）', itemStyle: { color: '#c41e3a' } },
  { value: 24, name: '5 个发展壮大级（山东半岛/粤闽浙/中原/关中/北部湾）', itemStyle: { color: '#22d3ee' } },
  { value: 18, name: '9 个培育发展级（哈长/辽中南/兰西等）', itemStyle: { color: '#e8a317' } },
  { value: 26, name: '城市群之外的国土（人口稀疏区/生态功能区）', itemStyle: { color: '#475569' } },
]);

const metroBarOpt = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 64, right: 36, top: 16, bottom: 24 },
  xAxis: valueY(),
  yAxis: { type: 'category', data: ['西安', '成都', '重庆', '武汉', '郑州', '长株潭', '南京', '福州', '深圳', '广州'].reverse(), axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
  series: [{
    type: 'bar', barWidth: 10,
    data: [1.3, 2.7, 2.0, 1.8, 1.6, 1.7, 2.3, 1.2, 3.5, 3.0].reverse(),
    itemStyle: { color: '#22d3ee', borderRadius: [0, 3, 3, 0] },
    label: { show: true, position: 'right', color: '#93a1b5', fontSize: 9, formatter: '{c} 万亿' },
  }],
};

// 常住人口城镇化分层（保留原图）
const urbanBar = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: categoryX(['户籍城镇化', '城区人口', '都市圈', '县域载体'], { fontSize: 11 }),
  yAxis: valueY({ min: 55, max: 70, axisLabel: { formatter: '{value}%' } }),
  series: [{ type: 'bar', data: [60.2, 63.9, 65.2, 66.2], barWidth: 28, itemStyle: { color: '#22d3ee', borderRadius: 4 }, label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10, formatter: '{c}%' } }],
};

// ---------------------------------------------------------------------------
// 六、区域战略时间线
// ---------------------------------------------------------------------------
const TIMELINE = [
  { period: '1979–1999', title: '沿海率先 · 梯度让利', accent: '#c41e3a', desc: '「让一部分地区先富起来」：特区—开放城市—沿海开放带的梯度让利，财政包干强化地方动力，也埋下东西差距与诸侯经济的种子。区域政策此时是增长政策的空间投影。' },
  { period: '2000–2012', title: '三大补偿性战略', accent: '#e8a317', desc: '西部大开发（2000）、东北振兴（2003）、中部崛起（2006）相继出台——对先富战略的政治补偿。转移支付规模快速扩张，西气东输/西电东送把西部锁定为东部的能源腹地。' },
  { period: '2014–2019', title: '区域重大战略', accent: '#22d3ee', desc: '京津冀协同、长江经济带、粤港澳大湾区、长三角一体化、黄河流域——政策单元从「板块」细化为「功能区」，从给优惠转向立规则，城市群与都市圈成为承载主体。' },
  { period: '2017–2021', title: '主体功能区定型', accent: '#10b981', desc: '国土空间被划入优化开发/重点开发/限制开发/禁止开发四类：生态功能区放弃 GDP 考核、换取转移支付。这是对「每个县都要工业化」模式的制度性否定。' },
  { period: '2022–', title: '全国统一大市场', accent: '#a78bfa', desc: '公平竞争审查、招投标统一、要素市场化配置——矛头指向地方保护与「诸侯经济」。区域协调的终局命题浮出：在维持地方竞争活力的同时拆除其壁垒工具箱。' },
  { period: '2026–', title: '十五五开局 · 空间再定价', accent: '#c41e3a', desc: '规划纲要审议后，区域政策从「给项目」转向「给规则+给账本」：统一大市场执行、转移支付与生态补偿挂钩、城市群承载新质生产力集群。收支倒挂省份的财政重整进入前台。' },
];

// ---------------------------------------------------------------------------
// 七、板块定位卡（保留并沿用）
// ---------------------------------------------------------------------------
const plates = [
  ['东部沿海发展带', '龙头牵引 · 新质生产力集群', '外向型经济、数字与新质产业集群密集，承担全要素生产率与全球价值链攀升主阵地；财政与金融资源集聚度高，外溢效应显著。研发强度 3.5%+（示意）。', '#c41e3a'],
  ['中部崛起板块', '承东启西 · 先进制造与物流', '制造业梯度转移与综合交通枢纽叠加，内需市场纵深大；在统一大市场下承担产业链备份与区域均衡器角色。研发强度 2.8%+（示意）。', '#22d3ee'],
  ['西部大开发', '战略纵深 · 能源与陆路开放', '能源、矿产与生态屏障功能突出，清洁能源基地与陆海新通道重塑内陆开放几何；约束在生态红线与投融资效率。研发强度 2.1%+（示意）。', '#e8a317'],
  ['东北全面振兴', '老工业基地 · 产业与粮食双安全', '装备制造与粮食安全双底牌，人口流出与债务历史包袱并存；产业升级与东北亚合作窗口构成长期变量。研发强度 2.4%+（示意）。', '#10b981'],
];

// ===========================================================================
export default function Page() {
  const [stratKey, setStratKey] = useState('csj');
  const [stageIdx, setStageIdx] = useState(4);
  const strat = useMemo(() => STRATEGIES.find((s) => s.key === stratKey) || STRATEGIES[0], [stratKey]);

  const synergyRadar = useMemo(
    () => radarOpt(SYNERGY_DIMS, strat.synergy, { name: strat.label, color: strat.accent }),
    [strat],
  );

  const shareCompareOpt = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 44, right: 16, top: 20, bottom: 24 },
    xAxis: categoryX(['GDP 占全国 %', '人口占全国 %']),
    yAxis: valueY({ max: 50, axisLabel: { formatter: '{value}%' } }),
    series: [{
      type: 'bar', barWidth: 48,
      data: [
        { value: strat.gdpShare, itemStyle: { color: strat.accent, borderRadius: 4 } },
        { value: strat.popShare, itemStyle: { color: '#475569', borderRadius: 4 } },
      ],
      label: { show: true, position: 'top', color: '#93a1b5', fontSize: 11, formatter: '{c}%' },
    }],
  }), [strat]);

  return (
    <div>
      <PageHeader badge="Regional · 区域协调" title="四大板块 · 区域重大战略 · 转移支付的空间政治" subtitle="东中西东北 / 南升北降 / 财政再分配 —— 从梯度让利到统一大市场的空间重组" />
      <IntroCard>区域协调不是地理问题，而是政治经济问题：谁集聚要素、谁守护底线、谁补贴谁。改革开放以梯度让利启动沿海，再以三大补偿性战略与逐年扩张的转移支付对冲分化；当下的统一大市场，则试图在不熄灭地方竞争引擎的前提下拆除其保护主义工具箱。本页以四大板块、八大战略、转移支付流向与城市群层级四个切面，呈现这套空间再分配机器的运行逻辑。数值均为示意。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="4 + 5" label="四大板块 + 五大区域重大战略" accent="#c41e3a" />
        <Stat value="19 个" label="国家级城市群（三档梯度）" accent="#22d3ee" />
        <Stat value="~10.5 万亿" label="转移支付/年 (2025 · 示意)" accent="#e8a317" />
        <Stat value="66 : 34" label="南北 GDP 占比 (2025 · 示意)" accent="#10b981" />
      </Grid>

      <Grid cols={3} className="mb-6">
        {[['十五五区域命题', '统一大市场从「立规矩」进入「拆壁垒」执行期 · 要素市场化配置改革提速', '#a78bfa'],
          ['城市群 GDP', '19 城市群占 GDP ~90% · 长三角/粤港澳/京津冀三极占 ~40%', '#22d3ee'],
          ['收支倒挂带', '东北/部分中西部省份广义收支缺口仍依赖转移支付 · 见重构河山财政沙盘', '#c41e3a']].map(([t, d, c]) => (
          <div key={t} className="os-card p-4" style={{ borderLeft: `3px solid ${c}` }}>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
          </div>
        ))}
      </Grid>

      {/* ============ 战略板块选择器 ============ */}
      <Card title="区域重大战略切片 · 点选切换（示意）" className="mb-6">
        <SelectorBar items={STRATEGIES} activeKey={stratKey} onSelect={setStratKey} />
        <div className="os-card p-5 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${strat.accent}` }}>
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <span className="text-base font-semibold" style={{ color: strat.accent }}>{strat.label}</span>
            <span className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>{strat.position}</span>
          </div>
          <Grid cols={4} className="mb-3">
            <div><div className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>GDP 规模（示意）</div><div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{strat.gdp}</div></div>
            <div><div className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>常住人口（示意）</div><div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{strat.pop}</div></div>
            <div><div className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>GDP 占全国</div><div className="text-sm font-semibold" style={{ color: strat.accent }}>{strat.gdpShare}%</div></div>
            <div><div className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>人口占全国</div><div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{strat.popShare}%</div></div>
          </Grid>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>核心引擎</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{strat.engine}</p>
            </div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>结构性短板</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{strat.weakness}</p>
            </div>
          </div>
        </div>
        <Grid cols={2}>
          <div>
            <div className="text-xs mb-1 mono" style={{ color: 'var(--text-tertiary)' }}>区域协同六维评估（产业/要素/基建/公共服务/生态/机制 · 示意得分）</div>
            <EChart option={synergyRadar} style={{ height: 240 }} />
          </div>
          <div>
            <div className="text-xs mb-1 mono" style={{ color: 'var(--text-tertiary)' }}>经济密度：GDP 占比 vs 人口占比（差值即「虹吸度」）</div>
            <EChart option={shareCompareOpt} style={{ height: 240 }} />
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{strat.note}</p>
          </div>
        </Grid>
      </Card>

      {/* ============ 四大板块对比 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="四大板块 GDP 占比演进（2000–2024 · 堆叠 · 示意）"><EChart option={gdpStack} style={{ height: 260 }} /></Card>
        <Card title="四大板块资源占比对比（GDP/人口/财政/上市公司 · 示意）"><EChart option={plateCompareOpt} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="四大板块人均 GDP（万元 · 示意）：差距是梯度，也是势能">
          <EChart option={perCapitaOpt} style={{ height: 230 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>东部人均约为东北 1.9 倍（示意）。差距在统计上收敛缓慢，但在功能上被重新解释：低成本腹地是产业梯度转移的接收端，差距本身构成转移的经济动力。</p>
        </Card>
        <Card title="南北分野：GDP 占比演进（2000–2024 · 示意）">
          <EChart option={northSouthOpt} style={{ height: 230 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>「南升北降」自 2013 年前后加速：能源与重化工周期退潮、民营经济密度差、港口与产业链地理共同作用。东西差距靠转移支付对冲，南北差距尚无对应政策工具——这是区域格局中最缺乏制度回应的一条裂缝。</p>
        </Card>
      </Grid>

      {/* ============ 转移支付 ============ */}
      <Card title="转移支付 · 财政再分配的空间政治（示意）" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>转移支付是区域协调的真实引擎：约 10 万亿/年的纵向再分配，维持中西部与东北的财政运转、边疆稳定与粮食主产区的种粮意愿。少数省份净上缴、多数省份净受益的格局，本质是发达地区为国家整体性付费——空间版的「先富带后富」，由财政部执行。</p>
        <Grid cols={2}>
          <div>
            <div className="text-xs mb-1 mono" style={{ color: 'var(--text-tertiary)' }}>中央对地方转移支付规模（万亿元 · 示意）</div>
            <EChart option={transferScaleOpt} style={{ height: 240 }} />
          </div>
          <div>
            <div className="text-xs mb-1 mono" style={{ color: 'var(--text-tertiary)' }}>省级财政净流向（+净受益 / −净上缴 · 千亿级 · 高度示意）</div>
            <EChart option={fiscalFlowOpt} style={{ height: 240 }} />
          </div>
        </Grid>
        <Grid cols={3} className="mt-4">
          {[['维稳边疆', '新疆/西藏/甘肃等人均转移支付远超全国均值——财政是比驻军更日常的国家在场方式。', '#e8a317'],
            ['补偿粮区', '产粮大省往往是财政穷省：粮食安全的成本由主产区承担、由转移支付部分回补，利益补偿机制仍在完善。', '#10b981'],
            ['托底社保', '东北等老龄化先行区依赖养老金全国统筹调剂——代际账本与区域账本在此合流。', '#22d3ee']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ============ 城市群层级 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="19 个国家级城市群三档梯度（经济体量占比 · 示意）">
          <EChart option={clusterDonut} style={{ height: 250 }} />
        </Card>
        <Card title="国家级都市圈 GDP 体量（万亿 · 部分 · 示意）">
          <EChart option={metroBarOpt} style={{ height: 250 }} />
        </Card>
      </Grid>

      {/* ============ 板块定位 ============ */}
      <Card title="四大板块对比 · 定位与约束" className="mb-6">
        <Grid cols={4}>
          {plates.map(([t, tag, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <div className="text-[10px] mt-0.5 mono" style={{ color: c }}>{tag}</div>
              <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ============ 时间线 ============ */}
      <Card title="区域战略演进 · 五个阶段（点选展开）" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ============ 统一大市场 / 城镇化 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="统一大市场的三条政策杠杆">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>反垄断与公平竞争审查、政府采购与招投标统一、要素市场化配置改革共同压缩「本地偏好」空间。</p>
          <div className="space-y-2">
            {[['公平竞争', '破除显性与隐性壁垒，降低跨区域投资的制度不确定性。', '#10b981'],
              ['要素流动', '户籍、土地、数据与资本定价机制联动，提高配置效率。', '#22d3ee'],
              ['财税激励校正', '弱化单纯以 GDP 论英雄的扩张冲动，向质量与协同倾斜。', '#e8a317']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
        <Card title="常住人口城镇化分层指标（2018–2024 · 示意）"><EChart option={urbanBar} style={{ height: 230 }} /></Card>
      </Grid>

      <Card title="人口与产业的再布局" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>城市群与都市圈承载主要增量；县域与乡村振兴承接返乡与县域消费，形成多层级空间结构。</p>
        <Grid cols={2}>
          {[['集聚 · 城市群', '核心城市研发与高端服务密度继续上升，全国一体化进程在规则统一、数据互通、劳动力流动维度推进最快（示意得分 88–95）。', '#c41e3a'],
            ['下沉 · 县域', '县域基础设施与公共服务补短板释放内需，承接产业梯度转移与返乡人口，是统一大市场的「毛细血管」。', '#22d3ee']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="调研要点 · 三个结构性张力" className="mb-6">
        <Grid cols={3}>
          {[['1 · 省际差距', '人均 GDP 与财政收入仍呈梯度，转移支付与生态补偿需精准挂钩，对口支援与飞地经济是省际协作的两类工具。'],
            ['2 · 产业同构', '部分省份在新能源、半导体等领域存在低水平重复招商风险，统一大市场的公平竞争审查正是对冲机制。'],
            ['3 · 开放节点', '自贸港、自贸试验区与边境口岸构成「受控开放」的多层接口，区域韧性依赖财政缓冲与产业多元（示意得分 85–95）。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="系统观察" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>区域政策的终局不是齐步走，而是分工定价：东部为创新与税基定价，中西部为腹地与能源定价，东北与边疆为安全与粮食定价——转移支付是这张分工契约的年度结算单。统一大市场若成，竞争将从「抢企业」转向「拼规则」；若不成，每一轮产业风口仍会复制一遍三十个省的重复建设。空间格局的下一变量，是人口负增长下「收缩地区」如何体面退出增长锦标赛。</p>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '梯度发展', subtitle: '先富带后富 · 空间版', body: '让一部分地区先富的本质是国家有意制造空间不平衡换取总量速度，再以政治承诺锁定「后富」期权——四大板块战略即其分期兑付。' },
        { key: 'stone', title: '转移支付', subtitle: '纵向再分配 · 维稳底盘', body: '约 10 万亿/年的财政再分配维系边疆、粮区与老工业基地的国家在场；它买得来稳定与忠诚，买不来内生增长——这是其结构性上限。' },
        { key: 'path', title: '统一大市场', subtitle: '拆诸侯 · 立规则', body: '从给政策到立规矩：公平竞争审查瞄准地方保护工具箱。空间整合的最终考题，是在拆除壁垒的同时保住地方政府的发展积极性。' },
      ]} />
      <ModuleFooter moduleId="regional" disclaimer="公开资料整理 · 全部数值为量级示意非统计口径 · 仅供空间政治经济分析框架参考，非投资建议" />
    </div>
  );
}
