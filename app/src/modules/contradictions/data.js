// ============================================================================
// 矛盾论 · 社会矛盾体结构化数据
// asOf: 2026-07-14 · 公开资料示意，非官方统计
// ============================================================================

import { categoryX, valueY, GRID, LEGEND, radarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

export const AS_OF = AS_OF_BASELINE;

/** 全局仪表盘 · 四张示意趋势图 */
export const DASHBOARD_CHARTS = {
  urbanRuralRatio: {
    title: '城乡人均可支配收入比 · 示意',
    build: () => ({
      grid: GRID,
      tooltip: { trigger: 'axis' },
      xAxis: categoryX(['2000', '2005', '2010', '2015', '2020', '2025E']),
      yAxis: valueY({ name: '倍', min: 2, max: 3.5 }),
      series: [{
        type: 'line', smooth: true, data: [2.79, 2.57, 2.42, 2.38, 2.56, 2.48],
        lineStyle: { color: '#22d3ee', width: 2 },
        areaStyle: { color: 'rgba(34,211,238,0.08)' },
        markLine: { silent: true, data: [{ yAxis: 2.5, label: { formatter: '均衡参考 2.5', color: LABEL.color }, lineStyle: { color: '#e8a317', type: 'dashed' } }] },
      }],
    }),
  },
  regionalGdp: {
    title: '人均 GDP 梯度 · 四大板块示意（万元）',
    build: () => ({
      grid: { left: 72, right: 16, top: 16, bottom: 24 },
      tooltip: { trigger: 'axis' },
      xAxis: valueY({ name: '万元' }),
      yAxis: categoryX(['东部', '东北', '中部', '西部']),
      series: [{
        type: 'bar', barWidth: 18,
        data: [
          { value: 11.2, itemStyle: { color: '#10b981' } },
          { value: 6.8, itemStyle: { color: '#64748b' } },
          { value: 6.1, itemStyle: { color: '#e8a317' } },
          { value: 5.4, itemStyle: { color: '#c41e3a' } },
        ],
        label: { show: true, position: 'right', color: LABEL.color, formatter: '{c}' },
      }],
    }),
  },
  dependencyRatio: {
    title: '人口抚养比 · 少儿 / 老年（%）',
    build: () => ({
      grid: GRID,
      tooltip: { trigger: 'axis' },
      legend: { ...LEGEND, top: 0, data: ['少儿抚养比', '老年抚养比'] },
      xAxis: categoryX(['2010', '2015', '2020', '2025E', '2030E', '2035E']),
      yAxis: valueY({ name: '%' }),
      series: [
        { name: '少儿抚养比', type: 'line', smooth: true, data: [22.0, 22.6, 26.2, 24.8, 23.5, 22.0], lineStyle: { color: '#22d3ee' } },
        { name: '老年抚养比', type: 'line', smooth: true, data: [11.9, 14.3, 19.7, 22.5, 26.8, 31.2], lineStyle: { color: '#c41e3a', width: 2 },
          areaStyle: { color: 'rgba(196,30,58,0.1)' } },
      ],
    }),
  },
  giniTrend: {
    title: '基尼系数走势 · 示意',
    build: () => ({
      grid: GRID,
      tooltip: { trigger: 'axis' },
      xAxis: categoryX(['2000', '2005', '2010', '2015', '2020', '2025E']),
      yAxis: valueY({ min: 0.38, max: 0.50, name: 'Gini' }),
      series: [{
        type: 'line', smooth: true, data: [0.417, 0.438, 0.474, 0.465, 0.468, 0.462],
        lineStyle: { color: '#e8a317', width: 2 },
        markArea: { silent: true, itemStyle: { color: 'rgba(232,163,23,0.06)' }, data: [[{ yAxis: 0.40 }, { yAxis: 0.45 }]] },
        markLine: { silent: true, data: [{ yAxis: 0.40, label: { formatter: '警戒 0.40', color: LABEL.color }, lineStyle: { color: '#c41e3a', type: 'dashed' } }] },
      }],
    }),
  },
};

export const CONTRADICTIONS = [
  {
    key: 'gender',
    label: '性别矛盾',
    accent: '#f0abfc',
    thesis: '劳动力市场结构性排斥与生育成本社会化不足，构成性别矛盾的主轴——女性承担再生产成本，却在初次分配中遭遇薪酬剪刀差与职场天花板。',
    primary: '生育成本个体化 vs 劳动力市场无差别竞争：育儿中断、弹性缺位使女性人力资本折旧，薪酬与晋升双重惩罚。',
    secondary: '教育性别逆转（高校女生占比过半）与决策层男性主导并存，形成「高教育—低权力」错位。',
    escalation: ['生育率跌破更替水平、托育供给不足', '平台经济零工化加剧女性就业不稳定', '职场歧视诉讼与舆论事件集中爆发'],
    mitigation: ['生育津贴与个税专项扣除扩面', '弹性工时与男性育儿假制度刚性', '国企与公共部门编制内性别配额试点'],
    levers: ['产假成本社会化分担', '薪酬透明与同工同酬执法', '托育普惠与公立幼儿园扩容'],
    dimensions: [
      ['劳动力参与', '25—54 岁女性参与率约 76%（2025E），仍低于男性 12pp；生育后再就业断层显著。'],
      ['薪酬剪刀差', '城镇单位女性平均工资约为男性 84%（示意），管理层性别比约 1:4。'],
      ['生育成本转嫁', '0—3 岁托育缺口约 48%（示意），育儿时间成本主要由家庭—尤其女性—吸收。'],
      ['职场天花板', '董事会/常委级女性占比不足 10%；STEM 领域晋升漏斗效应持续。'],
    ],
    charts: [
      { title: '劳动参与率 · 性别对照（%）', build: () => ({
        grid: GRID, tooltip: { trigger: 'axis' },
        legend: { ...LEGEND, top: 0, data: ['男性', '女性'] },
        xAxis: categoryX(['2010', '2015', '2020', '2025E']),
        yAxis: valueY({ min: 60, max: 95, name: '%' }),
        series: [
          { name: '男性', type: 'line', data: [90.2, 89.5, 88.8, 88.1], lineStyle: { color: '#22d3ee' } },
          { name: '女性', type: 'line', data: [79.8, 78.5, 77.2, 76.0], lineStyle: { color: '#f0abfc', width: 2 } },
        ],
      })},
      { title: '性别薪酬比 · 示意', build: () => ({
        grid: { left: 72, right: 16, top: 16, bottom: 24 },
        xAxis: valueY({ max: 100, name: '指数(男=100)' }),
        yAxis: categoryX(['全行业', '制造业', '金融', '公共管理']),
        series: [{ type: 'bar', barWidth: 16, data: [84, 81, 78, 92],
          itemStyle: { color: (p) => ['#f0abfc', '#c41e3a', '#e8a317', '#10b981'][p.dataIndex] },
          label: { show: true, position: 'right', color: LABEL.color } }],
      })},
      { title: '矛盾强度雷达 · 示意', build: () => radarOpt(
        ['参与率落差', '薪酬差', '生育成本', '晋升壁垒', '舆论张力'],
        [72, 68, 85, 74, 58], { name: '性别矛盾', color: '#f0abfc' },
      )},
    ],
    framework: {
      salt: { body: '人口再生产是社会再生产的前提；生育成本若完全私人化，等价于向女性征收「生物税」。', pillars: [['成本', '育儿时间货币化不足。'], ['收益', '劳动力市场按无间断工时计价。'], ['再分配', '社保与税收未充分补偿。']] },
      stone: { body: '三孩政策、育儿假、托育试点——以行政动员试探成本分担边界，尚未形成刚性财政承诺。', pillars: [['试点', '个税扣除+生育津贴。'], ['灰度', '弹性工时地方立法。'], ['迭代', '国企母职友好岗位。']] },
      path: { body: '从「鼓励生育」话语转向「生育友好型劳动力市场」——把性别矛盾纳入初次分配改革议程。', pillars: [['短期', '托育供给。'], ['中期', '薪酬执法。'], ['长期', '决策层性别结构。']] },
    },
  },
  {
    key: 'centerLocal',
    label: '央地矛盾',
    accent: '#e8a317',
    thesis: '事权层层下沉、财权相对上移，形成央地之间的结构性张力——中央统筹宏观稳定与战略项目，地方承担增长、就业与维稳的即时压力，土地财政成为弥补收支倒挂的缓冲阀。',
    primary: '事权财权倒挂：基层「三保」刚性支出与自有财力缺口并存，转移支付难以完全对冲属地化责任。',
    secondary: '政策博弈：中央去杠杆/环保/能耗双控与地方稳增长诉求之间的周期性拉锯。',
    escalation: ['地方债务显性化、城投非标违约', '中央专项债额度争夺白热化', '区域政策竞赛导致重复建设与产能过剩'],
    mitigation: ['转移支付公式化、常住人口挂钩', '消费税后移与地方税体系改革', '数字政府穿透预算执行'],
    levers: ['中央—地方事权清单', '转移支付与考核指标解绑', '土地财政向房地产税渐进切换'],
    dimensions: [
      ['事权财权倒挂', '地方一般公共预算收入占全国约 52%，支出约占 86%（示意）。'],
      ['转移支付', '中央转移支付规模约 8.4 万亿元（2025E），但专项化导致「跑部钱进」。'],
      ['土地财政', '土地出让收入占地方基金性收入约 87%（示意），房地产下行直接冲击财力。'],
      ['政策博弈', '环保督察、能耗双控、金融去杠杆等「一刀切」引发地方执行变形。'],
    ],
    charts: [
      { title: '地方收支缺口 · 占全国比重（%）', build: () => ({
        grid: GRID, tooltip: { trigger: 'axis' },
        legend: { ...LEGEND, top: 0, data: ['地方收入占比', '地方支出占比'] },
        xAxis: categoryX(['2015', '2018', '2021', '2024', '2025E']),
        yAxis: valueY({ min: 40, max: 95, name: '%' }),
        series: [
          { name: '地方收入占比', type: 'bar', barWidth: 14, data: [52, 51, 53, 52, 52], itemStyle: { color: '#22d3ee' } },
          { name: '地方支出占比', type: 'line', data: [85, 86, 87, 86, 86], lineStyle: { color: '#c41e3a', width: 2 } },
        ],
      })},
      { title: '土地出让收入 · 示意（万亿元）', build: () => ({
        grid: GRID, tooltip: { trigger: 'axis' },
        xAxis: categoryX(['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025E']),
        yAxis: valueY({ name: '万亿' }),
        series: [{ type: 'line', smooth: true, data: [6.5, 7.3, 8.4, 8.7, 6.7, 5.8, 4.9, 4.5],
          lineStyle: { color: '#e8a317', width: 2 }, areaStyle: { color: 'rgba(232,163,23,0.1)' } }],
      })},
      { title: '央地矛盾强度 · 雷达', build: () => radarOpt(
        ['收支倒挂', '土地依赖', '债务压力', '政策摩擦', '考核扭曲'],
        [88, 82, 78, 70, 75], { name: '央地矛盾', color: '#e8a317' },
      )},
    ],
    framework: {
      salt: { body: '财权集中是盐铁逻辑在财政领域的延伸——中央掌控税源枢纽，地方以土地与债务换取发展权。', pillars: [['命脉', '税制结构与专项债。'], ['缓冲', '土地出让金。'], ['风险', '隐性债务累积。']] },
      stone: { body: '自贸区、开发区、自贸港——中央赋予地方差异化政策试验权，换取增长与稳定。', pillars: [['试点', '地方立法权扩容。'], ['博弈', '督察与考核。'], ['纠偏', '问责与化债。']] },
      path: { body: '从「土地—债务增长模式」转向「税—转移支付—举债规范」三位一体的地方财政新架构。', pillars: [['税改', '消费税后移。'], ['事权', '清单化管理。'], ['监督', '预算穿透。']] },
    },
  },
  {
    key: 'urbanRural',
    label: '城乡矛盾',
    accent: '#10b981',
    thesis: '户籍制度塑造的要素流动壁垒，使城乡之间长期存在公共服务与收入的系统性落差——城镇化率与户籍城镇化率之间的「半城镇化」群体，是城乡矛盾最活跃的载体。',
    primary: '户籍壁垒导致教育、医疗、社保可携带性不足，2.4 亿流动人口在流入地难以完整市民化。',
    secondary: '工农业产品价格剪刀差的历史遗留，转为土地增值收益在城乡之间的不均衡分配。',
    escalation: ['大城市户籍门槛与房价联动', '农村宅基地与集体建设用地入市受阻', '县域产业空心化与留守群体扩大'],
    mitigation: ['居住证积分与基本公共服务均等化', '城乡统一建设用地市场', '中央财政转移支付向县域倾斜'],
    levers: ['户籍制度改革深化', '城乡医保养老并轨', '乡村振兴与县域产业集群'],
    dimensions: [
      ['户籍壁垒', '户籍城镇化率比常住人口城镇化率低约 18pp（示意）。'],
      ['要素流动', '农村建设用地入市试点进展不均，宅基地退出机制不畅。'],
      ['公共服务均等化', '农村生均教育经费约为城镇 78%（示意）；县域三甲医院覆盖率不足。'],
      ['剪刀差遗留', '农业劳动生产率约为第二产业 1/6，价格传导机制仍不利于小农。'],
    ],
    charts: [
      { title: '城镇化率 vs 户籍城镇化率（%）', build: () => ({
        grid: GRID, tooltip: { trigger: 'axis' },
        legend: { ...LEGEND, top: 0, data: ['常住人口城镇化', '户籍人口城镇化'] },
        xAxis: categoryX(['2010', '2015', '2020', '2025E']),
        yAxis: valueY({ min: 40, max: 75, name: '%' }),
        series: [
          { name: '常住人口城镇化', type: 'line', data: [49.9, 56.1, 63.9, 68.5], lineStyle: { color: '#10b981', width: 2 } },
          { name: '户籍人口城镇化', type: 'line', data: [34.2, 39.9, 45.4, 50.2], lineStyle: { color: '#64748b', type: 'dashed' } },
        ],
      })},
      { title: '城乡收入比 · 趋势', build: () => DASHBOARD_CHARTS.urbanRuralRatio.build() },
      { title: '城乡矛盾强度 · 雷达', build: () => radarOpt(
        ['收入差距', '公共服务', '户籍壁垒', '土地权益', '要素流动'],
        [70, 75, 80, 68, 62], { name: '城乡矛盾', color: '#10b981' },
      )},
    ],
    framework: {
      salt: { body: '土地集体所有制与用途管制，是城乡要素流动的制度闸门——城市扩张以征地低成本获取建设空间。', pillars: [['征地', '增值收益分配失衡。'], ['户籍', '公共服务属地绑定。'], ['产业', '县域承接能力不足。']] },
      stone: { body: '新型城镇化试点、宅基地改革、集体经营性建设用地入市——县域单元试错。', pillars: [['试点', '特大镇设市。'], ['灰度', '宅基地有偿退出。'], ['纠偏', '耕地红线。']] },
      path: { body: '从「土地城镇化」转向「人的城镇化」——公共服务按常住人口配置，而非户籍。', pillars: [['并轨', '社保医保。'], ['产业', '县域集群。'], ['权利', '集体产权确权。']] },
    },
  },
  {
    key: 'class',
    label: '阶层矛盾',
    accent: '#8b5cf6',
    thesis: '中间阶层在资产价格膨胀期扩大，却在增速换挡后遭遇「地位焦虑」——流动性固化与编制内外双轨，使阶层矛盾从收入差距演变为机会结构与身份认同的复合张力。',
    primary: '社会流动性下降：代际收入弹性上升，优质教育与住房成为阶层再生产的关键门槛。',
    secondary: '编制内外双轨：体制内稳定性溢价与体制外市场波动形成心理落差与政策诉求分化。',
    escalation: ['青年高学历失业与「慢就业」', '公务员考试竞争比突破 60:1', '中产资产缩水引发消费降级'],
    mitigation: ['保障房与租购并举', '职业教育与普职融通', '民营经济法治化预期稳定'],
    levers: ['共同富裕三次分配', '反垄断与平台规则', '编制分类改革与同工同酬'],
    dimensions: [
      ['中间阶层焦虑', '城镇中等收入群体约 4 亿人（示意），房产占比过高导致资产负债表敏感。'],
      ['流动性固化', '代际收入弹性约 0.42（示意），高于欧美可比水平。'],
      ['编制双轨', '体制内养老金替代率显著高于体制外灵活就业者。'],
      ['教育门槛', '重点学区与校外培训禁令后的「影子竞争」转移。'],
    ],
    charts: [
      { title: '代际收入弹性 · 国际对照（示意）', build: () => ({
        grid: { left: 72, right: 16, top: 16, bottom: 24 },
        xAxis: valueY({ max: 0.6 }),
        yAxis: categoryX(['中国', '美国', '德国', '北欧均值']),
        series: [{ type: 'bar', barWidth: 16, data: [0.42, 0.34, 0.32, 0.25],
          itemStyle: { color: (p) => (p.dataIndex === 0 ? '#8b5cf6' : '#64748b') },
          label: { show: true, position: 'right', color: LABEL.color } }],
      })},
      { title: '公务员考试竞争比 · 示意', build: () => ({
        grid: GRID, tooltip: { trigger: 'axis' },
        xAxis: categoryX(['2018', '2019', '2020', '2022', '2024', '2025E']),
        yAxis: valueY({ name: ':1' }),
        series: [{ type: 'line', smooth: true, data: [40, 48, 52, 61, 58, 64],
          lineStyle: { color: '#8b5cf6', width: 2 }, areaStyle: { color: 'rgba(139,92,246,0.1)' } }],
      })},
      { title: '阶层矛盾强度 · 雷达', build: () => radarOpt(
        ['流动性', '资产焦虑', '编制双轨', '教育竞争', '就业分化'],
        [76, 72, 68, 80, 74], { name: '阶层矛盾', color: '#8b5cf6' },
      )},
    ],
    framework: {
      salt: { body: '编制与国企岗位是盐铁逻辑在就业领域的延伸——稳定溢价本质上是财政对风险的补贴。', pillars: [['双轨', '体制内保障。'], ['门槛', '考试与编制。'], ['固化', '代际传递。']] },
      stone: { body: '共同富裕示范区、房产税试点、职教高考——在不同维度试探再分配边界。', pillars: [['试点', '浙江示范。'], ['灰度', '房产税。'], ['分流', '普职融通。']] },
      path: { body: '扩大中等收入群体需同时降低住房与教育门槛、提高体制外社会保障可携带性。', pillars: [['保障', '租购并举。'], ['机会', '教育公平。'], ['预期', '法治化营商环境。']] },
    },
  },
  {
    key: 'regional',
    label: '区域矛盾',
    accent: '#22d3ee',
    thesis: '东中西梯度与南北分化叠加，省会虹吸与产业转移不同步，使区域矛盾从「地理差距」演变为要素集聚与政策配给之间的博弈。',
    primary: '东部沿海集聚高端要素，中西部承担能源与生态功能，人均 GDP 梯度长期存在。',
    secondary: '南北分化：北方部分省份增长放缓，产业升级与人口流出形成负反馈。',
    escalation: ['省会「一城独大」与县域空心化', '产业转移承接地环境代价争议', '区域政策套利与重复招商'],
    mitigation: ['京津冀、长三角、粤港澳协同', '中部崛起与西部大开发升级版', '生态补偿与纵向转移支付'],
    levers: ['主体功能区战略', '省际对口支援机制', '陆海新通道与中欧班列'],
    dimensions: [
      ['东中西梯度', '东部人均 GDP 约为西部 2.1 倍（示意）。'],
      ['南北分化', '南方省份 GDP 增量占全国约 65%（2020s 示意）。'],
      ['省会虹吸', '省会城市人口占全省比重持续提升，县域城镇化放缓。'],
      ['产业转移', '纺织、电子组装向中西部转移，研发与设计仍留在东部。'],
    ],
    charts: [
      { title: '人均 GDP 梯度', build: () => DASHBOARD_CHARTS.regionalGdp.build() },
      { title: '南北 GDP 增速差 · 示意（pp）', build: () => ({
        grid: GRID, tooltip: { trigger: 'axis' },
        xAxis: categoryX(['2015', '2018', '2021', '2024', '2025E']),
        yAxis: valueY({ name: 'pp' }),
        series: [{ type: 'bar', barWidth: 18, data: [0.8, 1.2, 1.5, 1.8, 1.6],
          itemStyle: { color: '#22d3ee' },
          label: { show: true, position: 'top', color: LABEL.color } }],
      })},
      { title: '区域矛盾强度 · 雷达', build: () => radarOpt(
        ['人均差距', '南北差', '省会虹吸', '产业层级', '政策竞争'],
        [78, 72, 70, 75, 65], { name: '区域矛盾', color: '#22d3ee' },
      )},
    ],
    framework: {
      salt: { body: '关键通道、能源基地与中心城市是盐铁节点——谁控制枢纽，谁获取集聚租金。', pillars: [['枢纽', '省会与港口。'], ['通道', '高铁与算力。'], ['补偿', '转移支付。']] },
      stone: { body: '自贸区、国家级新区、承接产业转移示范区——区域政策试验的「摸石头」。', pillars: [['试点', '新区赋权。'], ['竞争', '招商优惠。'], ['纠偏', '全国统一大市场。']] },
      path: { body: '从「梯度转移」转向「功能分工」——按主体功能区配置产业与生态补偿。', pillars: [['分工', '功能区划。'], ['联通', '基础设施。'], ['均衡', '纵向转移。']] },
    },
  },
  {
    key: 'generational',
    label: '代际矛盾',
    accent: '#fb923c',
    thesis: '老龄化抬升抚养比、青年就业承压、资产代际传递加剧分化——代际矛盾是人口结构、劳动力市场与财富分配三条线的交汇点。',
    primary: '老年抚养比快速攀升，养老金现收现付压力增大，代际再分配预期紧张。',
    secondary: '青年就业：高校毕业生规模持续高位，慢就业与灵活就业比例上升。',
    escalation: ['延迟退休政策争议', '代际财富鸿沟与「躺平」话语', '生育意愿与养老负担叠加'],
    mitigation: ['多层次养老保险体系', '银发经济与适老化改造', '青年创业与技能再培训'],
    levers: ['渐进式延迟退休', '个人养老金账户扩面', '保障性住房向青年倾斜'],
    dimensions: [
      ['老龄化抚养比', '老年抚养比约 22.5%（2025E），2035E 或超 30%。'],
      ['青年就业', '16—24 岁调查失业率峰值约 21%（2023 示意），结构性矛盾突出。'],
      ['资产代际传递', '城镇住房财富集中于 60 前出生队列，青年购房年限延长。'],
      ['价值观撕裂', '婚育、消费、工作伦理的代际差异公共化。'],
    ],
    charts: [
      { title: '抚养比结构', build: () => DASHBOARD_CHARTS.dependencyRatio.build() },
      { title: '青年调查失业率 · 示意（%）', build: () => ({
        grid: GRID, tooltip: { trigger: 'axis' },
        xAxis: categoryX(['2018', '2019', '2020', '2022', '2024', '2025E']),
        yAxis: valueY({ min: 8, max: 22, name: '%' }),
        series: [{ type: 'line', smooth: true, data: [9.8, 11.2, 14.5, 18.7, 16.2, 15.0],
          lineStyle: { color: '#fb923c', width: 2 }, markPoint: { data: [{ coord: ['2022', 18.7], name: '峰值' }] } }],
      })},
      { title: '代际矛盾强度 · 雷达', build: () => radarOpt(
        ['养老压力', '青年就业', '资产鸿沟', '价值观', '生育意愿'],
        [82, 78, 74, 65, 80], { name: '代际矛盾', color: '#fb923c' },
      )},
    ],
    framework: {
      salt: { body: '养老金与医保是代际契约的财政化——年轻人缴费供养老年人，预期可持续性是政治稳定器。', pillars: [['契约', '现收现付。'], ['压力', '抚养比攀升。'], ['调整', '延迟退休。']] },
      stone: { body: '个人养老金、长期护理保险、银发经济试点——多层次保障的小步迭代。', pillars: [['试点', '税延养老。'], ['产业', '适老化。'], ['就业', '技能再培训。']] },
      path: { body: '从「人口红利」转向「人力资本红利」——延长健康工作年限、提高劳动生产率。', pillars: [['制度', '多层次养老。'], ['资产', '租购并举。'], ['文化', '代际对话机制。']] },
    },
  },
  {
    key: 'wealth',
    label: '贫富矛盾',
    accent: '#c41e3a',
    thesis: '基尼系数高位徘徊、三次分配机制尚在成形、平台经济集中度抬升——贫富矛盾呈现「显性收入差距」与「隐性福利差距」的双层结构。',
    primary: '初次分配中资本回报增速长期高于劳动回报，财富向资产持有者集中。',
    secondary: '隐性福利：编制保障、城市户籍公共服务、住房资产增值构成非货币化不平等。',
    escalation: ['房地产下行暴露中产资产负债表风险', '平台垄断与算法分配引发舆论', '慈善与第三次分配信任不足'],
    mitigation: ['提高个税累进性与财产性收入规范', '保障性住房与租赁市场', '平台经济常态化监管'],
    levers: ['共同富裕示范区', '慈善税收激励与透明披露', '最低工资标准动态调整'],
    dimensions: [
      ['基尼系数', '全国基尼约 0.46（2025E 示意），高于 0.40 警戒线。'],
      ['三次分配', '慈善捐赠占 GDP 约 0.1%（示意），企业社会责任制度化不足。'],
      ['平台集中度', '头部平台市场份额超 60%（电商/支付示意），算法分配影响零工收入。'],
      ['隐性福利', '城镇户籍与体制内岗位附带非货币保障，难以纳入基尼统计。'],
    ],
    charts: [
      { title: '基尼系数走势', build: () => DASHBOARD_CHARTS.giniTrend.build() },
      { title: '劳动与资本回报增速差 · 示意（%）', build: () => ({
        grid: GRID, tooltip: { trigger: 'axis' },
        legend: { ...LEGEND, top: 0, data: ['劳动报酬增速', '资本回报增速'] },
        xAxis: categoryX(['2015', '2018', '2021', '2024', '2025E']),
        yAxis: valueY({ name: '%' }),
        series: [
          { name: '劳动报酬增速', type: 'line', data: [8.2, 7.5, 6.8, 5.2, 5.0], lineStyle: { color: '#64748b' } },
          { name: '资本回报增速', type: 'line', data: [9.5, 10.2, 9.8, 7.5, 7.2], lineStyle: { color: '#c41e3a', width: 2 } },
        ],
      })},
      { title: '贫富矛盾强度 · 雷达', build: () => radarOpt(
        ['基尼', '资产集中', '平台垄断', '隐性福利', '三次分配'],
        [80, 76, 68, 72, 58], { name: '贫富矛盾', color: '#c41e3a' },
      )},
    ],
    framework: {
      salt: { body: '税收、社保与国有资本运作是再分配的国家枢纽——初次分配市场化，二次分配矫正，三次分配补充。', pillars: [['税收', '累进性。'], ['社保', '覆盖面。'], ['国资', '分红与划转。']] },
      stone: { body: '共同富裕试点、房地产税立法探索、平台反垄断——在不同环节试探再分配强度。', pillars: [['试点', '浙江示范。'], ['监管', '平台规则。'], ['慈善', '透明披露。']] },
      path: { body: '扩大中等收入群体、规范财富积累机制、畅通向上流动通道——「橄榄型」结构的制度目标。', pillars: [['初次', '劳动报酬。'], ['二次', '税收社保。'], ['三次', '慈善信任。']] },
    },
  },
  {
    key: 'laborCapital',
    label: '劳资矛盾',
    accent: '#06b6d4',
    thesis: '全球化退潮与自动化抬升背景下，劳资矛盾从「工资谈判」扩展为「算法管理、工时边界与社会保障可携带性」的系统性争议。',
    primary: '劳动报酬占 GDP 比重长期低于资本回报，加班文化与欠薪在制造业与平台业周期性复发。',
    secondary: '灵活就业者缺乏工伤、失业与养老的完整覆盖，劳动关系认定模糊。',
    escalation: ['大规模裁员与集体协商事件', '算法催单与骑手劳动保障诉讼', '外资产业链外迁冲击就业'],
    mitigation: ['工会与集体协商机制扩面', '新就业形态职业伤害保障试点', '最低工资与工时执法'],
    levers: ['劳动法修订与举证责任', '平台企业用工规范', '职业技能培训补贴'],
    dimensions: [
      ['工资份额', '劳动报酬占 GDP 约 52%（示意），低于 OECD 均值。'],
      ['工时边界', '法定工时执行率不均，996 文化与维权成本并存。'],
      ['灵活就业', '平台零工约 2 亿人（示意），劳动关系认定困难。'],
      ['集体协商', '工会覆盖率在私营部门偏低，集体合同执行有限。'],
    ],
    charts: [
      { title: '劳动报酬占 GDP 比重（%）', build: () => ({
        grid: GRID, tooltip: { trigger: 'axis' },
        xAxis: categoryX(['2000', '2005', '2010', '2015', '2020', '2025E']),
        yAxis: valueY({ min: 45, max: 58, name: '%' }),
        series: [{ type: 'line', smooth: true, data: [51.4, 50.2, 49.8, 51.2, 52.0, 52.3],
          lineStyle: { color: '#06b6d4', width: 2 } }],
      })},
      { title: '新就业形态规模 · 示意（亿人）', build: () => ({
        grid: { left: 72, right: 16, top: 16, bottom: 24 },
        yAxis: categoryX(['快递外卖', '网约车', '网络直播', '其他零工']),
        xAxis: valueY({ name: '亿人' }),
        series: [{ type: 'bar', barWidth: 14, data: [0.85, 0.42, 0.38, 0.55],
          itemStyle: { color: '#06b6d4' }, label: { show: true, position: 'right', color: LABEL.color } }],
      })},
      { title: '劳资矛盾强度 · 雷达', build: () => radarOpt(
        ['报酬份额', '工时违规', '灵活就业', '集体协商', '自动化替代'],
        [74, 70, 78, 62, 66], { name: '劳资矛盾', color: '#06b6d4' },
      )},
    ],
    framework: {
      salt: { body: '劳动力要素市场化是增长引擎，但社会保障属地化使劳资博弈带有行政色彩。', pillars: [['市场', '工资定价。'], ['保障', '社保属地。'], ['稳定', '就业优先。']] },
      stone: { body: '职业伤害保障试点、平台算法披露、集体协商扩面——小步调整劳动关系边界。', pillars: [['试点', '新就业形态。'], ['监管', '算法规则。'], ['协商', '行业工会。']] },
      path: { body: '从「廉价劳动力比较优势」转向「技能与保障并重」的高质量就业。', pillars: [['技能', '职业教育。'], ['保障', '可携带社保。'], ['法治', '劳动法执行。']] },
    },
  },
  {
    key: 'stateSociety',
    label: '官民矛盾',
    accent: '#64748b',
    thesis: '科层体制执行精度与民众诉求多元化之间的张力，构成官民矛盾的主线——数字政府提升透明度，也可能放大执行偏差与舆情发酵的连锁效应。',
    primary: '基层治理「最后一公里」：政策传导变形、形式主义与民众获得感落差。',
    secondary: '信访、行政诉讼与网络舆情构成平行申诉渠道，成本与效果不均。',
    escalation: ['极端个案引发全网舆情', '基层问责泛化导致执行僵化', '隐私与监控边界争议'],
    mitigation: ['「枫桥经验」与网格化精细治理', '政务公开与办事「最多跑一次」', '数字赋能减负基层'],
    levers: ['考核指标去 GDP 化', '基层干部容错与激励并重', '公益诉讼与行政复议扩面'],
    dimensions: [
      ['执行偏差', '政策层层加码与「一刀切」引发民众反弹。'],
      ['诉求渠道', '信访量与网络舆情年增（示意），司法救济成本较高。'],
      ['数字治理', '「互联网+督查」提升曝光，也增加基层数字负担。'],
      ['信任修复', '个案处理时效与信息公开程度影响整体信任。'],
    ],
    charts: [
      { title: '政务服务满意度 · 示意（%）', build: () => ({
        grid: GRID, tooltip: { trigger: 'axis' },
        xAxis: categoryX(['2015', '2018', '2021', '2024', '2025E']),
        yAxis: valueY({ min: 70, max: 95, name: '%' }),
        series: [{ type: 'line', smooth: true, data: [78, 82, 86, 89, 91],
          lineStyle: { color: '#10b981', width: 2 }, areaStyle: { color: 'rgba(16,185,129,0.08)' } }],
      })},
      { title: '基层负担感知 · 示意指数', build: () => radarOpt(
        ['填表报数', '迎检考核', '问责压力', '数字系统', '激励不足'],
        [82, 75, 78, 70, 72], { name: '基层负担', color: '#64748b' },
      )},
      { title: '官民矛盾强度 · 雷达', build: () => radarOpt(
        ['执行偏差', '诉求渠道', '舆情发酵', '隐私边界', '信任修复'],
        [68, 65, 72, 58, 62], { name: '官民矛盾', color: '#64748b' },
      )},
    ],
    framework: {
      salt: { body: '科层体制是秩序供给的核心机器——信息上行与命令下行的不对称，是官民矛盾的结构根源。', pillars: [['上行', '信访舆情。'], ['下行', '政策加码。'], ['稳定', '网格治理。']] },
      stone: { body: '放管服改革、数字政府、基层减负——以试点削减摩擦成本。', pillars: [['试点', '最多跑一次。'], ['工具', '数字督查。'], ['纠偏', '形式主义整治。']] },
      path: { body: '从「管理型政府」向「服务型政府」——以可问责的公共服务重塑信任。', pillars: [['公开', '政务透明。'], ['减负', '基层激励。'], ['法治', '权利救济。']] },
    },
  },
  {
    key: 'ethnic',
    label: '民族地区矛盾',
    accent: '#d4af37',
    thesis: '民族地区在资源禀赋、文化保护与现代化进程之间面临特殊张力——发展差距、语言教育政策与宗教民俗管理的平衡，构成区别于一般区域矛盾的专门维度。',
    primary: '发展差距：部分民族地区人均 GDP 低于全国均值 30—40%（示意），基础设施与产业层级滞后。',
    secondary: '文化保护与现代化：双语教育、传统社区与现代治理的接口需要持续调适。',
    escalation: ['外部势力话语干预与内部认同议题交织', '旅游开发与原住民权益冲突', '对口支援效果不均引发落差感'],
    mitigation: ['西部大开发升级版与兴边富民', '双语教育与职业技能培训', '生态补偿与特色产业扶持'],
    levers: ['民族区域自治法实施评估', '对口支援长效机制', '文旅融合与非遗产业化'],
    dimensions: [
      ['发展差距', '西藏、新疆、青海等人均 GDP 约为全国均值 55—75%（示意）。'],
      ['语言教育', '双语教育体系在普及与传承之间的平衡。'],
      ['产业层级', '资源型与旅游型经济占比高，制造业嵌入度低。'],
      ['对口支援', '东部省市对口支援形成财政与人才输送，效果评估机制在完善。'],
    ],
    charts: [
      { title: '民族地区人均 GDP / 全国均值（%）', build: () => ({
        grid: { left: 72, right: 16, top: 16, bottom: 24 },
        yAxis: categoryX(['西藏', '新疆', '青海', '宁夏', '内蒙古']),
        xAxis: valueY({ max: 100, name: '%' }),
        series: [{ type: 'bar', barWidth: 14, data: [55, 72, 68, 78, 85],
          itemStyle: { color: '#d4af37' }, label: { show: true, position: 'right', color: LABEL.color } }],
      })},
      { title: '对口支援投入 · 示意（亿元）', build: () => ({
        grid: GRID, tooltip: { trigger: 'axis' },
        xAxis: categoryX(['2015', '2018', '2021', '2024', '2025E']),
        yAxis: valueY({ name: '亿元' }),
        series: [{ type: 'line', smooth: true, data: [320, 380, 420, 460, 485],
          lineStyle: { color: '#d4af37', width: 2 }, areaStyle: { color: 'rgba(212,175,55,0.1)' } }],
      })},
      { title: '民族地区矛盾强度 · 雷达', build: () => radarOpt(
        ['发展差距', '文化接口', '产业层级', '生态约束', '外部话语'],
        [76, 62, 70, 58, 65], { name: '民族地区', color: '#d4af37' },
      )},
    ],
    framework: {
      salt: { body: '边疆稳固与资源通道是盐铁逻辑的地缘延伸——发展、安全与认同三重目标需同时满足。', pillars: [['安全', '边疆治理。'], ['发展', '对口支援。'], ['认同', '文化接口。']] },
      stone: { body: '兴边富民、双语教育、文旅融合——民族地区政策的试点与评估循环。', pillars: [['试点', '自贸片区。'], ['扶持', '特色产业。'], ['评估', '自治法实施。']] },
      path: { body: '从「输血式支援」转向「造血式嵌入」——产业链分工与人力资本投资并重。', pillars: [['产业', '特色集群。'], ['教育', '双语职教。'], ['生态', '补偿机制。']] },
    },
  },
];

export const CONTRADICTION_KEYS = CONTRADICTIONS.map((c) => c.key);

export function getContradiction(key) {
  return CONTRADICTIONS.find((c) => c.key === key) ?? CONTRADICTIONS[0];
}
