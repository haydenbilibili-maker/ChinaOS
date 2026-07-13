import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ---------------------------------------------------------------------------
// 数据层 · 六大未来产业赛道（示意值，结构参照工信部「未来产业」六个方向）
// ---------------------------------------------------------------------------

const TRACKS = [
  {
    key: 'mfg', label: '未来制造', accent: '#22d3ee', tag: '人形机器人 · 智能装备',
    dist: 3, weight: 92, heat: [40, 55, 70, 88, 112],
    desc: '人形机器人是「制造业皇冠」级集成考题：减速器、电机、灵巧手、运控算法与大模型具身智能在同一具身体内收敛。当前处于从实验室走向产线的「产业化前夜」，整机成本曲线决定渗透节奏。',
    distLabel: '约 3–5 年（量产爬坡）',
    provinces: '深圳（整机+供应链）/ 上海（具身大模型）/ 杭州（电驱与运控）/ 北京（科研院所）',
    position: '卡位逻辑：复用新能源车供应链（电机/电池/视觉），以「车规级降本」打法压缩 BOM 成本，争取在标准未定型前形成事实生态。',
    constraints: [88, 72, 80, 90, 62],
  },
  {
    key: 'info', label: '未来信息', accent: '#c41e3a', tag: '6G · 量子计算',
    dist: 6, weight: 95, heat: [30, 42, 56, 75, 98],
    desc: '6G 在标准预研期（2030 商用窗口），量子计算处于含噪中等规模（NISQ）向纠错过渡。两者共性：胜负在标准与专利池，而非单点演示机的比特数竞赛。',
    distLabel: '约 5–8 年（标准冻结前）',
    provinces: '北京（量子院+6G 推进组）/ 合肥（量子信息实验室）/ 深圳（通信设备商）/ 武汉（光电子）',
    position: '卡位逻辑：5G 时代的标准必要专利话语权需在 6G 延续；量子保密通信干线先行，以应用侧需求反哺硬件迭代。',
    constraints: [75, 60, 55, 92, 70],
  },
  {
    key: 'mat', label: '未来材料', accent: '#a78bfa', tag: '先进半导体材料 · 超导',
    dist: 5, weight: 85, heat: [22, 30, 42, 55, 72],
    desc: '材料是所有未来产业的「底层税」：第三代半导体、高温超导、生物基材料的突破周期以十年计，且高度依赖工艺 know-how 积累而非论文产出。',
    distLabel: '约 5–10 年（工艺爬坡）',
    provinces: '苏州（纳米材料）/ 宁波（新材料基地）/ 长沙（先进储能材料）/ 西安（超导）',
    position: '卡位逻辑：在稀土、石墨等资源端已有筹码，短板在高纯度制备与器件级验证；以下游整机需求拉动材料国产替代验证窗口。',
    constraints: [70, 65, 60, 78, 58],
  },
  {
    key: 'energy', label: '未来能源', accent: '#e8a317', tag: '可控核聚变 · 钙钛矿',
    dist: 8, weight: 88, heat: [18, 26, 38, 52, 70],
    desc: '聚变是「永远还有三十年」的赛道，但高温超导磁体把工程窗口实质性拉近；钙钛矿叠层电池则是 5 年内可兑现的效率跃迁，两者风险结构完全不同。',
    distLabel: '聚变 10 年+ / 钙钛矿 3–5 年',
    provinces: '合肥（EAST/BEST 聚变）/ 成都（环流三号）/ 上海（高温超导磁体）/ 常州（钙钛矿中试）',
    position: '卡位逻辑：以国家队（聚变公司）+ 商业队（民营聚变）双轨下注；钙钛矿复用光伏既有产能与渠道，防止技术路线切换期被反超。',
    constraints: [65, 70, 72, 75, 55],
  },
  {
    key: 'space', label: '未来空间', accent: '#10b981', tag: '商业航天 · 深海装备',
    dist: 4, weight: 90, heat: [35, 48, 62, 85, 108],
    desc: '低轨星座是轨道与频谱的「先占先得」资源竞赛：星网、千帆与可回收火箭试验并行，发射成本每下降一个量级，商业模式重写一次。深海则是资源勘探与安全感知的双重前沿。',
    distLabel: '约 3–5 年（星座组网期）',
    provinces: '北京（火箭总体）/ 上海（千帆星座）/ 海南（商业发射场）/ 青岛（深海基地）',
    position: '卡位逻辑：轨道/频谱按 ITU 规则先登记先得，组网速度即战略资产；可回收复用技术是成本曲线的唯一解。',
    constraints: [80, 68, 70, 85, 66],
  },
  {
    key: 'health', label: '未来健康', accent: '#f472b6', tag: '脑机接口 · 基因技术',
    dist: 6, weight: 80, heat: [20, 28, 40, 58, 78],
    desc: '脑机接口从医疗严肃场景（渐冻症/脊髓损伤）切入，监管路径决定商业化节奏；基因编辑与细胞治疗已有获批管线，但支付端（医保/商保）是放量瓶颈。',
    distLabel: '约 5–8 年（临床审批周期）',
    provinces: '上海（脑科学中心）/ 北京（脑机接口产业联盟）/ 苏州（生物医药园）/ 深圳（基因测序）',
    position: '卡位逻辑：以临床资源密度（病例规模）换数据优势；伦理与监管框架的「先行先试区」本身就是制度供给型卡位。',
    constraints: [68, 75, 58, 80, 72],
  },
];

const CONSTRAINT_DIMS = ['技术成熟度', '资本耐心', '供应链自主', '人才密度', '制度供给'];

// 概念演进时间线
const PHASES = [
  { period: '2017', title: '高质量发展', accent: '#64748b', desc: '十九大将「高质量发展」确立为主线，增速考核让位于质量效益——为后续生产率叙事预留语境。' },
  { period: '2012–2022', title: '创新驱动战略', accent: '#22d3ee', desc: '创新驱动发展战略十年铺垫：R&D 强度从 1.9% 爬升至 2.5%+，但 TFP 增速并未同步回升——投入产出转化率成为核心质疑。' },
  { period: '2023.9', title: '新质生产力提出', accent: '#c41e3a', desc: '黑龙江考察首次提出「新质生产力」。语义锚点：不是新一轮要素堆量，而是以科技创新为主导、摆脱传统增长路径的生产率命题。' },
  { period: '2024.3', title: '写入政府工作报告', accent: '#e8a317', desc: '列为年度任务之首，配套语「因地制宜」同步写入——中央在概念扩散初期即预置防一哄而上的纠偏条款。' },
  { period: '2024–', title: '未来产业建制化', accent: '#10b981', desc: '工信部等七部门划定六大方向；地方未来产业基金、中试平台、先导区密集挂牌，进入建制化布局与产能纪律博弈期。' },
];

// TFP：中国 vs 美国增速（%，示意，参考 PWT/学界区间估计）
const TFP_YEARS = ['1995', '2000', '2005', '2010', '2015', '2019', '2024'];
const TFP_CN = [3.8, 3.2, 4.5, 3.6, 1.2, 0.8, 1.1];
const TFP_US = [1.2, 1.8, 1.5, 0.9, 0.7, 0.9, 1.3];

// 增长动力分解（%，对 GDP 增速的贡献，示意）
const DECOMP_PERIODS = ['1995–2000', '2000–2008', '2008–2015', '2015–2019', '2020–2024'];
const DECOMP = {
  capital: [4.2, 5.5, 6.0, 4.5, 3.6],
  labor: [1.0, 0.8, 0.3, 0.1, -0.1],
  tfp: [3.5, 4.0, 1.8, 1.0, 1.2],
};

// 专精特新梯队（家数，示意）
const TIERS = [
  { name: '制造业单项冠军', value: 1557, color: '#c41e3a' },
  { name: '专精特新「小巨人」', value: 12950, color: '#e8a317' },
  { name: '专精特新中小企业', value: 141000, color: '#22d3ee' },
];

export default function Page() {
  const [track, setTrack] = useState('mfg');
  const [phaseIdx, setPhaseIdx] = useState(2);
  const t = TRACKS.find((x) => x.key === track) || TRACKS[0];
  const years = ['2020', '2021', '2022', '2023', '2024'];

  // --- 交互①：赛道热度多线（选中加粗） ---
  const trackHeat = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
    grid: GRID,
    xAxis: categoryX(years),
    yAxis: valueY(),
    series: TRACKS.map((tr) => ({
      name: tr.label, type: 'line', smooth: true, symbol: 'none', data: tr.heat,
      lineStyle: { color: tr.accent, width: tr.key === track ? 3 : 1, opacity: tr.key === track ? 1 : 0.35 },
    })),
  }), [track]);

  // --- 交互①：赛道约束因子横条 ---
  const constraintBar = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 76, right: 40, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100 }),
    yAxis: categoryX(CONSTRAINT_DIMS),
    series: [{
      type: 'bar', barWidth: 14, itemStyle: { color: t.accent, borderRadius: 3 },
      data: t.constraints,
      label: { show: true, position: 'right', color: LABEL.color, fontSize: 10 },
    }],
  }), [t]);

  // --- TFP 双线 ---
  const tfpLines = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
    grid: GRID,
    xAxis: categoryX(TFP_YEARS),
    yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
    series: [
      { name: '中国 TFP 增速', type: 'line', smooth: true, symbol: 'circle', data: TFP_CN, lineStyle: { color: '#c41e3a', width: 3 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.10)' }, markLine: { silent: true, symbol: 'none', lineStyle: { color: '#e8a317', type: 'dashed' }, label: { color: '#e8a317', fontSize: 10, formatter: '2015 后失速带' }, data: [{ xAxis: '2015' }] } },
      { name: '美国 TFP 增速（参照）', type: 'line', smooth: true, symbol: 'none', data: TFP_US, lineStyle: { color: '#22d3ee', width: 2, type: 'dashed' } },
    ],
  }), []);

  // --- 增长动力分解堆叠 ---
  const decompStack = useMemo(() => stackedBarOpt({
    categories: DECOMP_PERIODS,
    series: [
      { name: '资本投入贡献', data: DECOMP.capital, itemStyle: { color: '#64748b' } },
      { name: '劳动投入贡献', data: DECOMP.labor, itemStyle: { color: '#e8a317' } },
      { name: 'TFP 贡献', data: DECOMP.tfp, itemStyle: { color: '#c41e3a' } },
    ],
  }), []);

  // --- 新质生产力构成雷达（单系列） ---
  const npfRadar = useMemo(() => radarOpt(
    ['科技创新', '未来产业', '数字经济', '绿色转型', '人才要素', '制度供给'],
    [78, 62, 85, 80, 72, 58],
    { name: '新质生产力构成（示意评分）', color: '#c41e3a' },
  ), []);

  // --- 成熟度矩阵散点：产业化距离 × 战略权重 ---
  const maturityScatter = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.data[3]}<br/>产业化距离：约 ${p.data[0]} 年<br/>战略权重：${p.data[1]}`,
    },
    grid: { left: 48, right: 24, top: 24, bottom: 40 },
    xAxis: { type: 'value', name: '产业化距离（年）', nameLocation: 'middle', nameGap: 26, nameTextStyle: { color: LABEL.color, fontSize: 10 }, min: 0, max: 12, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    yAxis: { type: 'value', name: '战略权重', nameTextStyle: { color: LABEL.color, fontSize: 10 }, min: 70, max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    series: [{
      type: 'scatter',
      symbolSize: (d) => (d[2] === track ? 26 : 16),
      data: TRACKS.map((tr) => ({
        value: [tr.dist, tr.weight, tr.key, tr.label],
        itemStyle: { color: tr.accent, opacity: tr.key === track ? 1 : 0.55, borderColor: tr.key === track ? '#fff' : 'transparent', borderWidth: 1.5 },
        label: { show: true, position: 'top', color: tr.accent, fontSize: 10, formatter: tr.label },
      })),
    }],
  }), [track]);

  // --- 专精特新梯队金字塔 ---
  const tierBar = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (ps) => ps.map((p) => `${p.name}：约 ${p.value.toLocaleString()} 家`).join('<br/>') },
    grid: { left: 110, right: 56, top: 16, bottom: 24 },
    xAxis: logY({ axisLabel: { formatter: (v) => v.toLocaleString() } }),
    yAxis: categoryX(TIERS.map((x) => x.name)),
    series: [{
      type: 'bar', barWidth: 18,
      data: TIERS.map((x) => ({ value: x.value, itemStyle: { color: x.color, borderRadius: 3 } })),
      label: { show: true, position: 'right', color: LABEL.color, fontSize: 10, formatter: (p) => p.value.toLocaleString() },
    }],
  }), []);

  // --- 未来产业资本结构（保留原图，随赛道微调） ---
  const capitalDonut = useMemo(() => donutOpt([
    { value: track === 'space' ? 18 : 12, name: '空天与深海', itemStyle: { color: '#10b981' } },
    { value: track === 'mfg' ? 32 : 26, name: '智能制造与机器人', itemStyle: { color: '#22d3ee' } },
    { value: track === 'info' ? 28 : 22, name: '信息与算力', itemStyle: { color: '#c41e3a' } },
    { value: track === 'health' ? 24 : 16, name: '生命科技', itemStyle: { color: '#f472b6' } },
    { value: track === 'energy' ? 22 : 14, name: '能源与材料', itemStyle: { color: '#e8a317' } },
  ]), [track]);

  return (
    <div>
      <PageHeader badge="New Productive Forces" title="新质生产力 · 未来产业" subtitle="TFP 重启 · 六大赛道卡位 · 因地制宜纪律" />
      <IntroCard>
        新质生产力的本质命题只有一个：在资本边际回报递减、劳动供给转负之后，<strong style={{ color: 'var(--text-primary)' }}>重启全要素生产率（TFP）</strong>。
        未来产业是这一命题的载体——在产业化前夜进行制度与产能的先发卡位；「因地制宜」则是同一份文件里预装的刹车，防止六条赛道在三十一个省份被复制三十一遍。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~1.1%" label="TFP 增速（2024，示意）" accent="#c41e3a" />
        <Stat value="6" label="未来产业主攻方向" accent="#22d3ee" />
        <Stat value="14万+" label="专精特新中小企业" accent="#e8a317" />
        <Stat value="1.2万+" label="专精特新「小巨人」" accent="#10b981" />
      </Grid>

      {/* ----------------------------------------------------------------- */}
      <Card title="交互① · 六大未来产业赛道选择器" className="mb-6">
        <SelectorBar items={TRACKS} activeKey={track} onSelect={setTrack} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${t.accent}` }}>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-sm font-semibold" style={{ color: t.accent }}>{t.label}</span>
            <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{t.tag}</span>
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
          <Grid cols={3}>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: t.accent }}>产业化距离</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{t.distLabel}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: t.accent }}>主要布局省市</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{t.provinces}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: t.accent }}>卡位逻辑</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{t.position}</p>
            </div>
          </Grid>
        </div>
        <Grid cols={2}>
          <Card title="赛道热度指数（2020–2024，示意）"><EChart option={trackHeat} style={{ height: 260 }} /></Card>
          <Card title="赛道约束因子评分（随选择切换）"><EChart option={constraintBar} style={{ height: 260 }} /></Card>
        </Grid>
      </Card>

      {/* ----------------------------------------------------------------- */}
      <Card title="交互② · 概念演进时间线 — 从高质量发展到建制化布局" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* ----------------------------------------------------------------- */}
      <Card title="TFP 命题 · 全要素生产率的失速与重启" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          2008 年后中国 TFP 增速台阶式下行，2015 年后进入 1% 上下的失速带——同期 R&D 投入持续爬升，说明瓶颈不在投入端而在<strong style={{ color: 'var(--text-primary)' }}>配置效率与转化机制</strong>。
          新质生产力可以读作对这条曲线的政策回应：若 TFP 不能回到 2% 以上，潜在增速将被资本与劳动两端同时锁死。
        </p>
        <Grid cols={2}>
          <Card title="中美 TFP 增速演进（%，示意区间估计）"><EChart option={tfpLines} style={{ height: 280 }} /></Card>
          <Card title="增长动力分解 · 资本/劳动/TFP 贡献（pct，示意）"><EChart option={decompStack} style={{ height: 280 }} /></Card>
        </Grid>
        <Grid cols={3} className="mt-4">
          {[['要素驱动期', '1995–2008：资本+TFP 双高，城镇化与入世红利同时释放，TFP 贡献峰值约 4 个百分点。'],
            ['投资依赖期', '2008–2019：四万亿后资本贡献独大，TFP 贡献腰斩——单位投资的产出弹性持续走低。'],
            ['创新驱动考题', '2020–：劳动贡献转负，资本回报递减，剩余的增长方程里 TFP 是唯一可扩张项。']].map(([tit, txt]) => (
            <div key={tit}>
              <div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{tit}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{txt}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ----------------------------------------------------------------- */}
      <Grid cols={2} className="mb-6">
        <Card title="新质生产力构成雷达（六维，示意评分）">
          <EChart option={npfRadar} style={{ height: 280 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            短板读数：制度供给（58）与未来产业成熟度（62）显著低于数字经济（85）——政策文件密度不等于制度供给质量。
          </p>
        </Card>
        <Card title="未来产业成熟度矩阵 · 产业化距离 × 战略权重">
          <EChart option={maturityScatter} style={{ height: 280 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            左上象限（距离近 × 权重高）为资源主战场：未来制造与未来空间；未来能源（聚变）权重高但距离最远，属于「国家队长周期持有」资产。
          </p>
        </Card>
      </Grid>

      {/* ----------------------------------------------------------------- */}
      <Grid cols={2} className="mb-6">
        <Card title="专精特新梯队金字塔（家数，对数轴，示意）">
          <EChart option={tierBar} style={{ height: 260 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            梯队结构是新质生产力的微观底座：14 万专精特新 → 1.2 万小巨人 → 1500+ 单项冠军，逐级筛选隐形冠军候选池。
          </p>
        </Card>
        <Card title="未来产业资本结构（随赛道切换，示意）">
          <EChart option={capitalDonut} style={{ height: 260 }} />
          <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            耐心资本配比是赛道兑现率的先行指标：大基金三期 + 地方未来产业基金 + 险资长钱，匹配 10 年级回报周期。
          </p>
        </Card>
      </Grid>

      {/* ----------------------------------------------------------------- */}
      <FrameworkTrio cards={[
        {
          title: 'TFP 重启', subtitle: '增长方程的唯一可扩张项',
          body: '土地—基建—地产的旧要素红利耗尽后，资本贡献递减、劳动贡献转负，TFP 成为潜在增速的唯一弹性来源。新质生产力不是产业名单，而是生产率政策。',
          pillars: [['配置效率', '要素市场化改革决定 TFP 下限。'], ['转化机制', 'R&D 投入 → 生产率的管道修复。'], ['退出纪律', '低效产能出清是 TFP 的减法侧。']],
        },
        {
          title: '未来产业卡位', subtitle: '产业化前夜的制度先发',
          body: '六大赛道共性：技术路线未收敛、标准未冻结、成本曲线未定型。在此窗口内的卡位资产是标准话语权、轨道频谱、供应链 know-how，而非当期产值。',
          pillars: [['标准先发', '专利池与互操作规则。'], ['场景开放', '先行先试区即制度供给。'], ['供应链复用', '新能源车链条向机器人迁移。']],
        },
        {
          title: '因地制宜', subtitle: '防一哄而上的预装刹车',
          body: '概念提出半年内「因地制宜」即写入政府工作报告——中央预判地方会把六条赛道当成新一轮产能竞赛。考核若锚定短期产值，未来产业将复刻光伏式重复建设。',
          pillars: [['禀赋匹配', '不是每省都需要人形机器人。'], ['产能纪律', '中试平台共享替代重复投建。'], ['容错考核', '失败率定价进入官员考核。']],
        },
      ]} />

      {/* ----------------------------------------------------------------- */}
      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 成色检验', '判别真伪新质生产力看三个收敛：TFP 增速回升、专精特新梯队增厚、标准必要专利份额——三者背离时以 TFP 为准。'],
            ['2 · 节奏错配', '未来产业回报周期 10 年级，地方政府任期 5 年级，资本退出期 7 年级——三个时钟的错配是最大隐性风险。'],
            ['3 · 重复建设预警', '当六大赛道的省级规划覆盖率超过 2/3 时，光伏—锂电式产能过剩剧本进入倒计时；观测指标：中试平台空置率。']].map(([tit, txt]) => (
            <div key={tit}>
              <div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{tit}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{txt}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <ModuleFooter moduleId="npf" disclaimer="公开资料整理，TFP/梯队/热度等均为示意估计值非官方统计 · 仅供分析框架参考，非投资建议" sourceNote="由 china.html「新质生产力」专题迁移并扩容" />
    </div>
  );
}
