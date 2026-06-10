import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 认知内核 · 中等收入陷阱（Middle Income Trap）思想工具
// ----------------------------------------------------------------------------
// 低成本优势消失、又难在高端创新与发达国家竞争 → 人均收入在「夹层」长期停滞。
// 本页：国别命运对比（人均 GDP 占美国比轨迹）+ 五大陷阱机制 + 跨越要件清单
// + 世行划档与中国位置 + 增长动力切换雷达。数据为公开资料整理的量级示意。
// ============================================================================

const YEARS = ['1960', '1970', '1980', '1990', '2000', '2010', '2020'];

// 人均 GDP 占美国比（%，PPP/市场汇率混合量级示意）
const COUNTRIES = {
  korea: {
    label: '韩国 · 跨越', accent: '#10b981', traj: [5, 8, 14, 28, 48, 62, 70],
    turn: '1990s 转折：研发强度冲上全球第一梯队，财阀完成「代工 → 自主品牌 → 半导体霸权」三级跳，1995 跨入高收入，亚洲金融危机后制度改良反而提速。',
    factors: [['研发强度', 'R&D/GDP 由 0.5% 升至 4%+，全球最高之列'], ['教育红利', '高等教育毛入学率超 90%，工程师密度极高'], ['出口纪律', '以国际市场倒逼企业效率，补贴与业绩挂钩'], ['制度适应', '危机后财阀治理与金融体系刮骨改革']],
  },
  taiwan: {
    label: '台湾地区 · 跨越', accent: '#34d399', traj: [6, 10, 20, 35, 52, 60, 72],
    turn: '1980s 转折：从加工出口区转向新竹科学园区模式，台积电开创晶圆代工分工范式，卡位全球半导体链条最深的护城河。',
    factors: [['产业卡位', '晶圆代工独占生态位，越往后壁垒越深'], ['中小企业网络', '弹性供应链 + 隐形冠军集群'], ['工研院模式', '公共研发机构孵化民间产业'], ['土地改革遗产', '早期分配相对均等，内需与人力资本基础好']],
  },
  japan: {
    label: '日本 · 早跨越后停滞', accent: '#e8a317', traj: [30, 55, 70, 82, 78, 70, 63],
    turn: '1990 转折：早在 1970s 即跨越高收入线，但泡沫破裂 + 人口老化 + 数字化转身迟缓，占美比从 82% 一路回落——跨越之后仍可能「相对衰落」。',
    factors: [['跨越成功', '通产省产业政策 + 终身雇佣的质量文化'], ['泡沫教训', '资产泡沫破裂后资产负债表衰退 30 年'], ['创新错位', '硬件精益登峰造极，软件与平台经济缺席'], ['人口结构', '老龄化最早、最深，需求与活力双降']],
  },
  brazil: {
    label: '巴西 · 典型陷阱', accent: '#c41e3a', traj: [18, 20, 25, 18, 15, 18, 14],
    turn: '1980 转折：进口替代战略撞上债务危机，「失去的十年」后再未回到 1980 年的相对位置——典型的冲高回落、长期滞留陷阱带。',
    factors: [['进口替代失败', '保护出懒惰工业，竞争力始终未及国际线'], ['债务依赖', '靠外债与大宗商品周期续命，利率长期畸高'], ['分配极端失衡', '基尼系数全球最高之列，内需结构断裂'], ['去工业化过早', '制造业占比未到高点即衰退，困于资源出口']],
  },
  argentina: {
    label: '阿根廷 · 反复坠落', accent: '#f87171', traj: [35, 32, 28, 18, 18, 20, 16],
    turn: '1930 之后的百年转折：1913 年人均收入曾列全球前十，此后民粹周期—汇率危机—债务违约循环上演九次，是「从高处坠落」的孤例级警示。',
    factors: [['制度俘获', '庇隆主义分配联盟锁死改革空间'], ['宏观失锚', '通胀惯性 + 汇率管制 + 周期性违约'], ['政策钟摆', '左右剧烈摇摆，无跨周期产业战略'], ['人才外流', '高技能移民持续流出，能力存量耗散']],
  },
  malaysia: {
    label: '马来西亚 · 徘徊', accent: '#a78bfa', traj: [12, 13, 17, 18, 20, 22, 24],
    turn: '1997 转折：亚洲金融危机打断升级节奏，电子组装环节迟迟未升级为自主设计，长期在高收入门槛外 10-20% 处徘徊——「准跨越」样本。',
    factors: [['外资组装锁定', '处全球电子链组装环节，附加值上不去'], ['族群配额政策', '扭曲人才配置与企业激励'], ['资源诱惑', '油气棕榈收入缓解了升级紧迫感'], ['教育断层', '高等教育质量与产业需求脱节']],
  },
  china: {
    label: '中国 · 窗口期', accent: '#22d3ee', traj: [2, 2, 2, 3, 5, 12, 23],
    turn: '2010s 转折：人口红利见顶、传统成本优势让位于东南亚，是否跨越取决于 2020-2035 窗口期内新质生产力、TFP 与制度型开放能否接棒。',
    factors: [['规模市场', '14 亿人单一市场摊薄创新固定成本'], ['全产业链', '联合国工业门类最全，组合创新空间大'], ['工程师红利', '年均千万级理工毕业生接棒人口数量红利'], ['未解之题', '分配/房地产/债务/老龄化与外部技术封锁叠加']],
  },
};

// 陷阱五机制
const MECHANISMS = {
  cost: {
    label: '成本挤压 · 两头夹击', accent: '#c41e3a',
    chain: ['工资随收入水平上涨', '低端订单流向更廉价经济体', '高端环节又被发达国家专利/品牌/标准卡位', '夹层中利润率坍缩 → 投资与升级停滞'],
    china: '制造业时薪已数倍于越南/印度，纺织/组装外迁进行时；但新能源车/光伏/船舶证明部分链条已突围至高端——「夹击」与「突围」并存。', risk: '中',
  },
  innovation: {
    label: '创新不足 · 模仿红利耗尽', accent: '#e8a317',
    chain: ['追赶期靠引进消化吸收（低成本试错）', '逼近技术前沿后「可抄的」越来越少', '原始创新需要基础研究 + 风险资本 + 容错文化', '体系缺位 → TFP 增速归零'],
    china: 'R&D/GDP 约 2.6% 接近 OECD 均值，但基础研究占比 ~6%（韩日 12-15%）；专利数量全球第一与「卡脖子」清单并存，质量换挡是关键。', risk: '中高',
  },
  distribution: {
    label: '分配失衡 · 内需塌陷', accent: '#f87171',
    chain: ['增长红利向资本与少数群体集中', '中产规模不足 → 大众消费市场长不大', '企业被迫继续依赖出口与投资', '外需波动即增长失速（拉美剧本核心）'],
    china: '居民消费率 ~38% 显著低于全球均值（55%+），基尼系数高位徘徊；共同富裕与社保补短板是把「世界工厂」变「世界市场」的前提。', risk: '高',
  },
  capture: {
    label: '制度俘获 · 利益集团锁定', accent: '#a78bfa',
    chain: ['存量利益集团（地产/垄断/平台）坐大', '改革触动存量即被游说阻滞', '资源持续流向低效但有权势的部门', '熊彼特式「创造性破坏」被冻结'],
    china: '土地财政与平台垄断的整治显示打破锁定的意愿；但地方债务—房地产—银行的存量三角仍在缓慢拆弹，改革深水区即此。', risk: '中高',
  },
  debt: {
    label: '债务依赖 · 投资边际递减', accent: '#22d3ee',
    chain: ['增长放缓 → 以加杠杆投资托底', '基建/地产回报率逐轮递减', '债务存量挤占新增信贷与财政空间', '资产负债表衰退风险（日本剧本）'],
    china: '宏观杠杆率 ~290%，增量资本产出率（ICOR）十年翻倍——单位 GDP 需要的投资越来越多；从投资驱动转向 TFP 驱动是数学上的必答题。', risk: '高',
  },
};

// 跨越要件：韩国基准 vs 中国当前（示意评分）
const REQUIREMENTS = ['教育升级', '产业升级', '创新体系', '分配改善', '制度适应'];
const REQ_KOREA = [88, 90, 85, 72, 80];
const REQ_CHINA = [78, 84, 74, 52, 62];

// 概念演进时间线
const TIMELINE = [
  { period: '2007', title: '世行提出', accent: '#e8a317', desc: '世界银行《东亚复兴》报告首提「中等收入陷阱」：东亚经济体能否避免拉美式停滞？概念自此进入政策语汇。' },
  { period: '1980s-2000s', title: '拉美教训', accent: '#c41e3a', desc: '巴西/阿根廷/墨西哥的回溯研究固化了机制清单：债务依赖、分配失衡、过早去工业化、民粹—危机循环。' },
  { period: '1990s-2010s', title: '东亚跨越经验', accent: '#10b981', desc: '韩国与台湾地区证明陷阱并非宿命：教育 + 出口纪律 + 研发强度 + 产业卡位的组合可在一代人内完成跨越。' },
  { period: '2012-2020', title: '中国窗口期之辩', accent: '#22d3ee', desc: '中国跨入中高收入后，「未富先老」「未强先堵」之忧与「规模 + 全链」之恃激烈交锋，窗口期共识形成：2020-2035。' },
  { period: '2017-至今', title: '高质量发展应答', accent: '#a78bfa', desc: '从「高速增长」改写为「高质量发展」，新质生产力 / 全国统一大市场 / 共同富裕，可读作对五大陷阱机制的逐条应答。' },
];

export default function Page() {
  const [ck, setCk] = useState('china');
  const [mk, setMk] = useState('cost');
  const [ti, setTi] = useState(4);
  const c = COUNTRIES[ck];
  const m = MECHANISMS[mk];

  // 多国轨迹（占美国比 %，log 轴 + 陷阱带 markArea）
  const trajOption = useMemo(() => ({
    tooltip: { trigger: 'axis', valueFormatter: (v) => v + '%' },
    legend: { textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0, type: 'scroll' },
    grid: { left: 44, right: 16, top: 30, bottom: 24 },
    xAxis: categoryX(YEARS),
    yAxis: logY({ name: '占美国人均GDP比(%)', nameTextStyle: { color: '#93a1b5', fontSize: 10 }, min: 1, max: 100 }),
    series: Object.entries(COUNTRIES).map(([key, v]) => ({
      type: 'line', name: v.label, data: v.traj, smooth: true, symbol: 'circle', symbolSize: key === ck ? 7 : 3,
      lineStyle: { color: v.accent, width: key === ck ? 3.5 : 1.4, opacity: key === ck ? 1 : 0.55 },
      itemStyle: { color: v.accent },
      emphasis: { focus: 'series' },
      ...(key === ck ? {
        areaStyle: { color: v.accent + '18' },
        markArea: { silent: true, itemStyle: { color: 'rgba(196,30,58,0.07)' }, label: { color: '#93a1b5', fontSize: 10, position: 'insideTopRight' }, data: [[{ yAxis: 10, name: '陷阱带 10-30%' }, { yAxis: 30 }]] },
      } : {}),
    })),
  }), [ck]);

  // 跨越要件对照 bar
  const reqOption = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    grid: { left: 36, right: 16, top: 30, bottom: 24 },
    xAxis: categoryX(REQUIREMENTS),
    yAxis: valueY({ max: 100 }),
    series: [
      { type: 'bar', name: '韩国基准(跨越时)', data: REQ_KOREA, barWidth: 16, itemStyle: { color: '#10b981', borderRadius: [3, 3, 0, 0] } },
      { type: 'bar', name: '中国当前', data: REQ_CHINA, barWidth: 16, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
    ],
  }), []);

  // 世行划档：中国人均 GNI 逼近高收入门槛
  const gniOption = useMemo(() => ({
    tooltip: { trigger: 'axis', valueFormatter: (v) => '$' + v + 'k' },
    legend: { textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    grid: { left: 40, right: 48, top: 30, bottom: 24 },
    xAxis: categoryX(['2000', '2005', '2010', '2015', '2020', '2023', '2025E']),
    yAxis: valueY({ name: '人均GNI(千美元)', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    series: [
      {
        type: 'line', name: '中国人均GNI', data: [0.94, 1.76, 4.34, 7.94, 10.55, 13.4, 14.2], smooth: true,
        lineStyle: { color: '#22d3ee', width: 3 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' },
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { color: '#e8a317', type: 'dashed', width: 1.5 },
          label: { color: '#e8a317', fontSize: 10, formatter: '高收入门槛 ≈$14k' },
          data: [{ yAxis: 14.0 }],
        },
      },
      { type: 'line', name: '中高收入下限', data: [4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5], symbol: 'none', lineStyle: { color: '#93a1b5', type: 'dotted', width: 1 } },
    ],
  }), []);

  // 增长动力切换雷达（双系列内联：跨越国 vs 陷阱国）
  const RADAR_IND = ['要素投入依赖(逆)', '效率提升 TFP', '创新驱动', '人力资本', '出口复杂度', '制度适应力'].map((n) => ({ name: n, max: 100 }));
  const radarOption = useMemo(() => ({
    legend: { textStyle: { color: '#93a1b5', fontSize: 10 }, top: 0 },
    radar: { indicator: RADAR_IND, radius: '62%', axisName: { color: '#93a1b5', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
    series: [{
      type: 'radar',
      data: [
        { value: [82, 86, 84, 88, 90, 80], name: '跨越国(韩/台均值)', lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.12)' } },
        { value: [30, 32, 28, 45, 35, 26], name: '陷阱国(巴/阿/马均值)', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
      ],
    }],
  }), []);

  return (
    <div>
      <PageHeader badge="Cognition · 中等收入陷阱" title="中等收入陷阱 · 为何多数经济体止步于此"
        subtitle="低成本优势已失、高端优势未得的夹层 —— 七国命运对比 + 五大机制解剖 + 中国跨越进度对照" />
      <IntroCard>
        二战以来 101 个中等收入经济体中仅 13 个跨入高收入（世行 2008 测算口径），多数滞留在「占美国人均 GDP 10-30%」的<strong style={{ color: 'var(--text-primary)' }}>陷阱带</strong>数十年。机制内核是<strong style={{ color: 'var(--text-primary)' }}>两头夹击</strong>：工资上涨吃掉低成本优势，而创新体系又尚不足以与发达国家在高端竞争。中国 2023 年人均 GNI 已逼近高收入门槛——能否跨越、以何种方式跨越，是本页思想工具要拆解的问题。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="$13.4k" label="中国人均GNI(2023, 世行口径)" accent="#22d3ee" />
        <Stat value="≈$14k" label="世行高收入门槛(逐年上调)" accent="#e8a317" />
        <Stat value="88/101" label="1960年以来滞留中等收入经济体" accent="#c41e3a" />
        <Stat value="≈13%" label="历史跨越成功率(13/101)" accent="#10b981" />
      </Grid>

      {/* ① 国别命运选择器 + 轨迹对比 */}
      <Card title="交互 · 国别命运选择器 — 七种结局" className="mb-4">
        <SelectorBar items={Object.entries(COUNTRIES).map(([key, v]) => ({ key, label: v.label, accent: v.accent }))} activeKey={ck} onSelect={setCk} />
        <div className="os-card p-4 mb-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${c.accent}` }}>
          <div className="text-sm font-semibold mb-1" style={{ color: c.accent }}>{c.label} · 关键转折</div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.turn}</p>
        </div>
        <Grid cols={4}>
          {c.factors.map(([t, d]) => (
            <div key={t}>
              <div className="text-xs font-semibold mb-1" style={{ color: c.accent }}>{t}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="人均 GDP 占美国比轨迹 · 收敛俱乐部 vs 陷阱带（log 轴, 示意）" className="mb-6">
        <EChart option={trajOption} style={{ height: 320 }} />
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
          阴影区为「陷阱带」（占美 10-30%）：巴西/阿根廷/马来西亚长期滞留其中；韩国与台湾地区一穿而过进入收敛俱乐部；日本提示跨越后仍可能相对回落；中国 2020 年约 23%——正处陷阱带上沿，向上突围或就地滞留，正在此十年决出。
        </p>
      </Card>

      {/* ② 陷阱机制选择器 */}
      <Card title="交互 · 陷阱五机制解剖 — 机理链与中国对照" className="mb-6">
        <SelectorBar items={Object.entries(MECHANISMS).map(([key, v]) => ({ key, label: v.label, accent: v.accent }))} activeKey={mk} onSelect={setMk} />
        <div className="flex flex-wrap items-stretch gap-2 mb-3">
          {m.chain.map((step, i) => (
            <React.Fragment key={step}>
              <div className="os-card p-3 text-[11px] leading-relaxed flex-1" style={{ background: 'var(--bg-elevated)', minWidth: 150, borderTop: `2px solid ${m.accent}`, color: 'var(--text-secondary)' }}>
                <span className="mono" style={{ color: m.accent }}>{i + 1}. </span>{step}
              </div>
              {i < m.chain.length - 1 && <div className="self-center mono text-sm" style={{ color: m.accent }}>→</div>}
            </React.Fragment>
          ))}
        </div>
        <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${m.accent}` }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            中国对照评估 <span className="mono" style={{ color: m.accent }}>风险：{m.risk}</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.china}</p>
        </div>
      </Card>

      {/* ③ 要件清单 + 世行划档 */}
      <Grid cols={2} className="mb-6">
        <Card title="跨越要件清单 · 韩国基准 vs 中国进度（示意评分）">
          <EChart option={reqOption} style={{ height: 260 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
            产业升级与教育升级已接近韩国跨越时水位；最大缺口在<strong style={{ color: 'var(--text-primary)' }}>分配改善</strong>（居民消费率/社保覆盖）与<strong style={{ color: 'var(--text-primary)' }}>制度适应</strong>（要素市场化/法治化营商环境）——恰是拉美式机制的高发区。
          </p>
        </Card>
        <Card title="世行划档 · 中国人均 GNI 逼近高收入门槛">
          <EChart option={gniOption} style={{ height: 260 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
            「最后一公里」存在两重之辨：门槛本身逐年上调（追着跑）；且世行 Atlas 法对汇率敏感——人民币贬值会在统计上推迟跨线时点。名义跨线≠实质跨越，相对位置（占美比）与 TFP 才是硬指标。
          </p>
        </Card>
      </Grid>

      {/* ④ 增长动力切换雷达 */}
      <Card title="增长动力切换 · 跨越国 vs 陷阱国 结构画像（示意）" className="mb-6">
        <EChart option={radarOption} style={{ height: 300 }} />
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
          跨越的本质是增长动力从「要素投入」切换到「效率 + 创新」：跨越国六角全面外扩；陷阱国困在要素依赖与低复杂度出口。中国画像介于两者之间、整体偏向跨越国一侧——但分配与制度两角的塌陷度更接近警戒区。
        </p>
      </Card>

      {/* ⑤ 概念演进时间线 */}
      <Card title="时间线 · 「中等收入陷阱」概念演进" className="mb-6">
        <TimelineBar stages={TIMELINE} activeIdx={ti} onSelect={setTi} />
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '两头挤压', subtitle: '夹层困境', body: '成本优势已失（让位东南亚）、技术优势未得（高端被卡位）的结构性夹层——陷阱的全部机制都是这一夹层的不同切面：利润坍缩、创新断档、分配失衡、债务续命。' },
        { key: 'stone', title: '韩国剧本', subtitle: '研发+财阀+教育', body: '研发强度全球第一 + 财阀沿价值链强制升级 + 高等教育普及率 90%+ 的组合拳，证明一代人内可完成跨越；代价是危机倒逼的制度刮骨——跨越没有免费午餐。' },
        { key: 'path', title: '中国变量', subtitle: '非典型路径', body: '规模市场（摊薄创新成本）+ 全产业链（组合创新空间）+ 新质生产力（国家级 TFP 工程），是历史上没有先例的跨越方案；变数在分配、债务与外部技术封锁三线能否同时拆弹。' },
      ]} />
      <ModuleFooter moduleId="middleincometrap" disclaimer="公开资料整理（世行/Penn World Table 量级示意），评分与轨迹为分析框架示意，非精确统计 · 非投资建议" />
    </div>
  );
}
