import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt, radarOpt, stackedBarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ============================================================================
// 资源品种数据矩阵 —— 对外依存度 / 来源集中度 / 权益占比 / 卡脖子 / 定价权（示意）
// ============================================================================
const COMMODITIES = [
  {
    key: 'iron', label: '铁矿石', accent: '#c41e3a',
    dependency: 80, equity: 22, choke: 88, pricing: 18, reserve: 25,
    headline: '买方大国 · 定价权弃儿',
    sources: [['澳大利亚', 60], ['巴西', 20], ['几内亚', 8], ['其他', 12]],
    note: '全球最大买家却长期被「普氏指数 + 三大矿山」定价。西芒杜投产前，议价权几乎为零——这是「买矿≠控矿」最残酷的样本。',
    routes: ['澳—西北航线', '巴西—好望角', '几内亚—印度洋'],
  },
  {
    key: 'copper', label: '铜', accent: '#e8a317',
    dependency: 75, equity: 28, choke: 62, pricing: 35, reserve: 30,
    headline: '电气化的血液 · 长协对冲',
    sources: [['智利', 32], ['秘鲁', 24], ['刚果(金)', 18], ['其他', 26]],
    note: '电网/电机/新能源的刚需金属。海外权益矿（紫金/五矿在秘鲁、刚果）+ LME 长协，把价格波动嵌入资产负债表对冲。',
    routes: ['智利—太平洋', '刚果—达累斯萨拉姆', '秘鲁—钱凯港'],
  },
  {
    key: 'bauxite', label: '铝土矿', accent: '#22d3ee',
    dependency: 70, equity: 35, choke: 70, pricing: 40, reserve: 20,
    headline: '几内亚单点 · 园区一体化',
    sources: [['几内亚', 55], ['澳大利亚', 25], ['印尼', 12], ['其他', 8]],
    note: '电解铝产能全球第一，但铝土原料高度依赖几内亚一国。政变即断供——权益矿 + 本土氧化铝产能是唯一缓冲。',
    routes: ['几内亚—印度洋', '澳洲—西北线', '印尼—南海'],
  },
  {
    key: 'battery', label: '镍钴锂', accent: '#8b5cf6',
    dependency: 65, equity: 48, choke: 55, pricing: 58, reserve: 35,
    headline: '电池金属 · 资源—冶炼闭环',
    sources: [['印尼镍', 38], ['刚果钴', 30], ['澳/智锂', 20], ['其他', 12]],
    note: '新能源命门。印尼镍铁园区 + 刚果钴 + 锂三角长协，配合全球 75% 精炼产能，形成「资源—加工—电池」一体化重力场。',
    routes: ['印尼—南海', '刚果—印度洋', '锂三角—太平洋'],
  },
  {
    key: 'oil', label: '原油', accent: '#f97316',
    dependency: 72, equity: 30, choke: 92, pricing: 25, reserve: 45,
    headline: '海上生命线 · 马六甲困局',
    sources: [['沙特', 18], ['俄罗斯', 17], ['伊拉克', 12], ['其他', 53]],
    note: '70%+ 进口、80% 过马六甲。来源已多元化，但运输咽喉单点依赖未解——管道（中俄/中缅/中哈）是陆上备份的核心逻辑。',
    routes: ['霍尔木兹—马六甲', '中俄管道', '中缅管道'],
  },
  {
    key: 'gas', label: '天然气', accent: '#10b981',
    dependency: 45, equity: 26, choke: 68, pricing: 38, reserve: 30,
    headline: '管道+LNG · 双轨供应',
    sources: [['土库曼斯坦', 28], ['俄罗斯', 22], ['卡塔尔LNG', 18], ['其他', 32]],
    note: '中亚管道 + 西伯利亚力量 + 沿海 LNG 接收站构成双轨。依存度相对可控，但 LNG 现货价格受地缘事件剧烈扰动。',
    routes: ['中亚管道', '西伯利亚力量', '卡塔尔—马六甲'],
  },
  {
    key: 'grain', label: '粮食', accent: '#84cc16',
    dependency: 85, equity: 15, choke: 75, pricing: 22, reserve: 60,
    headline: '大豆软肋 · 口粮自主',
    sources: [['巴西', 40], ['美国', 30], ['阿根廷', 18], ['其他', 12]],
    note: '口粮（稻麦）基本自给，但大豆 85% 靠进口、巴美两国占七成。饲料—蛋白链是隐形的「卡脖子」，储备天数与南美布局是缓冲。',
    routes: ['巴西—好望角', '美湾—太平洋', '黑海走廊'],
  },
];

// ============================================================================
// 航道咽喉 —— 关键海上节点依赖度（示意）
// ============================================================================
const CHOKEPOINTS = [
  { name: '马六甲海峡', share: 80, accent: '#c41e3a', desc: '原油 80% + 大宗散货主通道。最窄处 2.8km，单点断裂即工业失血。' },
  { name: '霍尔木兹海峡', share: 45, accent: '#f97316', desc: '中东油气出海唯一口。波斯湾局势的瞬时定价器。' },
  { name: '曼德海峡', share: 35, accent: '#e8a317', desc: '红海—苏伊士通道入口。也门冲突外溢直接抬升保险与绕行成本。' },
  { name: '好望角航线', share: 28, accent: '#22d3ee', desc: '巴西铁矿与西非铝土的远洋路径，绕行即周期与运费双升。' },
  { name: '巽他/龙目', share: 18, accent: '#10b981', desc: '马六甲的天然备份，水深受限但战时分流价值高。' },
];

// ============================================================================
// 走出去阶段时间线
// ============================================================================
const PHASES = [
  { period: '1993–2003', title: '贸易采购 · 现货买单', accent: '#64748b', desc: '从净出口国转为净进口国。资源以现货贸易为主，价格被动接受，毫无议价与权益概念——「世界工厂」的资源胃口刚刚觉醒。' },
  { period: '2004–2013', title: '海外并购潮 · 买矿时代', accent: '#94a3b8', desc: '油气与矿业「走出去」高峰。中铝入股力拓、中海油竞购优尼科受阻——买矿易、控矿难，地缘审查首次成为硬约束。' },
  { period: '2013–2019', title: '一带一路 · 资源通道', accent: '#e8a317', desc: '中缅/中俄管道、瓜达尔与汉班托塔港、中欧班列。资源安全从「单笔交易」升级为「通道工程」，陆海备份网络成形。' },
  { period: '2019–2024', title: '权益矿+定价权争夺', accent: '#22d3ee', desc: '西芒杜铁矿、印尼镍铁园区、锂三角长协。从「买」转向「控」：股权 + 本土冶炼 + 上海原油期货，争夺定价话语权。' },
  { period: '2024–2030', title: '资源自主可控 · 重力场', accent: '#c41e3a', desc: '权益+冶炼+储备+护航四重冗余。目标不是脱钩，而是构建「非对称相互依赖」——断供时让对手承担不可逆的崩溃成本。' },
];

// ============================================================================
// 静态图表 —— 关键资源对外依存度（全景红色预警）
// ============================================================================
const dependencyOverviewBar = {
  grid: { ...GRID, bottom: 28 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: categoryX(COMMODITIES.map((c) => c.label)),
  yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  series: [{
    type: 'bar', barWidth: 26,
    data: COMMODITIES.map((c) => ({
      value: c.dependency,
      itemStyle: { color: c.dependency >= 75 ? '#c41e3a' : c.dependency >= 60 ? '#e8a317' : '#22d3ee', borderRadius: 3 },
    })),
    markLine: {
      silent: true, symbol: 'none',
      lineStyle: { color: '#c41e3a', type: 'dashed', opacity: 0.6 },
      label: { formatter: '70% 安全警戒线', color: '#c41e3a', fontSize: 10, position: 'insideEndTop' },
      data: [{ yAxis: 70 }],
    },
    label: { show: true, position: 'top', formatter: '{c}%', color: LABEL.color, fontSize: 10 },
  }],
};

// 买矿 vs 控矿差距 —— 进口依存 vs 海外权益覆盖
const equityGapBar = stackedBarOpt({
  categories: COMMODITIES.map((c) => c.label),
  horizontal: true,
  series: [
    { name: '海外权益覆盖', data: COMMODITIES.map((c) => c.equity), itemStyle: { color: '#22d3ee' } },
    { name: '纯进口敞口', data: COMMODITIES.map((c) => Math.max(0, c.dependency - c.equity)), itemStyle: { color: '#c41e3a', opacity: 0.6 } },
  ],
});

// 资源自主综合趋势（纯进口依赖 vs 权益+冶炼覆盖）
const resilienceTrend = {
  grid: GRID,
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { color: LABEL.color, fontSize: 10 } },
  xAxis: categoryX(['2008', '2012', '2016', '2020', '2024', '2030E']),
  yAxis: valueY({ max: 100, axisLabel: { formatter: '{value}' } }),
  series: [
    { name: '纯进口依赖指数', type: 'line', smooth: true, data: [88, 82, 75, 60, 48, 35], lineStyle: { color: LABEL.color, type: 'dashed' }, itemStyle: { color: LABEL.color } },
    { name: '海外权益+冶炼覆盖', type: 'line', smooth: true, data: [8, 18, 32, 55, 78, 95], lineStyle: { color: '#22d3ee', width: 3 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
    { name: '战略储备天数指数', type: 'line', smooth: true, data: [20, 30, 42, 55, 68, 82], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
  ],
};

// 海外区域资源布局权重
const REGIONS = [
  { label: '非洲', accent: '#c41e3a', weight: 30, minerals: '钴/铁/铜' },
  { label: '东南亚', accent: '#e8a317', weight: 35, minerals: '镍/铝土' },
  { label: '拉美', accent: '#22d3ee', weight: 25, minerals: '锂/铜/铁' },
  { label: '中亚', accent: '#10b981', weight: 10, minerals: '油气/铀' },
];

const regionBar = {
  grid: GRID,
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: categoryX(REGIONS.map((r) => `${r.label}\n${r.minerals}`)),
  yAxis: valueY({ max: 40, axisLabel: { formatter: '{value}%' } }),
  series: [{
    type: 'bar', barWidth: 30,
    data: REGIONS.map((r) => ({ value: r.weight, itemStyle: { color: r.accent, borderRadius: 3 } })),
    label: { show: true, position: 'top', formatter: '{c}%', color: LABEL.color, fontSize: 10 },
  }],
};

const chokeBar = {
  grid: { left: 80, right: 30, top: 12, bottom: 16 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: valueY({ max: 100, axisLabel: { formatter: '{value}%' } }),
  yAxis: { type: 'category', data: [...CHOKEPOINTS].reverse().map((c) => c.name), axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, fontSize: 10 } },
  series: [{
    type: 'bar', barWidth: 16,
    data: [...CHOKEPOINTS].reverse().map((c) => ({ value: c.share, itemStyle: { color: c.accent, borderRadius: 3 } })),
    label: { show: true, position: 'right', formatter: '{c}%', color: LABEL.color, fontSize: 10 },
  }],
};

export default function Page() {
  const [commodityKey, setCommodityKey] = useState('iron');
  const [phaseIdx, setPhaseIdx] = useState(PHASES.length - 1);

  const c = useMemo(() => COMMODITIES.find((x) => x.key === commodityKey) || COMMODITIES[0], [commodityKey]);

  // 当前品种 —— 来源集中度 donut
  const sourceDonut = useMemo(() => {
    const opt = donutOpt(
      c.sources.map(([n, v], i) => ({
        name: n, value: v,
        itemStyle: { color: [c.accent, '#94a3b8', '#475569', '#27324a'][i] || '#27324a' },
      })),
    );
    opt.title = {
      text: `${c.sources[0][1]}%`, subtext: `首位 · ${c.sources[0][0]}`,
      left: 'center', top: '34%', textAlign: 'center',
      textStyle: { color: c.accent, fontSize: 22, fontWeight: 700 },
      subtextStyle: { color: LABEL.color, fontSize: 10 },
    };
    return opt;
  }, [c]);

  // 当前品种资源安全雷达
  const securityRadar = useMemo(() => radarOpt(
    [
      { name: '储量保障', max: 100 },
      { name: '进口多元化', max: 100 },
      { name: '权益占比', max: 100 },
      { name: '航道安全', max: 100 },
      { name: '定价权', max: 100 },
      { name: '战略储备', max: 100 },
    ],
    [
      Math.max(15, 100 - c.dependency),
      Math.max(20, 100 - c.sources[0][1]),
      c.equity,
      Math.max(10, 100 - c.choke),
      c.pricing,
      c.reserve,
    ],
    { name: `${c.label} · 资源安全`, color: c.accent },
  ), [c]);

  return (
    <div>
      <PageHeader badge="Overseas Resources · 权益矿 / 航道安全" title="海外战略资源 · 权益矿与运输安全" subtitle="对外依存 · 来源集中度 · 权益占比 · 定价权 · 航道咽喉" />

      <IntroCard>
        资源主权是工业文明的生命线。工业化的「资源胃口」把对外依存度推到危险区间——铁矿 80%、铜 75%、原油 72%、大豆 85%。
        但更深的痛点不是「买不到」，而是<strong style={{ color: 'var(--text-primary)' }}>「买得到却定不了价」</strong>：作为全球最大买家，铁矿石定价权却长期旁落。
        破解之道是把生产关系延伸到全球资源腹地——<strong style={{ color: 'var(--text-primary)' }}>控矿（权益）+ 护航（通道）+ 储备（冗余）</strong>三重保险，
        从「单纯买卖」升级为对矿山的决策主权，最终构建断供时让对手承受不可逆成本的「资源重力场」。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="72%" label="原油对外依存 · 80% 过马六甲" accent="#f97316" />
        <Stat value="80%+" label="铁矿石对外依存 · 定价权痛点" accent="#c41e3a" />
        <Stat value="1.8 万亿" label="海外权益资源累计投资(元)" accent="#22d3ee" />
        <Stat value="~90 天" label="战略储备覆盖(原油示意)" accent="#e8a317" />
      </Grid>

      {/* ============ 交互核心：资源品种切换 ============ */}
      <Card title="交互 · 资源品种选择器 · 依存 / 来源 / 权益 / 安全联动" className="mb-6">
        <SelectorBar items={COMMODITIES} activeKey={commodityKey} onSelect={setCommodityKey} />
        <Grid cols={4} className="mb-4">
          <div className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${c.accent}` }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>对外依存度</div>
            <div className="text-2xl font-bold" style={{ color: c.dependency >= 75 ? '#c41e3a' : c.accent }}>{c.dependency}%</div>
          </div>
          <div className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${c.accent}` }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>首位来源占比</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{c.sources[0][1]}%</div>
          </div>
          <div className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${c.accent}` }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>海外权益占比</div>
            <div className="text-2xl font-bold" style={{ color: '#22d3ee' }}>{c.equity}%</div>
          </div>
          <div className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderTop: `2px solid ${c.accent}` }}>
            <div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>卡脖子风险</div>
            <div className="text-2xl font-bold" style={{ color: c.choke >= 75 ? '#c41e3a' : c.choke >= 60 ? '#e8a317' : '#22d3ee' }}>{c.choke}</div>
          </div>
        </Grid>
        <Grid cols={2}>
          <div>
            <div className="text-xs mb-2 mono" style={{ color: c.accent }}>{c.label} · 进口来源集中度（%）</div>
            <EChart option={sourceDonut} style={{ height: 240 }} />
          </div>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${c.accent}` }}>
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{c.label} · {c.headline}</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{c.note}</p>
            <div className="text-[11px] mb-1" style={{ color: 'var(--text-tertiary)' }}>主要运输路径</div>
            <div className="flex flex-wrap gap-1.5">
              {c.routes.map((r) => (
                <span key={r} className="text-[10px] px-2 py-1 rounded mono" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>{r}</span>
              ))}
            </div>
          </div>
        </Grid>
      </Card>

      {/* ============ 资源安全雷达 + 依存度全景 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title={`${c.label} · 资源安全雷达（六维 · 示意）`}>
          <EChart option={securityRadar} style={{ height: 260 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>储量保障 / 进口多元化 / 权益占比 / 航道安全 / 定价权 / 战略储备——随品种切换。锐角凹陷处即最脆弱的安全短板。</p>
        </Card>
        <Card title="关键资源对外依存度全景（% · 红色预警）">
          <EChart option={dependencyOverviewBar} style={{ height: 260 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>七大品种横切——超过 70% 警戒线即进入战略风险区。铁矿、大豆、铜构成最硬的对外敞口。</p>
        </Card>
      </Grid>

      {/* ============ 买矿 vs 控矿 + 区域布局 ============ */}
      <Grid cols={2} className="mb-6">
        <Card title="买矿 vs 控矿 · 进口敞口与海外权益覆盖（% · 示意）">
          <EChart option={equityGapBar} style={{ height: 260 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>蓝色为已锁定的海外权益资源，红色为裸露的纯进口敞口。差距即「买矿易、控矿难」的物理欠账——铁矿与粮食的红条最长。</p>
        </Card>
        <Card title="海外资源布局区域权重（% · 示意）">
          <EChart option={regionBar} style={{ height: 260 }} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>东南亚（镍铝冶炼一体化）与非洲（钴铁铜锚点）构成两大重心，拉美对冲价格武器化，中亚以陆路通道对冲海上单点。</p>
        </Card>
      </Grid>

      {/* ============ 航道咽喉 ============ */}
      <Card title="航道咽喉 · 海上运输节点依赖度（% · 示意）" className="mb-6">
        <Grid cols={2}>
          <EChart option={chokeBar} style={{ height: 220 }} />
          <div className="flex flex-col gap-2">
            {CHOKEPOINTS.map((cp) => (
              <div key={cp.name} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${cp.accent}` }}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{cp.name}</span>
                  <span className="text-xs mono" style={{ color: cp.accent }}>{cp.share}%</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{cp.desc}</p>
              </div>
            ))}
          </div>
        </Grid>
        <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>马六甲是无法回避的物理软肋——80% 原油经此入境。陆上管道、远海护航与替代航道（巽他/龙目）是降低单点依赖的三条路径。</p>
      </Card>

      {/* ============ 资源自主趋势 ============ */}
      <Card title="资源自主可控趋势 · 进口依赖 / 权益冶炼覆盖 / 储备天数（示意）" className="mb-6">
        <EChart option={resilienceTrend} style={{ height: 240 }} />
        <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>纯进口依赖指数单调下行，海外权益+冶炼覆盖逼近 95，战略储备天数同步抬升——三条曲线交汇处，即「买卖关系」让位于「决策主权」的临界点。</p>
      </Card>

      {/* ============ 走出去时间线 ============ */}
      <Card title="资源走出去 · 五阶段演进（点选展开）" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      {/* ============ 三框架 ============ */}
      <FrameworkTrio cards={[
        {
          title: '进口依赖物理', subtitle: 'Industrial Appetite',
          body: '工业化是一台吞噬资源的机器。钢铁、电力、化工、电池的规模决定了对铁、铜、铝、镍钴锂、油气的刚性进口——依存度不是政策选择，而是工业体量的物理后果。',
          pillars: [['钢的胃口', '铁矿 80% 进口，全球最大买家。'], ['电的血液', '铜铝支撑电网与新能源扩张。'], ['粮的软肋', '大豆 85% 靠进口，蛋白链外悬。']],
        },
        {
          title: '定价权博弈', subtitle: 'Buyer Without Power',
          body: '最大的痛不是缺货，而是「买方大国却无定价权」。铁矿石被普氏指数与三大矿山定价多年。破局靠三招：自有权益矿、本土冶炼份额、人民币计价的期货市场。',
          pillars: [['权益锁价', '股权+长协替代现货被动。'], ['冶炼筹码', '75% 精炼产能=加工话语权。'], ['期货定价', '上海原油/铁矿期货争话语权。']],
        },
        {
          title: '通道与权益双保险', subtitle: 'Control · Escort · Reserve',
          body: '资源安全=控矿+护航+储备三重冗余。无法防御的资产本质是他人的财富——亚丁湾护航、海外保障点、战略储备体系，把物理安全嵌入资源资产负债表。',
          pillars: [['控矿', '权益+本土冶炼，深度嵌合。'], ['护航', '远海护航+海外保障点。'], ['储备', '原油/粮食战略库存抬高韧性。']],
        },
      ]} />

      {/* ============ 结论 ============ */}
      <Card title="调研结论 · 从「买矿」到「重力场」">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          海外资源战略的真实标的，不是平抑价格，而是<strong style={{ color: 'var(--text-primary)' }}>极端封锁下的工业最低运转权</strong>。
          通过印尼镍铁园区、几内亚西芒杜铁矿、刚果钴与锂三角长协，正在全球制造以中国需求和加工产能为核心的「资源重力场」。
          最终目标是「非对称相互依赖」：外部断供时，中国掌控的初级加工权与本土冶炼产能，将使全球制造业面临不可承受的崩溃成本——
          这是把「卡脖子的手」反向握住的物理算法。
        </p>
      </Card>

      <ModuleFooter
        moduleId="resources"
        disclaimer="公开资料整理，依存度/来源/权益/储备均为示意非官方数据 · 仅供分析框架参考，非投资建议"
        sourceNote="由 china.html「海外资源」专题迁移并大幅扩容"
      />
    </div>
  );
}
