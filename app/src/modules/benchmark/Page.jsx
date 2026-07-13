import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, CHART_SERIES_PALETTE, AXIS, LABEL, GRID_LINE, LEGEND } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// 数据来源：china.html「国际对标」专题（WB/IMF/OECD 等公开口径教学示意，2023-2024 基准）
const COUNTRIES = ['中国', '美国', '日本', '德国', '印度'];
const PALETTE = CHART_SERIES_PALETTE;
const axisX = (data) => ({ type: 'category', data, axisLine: AXIS, axisLabel: LABEL });
const axisY = (opts = {}) => ({ type: 'value', axisLabel: { ...LABEL, ...opts.axisLabel }, splitLine: GRID_LINE, ...opts });

// ---------------------------------------------------------------------------
// 对标国数据库（雷达 6 维：经济总量/制造业/科技创新/军事/人口结构/全球影响，归一化 0-100 示意）
// ---------------------------------------------------------------------------
const CHINA_RADAR = [88, 100, 72, 75, 52, 70];
const RADAR_DIMS = ['经济总量', '制造业', '科技创新', '军事力量', '人口结构', '全球影响'];

const PEERS = {
  us: {
    label: '美国', accent: '#22d3ee', radar: [100, 55, 100, 100, 65, 100],
    tagline: '唯一全维度对手 · 体系霸权',
    stats: [
      ['GDP 总量', '~27.4 万亿$', '中国 ~17.8 万亿$，约为其 65%'],
      ['人均 GDP', '~8.2 万$', '约为中国（~1.27 万$）的 6.5 倍'],
      ['军费', '~8800 亿$', '约为中国（~2960 亿$）的 3 倍'],
      ['货币地位', '美元 ~58% 储备份额', '人民币 ~2.3%，差距在金融而非工厂'],
    ],
    learn: '基础研究投入体制（联邦实验室 + 研究型大学 + 风险资本接力）、移民虹吸全球人才、金融市场为创新定价的能力。',
    compete: '科技封锁（芯片/AI 管制清单）、美元结算体系、盟友网络（五眼/北约/印太）。竞争是体系对体系，不是单项对单项。',
    mirror: '美国镜鉴 · 霸权的成本：超发货币与双赤字靠储备货币地位托底，制造业空心化是其阿喀琉斯之踵——这正是中国手里最重的牌，也是美方再工业化政策的全部动机。',
  },
  jp: {
    label: '日本', accent: '#e8a317', radar: [42, 45, 78, 35, 22, 55],
    tagline: '前车之鉴 · 失去三十年的标本',
    stats: [
      ['GDP 峰值占美', '1995 年 ~71%', '此后再未接近；2024 已跌至 ~15%'],
      ['老龄化率', '29.1%', '中国 14.9% 正以更快斜率逼近'],
      ['政府债务/GDP', '~264%', '低利率维系的极限样本'],
      ['人均 GDP', '~3.4 万$', '泡沫破裂后名义值原地踏步三十年'],
    ],
    learn: '产业升级路径（从纺织到汽车到精密制造）、国民健康与社会秩序在长停滞中的韧性、企业出海再造一个海外日本（GNI 视角）。',
    compete: '高端材料与精密设备（光刻胶/轴承/机床）仍卡在产业链上游；日美同盟使其成为对华管制的执行节点。',
    mirror: '日本镜鉴 · 失去三十年：广场协议→汇率升值→资产泡沫→泡沫破裂→资产负债表衰退，叠加老龄化使出清期无限拉长。对中国的警示不是「会不会重演」，而是哪些变量相同（地产泡沫/老龄化/对美顺差），哪些不同（资本管制/经济体量/统一大市场）。',
  },
  de: {
    label: '德国', accent: '#10b981', radar: [38, 50, 75, 30, 30, 60],
    tagline: '隐形冠军 · 制造业的质量极限',
    stats: [
      ['GDP 总量', '~4.5 万亿$', '欧盟引擎，但增速近零'],
      ['制造业占 GDP', '~18%', '发达国家中最高之一'],
      ['隐形冠军', '~1300 家', '占全球隐形冠军约半数'],
      ['工业电价', '俄乌后翻倍', '能源转型与产业外迁双重挤压'],
    ],
    learn: '双元制职业教育（技工的社会地位与供给管道）、中小企业百年深耕单一细分（隐形冠军模式）、工业 4.0 的标准化路线。',
    compete: '高端汽车与机床正面遭遇中国电动化冲击——大众在华份额收缩是两国产业关系反转的缩影。',
    mirror: '德国镜鉴 · 健康账本的失速：债务纪律全球最严（66%）却换来增长停滞；过度依赖俄国能源 + 中国市场 + 美国安保的「三重外包」在地缘剧变中同时失效。对中国的启示：质量与规模不可偏废，且不可把关键变量外包。',
  },
  in: {
    label: '印度', accent: '#93a1b5', radar: [30, 18, 35, 45, 95, 45],
    tagline: '身后的追赶者 · 人口红利对照组',
    stats: [
      ['GDP 增速', '~7.2%', '主要经济体最快，总量仅为中国 1/5'],
      ['年龄中位数', '~28 岁', '中国 ~39 岁，这是印度最大的牌'],
      ['制造业份额', '全球 ~3%', '「印度制造」十年未撼动格局'],
      ['对华贸易', '逆差 ~850 亿$', '越抵制越依赖的结构性矛盾'],
    ],
    learn: 'IT 服务出口的全球嵌入（用英语和时差打进美国体系）、在中美之间左右逢源的战略自主姿态。',
    compete: '苹果链外迁的首选承接地之一；与中国在全球南方话语权、边境与海洋方向直接竞争。',
    mirror: '印度镜鉴 · 红利不会自动兑现：人口结构与中国 1990 年相似，但制造份额、基建密度、女性劳动参与率（~25%）和征地/劳动法改革进度决定红利是资产还是负债。它提醒中国：当年的成功靠的是改革打开的窗口，不是人口本身。',
  },
  kr: {
    label: '韩国', accent: '#a78bfa', radar: [25, 30, 80, 30, 18, 35],
    tagline: '跨越陷阱的小样本 · 财阀模式',
    stats: [
      ['人均 GDP', '~3.3 万$', '约 1/3 世纪从穷国跨入发达行列'],
      ['R&D 强度', '~4.9%', '全球最高，超过美日德'],
      ['总和生育率', '~0.72', '全球最低，比中国更极端的未来'],
      ['财阀集中度', '前 10 财阀 ~60% GDP', '三星一家约占 1/5'],
    ],
    learn: '政府主导的赶超工业化（出口纪律换信贷）、押注半导体/造船/电池的产业豪赌成功学、文化输出（韩流）的软实力杠杆。',
    compete: '存储芯片、造船、电池与显示面板与中国正面相撞；其今天的份额收缩曲线是中国攻坡的镜像。',
    mirror: '韩国镜鉴 · 跨越之后的天花板：成功跨越中等收入陷阱的极少数样本，但代价是财阀垄断、地狱式内卷与 0.72 的生育率——它演示了「跨越陷阱」不等于「解决矛盾」，只是把矛盾推到更高收入水平上重现。',
  },
  eu: {
    label: '欧盟', accent: '#f472b6', radar: [85, 48, 78, 40, 35, 75],
    tagline: '规模相当的规制力量 · 布鲁塞尔效应',
    stats: [
      ['GDP 总量', '~18.6 万亿$', '与中国体量相当的第三极'],
      ['统一市场', '4.5 亿人', '人均 ~4.1 万$ 的高收入市场'],
      ['规制输出', 'GDPR/碳关税/AI 法案', '不造标准产品，但造产品标准'],
      ['对华定位', '伙伴/竞争者/制度对手', '三重定位并存的摇摆变量'],
    ],
    learn: '用单一市场准入权输出规则（布鲁塞尔效应）、碳定价与绿色转型的制度设计、多国协调下的标准化能力。',
    compete: '电动车反补贴税是缩影：中国的产能规模 vs 欧盟的市场准入权，互为筹码。',
    mirror: '欧盟镜鉴 · 没有主权的规模：经济体量足以成极，却因无统一财政与军事而在中美之间被动摇摆；它演示了「规模若不配套主权与决断机制，只是谈判桌上更大的筹码堆」。',
  },
};
const PEER_KEYS = Object.keys(PEERS);

// ---------------------------------------------------------------------------
// 追赶坐标（占美 GDP 比重的历史轨迹 · 名义美元口径示意）
// ---------------------------------------------------------------------------
const CATCHUP_STAGES = [
  { period: '1995', title: '日本峰值 ~71%', accent: '#e8a317', desc: '广场协议后日元升值推高名义比重，泡沫破裂前夜的日本达到对美 GDP 比的历史峰值。此后汇率回落 + 长期停滞，比重一路下行至今约 15%。「71%」由此成为追赶叙事中的心理坐标。' },
  { period: '2001', title: '中国入世 ~13%', accent: '#93a1b5', desc: '加入 WTO 时中国 GDP 仅为美国的约 13%。此后二十年是人类历史上规模最大的追赶：出口导向 + 投资驱动 + 全球化顺风，比重以年均 2-3 个百分点的速度爬升。' },
  { period: '2010', title: '超越日本 ~40%', accent: '#22d3ee', desc: '中国 GDP 总量超过日本成为全球第二，占美比重约 40%。「中国何时超美」开始成为全球宏观的核心命题，主流预测一度集中在 2028-2033。' },
  { period: '2021', title: '中国峰值 ~76%', accent: '#c41e3a', desc: '疫情错位（中国先复工 + 美国大放水前的基数）使比重冲至约 76%，超过日本 1995 年的峰值。这是迄今任何经济体距离美国最近的一次。' },
  { period: '2024', title: '回落 ~63-65%', accent: '#e8a317', desc: '美元加息 + 人民币走弱 + 美国名义高通胀，名义比重回落至 63-65%。「70% 魔咒」之辩由此而起：看空者引日本苏联为证，看多者指出按购买力平价（PPP）中国 2016 年已超美——名义汇率口径本身就是叙事战场。' },
  { period: '之辩', title: '70% 魔咒？', accent: '#a78bfa', desc: '魔咒论：苏联（1970s ~50%）与日本（1995 ~71%）均在逼近后遭遇体系性反制 + 内部失速。反魔咒论：两者样本量为 2，且中国具备核武主权、资本管制、14 亿统一市场与全产业链——前两者各缺其一。真正的变量不是比重数字，而是老龄化曲线与全要素生产率的赛跑。' },
];

// ---------------------------------------------------------------------------
// 静态图表
// ---------------------------------------------------------------------------
const gdpGrowthBar = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: axisX(COUNTRIES),
  yAxis: axisY({ axisLabel: { formatter: '{value}%' } }),
  series: [{ type: 'bar', barWidth: 26, data: [5.2, 2.5, 1.0, 0.5, 7.2].map((v, i) => ({ value: v, itemStyle: { color: PALETTE[i], borderRadius: 4 } })), label: { show: true, position: 'top', formatter: '{c}%', color: LABEL.color, fontSize: 11 } }],
};

const agingDebtBar = {
  legend: { data: ['老龄化率 (65+ %)', '政府债务/GDP (%)'], ...LEGEND, top: 0 },
  grid: { left: 44, right: 16, top: 34, bottom: 24 },
  xAxis: axisX(COUNTRIES),
  yAxis: axisY(),
  series: [
    { name: '老龄化率 (65+ %)', type: 'bar', barWidth: 16, data: [14.9, 17.4, 29.1, 22.3, 7.0], itemStyle: { color: '#e8a317', borderRadius: 3 } },
    { name: '政府债务/GDP (%)', type: 'bar', barWidth: 16, data: [77, 123, 264, 66, 82], itemStyle: { color: '#c41e3a', borderRadius: 3 } },
  ],
};

// GDP 总量 + 人均（双轴：总量 bar 左轴，人均 line 右轴）
const gdpDualOpt = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['GDP 总量（万亿$）', '人均 GDP（万$）'], ...LEGEND, top: 0 },
  grid: { left: 44, right: 48, top: 34, bottom: 24 },
  xAxis: axisX(COUNTRIES),
  yAxis: [
    { ...axisY(), name: '总量', nameTextStyle: { ...LABEL } },
    { ...axisY(), name: '人均', splitLine: { show: false } },
  ],
  series: [
    { name: 'GDP 总量（万亿$）', type: 'bar', barWidth: 24, data: [17.8, 27.4, 4.2, 4.5, 3.6].map((v, i) => ({ value: v, itemStyle: { color: PALETTE[i], borderRadius: 4 } })), label: { show: true, position: 'top', color: LABEL.color, fontSize: 10 } },
    { name: '人均 GDP（万$）', type: 'line', yAxisIndex: 1, data: [1.27, 8.2, 3.4, 5.3, 0.26], symbol: 'circle', symbolSize: 8, lineStyle: { color: '#fff', width: 1.5, type: 'dashed' }, itemStyle: { color: '#fff' }, label: { show: true, position: 'top', color: '#e8a317', fontSize: 10 } },
  ],
};

// 制造业增加值占全球份额
const mfgShareBar = {
  grid: { left: 40, right: 24, top: 20, bottom: 24 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: axisX(['中国', '美国', '日本', '德国', '韩国', '印度']),
  yAxis: axisY({ axisLabel: { formatter: '{value}%' } }),
  series: [{
    type: 'bar', barWidth: 28,
    data: [30, 16, 6, 4, 3, 3].map((v, i) => ({ value: v, itemStyle: { color: PALETTE[i % PALETTE.length], borderRadius: 4 } })),
    label: { show: true, position: 'top', formatter: '{c}%', color: LABEL.color, fontSize: 11 },
    markLine: { silent: true, symbol: 'none', lineStyle: { color: 'rgba(196,30,58,0.5)', type: 'dashed' }, label: { color: '#c41e3a', fontSize: 10, formatter: '美日德韩之和 ≈ 中国' }, data: [{ yAxis: 29 }] },
  }],
};

// R&D 强度
const rdBar = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: axisX(['韩国', '美国', '日本', '德国', '中国', '欧盟', '印度']),
  yAxis: axisY({ axisLabel: { formatter: '{value}%' } }),
  series: [{
    type: 'bar', barWidth: 26,
    data: [4.9, 3.5, 3.3, 3.1, 2.6, 2.2, 0.7].map((v, i) => ({ value: v, itemStyle: { color: ['#a78bfa', '#22d3ee', '#e8a317', '#10b981', '#c41e3a', '#f472b6', '#93a1b5'][i], borderRadius: 4 } })),
    label: { show: true, position: 'top', formatter: '{c}%', color: LABEL.color, fontSize: 11 },
  }],
};

// 系统基准雷达（保留原三国版）
const sysRadar = {
  legend: { data: ['中国', '美国', '印度'], textStyle: { color: LABEL.color, fontSize: 11 }, top: 0 },
  radar: {
    indicator: [{ name: '增速动能', max: 100 }, { name: '人口年轻度', max: 100 }, { name: '杠杆空间', max: 100 }, { name: '制造份额', max: 100 }],
    radius: '62%', axisName: { color: LABEL.color },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
    axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
  },
  series: [{ type: 'radar', data: [
    { value: [72, 60, 70, 95], name: '中国', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [35, 52, 52, 53], name: '美国', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
    { value: [100, 90, 68, 10], name: '印度', lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.08)' } },
  ] }],
};

// ---------------------------------------------------------------------------
// 页面
// ---------------------------------------------------------------------------
export default function Page() {
  const [peerKey, setPeerKey] = useState('us');
  const [stageIdx, setStageIdx] = useState(5);
  const peer = PEERS[peerKey];

  // 多维国力雷达：中国 vs 选中国（双系列内联）
  const vsRadar = useMemo(() => ({
    legend: { data: ['中国', peer.label], textStyle: { color: LABEL.color, fontSize: 11 }, top: 0 },
    tooltip: { trigger: 'item' },
    radar: {
      indicator: RADAR_DIMS.map((n) => ({ name: n, max: 100 })),
      radius: '62%', axisName: { color: LABEL.color, fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
      axisLine: { lineStyle: { color: AXIS.lineStyle.color } },
    },
    series: [{ type: 'radar', data: [
      { value: CHINA_RADAR, name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.14)' } },
      { value: peer.radar, name: peer.label, lineStyle: { color: peer.accent, width: 2 }, itemStyle: { color: peer.accent }, areaStyle: { color: 'rgba(148,163,184,0.10)' } },
    ] }],
  }), [peerKey]);

  return (
    <div>
      <PageHeader badge="Benchmark · 国际对标" title="国际对标 · 追赶坐标与历史镜鉴" subtitle="中 vs 美日德印韩欧 · 总量/人均/制造/研发/国力六维 · 70% 魔咒之辩" />

      <IntroCard>
        对标不是排名游戏，而是定位练习：把中国放进美日德印韩欧的坐标系里，量出三个距离——与美国的「体系距离」（金融/科技/军事/盟友网络）、与日德的「时间距离」（老龄化与债务曲线晚到了多少年）、与印度的「能力距离」（追赶者复制中国剧本还差哪些制度件）。名义 GDP 占美比重从 2021 年的 ~76% 回落至 ~64%，「70% 魔咒」之辩本质是问：中国是下一个日本，还是一个没有先例的样本。本页全部数值为 WB/IMF/OECD 公开口径教学示意。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~64%" label="GDP 占美比重（2024 名义示意，峰值 76%）" accent="#c41e3a" />
        <Stat value="~30%" label="制造业增加值全球份额（≈美日德韩之和）" accent="#22d3ee" />
        <Stat value="2.6%" label="R&D 强度（高于欧盟，低于美日德韩）" accent="#e8a317" />
        <Stat value="~70 位" label="人均 GDP 全球排名（总量第 2 的另一面）" accent="#10b981" />
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 对标国选择器 + 多维国力对比 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="对标国切换 · 与中国的多维对比" className="mb-6">
        <SelectorBar
          items={PEER_KEYS.map((k) => ({ key: k, label: PEERS[k].label, accent: PEERS[k].accent }))}
          activeKey={peerKey} onSelect={setPeerKey} />
        <Grid cols={2}>
          <div>
            <div className="text-xs mono mb-2" style={{ color: peer.accent }}>中国 vs {peer.label} · {peer.tagline}</div>
            <EChart option={vsRadar} style={{ height: 300 }} />
          </div>
          <div className="space-y-3">
            {peer.stats.map(([k, v, note]) => (
              <div key={k} className="flex items-baseline justify-between gap-3" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                <div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{k}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{note}</div>
                </div>
                <div className="text-sm mono font-semibold whitespace-nowrap" style={{ color: peer.accent }}>{v}</div>
              </div>
            ))}
          </div>
        </Grid>
        <Grid cols={2} className="mt-4">
          <div className="os-card p-4" style={{ borderLeft: '3px solid #10b981' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>可借鉴点</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{peer.learn}</p>
          </div>
          <div className="os-card p-4" style={{ borderLeft: '3px solid #c41e3a' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#c41e3a' }}>竞争面</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{peer.compete}</p>
          </div>
        </Grid>
        <div className="os-card p-4 mt-4" style={{ borderLeft: `3px solid ${peer.accent}`, background: 'var(--bg-elevated)' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{peer.mirror}</p>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 总量 vs 人均 · 制造份额 */}
      {/* ------------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="GDP 总量 vs 人均（万亿$ / 万$ · 2024 示意）">
          <EChart option={gdpDualOpt} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            总量逼近（中国 ≈ 美国 65%）与人均悬殊（≈ 美国 1/6.5、德国 1/4）并存——这正是「发展中国家」与「全球第二」两个标签同时为真的算术基础，也是国际谈判中身份选择的弹性空间。
          </p>
        </Card>
        <Card title="制造业增加值占全球份额（% · 示意）">
          <EChart option={mfgShareBar} style={{ height: 260 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            中国约 30% 的份额接近美日德韩四国之和，是 1880 年代以来无国企及的工厂地位。这是金融与军事短板之外最硬的一张牌——所有「脱钩/去风险」政策都在为绕开它定价。
          </p>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 追赶坐标时间线 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="追赶坐标 · 占美 GDP 比重的历史轨迹（名义美元口径）" className="mb-6">
        <TimelineBar stages={CATCHUP_STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 增速/老龄化/债务（保留原系统基准） */}
      {/* ------------------------------------------------------------------ */}
      <Grid cols={2} className="mb-6">
        <Card title="GDP 实际增速（% · 2024 示意）"><EChart option={gdpGrowthBar} style={{ height: 240 }} /></Card>
        <Card title="老龄化率 vs 广义政府债务/GDP（%）"><EChart option={agingDebtBar} style={{ height: 240 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="R&D 强度 · 研发支出/GDP（% · 示意）">
          <EChart option={rdBar} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            中国 2.6% 的强度已超欧盟均值，绝对额全球第二；短板在结构——基础研究占比约 6%（美国约 17%），「从 1 到 N」强而「从 0 到 1」弱的格局尚未反转。
          </p>
        </Card>
        <Card title="系统基准雷达 · 中/美/印（归一化示意）"><EChart option={sysRadar} style={{ height: 264 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="三轴解读 · 同一画布上的相对位置">
          <div className="space-y-3">
            {[['增速轴 · 追赶窗口', '#c41e3a', '印度 7.2% > 中国 5.2% > 美国 2.5% > 日本 1.0% > 德国 0.5%；增速差决定追赶或被追赶的方向与时限。'],
              ['老龄化轴 · 时间压力', '#e8a317', '日本 29.1% 与德国 22.3% 已深度老龄化；中国 14.9% 正快速逼近美国 17.4%，而印度仅 7.0%，人口结构是最难逆转的慢变量。'],
              ['杠杆轴 · 政策空间', '#22d3ee', '日本 264% 展示债务天花板的极限；美国 123% 靠美元霸权延展；中国 77%（不含隐性债务）与德国 66% 名义空间相对充裕。']].map(([t, c, d]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="魔咒之辩 · 正反两造">
          <div className="space-y-3">
            {[['魔咒论 · 体系反制 + 内部失速', '#e8a317', '苏联（1970s 约 50%）与日本（1995 约 71%）逼近后均遭遇美国体系性反制（军备竞赛/广场协议），叠加内部结构问题（计划僵化/资产泡沫）而失速。中国同时面临科技封锁与地产出清，剧本相似度令人不安。'],
              ['反魔咒论 · 样本量为 2', '#10b981', '苏联无市场经济，日本无国防与货币主权——中国两者皆有，且拥有 14 亿统一市场与全产业链。按 PPP 口径中国 2016 年已超美，名义比重回落一半是汇率与通胀的算术，而非实物量的萎缩。'],
              ['共识区 · 真正的赛跑', '#22d3ee', '两造都同意：决定结局的不是占美比重的数字，而是老龄化曲线追上日德之前，全要素生产率能否接替要素投入成为增长引擎。镜鉴的价值是把别人的学费变成自己的边界条件。']].map(([t, c, d]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* ------------------------------------------------------------------ */}
      {/* 历史镜鉴卡 */}
      {/* ------------------------------------------------------------------ */}
      <Card title="历史镜鉴 · 四国一鉴" className="mb-6">
        <Grid cols={4}>
          {[['日本 · 失去三十年', '#e8a317', '泡沫 + 老龄化 + 广场协议的三重叠加。资产负债表衰退理论（辜朝明）由此而生：企业从利润最大化转向负债最小化，货币政策失效。对中国最贵的一课：地产出清的速度决定停滞的长度。'],
            ['德国 · 工业 4.0', '#10b981', '约 1300 家隐形冠军靠双元制技工与百年专注守住高端制造，但「三重外包」（俄能源/中市场/美安保）的脆弱性在 2022 年总爆发。一课：质量路线必须配套战略自主。'],
            ['韩国 · 财阀跨越', '#a78bfa', '政府主导 + 财阀豪赌跨越中等收入陷阱的孤例，代价是 0.72 的生育率与极端内卷。一课：跨越陷阱不消灭矛盾，只是在更高收入上重现矛盾。'],
            ['印度 · 红利对照组', '#93a1b5', '人口结构与中国 1990 年相似，但制造份额 ~3%、女性劳动参与率 ~25%、征地与劳动法改革滞后。一课（反向）：当年中国的成功靠改革打开窗口，不是人口本身。']].map(([t, c, d]) => (
            <div key={t} className="os-card p-4" style={{ borderTop: `2px solid ${c}` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: c }}>{t}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 五国画像（保留） */}
      {/* ------------------------------------------------------------------ */}
      <Card title="五国画像 · 各自的系统约束" className="mb-6">
        <Grid cols={5}>
          {[['中国', '#c41e3a', '未富先老 + 制造份额全球第一；窗口期内须完成增长动能切换，隐性债务是杠杆轴的暗变量。'],
            ['美国', '#22d3ee', '增速在发达国家中领先，债务 123% 由储备货币地位托底；老龄化温和但移民政策波动大。'],
            ['日本', '#e8a317', '老龄化 29.1% + 债务 264% 的双极限样本；低利率维系的债务结构对加息周期高度敏感。'],
            ['德国', '#10b981', '债务纪律最严（66%）但增速近零；制造业外迁与能源转型叠加，是「健康资产负债表 + 增长失速」的样本。'],
            ['印度', '#93a1b5', '增速与人口结构双优，但制造份额低、基础设施与制度能力是红利兑现的瓶颈。']].map(([t, c, d]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="口径说明" className="mb-6">
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          债务与老龄化定义随统计机构调整；广义政府债务口径各国差异显著（中国数值不含地方隐性债务）。占美 GDP 比重为名义美元口径，对汇率与通胀高度敏感——同一实物经济在不同口径下可呈现「追赶」或「回落」两种叙事。雷达归一化为主观教学示意。对比前请核对 IMF WEO 与各国统计局的最新修订。
        </p>
      </Card>

      <Card title="系统观察" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          横比的意义不在排名，而在识别约束的类型：日本式约束来自时间（人口与债务都已透支），印度式约束来自能力（制度与基建跟不上人口），美国式约束来自成本（霸权维护费蚕食实体），中国的约束则是赛跑——能否在老龄化曲线追上日德之前，把增长引擎从要素投入切换到全要素生产率。镜鉴的全部价值，是把别人交过的学费变成自己的边界条件。
        </p>
      </Card>

      <FrameworkTrio cards={[
        { title: '追赶经济学', subtitle: '后发优势 · 中等收入陷阱', body: '后发优势（技术引进/模仿成本低）解释前 70% 的路程，中等收入陷阱解释为何多数国家止步于此——韩国是孤例，拉美与东南亚是常态。中国当前人均 ~1.27 万$ 正处陷阱口径的临界带，跨越与否取决于创新能否接棒模仿。' },
        { title: '日本镜鉴', subtitle: '泡沫 · 老龄化 · 广场协议', body: '前车三件套：汇率被迫升值（广场协议）→ 货币宽松吹大资产泡沫 → 泡沫破裂叠加老龄化进入资产负债表衰退。中国的不同在于资本管制与汇率自主，相同在于地产依赖与人口曲线——学费已由东京垫付，关键看是否照抄答案。' },
        { title: '规模优势', subtitle: '超大市场 · 全产业链', body: '14 亿人统一市场 + 41 个工业大类全覆盖，是苏联与日本都不具备的变量：内需可部分对冲外部封锁，产业链网络效应使「脱钩」成本由全球分摊。规模不保证胜利，但显著抬高对手反制的价格。' },
      ]} />

      <ModuleFooter moduleId="benchmark" disclaimer="WB/IMF/OECD 等公开口径教学示意，雷达与占比为主观归一化，非官方数据 · 仅供比较政治经济分析框架参考，非投资建议" />
    </div>
  );
}
