import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 议题数据 · 粮食/土地/县域/增收/人口/数字 六大议题（现状-机制-矛盾-政策 四维）
// ============================================================================
const ISSUES = [
  {
    key: 'grain', label: '粮食与耕地', accent: '#10b981',
    status: '粮食产量连续多年稳定在 1.3 万亿斤以上，2023 年约 6.95 亿吨（示意）；但耕地「非农化、非粮化」压力持续，18 亿亩红线靠占补平衡与进出平衡双闸门维持。',
    mechanism: '粮食安全党政同责 + 主产区利益补偿 + 最低收购价托底。种粮比较收益低于经济作物与外出务工，产能维持本质是财政与行政双重补贴的结果。',
    tension: '生态红线（地下水超采、黑土退化）与产能红线互相挤压：华北压采意味着减灌，东北黑土保护意味着休耕轮作——增产只能压向单产与种业。',
    policy: '高标准农田累计建成超 10 亿亩（量级），种业振兴行动聚焦「卡脖子」种源；大豆油料扩种以行政指标分解到省，市场化程度有限。',
  },
  {
    key: 'land', label: '土地制度', accent: '#e8a317',
    status: '承包地完成确权颁证，流转面积占比约 1/3 强（示意）；宅基地约 1/3 闲置或季节性闲置；集体经营性建设用地入市试点扩面但成交规模仍小。',
    mechanism: '三权分置把「所有权-承包权-经营权」拆开，理论上让土地要素流动而不动摇集体所有制；宅基地三权分置同构复制，但「资格权」边界至今模糊。',
    tension: '农民最大的「沉睡资产」是宅基地与农房，但抵押、转让面向村集体外成员仍被严格限制——唤醒资产与守住「农民失地失所」底线之间是真实的两难。',
    policy: '深化试点强调「三条底线」：土地公有制不变、耕地红线不破、农民利益不受损。增值收益分配向集体和农民倾斜是改革成色的试金石。',
  },
  {
    key: 'county', label: '县域经济', accent: '#22d3ee',
    status: '全国 1800 余县（市）贡献约 38% GDP（示意），但内部极度分化：百强县人均 GDP 超全国平均，资源枯竭县与边境县财政自给率不足 20%。',
    mechanism: '县域是「城尾乡头」：承接产业梯度转移、吸纳县内城镇化、提供农民「半工半耕」的就业半径。县城公共服务能力决定农民进城的真实成本。',
    tension: '「千县千面」：苏南强县靠产业集群，中部农业大县靠转移支付吃饭，财政供养人口与产业空心化互为因果——一刀切的县城城镇化方案不存在。',
    policy: '以县城为重要载体的城镇化建设；土地指标、专项债向县域倾斜；防止「造城运动」重演，人口流出县明确要求收缩规划而非扩张。',
  },
  {
    key: 'income', label: '农民增收', accent: '#c41e3a',
    status: '2023 年农村居民人均可支配收入约 2.17 万元（示意），城乡收入比降至 2.39 左右；但绝对差距仍在扩大，财产性收入占比不足 3%。',
    mechanism: '四轮驱动：工资性（务工）约 42%、经营性（农业+小生意）约 34%、转移性约 21%、财产性约 3%。增收主引擎是务工工资，而非农业本身。',
    tension: '务工收入受制于宏观就业景气与建筑业收缩；经营性收入受农产品价格天花板压制；财产性收入被土地制度锁死——三条路同时变窄时转移支付独木难支。',
    policy: '脱贫攻坚与乡村振兴衔接期防返贫监测；农民工工资保障条例；财产性收入突破口押注宅基地与集体资产股份化改革试点。',
  },
  {
    key: 'population', label: '人口流出与老龄化', accent: '#8b5cf6',
    status: '乡村常住人口从 2010 年约 6.7 亿降至 2023 年约 4.77 亿（示意）；乡村 60 岁以上人口占比超 23%，高出城镇约 7 个百分点。',
    mechanism: '青壮年单向流出形成「386199 部队」（妇女、儿童、老人留守）；村庄空心化与县城聚集并行——人口不是消失，而是在县域内重新分布。',
    tension: '谁来种地：小农户经营者平均年龄逼近 60 岁；社会化服务与土地托管是替代方案，但丘陵山区机械化经济性差，规模化有自然边界。',
    policy: '农村养老服务补短板、互助养老试点；村庄分类规划（集聚提升/搬迁撤并）承认部分村庄将自然消亡——这是政策文本里罕见的「收缩叙事」。',
  },
  {
    key: 'digital', label: '数字乡村', accent: '#3b82f6',
    status: '行政村 4G/光纤通达率接近 100%，农村网络零售额超 2.5 万亿元（示意）；但冷链「最初一公里」与品控标准仍是农产品上行瓶颈。',
    mechanism: '电商平台 + 县域物流共配 + 直播带货重构流通链路，缩短从田头到餐桌的环节；数字支付下沉快于物理基建，渗透先于产业。',
    tension: '流量不等于产业：网红县的直播 GMV 与本地税收、就业的转化率低；数据与算法在平台手里，县域只是供应链末端的「数字佃农」风险真实存在。',
    policy: '数字乡村发展行动；快递进村工程；智慧农业（遥感、物联网）补贴试点——硬件覆盖易、运营可持续难，奖补退出后的存活率是真考题。',
  },
];

// ============================================================================
// 时间线 · 三农制度演进五阶段
// ============================================================================
const STAGES = [
  { period: '1978-2005', title: '家庭联产承包', accent: '#10b981', desc: '包产到户释放第一轮制度红利，乡镇企业异军突起；但「剪刀差」遗产仍在：农业税费叠加工农产品价格剪刀差，农村持续向城市与工业输血。' },
  { period: '2006', title: '取消农业税', accent: '#22d3ee', desc: '延续两千六百年的「皇粮国税」终结，城乡关系从「取」转向「予」；同年起以工补农、以城带乡成为基调，转移支付通道全面打开。' },
  { period: '2013-2020', title: '脱贫攻坚', accent: '#c41e3a', desc: '现行标准下 9899 万农村贫困人口全部脱贫、832 个贫困县摘帽；超常规动员（驻村第一书记、对口帮扶）证明体制的纵向穿透力，也留下后续可持续性问题。' },
  { period: '2021-2025', title: '衔接过渡期', accent: '#e8a317', desc: '设 5 年过渡期防止规模性返贫，帮扶政策「扶上马送一程」；乡村振兴局并入农业农村部，叙事从「攻坚」转向「常态化制度建设」。' },
  { period: '2025+', title: '城乡融合 · 要素双向流动', accent: '#8b5cf6', desc: '改革深水区：人（户籍与公共服务）、地（宅基地与入市）、钱（财政与社会资本）三要素能否真正双向流动，决定乡村是「振兴」还是「体面收缩」。' },
];

// ============================================================================
// 图表 option · 城乡收入比 / 县域分化 / 人口结构 / 雷达 / 收入构成
// ============================================================================

// 城乡收入比 + 农村转移性收入占比（双轴双线）
const incomeGapOpt = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: { left: 44, right: 48, top: 32, bottom: 24 },
  xAxis: categoryX(['2010', '2013', '2016', '2019', '2021', '2023']),
  yAxis: [
    valueY({ min: 2.2, max: 3.4, name: '收入比', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    valueY({ min: 0, max: 30, name: '转移占比%', nameTextStyle: { color: '#93a1b5', fontSize: 10 }, splitLine: { show: false } }),
  ],
  series: [
    { name: '城乡收入比(农村=1)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [3.23, 3.03, 2.72, 2.64, 2.50, 2.39], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    { name: '农村转移性收入占比%', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: [7.7, 10.4, 18.8, 20.6, 20.9, 21.4], lineStyle: { color: '#22d3ee', width: 2, type: 'dashed' }, itemStyle: { color: '#22d3ee' } },
  ],
};

// 县域分化 · 百强县 vs 一般农业县 vs 人口流出县（人均指标 bar）
const countyDivergeOpt = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: { left: 44, right: 16, top: 32, bottom: 24 },
  xAxis: categoryX(['人均GDP(万元)', '财政自给率(%)/10', '人口增长指数', '工业占比(%)/10']),
  yAxis: valueY(),
  series: [
    { name: '百强县(均值)', type: 'bar', barWidth: 14, data: [13.2, 7.8, 10.4, 4.6], itemStyle: { color: '#22d3ee', borderRadius: 3 } },
    { name: '一般农业县', type: 'bar', barWidth: 14, data: [4.8, 2.4, 9.2, 2.2], itemStyle: { color: '#e8a317', borderRadius: 3 } },
    { name: '人口流出县', type: 'bar', barWidth: 14, data: [3.6, 1.5, 7.8, 1.6], itemStyle: { color: '#8b5cf6', borderRadius: 3 } },
  ],
};

// 乡村人口 + 老龄化率（柱线双轴）
const ruralPopOpt = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: { left: 44, right: 48, top: 32, bottom: 24 },
  xAxis: categoryX(['2010', '2015', '2018', '2020', '2022', '2023']),
  yAxis: [
    valueY({ min: 0, max: 8, name: '亿人', nameTextStyle: { color: '#93a1b5', fontSize: 10 } }),
    valueY({ min: 0, max: 30, name: '60+占比%', nameTextStyle: { color: '#93a1b5', fontSize: 10 }, splitLine: { show: false } }),
  ],
  series: [
    { name: '乡村常住人口(亿)', type: 'bar', barWidth: 18, data: [6.71, 6.03, 5.64, 5.10, 4.91, 4.77], itemStyle: { color: 'rgba(139,92,246,0.55)', borderRadius: 3 } },
    { name: '乡村60岁+占比%', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: [15.0, 18.5, 20.5, 23.8, 24.7, 25.3], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
  ],
};

// 五大振兴雷达（单系列 · radarOpt）
const revitalRadar = radarOpt(
  ['产业振兴', '人才振兴', '文化振兴', '生态振兴', '组织振兴'],
  [78, 52, 60, 74, 64],
  { name: '推进度(示意)', color: '#10b981' },
);

// 农民收入构成 donut
const incomeDonut = donutOpt([
  { name: '工资性收入', value: 42, itemStyle: { color: '#22d3ee' } },
  { name: '经营净收入', value: 34, itemStyle: { color: '#10b981' } },
  { name: '转移净收入', value: 21, itemStyle: { color: '#e8a317' } },
  { name: '财产净收入', value: 3, itemStyle: { color: '#c41e3a' } },
]);

// 农民收入结构演进 stacked bar（万元 · 示意）
const incomeStackOpt = stackedBarOpt({
  categories: ['2013', '2016', '2019', '2021', '2023'],
  series: [
    { name: '工资性', data: [0.42, 0.51, 0.66, 0.79, 0.91], itemStyle: { color: '#22d3ee' } },
    { name: '经营性', data: [0.39, 0.47, 0.58, 0.65, 0.74], itemStyle: { color: '#10b981' } },
    { name: '转移性', data: [0.17, 0.23, 0.32, 0.39, 0.46], itemStyle: { color: '#e8a317' } },
    { name: '财产性', data: [0.02, 0.03, 0.04, 0.05, 0.06], itemStyle: { color: '#c41e3a' } },
  ],
});

// 粮食产量（保留原线，万吨）
const grainLine = {
  tooltip: { trigger: 'axis' },
  grid: { left: 56, right: 16, top: 20, bottom: 24 },
  xAxis: categoryX(['2018', '2019', '2020', '2021', '2022', '2023']),
  yAxis: valueY({ min: 12800 }),
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [13158, 13277, 13390, 13657, 13731, 13908], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.12)' } }],
};

// 县域数字基建推进度（保留原横条）
const techBar = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 80, right: 40, top: 16, bottom: 24 },
  xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  yAxis: categoryX(['遥感监测', '冷链覆盖', '益农信息社', '宽带通达', '电商服务站']),
  series: [{ type: 'bar', data: [38, 45, 60, 85, 92], barWidth: 14, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5' } }],
};

// 土地制度三栏
const LAND_CARDS = [
  {
    title: '承包地 · 三权分置', accent: '#10b981',
    rows: [['所有权', '集体所有不可动摇——这是整个制度的锚。'], ['承包权', '农户长期稳定，二轮到期后再延 30 年。'], ['经营权', '可流转、可入股、可抵押融资试点，规模经营的法律接口。']],
    note: '流转面积约占承包地 1/3 强（示意），但多为村内熟人流转，市场化程度有限。',
  },
  {
    title: '宅基地 · 三权分置', accent: '#e8a317',
    rows: [['所有权', '村集体持有，宅基地不得向城镇居民出售。'], ['资格权', '农户身份性权利——边界至今未在法律上厘清。'], ['使用权', '允许出租、入股发展民宿等业态，期限受限。']],
    note: '约 1/3 宅基地闲置（示意）。「沉睡资产」唤醒之辩：是农民最大的潜在财产，还是最后的退路保险？两种叙事背后是两种改革速度。',
  },
  {
    title: '集体经营性建设用地入市', accent: '#22d3ee',
    rows: [['同权同价', '与国有建设用地同等入市、同权同价——纸面原则。'], ['增值收益', '土地增值收益调节金：国家、集体、农民如何切分。'], ['规模现状', '试点成交规模与国有土地出让相比仍是零头。']],
    note: '真正的深水区：一旦大规模入市，将直接冲击地方政府土地财政的独家供地垄断。',
  },
];

// ============================================================================
// 页面
// ============================================================================
export default function Page() {
  const [issueKey, setIssueKey] = useState('grain');
  const [stageIdx, setStageIdx] = useState(4);

  const issue = useMemo(() => ISSUES.find((i) => i.key === issueKey) || ISSUES[0], [issueKey]);

  return (
    <div>
      <PageHeader badge="Rural · 粮食安全党政同责" title="乡村振兴 · 县域与土地制度" subtitle="粮食产能 · 土地三权 · 县域分化 · 人口流出 · 城乡要素流动" />

      <IntroCard>
        乡村振兴的冷峻底色：这不是一场田园牧歌式的复兴，而是一张长周期资产负债表的修复。资产端是 18 亿亩耕地、数亿亩宅基地与县域产业；负债端是工农剪刀差的历史欠账、4.77 亿乡村常住人口中超过 23% 的老龄化、与被土地制度锁死的财产性收入。粮食安全党政同责划定底线，城乡要素能否真正双向流动决定上限——部分村庄将振兴，更多村庄将体面收缩，政策文本已悄然承认这一点。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="2.39 : 1" label="城乡居民收入比（2023 示意）" accent="#e8a317" />
        <Stat value="1.39 万亿斤" label="粮食年产量（2023 示意）" accent="#10b981" />
        <Stat value="~38%" label="县域 GDP 占全国比重（示意）" accent="#22d3ee" />
        <Stat value="4.77 亿" label="乡村常住人口（2023 示意）" accent="#8b5cf6" />
      </Grid>

      {/* ---- 议题选择器：现状 / 机制 / 矛盾 / 政策 ---- */}
      <Card title="六大议题透视 · 点选切换" className="mb-6">
        <SelectorBar items={ISSUES} activeKey={issueKey} onSelect={setIssueKey} />
        <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${issue.accent}` }}>
          <div className="text-sm font-semibold mb-3" style={{ color: issue.accent }}>{issue.label}</div>
          <Grid cols={2}>
            {[['现状', issue.status], ['机制', issue.mechanism], ['矛盾', issue.tension], ['政策', issue.policy]].map(([t, d]) => (
              <div key={t} style={{ borderLeft: `2px solid ${issue.accent}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold mono" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Card>

      {/* ---- 城乡收入差距 + 粮食产量 ---- */}
      <Grid cols={2} className="mb-6">
        <Card title="城乡收入比收敛 vs 转移性收入占比（示意）">
          <EChart option={incomeGapOpt} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>比值在缩小，绝对差距仍在扩大；收敛的相当部分由转移支付贡献——「输血型收敛」与「造血型收敛」是两种成色。</p>
        </Card>
        <Card title="粮食产量（万吨 · 示意）—— 连续稳定在 1.3 万亿斤以上">
          <EChart option={grainLine} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>产能维持依赖最低收购价、农资补贴与高标准农田投入；纯市场定价下种粮收益不足以支撑现有产量。</p>
        </Card>
      </Grid>

      {/* ---- 土地制度结构卡 ---- */}
      <Card title="土地制度 · 三块地改革结构" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          承包地、宅基地、集体经营性建设用地——「三块地」改革是乡村财产性收入的总闸门，也是城乡要素流动最深的制度水位线。改革三条底线：土地公有制性质不改变、耕地红线不突破、农民利益不受损。
        </p>
        <Grid cols={3}>
          {LAND_CARDS.map((c) => (
            <div key={c.title} className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${c.accent}` }}>
              <div className="text-sm font-semibold mb-2" style={{ color: c.accent }}>{c.title}</div>
              <div className="space-y-2 mb-3">
                {c.rows.map(([t, d]) => (
                  <div key={t} style={{ borderLeft: `2px solid ${c.accent}`, paddingLeft: 8 }}>
                    <div className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.note}</p>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ---- 县域分化 + 人口结构 ---- */}
      <Grid cols={2} className="mb-6">
        <Card title="县域经济分化 · 百强县 vs 农业县 vs 流出县（示意）">
          <EChart option={countyDivergeOpt} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>「千县千面」：百强县扎堆苏浙鲁，人均 GDP 是流出县的 3 倍以上；财政自给率不足 20% 的县靠转移支付维持运转，缩编与撤并是下一阶段的隐性议程。</p>
        </Card>
        <Card title="乡村常住人口下降 × 老龄化率攀升（示意）">
          <EChart option={ruralPopOpt} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>十三年间乡村常住人口减少近 2 亿；「386199 部队」式空心化下，小农户经营者平均年龄逼近 60 岁——「谁来种地」不再是修辞，而是排期表。</p>
        </Card>
      </Grid>

      {/* ---- 五大振兴雷达 + 收入构成 donut ---- */}
      <Grid cols={2} className="mb-6">
        <Card title="五大振兴推进度雷达（示意）">
          <EChart option={revitalRadar} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>产业、生态两维领先（政策资源长期倾斜）；人才振兴垫底——青壮年单向流出未逆转，返乡创业仍是结构性少数。</p>
        </Card>
        <Card title="农民收入四元构成（2023 · % 示意）">
          <EChart option={incomeDonut} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>财产性收入仅约 3%，与城镇居民 10% 以上形成断崖——短板不在勤劳，在制度：土地不能充分变现，资产就无法生息。</p>
        </Card>
      </Grid>

      {/* ---- 收入结构演进 stacked + 数字基建 ---- */}
      <Grid cols={2} className="mb-6">
        <Card title="农村人均可支配收入结构演进（万元 · 示意）">
          <EChart option={incomeStackOpt} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>工资性收入 2015 年前后超越经营性收入成为第一来源——农民增收的主战场早已不在农业，而在县域就业与外出务工。</p>
        </Card>
        <Card title="县域数字基建推进度（示意 %）">
          <EChart option={techBar} style={{ height: 240 }} />
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>数字渗透领先于物理基建：支付与电商下沉快于冷链与道路。生鲜损耗率每降 1 个百分点，相当于变相增产。</p>
        </Card>
      </Grid>

      {/* ---- 三农制度演进时间线 ---- */}
      <Card title="三农制度演进 · 从「取」到「予」再到「融」" className="mb-6">
        <TimelineBar stages={STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* ---- 产业五条线（保留） ---- */}
      <Card title="产业振兴五条线 · 种养加销旅贯通" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>财政、金融与土地指标向县域特色产业倾斜，五条产业线各有约束与变现逻辑。</p>
        <Grid cols={5}>
          {[
            ['粮 · 稳产保供', '主产区利益补偿与耕地占补平衡挂钩，抑制「非粮化」冲动。', '#产能红线'],
            ['肉 · 畜禽与饲料', '豆粕减量替代与规模化养殖环保约束抬高固定成本。', '#成本曲线'],
            ['果 · 特色经济作物', '地理标志与冷链决定溢价能否留在县域。', '#品牌与渠道'],
            ['工 · 农产品加工', '预制菜、中央厨房与县域产业园绑定用地与能耗指标。', '#增值留存'],
            ['游 · 乡村旅游', '与基础设施和数字支付渗透率强相关，防止低水平重复建设。', '#流量变现'],
          ].map(([t, d, tag]) => (
            <div key={t} style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <div className="text-[10px] mt-2 font-bold" style={{ color: '#10b981' }}>{tag}</div>
            </div>
          ))}
        </Grid>
      </Card>

      {/* ---- 调研结论 ---- */}
      <Card title="调研结论" className="mb-6">
        <Grid cols={3}>
          {[
            ['1 · 增产靠单产与结构', '粮食安全与生态红线（耕地、地下水）硬约束下，增产主要靠单产与种业，而非简单扩面；产能本质上是财政持续投入的函数。'],
            ['2 · 县域产业防空心化', '县域产业若不能与物流、电力、人力资本同步升级，财政奖补退出后易空心化；人口流出县的正确动作是收缩规划而非扩张造城。'],
            ['3 · 土地制度定天花板', '集体经营性建设用地入市与宅基地改革试点决定财产性收入的天花板；其推进速度又受土地财政依赖度的反向钳制——这是最硬的死结。'],
          ].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      {/* ---- 系统观察 ---- */}
      <Card title="系统观察" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          乡村振兴是长周期资产负债表修复：人口回流、基建折旧与产业迭代需同屏评估。城乡要素流动的方向最终由土地制度与县域就业承载力共同决定——土地不松绑，人就只能单向流出；县域无就业，回流就只是返贫。承认「部分村庄将体面收缩」的政策，比承诺「全部村庄都将振兴」的政策更诚实，也更可执行。
        </p>
      </Card>

      <FrameworkTrio cards={[
        { key: 'salt', title: '城乡剪刀差遗产', subtitle: '历史欠账 · 反向补偿', body: '工农产品价格剪刀差数十年间从农村抽取巨额原始积累；取消农业税与转移支付是「还账」的开始——但财产性权利的归还远未完成。' },
        { key: 'stone', title: '土地财政镜像', subtitle: '增值收益 · 分配之争', body: '农地非农化的增值收益长期由地方政府独享；集体土地入市每推进一步，土地财政的垄断地租就被稀释一分——改革速度由财政承受力反向决定。' },
        { key: 'path', title: '县域载体', subtitle: '城尾乡头 · 融合枢纽', body: '县城是城乡融合的关键枢纽：承接产业转移、吸纳县内城镇化、提供「半工半耕」就业半径；县域公共服务的质量决定农民进城的真实成本。' },
      ]} />

      <ModuleFooter moduleId="rural" disclaimer="公开资料整理 · 数值为示意量级非官方统计 · 仅供城乡结构分析框架参考，不构成任何决策建议" />
    </div>
  );
}
