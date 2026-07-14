import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid, OsGauge } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// 机器人类型选择器：切换看市场规模 / 国产化率 / 关键部件自主度 / 代表企业 / 卡脖子点
const ROBOTS = [
  {
    key: 'industrial', label: '工业机器人', accent: '#c41e3a',
    density: 470, share: 52, marketCN: 680, local: 50,
    desc: '全球过半工业机器人装机于中国，密度达每万名工人约 470 台；汽车、3C 电子、锂电光伏是主战场。本体国产份额已过半，但高端六轴与精密部件仍受制于人。',
    sectors: [
      { value: 32, name: '3C 电子', itemStyle: { color: '#c41e3a' } },
      { value: 24, name: '汽车制造', itemStyle: { color: '#22d3ee' } },
      { value: 18, name: '锂电光伏', itemStyle: { color: '#e8a317' } },
      { value: 14, name: '金属加工', itemStyle: { color: '#10b981' } },
      { value: 12, name: '其他', itemStyle: { color: '#64748b' } },
    ],
    parts: [['RV 减速器', 45], ['谐波减速器', 80], ['伺服电机', 50], ['控制器', 60]],
    players: ['埃斯顿', '汇川技术', '埃夫特', '新时达', '新松'],
    choke: '高刚性 RV 减速器精度与寿命、高端伺服编码器分辨率，仍依赖纳博特斯克/哈默纳科/安川。',
  },
  {
    key: 'cobot', label: '协作机器人', accent: '#22d3ee',
    density: 95, share: 40, marketCN: 38, local: 70,
    desc: '与人共融的轻量协作臂渗透 SME 与商用场景；中国出货量已居全球前列。安全力控、碰撞检测与低成本一体化关节是差异化关键，本体国产化程度高。',
    sectors: [
      { value: 30, name: '3C 装配', itemStyle: { color: '#22d3ee' } },
      { value: 22, name: '商用服务', itemStyle: { color: '#c41e3a' } },
      { value: 20, name: '半导体', itemStyle: { color: '#e8a317' } },
      { value: 16, name: '医疗', itemStyle: { color: '#10b981' } },
      { value: 12, name: '其他', itemStyle: { color: '#64748b' } },
    ],
    parts: [['一体化关节', 78], ['力矩传感', 55], ['伺服电机', 65], ['控制器', 72]],
    players: ['节卡', '遨博', '越疆 Dobot', '艾利特', '法奥'],
    choke: '高精度六维力/力矩传感器、关节空心杯电机与高动态响应算法。',
  },
  {
    key: 'humanoid', label: '人形机器人', accent: '#e8a317',
    density: 8, share: 35, marketCN: 12, local: 60,
    desc: '具身智能是 AI 进入物理世界的最后拼图；北京、上海、深圳国家级创新中心并行推进。本体供应链国产化快速攀升，但灵巧手、空心杯电机、高算力域控仍是瓶颈，2025—2026 进入小批量量产。',
    sectors: [
      { value: 28, name: '工厂搬运', itemStyle: { color: '#e8a317' } },
      { value: 24, name: '商用导览', itemStyle: { color: '#c41e3a' } },
      { value: 20, name: '科研教育', itemStyle: { color: '#22d3ee' } },
      { value: 16, name: '家庭服务', itemStyle: { color: '#10b981' } },
      { value: 12, name: '特种', itemStyle: { color: '#64748b' } },
    ],
    parts: [['行星滚柱丝杠', 35], ['空心杯电机', 30], ['灵巧手', 40], ['域控芯片', 25]],
    players: ['宇树', '智元', '傅利叶', '小鹏', '优必选'],
    choke: '行星滚柱丝杠量产良率、空心杯无刷电机、灵巧手触觉、车规级高算力域控芯片。',
  },
  {
    key: 'service', label: '服务机器人', accent: '#10b981',
    density: 60, share: 45, marketCN: 95, local: 85,
    desc: '配送、清洁、餐饮、商用导览构成中国服务机器人最大规模量；导航定位与本体高度国产化，场景驱动迭代快，是产业链「以量养技」的现金牛。',
    sectors: [
      { value: 30, name: '配送物流', itemStyle: { color: '#10b981' } },
      { value: 24, name: '清洁', itemStyle: { color: '#22d3ee' } },
      { value: 20, name: '餐饮商用', itemStyle: { color: '#c41e3a' } },
      { value: 16, name: '医疗康养', itemStyle: { color: '#e8a317' } },
      { value: 10, name: '其他', itemStyle: { color: '#64748b' } },
    ],
    parts: [['激光雷达', 80], ['SLAM 算法', 75], ['伺服轮毂', 82], ['电池/电控', 88]],
    players: ['普渡', '擎朗', '云迹', '高仙', '九号'],
    choke: '高线束固态激光雷达成本、复杂动态场景下的鲁棒导航与长续航。',
  },
  {
    key: 'special', label: '特种机器人', accent: '#8b5cf6',
    density: 12, share: 30, marketCN: 55, local: 65,
    desc: '消防、巡检、矿用、水下、军用等极端场景机器人；强可靠性与环境适应性优先。国产化在巡检/矿用较高，高端水下与防爆驱动仍有缺口。',
    sectors: [
      { value: 28, name: '电力巡检', itemStyle: { color: '#8b5cf6' } },
      { value: 22, name: '矿用', itemStyle: { color: '#c41e3a' } },
      { value: 20, name: '消防应急', itemStyle: { color: '#e8a317' } },
      { value: 18, name: '水下', itemStyle: { color: '#22d3ee' } },
      { value: 12, name: '其他', itemStyle: { color: '#64748b' } },
    ],
    parts: [['防爆驱动', 55], ['多传感融合', 60], ['特种材料', 70], ['通信链路', 65]],
    players: ['亿嘉和', '申昊', '中信重工', '博实', '哈工智能'],
    choke: '深水耐压密封、防爆电机认证、强干扰环境下的可靠通信与自主决策。',
  },
];

// 机器人密度国际对比（每万名制造业工人台数，示意 ~2023）
const DENSITY = [
  { c: '韩国', v: 1012, color: '#c41e3a' },
  { c: '新加坡', v: 770, color: '#e8a317' },
  { c: '德国', v: 415, color: '#8b5cf6' },
  { c: '日本', v: 397, color: '#10b981' },
  { c: '中国', v: 470, color: '#22d3ee' },
  { c: '美国', v: 295, color: '#64748b' },
];

// 核心零部件国产自主度雷达（中国 vs 全球第一梯队，示意）
const RADAR_INDS = ['RV 减速器', '谐波减速器', '伺服电机', '控制器', '传感器', 'AI 大脑'];
const RADAR_CN = [45, 80, 55, 62, 50, 70];
const RADAR_LEADER = [95, 92, 90, 95, 90, 85];

// 产业规模趋势（亿元，工业 / 服务 / 人形 分项，示意）
const TREND_YEARS = ['2018', '2020', '2022', '2024', '2025E', '2030E'];
const TREND_INDUSTRIAL = [380, 450, 580, 680, 760, 1100];
const TREND_SERVICE = [120, 230, 480, 720, 880, 1900];
const TREND_HUMANOID = [0, 2, 6, 18, 45, 600];

// 人形机器人 BOM 成本拆解（占比 %，示意）
const HUMANOID_BOM = [
  { value: 32, name: '执行器/关节模组', itemStyle: { color: '#c41e3a' } },
  { value: 18, name: '减速器/丝杠', itemStyle: { color: '#e8a317' } },
  { value: 16, name: '灵巧手', itemStyle: { color: '#22d3ee' } },
  { value: 14, name: '传感器', itemStyle: { color: '#10b981' } },
  { value: 12, name: '算力/域控', itemStyle: { color: '#8b5cf6' } },
  { value: 8, name: '结构件/电源', itemStyle: { color: '#64748b' } },
];

// 人形机器人量产降本曲线（整机成本，万元/台，示意）
const COST_YEARS = ['2023', '2024', '2025E', '2026E', '2028E', '2030E'];
const COST_VALUES = [60, 45, 30, 22, 14, 8];

// 人形机器人路线 TimelineBar
const ROADMAP = [
  { period: '2020—2023', title: '样机验证', accent: '#8b5cf6', desc: '双足/双臂动态平衡与运动控制突破，宇树、优必选、傅利叶等样机迭代；技术路线发散，单台成本数十万元，纯展示与科研属性。' },
  { period: '2024—2025', title: '小批量交付', accent: '#22d3ee', desc: '本体供应链初步国产化，进入实验室与示范工厂；整机价格下探至二三十万元，订单以百台计，场景以搬运/巡检/导览为主。' },
  { period: '2026—2028', title: '商业化落地', accent: '#e8a317', desc: '具身大模型 + 数据飞轮成熟，工厂与商用场景规模复制；成本击穿 15 万元线，年出货进入万台量级，开始替代结构化重复劳动。' },
  { period: '2029—2030', title: '规模量产', accent: '#c41e3a', desc: '行星滚柱丝杠/空心杯电机/灵巧手良率爬坡完成，整机降至个位数万元；进入消费与家庭场景，成为继手机、汽车后的第三超级终端。' },
];

export default function Page() {
  const [robot, setRobot] = useState('industrial');
  const [stage, setStage] = useState(1);
  const r = ROBOTS.find((x) => x.key === robot) || ROBOTS[0];

  // 智能泛化能力指数（随类型切换）
  const intelligenceLine = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(['2021', '2022', '2023', '2024', '2025E']),
    yAxis: valueY({ max: 100 }),
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      data: robot === 'humanoid' ? [10, 22, 40, 68, 92]
        : robot === 'cobot' ? [40, 55, 68, 80, 90]
        : robot === 'service' ? [50, 62, 74, 84, 92]
        : robot === 'special' ? [35, 45, 56, 68, 78]
        : [60, 70, 80, 88, 94],
      lineStyle: { color: r.accent, width: 2 }, itemStyle: { color: r.accent },
      areaStyle: { color: `${r.accent}1f` },
    }],
  }), [robot, r]);

  // 应用需求分布（随类型切换）
  const sectorPie = useMemo(() => donutOpt(r.sectors, { center: ['50%', '46%'] }), [r]);

  // 关键部件自主度（随类型切换，横向 bar）
  const partsBar = useMemo(() => ({
    grid: { left: 80, right: 24, top: 8, bottom: 16 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: {c}%' },
    xAxis: valueY({ max: 100 }),
    yAxis: { type: 'category', data: r.parts.map((p) => p[0]), axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    series: [{
      type: 'bar', barWidth: 14,
      data: r.parts.map((p) => ({ value: p[1], itemStyle: { color: p[1] >= 70 ? '#10b981' : p[1] >= 50 ? '#e8a317' : '#c41e3a', borderRadius: [0, 3, 3, 0] } })),
      label: { show: true, position: 'right', color: LABEL.color, fontSize: 10, formatter: '{c}%' },
    }],
  }), [r]);

  // 密度国际对比
  const densityBar = useMemo(() => ({
    grid: { left: 40, right: 24, top: 16, bottom: 28 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: {c} 台/万人' },
    xAxis: categoryX(DENSITY.map((d) => d.c)),
    yAxis: valueY({ name: '台/万人' }),
    series: [{
      type: 'bar', barWidth: 22,
      data: DENSITY.map((d) => ({ value: d.v, itemStyle: { color: d.color, borderRadius: [3, 3, 0, 0] } })),
      markLine: { silent: true, symbol: 'none', lineStyle: { color: '#22d3ee', type: 'dashed' }, data: [{ yAxis: 470, label: { color: '#22d3ee', fontSize: 10, formatter: '中国 470' } }] },
    }],
  }), []);

  // 核心零部件自主度雷达（中国 vs 全球第一梯队）
  const radarCompare = useMemo(() => ({
    legend: { ...{ textStyle: { color: LABEL.color, fontSize: 10 } }, bottom: 0 },
    radar: {
      indicator: RADAR_INDS.map((n) => ({ name: n, max: 100 })),
      axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
      splitArea: { show: false },
    },
    series: [{
      type: 'radar',
      data: [
        { value: RADAR_CN, name: '中国自主度', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.15)' } },
        { value: RADAR_LEADER, name: '全球第一梯队', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
      ],
    }],
  }), []);

  // 产业规模趋势（堆叠 bar）
  const trendStack = useMemo(() => stackedBarOpt({
    categories: TREND_YEARS,
    series: [
      { name: '工业机器人', data: TREND_INDUSTRIAL, itemStyle: { color: '#c41e3a' } },
      { name: '服务机器人', data: TREND_SERVICE, itemStyle: { color: '#22d3ee' } },
      { name: '人形机器人', data: TREND_HUMANOID, itemStyle: { color: '#e8a317' } },
    ],
  }), []);

  // 人形 BOM donut
  const bomPie = useMemo(() => donutOpt(HUMANOID_BOM, { center: ['50%', '46%'] }), []);

  // 人形量产降本曲线
  const costCurve = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis', formatter: '{b}: {c} 万元/台' },
    xAxis: categoryX(COST_YEARS),
    yAxis: valueY({ name: '万元/台' }),
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 7,
      data: COST_VALUES,
      lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' },
      areaStyle: { color: 'rgba(232,163,23,0.12)' },
      markPoint: { symbolSize: 0, data: [{ coord: ['2026E', 22], value: '商业化拐点', label: { color: '#e8a317', fontSize: 10 } }] },
    }],
  }), []);

  return (
    <div>
      <PageHeader badge="Robotics · 具身智能" title="工业机器人 · 人形产业化" subtitle="机器人密度 · 核心零部件自主度 · 具身智能终局" />
      <IntroCard>
        中国机器人产业崛起是「以资本替代劳动」的长期博弈：全球过半工业机器人装机于中国，配送/清洁服务机器人以量养技反哺供应链。下一阶段的胜负手在
        <strong style={{ color: 'var(--text-primary)' }}> 核心零部件自给率</strong>（RV 减速器、伺服、行星滚柱丝杠）与
        <strong style={{ color: 'var(--text-primary)' }}>人形机器人的量产降本能力</strong>——谁掌握通用机器人量产，谁掌握未来 50 年的生产力主权。
      </IntroCard>

      <StatGrid className="mb-6">
        <Stat value="470 台" label="工业机器人密度/万人" accent="#22d3ee" />
        <Stat value="52%" label="全球工业装机份额" accent="#c41e3a" />
        <Stat value="45%" label="高端核心部件国产化率" accent="#e8a317" />
        <Stat value="2025—26" label="人形机器人小批量量产" accent="#10b981" />
      </StatGrid>

      {/* ① 机器人类型选择器 */}
      <Card title="交互 · 机器人类型选择器" className="mb-6">
        <SelectorBar items={ROBOTS} activeKey={robot} onSelect={setRobot} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${r.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
        </div>

        <StatGrid className="mb-4">
          <Stat value={`${r.share}%`} label={`全球装机份额 · ${r.label}`} accent={r.accent} />
          <Stat value={`${r.density} 台`} label="装机密度/万人(示意)" accent="#22d3ee" />
          <Stat value={`${r.marketCN} 亿`} label="中国市场规模(示意)" accent="#e8a317" />
          <div className="os-card os-stat-card p-4 flex flex-col items-center justify-center gap-1">
            <OsGauge value={r.local} color={r.accent} size={84} label="本体国产化率" />
          </div>
        </StatGrid>

        <Grid cols={2} className="mb-4">
          <Card title="智能泛化能力指数（随类型切换）"><EChart option={intelligenceLine} style={{ height: 220 }} /></Card>
          <Card title="应用需求分布（随类型切换）"><EChart option={sectorPie} style={{ height: 220 }} /></Card>
        </Grid>

        <Grid cols={2}>
          <Card title="关键部件自主度（随类型切换）"><EChart option={partsBar} style={{ height: 200 }} /></Card>
          <Card title="代表企业 · 卡脖子点">
            <div className="flex flex-wrap gap-2 mb-3">
              {r.players.map((p) => (
                <span key={p} className="text-xs px-2.5 py-1 rounded mono" style={{ background: 'var(--bg-elevated)', border: `1px solid ${r.accent}`, color: 'var(--text-secondary)' }}>{p}</span>
              ))}
            </div>
            <div className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid #c41e3a' }}>
              <div className="text-[11px] font-semibold mb-1" style={{ color: '#c41e3a' }}>卡脖子点</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.choke}</p>
            </div>
          </Card>
        </Grid>
      </Card>

      {/* ② 密度国际对比 + ③ 零部件自主度雷达 */}
      <Grid cols={2} className="mb-6">
        <Card title="机器人密度国际对比 · 每万名工人台数（示意 ~2023）">
          <EChart option={densityBar} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            韩国、新加坡以电子/半导体高度自动化领跑；中国密度已超日德，但绝对装机量全球第一，密度仍有翻倍空间。
          </p>
        </Card>
        <Card title="核心零部件自主度雷达 · 中国 vs 全球第一梯队">
          <EChart option={radarCompare} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            谐波减速器、AI 大脑已逼近第一梯队；RV 减速器与高端伺服仍是最深护城河缺口。
          </p>
        </Card>
      </Grid>

      {/* ④ 产业规模趋势 */}
      <Card title="产业规模趋势 · 工业 / 服务 / 人形（亿元，2018→2030E 示意）" className="mb-6">
        <EChart option={trendStack} style={{ height: 280 }} />
        <Grid cols={3} className="mt-4">
          <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>工业 · 存量基本盘</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>增速放缓但规模稳健，国产替代是主线。</p>
          </div>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>服务 · 现金牛</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>以量养技，高国产化率反哺供应链与算法。</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>人形 · 指数级增量</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>2030 前从近乎为零跃升至千亿量级的最大变量。</p>
          </div>
        </Grid>
      </Card>

      {/* ⑤ 人形 BOM + 降本曲线 */}
      <Grid cols={2} className="mb-6">
        <Card title="人形机器人 BOM 成本拆解（占比 %，示意）">
          <EChart option={bomPie} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            执行器/关节模组占整机三成以上，减速器与丝杠是降本与国产化的核心战场。
          </p>
        </Card>
        <Card title="人形机器人量产降本曲线（万元/台，示意）">
          <EChart option={costCurve} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            规模效应 + 丝杠/电机良率爬坡，预计 2030 整机成本击穿个位数万元，开启消费级渗透。
          </p>
        </Card>
      </Grid>

      {/* ⑥ 人形机器人路线 TimelineBar */}
      <Card title="交互 · 人形机器人产业化路线" className="mb-6">
        <TimelineBar stages={ROADMAP} activeIdx={stage} onSelect={setStage} />
      </Card>

      {/* ⑦ FrameworkTrio：换道逻辑 / 卡脖子 / 场景驱动 */}
      <FrameworkTrio cards={[
        {
          title: '换道逻辑：具身智能', subtitle: 'AI + 本体', accent: 'var(--fire-gold)', border: 'var(--fire-gold)',
          body: '具身智能 = 通用大模型（脑）+ 高性能本体（身）。中国在场景数据与本体制造上占优，正以「数据飞轮 + 供应链」对冲算法代差。',
          pillars: [['大模型', 'VLA 视觉-语言-动作。'], ['数据飞轮', '工厂实景强化学习。'], ['本体制造', '全球供应链留存。']],
        },
        {
          title: '卡脖子：高端部件', subtitle: '减速器 / 伺服 / 丝杠', accent: 'var(--cyber-cyan)', border: 'var(--cyber-cyan)',
          body: '减速器、伺服、控制器占工业整机约七成成本；人形新增行星滚柱丝杠、空心杯电机、灵巧手三大新瓶颈，量产良率是攻坚焦点。',
          pillars: [['RV 45%', '寿命与精度待补。'], ['伺服 50%', '编码器分辨率。'], ['丝杠 35%', '人形新护城河。']],
        },
        {
          title: '场景驱动：三级跳', subtitle: '制造 → 物流 → 家庭', accent: 'var(--china-red)', border: 'var(--china-red)',
          body: '从结构化的制造/物流切入，向半结构化商用、再到非结构化家庭逐级渗透；场景越泛化，对通用智能与成本的要求越极致。',
          pillars: [['制造', '结构化、易复制。'], ['物流', '半结构化爬坡。'], ['家庭', '终极万亿市场。']],
        },
      ]} />

      <ModuleFooter moduleId="robotics" disclaimer="公开资料整理，市场规模/密度/成本/国产化率均为示意值，非官方统计 · 仅供分析框架参考，非投资建议" sourceNote="由 china.html「机器人」专题迁移升级" />
    </div>
  );
}
