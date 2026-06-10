import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import ChinaMap from '../../lib/viz/ChinaMap.jsx';

// 省级债务率（债务/综合财力 % · 示意值，量级贴近公开研究）—— name 用 DataV 全称
const DEBT_RATE = [
  { name: '贵州省', value: 295 }, { name: '天津市', value: 290 }, { name: '云南省', value: 270 },
  { name: '青海省', value: 260 }, { name: '甘肃省', value: 240 }, { name: '广西壮族自治区', value: 235 },
  { name: '吉林省', value: 230 }, { name: '宁夏回族自治区', value: 230 }, { name: '重庆市', value: 225 },
  { name: '内蒙古自治区', value: 215 }, { name: '黑龙江省', value: 210 }, { name: '辽宁省', value: 205 },
  { name: '湖南省', value: 195 }, { name: '海南省', value: 185 }, { name: '陕西省', value: 180 },
  { name: '四川省', value: 175 }, { name: '江西省', value: 175 }, { name: '河南省', value: 170 },
  { name: '新疆维吾尔自治区', value: 170 }, { name: '湖北省', value: 168 }, { name: '安徽省', value: 165 },
  { name: '河北省', value: 160 }, { name: '山西省', value: 150 }, { name: '山东省', value: 145 },
  { name: '江苏省', value: 130 }, { name: '浙江省', value: 120 }, { name: '福建省', value: 115 },
  { name: '广东省', value: 95 }, { name: '北京市', value: 90 }, { name: '上海市', value: 85 },
  { name: '西藏自治区', value: 60 },
];

// 显债/隐债分解（债务/GDP % · 2023 示意，源自 china.html debtHeatmapByYear）
const EXPLICIT = [
  { name: '贵州省', value: 52 }, { name: '青海省', value: 48 }, { name: '内蒙古自治区', value: 46 },
  { name: '宁夏回族自治区', value: 44 }, { name: '吉林省', value: 42 }, { name: '广西壮族自治区', value: 42 },
  { name: '天津市', value: 40 }, { name: '海南省', value: 40 }, { name: '甘肃省', value: 40 },
  { name: '安徽省', value: 38 }, { name: '云南省', value: 38 }, { name: '辽宁省', value: 36 },
  { name: '河南省', value: 36 }, { name: '重庆市', value: 36 }, { name: '黑龙江省', value: 34 },
  { name: '江西省', value: 34 }, { name: '湖北省', value: 34 }, { name: '四川省', value: 34 },
  { name: '陕西省', value: 34 }, { name: '新疆维吾尔自治区', value: 34 }, { name: '河北省', value: 32 },
  { name: '山东省', value: 32 }, { name: '湖南省', value: 32 }, { name: '江苏省', value: 30 },
  { name: '山西省', value: 28 }, { name: '福建省', value: 28 }, { name: '浙江省', value: 26 },
  { name: '北京市', value: 24 }, { name: '广东省', value: 24 }, { name: '上海市', value: 22 },
  { name: '西藏自治区', value: 20 },
];
const IMPLICIT = EXPLICIT.map((d) => ({ name: d.name, value: Math.round(d.value * 0.72) }));

// 债务/GDP 排序 Top 10（2023 示意，≥70% 高亮为风险红）
const top10 = ['安徽', '甘肃', '海南', '天津', '广西', '吉林', '宁夏', '内蒙古', '青海', '贵州'];
const top10Val = [65, 68, 68, 68, 72, 72, 75, 78, 82, 88];
const debtRank = {
  grid: { left: 64, right: 40, top: 12, bottom: 24 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'category', data: top10, axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  series: [{
    type: 'bar', barWidth: 12, data: top10Val.map((v) => ({ value: v, itemStyle: { color: v >= 70 ? '#c41e3a' : '#e8a317', borderRadius: 3 } })),
    label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5' },
  }],
};

// 显性债务余额 vs 城投有息债务（万亿元 · 示意，量级贴近公开数据）
const debtTrend = {
  grid: { left: 40, right: 16, top: 32, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5' }, itemWidth: 14 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  series: [
    { name: '显性债务余额', type: 'line', smooth: true, symbol: 'circle', data: [21.3, 25.7, 30.5, 35.1, 40.7, 47.5], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
    { name: '城投有息债务(估)', type: 'line', smooth: true, symbol: 'circle', data: [44, 49, 54, 57, 60, 62], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
  ],
};

export default function Page() {
  return (
    <div>
      <PageHeader
        badge="深度透视 · Local Debt"
        title="地方债务 · 显性隐性与省际热力"
        subtitle="城投 · 化债 · 一揽子方案 · 省际分化"
      />

      <Card className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          地方债务的核心矛盾不在「显性」账面，而在城投平台沉淀的隐性债务：土地财政退潮后，
          以土地增值预期为锚的举债模式失去现金流支撑。债务率（债务/综合财力）的省际分化极为陡峭——
          天津、贵州、云南、青海等地远超 120% 警戒线，而沿海经济大省仍有充足缓冲。
          化债的本质是时间换空间：以低息长久期的政府债券置换高息短久期的隐性债务，同时压实「谁家的孩子谁抱」的属地责任。
        </p>
      </Card>

      <Grid cols={4} className="mb-6">
        <Stat value="~47 万亿" label="显性债务余额（2024 · 地方政府债券）" accent="#c41e3a" />
        <Stat value="~60 万亿" label="城投有息债务（市场估算口径）" accent="#e8a317" />
        <Stat value="12 万亿" label="一揽子化债资源（6+4+2）" accent="#10b981" />
        <Stat value="2028" label="隐性债务清零目标年" accent="#22d3ee" />
      </Grid>

      <Card title="省级债务率热力（债务/综合财力 % · 示意 · 可切换显债/隐债口径 · 点省下钻）" className="mb-6">
        <ChinaMap
          metrics={[
            { key: 'rate', label: '债务率', valueName: '债务率(%)', max: 320, data: DEBT_RATE },
            { key: 'explicit', label: '显债/GDP', valueName: '显性债务/GDP(%)', max: 60, data: EXPLICIT },
            { key: 'implicit', label: '隐债/GDP', valueName: '隐性债务/GDP(%)', max: 45, data: IMPLICIT },
          ]}
          style={{ height: 480 }}
        />
        <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
          阈值仅作示意：债务率 ≥120% 为财政部口径警戒带，深色省区即尾部风险集聚带；与「治理」「金融」模块可交叉阅读。
        </p>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="债务/GDP 排序 Top 10（2023 示意 · ≥70% 标红）">
          <EChart option={debtRank} style={{ height: 280 }} />
        </Card>
        <Card title="显性债务 vs 城投有息债务（万亿元 · 示意）">
          <EChart option={debtTrend} style={{ height: 280 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="显性 vs 隐性 · 两本账">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            显性债务是人大批准限额内的地方政府债券（一般债+专项债），透明可控；
            隐性债务藏在城投平台、政府购买服务与 PPP 中，以政府信用背书却不入账。
            后者规模约为前者 1.2-1.5 倍，是风险定价的真正难点。
          </p>
        </Card>
        <Card title="城投平台 · 制度夹层">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            城投是分税制与土地财政的衍生物：地方以土地注资设平台、平台举债搞基建、土地升值还本付息。
            土地市场转冷后，弱资质城投的「借新还旧」依赖度急升，非标违约与展期事件向债券市场传导。
          </p>
        </Card>
        <Card title="特殊再融资债 · 置换工具">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            2023 年起重启特殊再融资债券，单年发行超 1.5 万亿，贵州、天津、云南获额度最多——
            用省级政府债券置换高息隐债，将票面 7-10% 的非标压到 3% 左右，直接削减利息负担。
          </p>
        </Card>
        <Card title="一揽子方案 · 6+4+2">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            2024 年 11 月落地 12 万亿组合：6 万亿一次性新增置换限额（分三年）+ 4 万亿新增专项债额度（分五年）
            + 2 万亿棚改隐债自然到期，将 2028 年前需消化的隐债从 14.3 万亿压至 2.3 万亿。
          </p>
        </Card>
        <Card title="省际分化 · 苦乐不均">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            同一债务率在不同人均产出与购买力下痛感不同：江苏、浙江债务绝对额大但财力厚、可消化；
            西部弱省财力薄、债务/综合财力突破 250%，新增投资被严控（「砸锅卖铁」名单管理）。
          </p>
        </Card>
        <Card title="中央兜底边界 · 道德风险">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            「谁家的孩子谁抱」是底线话语：中央救流动性不救清偿力，避免全面兜底诱发新一轮举债冲动。
            置换给了时间，但财权事权再平衡与转移支付改革才是治本。
          </p>
        </Card>
      </Grid>

      <Card title="结论 · 时间换空间，但空间要靠改革挣" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          一揽子化债将隐债显性化、长久期化、低息化，短期内系统性违约风险显著下降；
          但债务总量并未消失，只是从「灰色高息」搬到「白色低息」。若土地财政缺口无法由新税基（消费税下划、房产税）填补，
          化债窗口期内的省际分化仍会加深——地图上的深红区域，正是下一轮央地财政关系改革的压力测试场。
        </p>
      </Card>

      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
        示意数据综合公开研究与 Wind 等二手整理，非实时审计口径，不替代审计与财政决算 · 由 china.html「地方债务」专题迁移
      </p>
    </div>
  );
}
