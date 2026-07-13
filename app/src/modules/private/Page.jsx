import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, logY, GRID, donutOpt, radarOpt, stackedBarOpt, AXIS, LABEL } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// 56789：贡献度图谱（顺序由低到高，呈现「贡献—话语权」倒挂）
// ─────────────────────────────────────────────────────────────────────────────
const CONTRIB_56789 = [
  { num: '5', val: 50, label: '税收', sub: '财政命脉', accent: '#c41e3a' },
  { num: '6', val: 60, label: 'GDP', sub: '经济总量', accent: '#e8a317' },
  { num: '7', val: 70, label: '技术创新', sub: '专利与研发', accent: '#22d3ee' },
  { num: '8', val: 80, label: '城镇就业', sub: '社会稳定底盘', accent: '#10b981' },
  { num: '9', val: 90, label: '企业数量', sub: '市场主体', accent: '#8b5cf6' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 政策时间线：从个体户松绑到促进法
// ─────────────────────────────────────────────────────────────────────────────
const POLICY_STAGES = [
  { period: '1979–87', title: '个体户松绑', accent: '#64748b', desc: '改革开放破冰，「七上八下」之争（雇工超 7 人是否算剥削）划定民营边界；个体经济作为公有制「补充」获默许，傻子瓜子成为符号。' },
  { period: '2005', title: '非公经济 36 条', accent: '#94a3b8', desc: '首份系统性非公经济政策，明确放宽市场准入、平等待遇；但「玻璃门、弹簧门、旋转门」始终是执行层的现实阻滞。' },
  { period: '2013–17', title: '两个毫不动摇', accent: '#e8a317', desc: '巩固和发展公有制 + 鼓励支持非公经济，写入党的纲领性文件。地位话语确立，但与实际处境的落差成为信心症结。' },
  { period: '2018', title: '31 条 · 预期修复', accent: '#22d3ee', desc: '民营企业家信心下滑、「离场论」泛起，最高层座谈会定调，出台支持 31 条，强调民营经济是「自己人」。' },
  { period: '2020–22', title: '平台整治期', accent: '#c41e3a', desc: '反垄断与防止资本无序扩张，平台经济、教培、地产遭遇结构性收缩；预期管理与资本边界成为政策核心张力。' },
  { period: '2025', title: '民营经济促进法', accent: '#10b981', desc: '首部以民营经济为名的基础性法律落地，把平等保护、公平竞争、产权安全从政策文件上升为法律义务，降低制度可逆性。' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 维度选择器：每个维度对应痛点 / 政策抓手 / 信心读数
// ─────────────────────────────────────────────────────────────────────────────
const DIMENSIONS = [
  {
    key: 'finance', label: '融资环境', accent: '#22d3ee', score: 58,
    pain: '间接融资体系以抵押与所有制为筛子，民企（尤其轻资产、小微）融资贵融资难；信用债违约后市场避险，民企发债利差长期高于国企。',
    lever: '普惠金融定向降准、政府性融资担保、票据贴现清欠、设立民营企业债券融资支持工具。',
    metric: '民企贷款占比偏低 · 综合融资成本上行 · 示意',
  },
  {
    key: 'access', label: '市场准入', accent: '#10b981', score: 52,
    pain: '负面清单之外仍有「卷帘门、玻璃门」；能源、电信、金融、铁路等命脉行业实质准入受限，名义开放与实际可进入存在落差。',
    lever: '全国统一负面清单、公平竞争审查制度、向民间资本推介重大项目、特许经营新机制。',
    metric: '准入开放度名实落差 · 示意',
  },
  {
    key: 'property', label: '产权保护', accent: '#e8a317', score: 61,
    pain: '涉企刑事案件中的「远洋捕捞」式逐利执法、超权限查封冻结、历史案件纠错滞后，伤害企业家长期安全预期与资产配置意愿。',
    lever: '甄别纠正涉产权冤错案、规范异地执法与涉企强制措施、保护企业家人身和财产安全制度化。',
    metric: '产权安全预期承压 · 示意',
  },
  {
    key: 'fair', label: '公平竞争', accent: '#8b5cf6', score: 55,
    pain: '招投标隐性门槛、补贴与要素价格的所有制差别、行政垄断与地方保护，使民企在同台竞争中承担额外制度成本。',
    lever: '公平竞争审查条例、反垄断法修订、清理废除妨碍统一市场的政策、要素市场化配置。',
    metric: '竞争中性落实度 · 示意',
  },
  {
    key: 'expect', label: '政策预期', accent: '#c41e3a', score: 49,
    pain: '运动式监管、政策急转弯与「一刀切」，使企业难以形成稳定预期；信心是比黄金更稀缺的资源，一旦受损修复周期长。',
    lever: '重大政策出台前评估对市场主体影响、设置政策过渡期、稳定连续可预期的制度环境。',
    metric: '企业家信心指数走弱后修复 · 示意',
  },
  {
    key: 'global', label: '出海', accent: '#38bdf8', score: 66,
    pain: '地缘摩擦、关税壁垒、合规与数据跨境、产能出海中的东道国本地化要求，民企「走出去」面对的是政治与制度的双重不确定性。',
    lever: '一带一路与 RCEP 通道、出口信用保险、海外仓与跨境支付基建、商会与领事保护协同。',
    metric: '民企外贸占比上行 · 出海意愿活跃 · 示意',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 民间投资 vs 全社会固投增速（信心晴雨表）
// ─────────────────────────────────────────────────────────────────────────────
const INVEST_YEARS = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
const PRIVATE_INVEST = [10.1, 3.2, 6.0, 8.7, 4.7, 1.0, 7.0, 0.9, -0.4, -0.1];
const TOTAL_INVEST = [10.0, 8.1, 7.2, 5.9, 5.4, 2.9, 4.9, 5.1, 3.0, 3.2];

const investTrend = {
  grid: { left: 40, right: 16, top: 30, bottom: 28 },
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: LABEL.color, fontSize: 10 }, itemWidth: 12 },
  xAxis: categoryX(INVEST_YEARS),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' } }),
  series: [
    { name: '民间投资增速', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: PRIVATE_INVEST, lineStyle: { color: '#c41e3a', width: 2.5 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
    { name: '全社会固投增速', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: TOTAL_INVEST, lineStyle: { color: '#64748b', width: 1.5, type: 'dashed' }, itemStyle: { color: '#64748b' } },
    { name: '零增长线', type: 'line', data: INVEST_YEARS.map(() => 0), symbol: 'none', lineStyle: { color: 'rgba(232,163,23,0.5)', width: 1, type: 'dotted' }, silent: true },
  ],
};

// 民企外贸占比走势（保留原 tradeShare 数据，扩展年份）
const tradeShare = {
  grid: GRID,
  tooltip: { trigger: 'axis', formatter: '{b}: {c0}%' },
  xAxis: categoryX(['2017', '2019', '2021', '2023', '2024', '2025E']),
  yAxis: valueY({ axisLabel: { formatter: '{value}%' }, max: 70 }),
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [39, 43, 48, 53, 55, 56], lineStyle: { color: '#38bdf8', width: 2 }, itemStyle: { color: '#38bdf8' }, areaStyle: { color: 'rgba(56,189,248,0.1)' } }],
};

// ─────────────────────────────────────────────────────────────────────────────
// 所有制结构演进：国有 vs 民营 在三维度的占比（堆叠）
// ─────────────────────────────────────────────────────────────────────────────
const ownershipBar = stackedBarOpt({
  categories: ['工业增加值', '固定资产投资', '城镇就业', '企业数量', '出口'],
  series: [
    { name: '民营 / 非公', data: [60, 55, 80, 90, 55], itemStyle: { color: '#c41e3a' } },
    { name: '国有 / 国有控股', data: [40, 45, 20, 10, 45], itemStyle: { color: '#475569' } },
  ],
});
ownershipBar.tooltip = { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => `${p[0].name}<br/>${p.map((x) => `${x.seriesName}: ${x.value}%`).join('<br/>')}` };

// ─────────────────────────────────────────────────────────────────────────────
// 行业渗透切换（保留原 SECTORS，扩展）
// ─────────────────────────────────────────────────────────────────────────────
const SECTORS = [
  { key: 'tech', label: '科技创新', accent: '#22d3ee', share: 70, note: '专精特新「小巨人」、单项冠军绝大多数为民营，承担多数研发投入与新增专利。' },
  { key: 'service', label: '消费服务', accent: '#10b981', share: 85, note: '批发零售、餐饮、住宿、生活服务几乎全部由民营与个体户支撑，是就业的最大蓄水池。' },
  { key: 'mfg', label: '制造业', accent: '#c41e3a', share: 55, note: '民营贡献过半工业增加值，链主央企 + 民营专精特新构成产业蜂群，是「制造强国」的腰部。' },
  { key: 'digital', label: '数字经济', accent: '#8b5cf6', share: 78, note: '平台、电商、移动支付、内容生态由民营开创；亦是 2020–22 反垄断与资本边界整治的主战场。' },
  { key: 'lifeline', label: '命脉行业', accent: '#475569', share: 12, note: '电网、油气、骨干电信、铁路、主要金融由国资控盘——民营渗透极低，盐铁逻辑的当代分界线。' },
];

export default function Page() {
  const [stageIdx, setStageIdx] = useState(POLICY_STAGES.length - 1);
  const [sectorKey, setSectorKey] = useState('tech');
  const [dimKey, setDimKey] = useState('finance');
  const sector = SECTORS.find((s) => s.key === sectorKey) || SECTORS[0];
  const dim = DIMENSIONS.find((d) => d.key === dimKey) || DIMENSIONS[0];

  // 营商环境雷达（保留原维度）
  const envRadar = radarOpt(
    ['市场准入', '产权保护', '融资可得', '公平竞争', '政策稳定', '账款清欠'],
    [72, 78, 65, 70, 68, 60],
    { name: '营商环境', color: '#10b981' },
  );

  // 民企信心指数雷达：与维度选择器联动，高亮当前维度对应读数
  const confidenceRadar = useMemo(() => {
    const dims = ['融资可得性', '准入公平', '产权安全', '政策连续性', '账款及时性', '营商环境'];
    const base = [58, 52, 61, 49, 56, 64];
    return {
      radar: {
        indicator: dims.map((n) => ({ name: n, max: 100 })),
        axisName: { color: LABEL.color, fontSize: 10 },
        radius: '62%',
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
        axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
        splitArea: { show: false },
      },
      series: [{
        type: 'radar',
        data: [{
          value: base, name: '民企信心指数（示意）',
          lineStyle: { color: '#c41e3a', width: 2 },
          itemStyle: { color: '#c41e3a' },
          areaStyle: { color: 'rgba(196,30,58,0.12)' },
        }],
      }],
    };
  }, []);

  // 56789 条形（保留原 contribBar 逻辑，改用数据驱动配色）
  const contribBar = {
    grid: { left: 78, right: 36, top: 16, bottom: 24 },
    xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
    yAxis: categoryX(CONTRIB_56789.map((c) => c.label)),
    series: [{
      type: 'bar', barWidth: 16,
      data: CONTRIB_56789.map((c) => ({ value: c.val, itemStyle: { color: c.accent, borderRadius: 3 } })),
      label: { show: true, position: 'right', formatter: '{c}%+', color: LABEL.color },
    }],
  };

  return (
    <div>
      <PageHeader badge="Private Economy · 56789" title="民营经济与市场主体贡献" subtitle="民营经济促进法 · 56789 · 产权保护 —— 从「两个毫不动摇」到法律确权" />
      <IntroCard>民营经济贡献了约<strong style={{ color: 'var(--text-primary)' }}>五成税收、六成 GDP、七成技术创新、八成城镇就业、九成市场主体</strong>。其活力取决于稳定预期、公平准入与产权保护三项制度供给是否到位——「五六七八九」描述的是贡献度，而非话语权。贡献越往后越高、地位越靠前越虚：这是民营经济的结构性不对称。</IntroCard>

      {/* 概览 4 Stat */}
      <Grid cols={4} className="mb-6">
        <Stat value="60%+" label="民营 GDP 占比" accent="#e8a317" />
        <Stat value="80%+" label="城镇就业占比" accent="#10b981" />
        <Stat value="90%+" label="企业数量占比" accent="#8b5cf6" />
        <Stat value="-0.1%" label="民间投资增速 '24·示意" accent="#c41e3a" />
      </Grid>

      {/* 56789 卡片组 */}
      <Card title="「56789」· 贡献度图谱（示意）" className="mb-6">
        <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-tertiary)' }}>
          数字越大、贡献越重——而制度话语权与之倒挂。这五个数字是民营经济谈判桌上的全部筹码，也是其脆弱性的来源。
        </p>
        <Grid cols={5} className="mb-4">
          {CONTRIB_56789.map((c) => (
            <div key={c.num} className="os-card p-4 text-center" style={{ background: 'var(--bg-elevated)', borderTop: `3px solid ${c.accent}` }}>
              <div className="mono text-3xl font-bold" style={{ color: c.accent }}>{c.num}<span className="text-base">0%+</span></div>
              <div className="text-sm font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>{c.label}</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{c.sub}</div>
            </div>
          ))}
        </Grid>
        <EChart option={contribBar} style={{ height: 220 }} />
      </Card>

      {/* 交互① 政策时间线 */}
      <Card title="交互① · 民营经济地位演进时间线" className="mb-6">
        <TimelineBar stages={POLICY_STAGES} activeIdx={stageIdx} onSelect={setStageIdx} />
      </Card>

      {/* 交互② 维度选择器 */}
      <Card title="交互② · 六维诊断 · 痛点 / 政策抓手 / 信心读数" className="mb-6">
        <SelectorBar items={DIMENSIONS} activeKey={dimKey} onSelect={setDimKey} />
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${dim.accent}` }}>
            <div className="flex items-center gap-3 mb-3">
              <Stat value={dim.score} label={`${dim.label} · 信心读数 / 100`} accent={dim.accent} />
            </div>
            <div className="text-xs font-semibold mb-1" style={{ color: dim.accent }}>痛点</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{dim.pain}</p>
            <div className="text-xs font-semibold mb-1" style={{ color: dim.accent }}>政策抓手</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{dim.lever}</p>
            <div className="text-[11px] mono pt-2" style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)' }}>{dim.metric}</div>
          </div>
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>民企信心指数雷达（六维 · 示意）</div>
            <EChart option={confidenceRadar} style={{ height: 240 }} />
          </div>
        </Grid>
      </Card>

      {/* 投资与外贸 */}
      <Grid cols={2} className="mb-6">
        <Card title="民间投资 vs 全社会固投增速（% · 信心晴雨表 · 示意）">
          <EChart option={investTrend} style={{ height: 240 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            民间投资增速跌破零增长线、并持续低于全社会固投——这是预期与信心的最直接量度。政府投资托底，民间投资观望。
          </p>
        </Card>
        <Card title="民企外贸占比走势（% · 示意）">
          <EChart option={tradeShare} style={{ height: 240 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            民营企业已成为第一大外贸经营主体，占比稳步过半——出海是民营在国内预期承压时的结构性出口。
          </p>
        </Card>
      </Grid>

      {/* 所有制结构 + 营商环境雷达 */}
      <Grid cols={2} className="mb-6">
        <Card title="所有制结构 · 民营 vs 国有 占比（% · 堆叠 · 示意）">
          <EChart option={ownershipBar} style={{ height: 260 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            民营在数量、就业、出口端绝对主导，在投资与命脉资产端让位国资——「国进民退」之辩的统计底色。
          </p>
        </Card>
        <Card title="营商环境六维雷达（% · 示意）">
          <EChart option={envRadar} style={{ height: 260 }} />
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-tertiary)' }}>
            账款清欠与政策稳定是短板——前者是现金流的生死线，后者是长期资本开支的前提。
          </p>
        </Card>
      </Grid>

      {/* 交互③ 行业渗透切换（保留升级） */}
      <Card title="交互③ · 行业渗透切换" className="mb-6">
        <SelectorBar items={SECTORS} activeKey={sectorKey} onSelect={setSectorKey} />
        <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${sector.accent}` }}>
          <Stat value={`${sector.share}%`} label={`${sector.label} · 民营渗透（示意）`} accent={sector.accent} />
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>{sector.note}</p>
        </div>
      </Card>

      {/* FrameworkTrio：56789 不对称 / 信心政治学 / 双轨张力 */}
      <FrameworkTrio cards={[
        {
          title: '56789 · 不对称',
          subtitle: '贡献度 ↔ 话语权',
          body: '贡献越往后越高（5→9），制度话语权却与之倒挂。民营承载社会稳定的就业底盘与财政税基，却在准入、要素、产权上承担额外成本——盐铁逻辑（卷十二）在当代的分界线：命脉国有、竞争民营。',
          pillars: [['贡献结构', '税收最低、数量最高的金字塔。'], ['话语错位', '是「自己人」却非「定价者」。'], ['脆弱性', '五个数字即全部筹码。']],
        },
        {
          title: '信心政治学',
          subtitle: '预期管理 ↔ 实际处境',
          body: '「信心比黄金更重要」——但信心是处境的函数，不是表态的函数。座谈会、31 条、促进法是预期管理的工具；民间投资增速跌破零、产权个案纠错，才是实际处境的真读数。话语与数据之间的缝隙，就是信心的成本。',
          pillars: [['预期工具', '座谈、文件、立法的善意。'], ['处境读数', '投资增速 · 产权个案。'], ['修复周期', '信心易碎、难复、长尾。']],
        },
        {
          title: '双轨张力',
          subtitle: '国进民退 ↔ 资本边界',
          body: '一面是「国进民退」之辩——投资与命脉资产向国资集中；一面是「防止资本无序扩张」——平台、地产、教培的整治。两条轨道同时收紧时，民营的安全空间被双向压缩。促进法试图用法律确权为这条边界定桩。',
          pillars: [['国进民退', '要素与命脉的所有制集中。'], ['资本边界', '反垄断 · 防无序扩张。'], ['法律定桩', '促进法降低可逆性。']],
        },
      ]} />

      <ModuleFooter moduleId="private" disclaimer="公开资料整理，示意值非官方统计 · 仅供分析框架参考，非投资建议" sourceNote="由 tabs/private.html 迁移升级 · 扩容版" />
    </div>
  );
}
