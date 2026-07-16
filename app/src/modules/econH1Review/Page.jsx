import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, LABEL, CHART_TOOLTIP } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { AS_OF_BASELINE } from '../../lib/config/asOfBaseline.js';

// ============================================================================
// 半年经济解读 · 2026 H1（国家统计局 2026-07-15 发布上半年国民经济运行情况）
// ----------------------------------------------------------------------------
// 口径声明：所有数字取自国家统计局 2026-07-15《上半年经济运行在合理区间 新动能
// 快速成长》新闻稿及附表、海关总署进出口数据。GDP 及工业增加值增速为不变价/可比价
// 实际增速；居民收入增速为实际增速；其余除特殊说明外为现价名义增速。以官方发布为准。
// 分析为冷峻中立研究框架，非投资建议、非预测。
// ============================================================================

const DATA_AS_OF = '2026-07-15';
const SRC = '国家统计局 2026-07-15 上半年国民经济运行情况新闻稿及附表';

// —— 三驾马车（消费 / 投资 / 出口）——
const ENGINES = [
  {
    key: 'consume', label: '消费 · 内需', accent: '#22d3ee',
    title: '消费 —— 服务强、商品弱的「K 形」扩容',
    headline: '社零 +1.3%',
    metrics: [
      ['社会消费品零售总额', '248722 亿元', '+1.3%'],
      ['服务零售额', '—', '+5.3%'],
      ['商品零售额', '220467 亿元', '+1.1%'],
      ['餐饮收入', '28255 亿元', '+2.8%'],
      ['网上商品和服务零售额', '100715 亿元', '+5.2%'],
    ],
    note: '「社会消费商品和服务零售总额」同比 +2.7%，其中服务零售（+5.3%）明显快于商品零售（+1.1%）——'
      + '通讯器材（+14.4%）、粮油食品（+7.4%）等结构性亮点难掩商品消费整体乏力。乡村（+2.5%）快于城镇（+1.2%），'
      + '但限额以上单位商品零售 −1.0%，显示中高端与耐用品需求偏冷。消费的「量」在扩，「价」与信心仍在低位徘徊。',
    bars: {
      cats: ['社零总额', '服务零售', '商品零售', '餐饮', '网上零售', '限上商品'],
      data: [1.3, 5.3, 1.1, 2.8, 5.2, -1.0],
    },
  },
  {
    key: 'invest', label: '投资 · 固投', accent: '#e8a317',
    title: '投资 —— 地产深跌拖累，高技术逆势',
    headline: '固投 −5.7%',
    metrics: [
      ['固定资产投资（不含农户）', '226370 亿元', '−5.7%'],
      ['扣除房地产开发的固投', '—', '−2.7%'],
      ['房地产开发投资', '38074 亿元', '−18.0%'],
      ['制造业投资', '—', '−1.2%'],
      ['基础设施投资', '—', '−2.4%'],
      ['高技术产业投资', '—', '+4.6%'],
    ],
    note: '固投同比 −5.7% 是三驾马车中最弱一环，房地产开发投资 −18.0%、房企到位资金 −20.2% 构成主拖累；'
      + '民间投资 −8.5%（扣除地产后 −4.9%）反映社会资本预期偏谨慎。但结构上有亮点：知识产权产品投资 +9.4%、'
      + '高技术产业投资 +4.6%，其中航空航天器 +23.3%、信息服务 +15.5%——投资的「总量收缩、结构升级」同时发生。',
    bars: {
      cats: ['固投总额', '扣地产固投', '房地产', '制造业', '基建', '高技术产业', '知识产权'],
      data: [-5.7, -2.7, -18.0, -1.2, -2.4, 4.6, 9.4],
    },
  },
  {
    key: 'export', label: '出口 · 外需', accent: '#c41e3a',
    title: '出口 —— 韧性最强，机电与高技术领跑',
    headline: '进出口 +16.9%',
    metrics: [
      ['货物进出口总额', '254686 亿元', '+16.9%'],
      ['出口', '147314 亿元', '+13.4%'],
      ['进口', '107372 亿元', '+22.1%'],
      ['机电产品出口', '占出口 63.5%', '+20.1%'],
      ['对共建「一带一路」进出口', '—', '+14.8%'],
      ['民营企业进出口', '占比 57.0%', '+17.0%'],
    ],
    note: '进出口 +16.9% 是本期最强引擎，出口 +13.4%、进口 +22.1%（6 月进出口更提速至 +24.2%）。'
      + '结构持续优化：机电产品出口 +20.1%、占出口 63.5%，民营企业挑起 57.0% 大梁。海关口径下集成电路、'
      + '锂电池、电动汽车等高技术与绿色产品出口高增，外需与产业升级共振——出口正从「衬衫换飞机」转向绿色资本品输出。',
    bars: {
      cats: ['进出口', '出口', '进口', '机电出口', '一带一路', '民企进出口'],
      data: [16.9, 13.4, 22.1, 20.1, 14.8, 17.0],
    },
  },
];

// —— 核心指标仪表盘 ——
const DASHBOARD = [
  { v: '4.7%', l: 'GDP 上半年同比（实际）', a: '#c41e3a', s: '695704 亿元 · 一季 5.0 / 二季 4.3' },
  { v: '5.4%', l: '规上工业增加值同比', a: '#e8a317', s: '高技术制造 +13.3%' },
  { v: '+1.3%', l: '社会消费品零售总额', a: '#22d3ee', s: '服务零售 +5.3%' },
  { v: '−5.7%', l: '固定资产投资', a: '#64748b', s: '扣除地产 −2.7%' },
  { v: '+16.9%', l: '货物进出口总额', a: '#10b981', s: '出口 +13.4% / 进口 +22.1%' },
  { v: '1.0%', l: 'CPI 上半年同比', a: '#8b5cf6', s: '核心 CPI +1.2%' },
  { v: '5.2%', l: '城镇调查失业率均值', a: '#22d3ee', s: '6 月 5.0%' },
  { v: '+4.2%', l: '居民人均可支配收入（实际）', a: '#e8a317', s: '名义 +5.2% · 22981 元' },
];

// —— 工业分项（同比 %）——
const IVA_BARS = {
  cats: ['规上工业', '采矿业', '制造业', '电力燃气水', '装备制造', '高技术制造'],
  data: [5.4, 3.6, 5.6, 5.5, 9.3, 13.3],
};

// —— 新质生产力代表产品产量（同比 %）——
const NPF_PRODUCTS = {
  cats: ['3D 打印设备', '锂离子电池', '工业机器人'],
  data: [48.5, 39.3, 28.0],
};

// —— 台账：已兑现 / 进行中 / 存疑 ——
const LEDGER = {
  done: {
    label: '已兑现', accent: '#10b981',
    items: [
      ['出口韧性', '进出口 +16.9%、机电 +20.1%，稳居全球货物贸易第一大国。'],
      ['新质生产力起势', '高技术制造 +13.3%、装备制造 +9.3%；锂电 +39.3%、机器人 +28.0%。'],
      ['PPI 转正', '6 月 PPI 同比 +4.1%（上半年累计 +1.5%），结束长期工业通缩。'],
      ['就业总量稳定', '城镇调查失业率均值 5.2%，6 月降至 5.0%。'],
    ],
  },
  ongoing: {
    label: '进行中', accent: '#e8a317',
    items: [
      ['扩内需政策', '社零 +1.3% 偏弱，以旧换新、服务消费仍需加力提振。'],
      ['地产止跌回稳', '开发投资 −18.0%、到位资金 −20.2%，仍在寻底。'],
      ['物价温和回升', 'CPI +1.0%、核心 +1.2%，弱通胀格局尚未根本扭转。'],
      ['民间投资修复', '民间投资 −8.5%，预期与信心修复是关键变量。'],
    ],
  },
  doubt: {
    label: '存疑 / 需观察', accent: '#c41e3a',
    items: [
      ['供强需弱能否闭合', '生产端（工业 5.4%）显著强于需求端（社零 1.3%、固投 −5.7%），缺口若持续将压制价格与利润。'],
      ['出口高增可持续性', '16.9% 高增速含抢出口与低基数成分，下半年外部关税与需求不确定性上升。〔存疑〕'],
      ['收入—消费传导', '居民收入实际 +4.2% 略低于 GDP 增速，财产净收入仅 +1.1%，消费倾向能否回升待观察。'],
      ['青年就业结构压力', '总量失业率平稳，但分年龄结构性压力仍需分项数据印证。〔以官方分项发布为准〕'],
    ],
  },
};

// —— 研判要点 ——
const VERDICTS = [
  ['1 · 增速达标，动能分化', 'H1 增速 4.7%（一季 5.0 → 二季 4.3，二季环比 +0.9%）落在合理区间，但二季度较一季度回落 0.7pct，边际动能走弱。增量约 3.6 万亿元仍为近年同期高位，「量的合理增长」由供给端与外需撑起。'],
  ['2 · 供强需弱是主要矛盾', '工业 +5.4%、服务业 +5.2% 的供给扩张，与社零 +1.3%、固投 −5.7% 的需求收缩形成剪刀差。官方明确「国内供强需弱矛盾突出」——这是价格低位、企业利润与预期承压的结构根源。'],
  ['3 · 新旧动能加速换挡', '高技术制造 +13.3%、装备制造 +9.3% 对冲地产 −18.0% 的塌陷。新质生产力是对冲旧引擎熄火的核心变量，但其增加值体量尚不足以完全填补地产与传统投资的缺口。'],
  ['4 · 外需红利与风险并存', '出口 +13.4% 是最亮读数，却也最依赖外部环境。抢出口、低基数与全球 AI/新能源景气叠加推高上半年，下半年关税博弈与需求回摆构成下行风险，外需难长期替代内需。'],
];

function barOpt({ cats, data, positive = '#22d3ee', negative = '#c41e3a', horizontal = false }) {
  const barData = data.map((v) => ({
    value: v,
    itemStyle: { color: v >= 0 ? positive : negative, borderRadius: horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0] },
  }));
  const catAxis = { type: 'category', data: cats, axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { ...LABEL } };
  const valAxis = valueY({ axisLabel: { formatter: '{value}%' } });
  return {
    grid: horizontal ? { left: 92, right: 28, top: 12, bottom: 20 } : { ...GRID, bottom: 48 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => `${v}%`, ...CHART_TOOLTIP },
    xAxis: horizontal ? valAxis : { ...catAxis, axisLabel: { ...LABEL, interval: 0, rotate: cats.some((c) => c.length > 4) ? 20 : 0 } },
    yAxis: horizontal ? { ...catAxis, inverse: true } : valAxis,
    series: [{ type: 'bar', barWidth: horizontal ? 12 : 22, data: barData, label: { show: true, position: horizontal ? 'right' : 'top', formatter: '{c}%', color: LABEL.color, fontSize: 10 } }],
  };
}

export default function Page() {
  const [engine, setEngine] = useState('export');
  const e = ENGINES.find((x) => x.key === engine) || ENGINES[0];

  const quarterOpt = useMemo(() => ({
    grid: { ...GRID, bottom: 28 },
    tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%`, ...CHART_TOOLTIP },
    xAxis: categoryX(['2025Q3', '2025Q4', '2026Q1', '2026Q2']),
    yAxis: valueY({ min: 3, max: 6, axisLabel: { formatter: '{value}%' } }),
    series: [{
      type: 'line', smooth: true, symbol: 'circle', symbolSize: 7,
      data: [4.8, 5.4, 5.0, 4.3],
      lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' },
      areaStyle: { color: 'rgba(196,30,58,0.1)' },
      label: { show: true, formatter: '{c}%', color: LABEL.color, fontSize: 10, position: 'top' },
    }],
  }), []);

  const engineOpt = useMemo(() => barOpt({ cats: e.bars.cats, data: e.bars.data, positive: e.accent }), [e]);
  const ivaOpt = useMemo(() => barOpt({ cats: IVA_BARS.cats, data: IVA_BARS.data, positive: '#e8a317' }), []);
  const npfOpt = useMemo(() => barOpt({ cats: NPF_PRODUCTS.cats, data: NPF_PRODUCTS.data, positive: '#c41e3a', horizontal: true }), []);

  return (
    <div>
      <PageHeader
        badge="H1 Economic Review · 2026"
        title="半年经济解读 · 2026 上半年"
        subtitle={`国家统计局 2026-07-15 发布 · GDP +4.7% · 供强需弱下的新旧动能换挡 · 数据截至 ${DATA_AS_OF}`}
      />

      <IntroCard>
        上半年 GDP 695704 亿元、同比增长 <strong style={{ color: 'var(--text-primary)' }}>4.7%</strong>（一季 5.0%、二季 4.3%，二季环比 +0.9%），
        运行在合理区间。但一张成绩单里藏着两条背离的曲线：<strong style={{ color: 'var(--text-primary)' }}>供给端</strong>（规上工业 +5.4%、高技术制造 +13.3%）
        与<strong style={{ color: 'var(--text-primary)' }}>外需</strong>（进出口 +16.9%）强劲，而<strong style={{ color: 'var(--text-primary)' }}>内需</strong>（社零 +1.3%、固投 −5.7%）疲弱。
        官方定调「国内供强需弱矛盾突出，经济向好基础还需巩固」。本页以核心仪表盘、三驾马车拆解、结构性信号与风险台账四条线索，
        穿透宏观叙事，从成本/收益与物理约束视角解析这台经济机器上半年的运转与软肋。
      </IntroCard>

      <StatGrid className="mb-8">
        {DASHBOARD.map((d) => (
          <Stat key={d.l} value={d.v} label={d.l} accent={d.a} sub={d.s} />
        ))}
      </StatGrid>

      <Grid cols={2} className="mb-8">
        <Card title="季度 GDP 增速 · 二季度边际回落（实际同比 %）" asSection={false}>
          <EChart option={quarterOpt} style={{ height: 240 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            增速从一季度 5.0% 回落至二季度 4.3%，二季环比 +0.9%（低于前几季 1.1%–1.3%）。
            全年 5% 左右目标下，下半年需求侧发力与地产企稳是关键。
          </p>
        </Card>
        <Card title="三次产业 · 增加值同比（上半年 %）" asSection={false}>
          <EChart
            option={barOpt({ cats: ['第一产业', '第二产业', '第三产业'], data: [3.7, 3.9, 5.2], positive: '#10b981' })}
            style={{ height: 240 }}
          />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            第一产业 31522 亿元 +3.7%、第二产业 250473 亿元 +3.9%、第三产业 413709 亿元 +5.2%。
            服务业重回主引擎，其中信息传输/软件（+10.7%）、租赁商务（+11.9%）领跑现代服务业。
          </p>
        </Card>
      </Grid>

      {/* 三驾马车拆解 */}
      <Card title="三驾马车拆解 · 消费 / 投资 / 出口" className="mb-8">
        <SelectorBar items={ENGINES} activeKey={engine} onSelect={setEngine} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${e.accent}` }}>
          <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{e.title}</div>
            <div className="mono text-lg font-semibold" style={{ color: e.accent }}>{e.headline}</div>
          </div>
          <Grid cols={3} className="mb-3">
            {e.metrics.map(([label, abs, yoy]) => (
              <div key={label} className="min-w-0">
                <div className="text-[11px] leading-snug mb-0.5" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
                <div className="text-sm font-semibold mono" style={{ color: e.accent }}>{yoy}</div>
                {abs !== '—' && <div className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>{abs}</div>}
              </div>
            ))}
          </Grid>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{e.note}</p>
        </div>
        <Card title={`${e.label} · 分项同比（%）`} asSection={false}>
          <EChart option={engineOpt} style={{ height: 260 }} />
        </Card>
      </Card>

      {/* 结构性信号 */}
      <Card title="结构性信号解读 · 穿透宏观叙事" className="mb-8">
        <Grid cols={2}>
          {[
            ['供强需弱：一张成绩单的两条曲线', '#c41e3a',
              '生产端（工业 +5.4%、服务业 +5.2%）与外需（进出口 +16.9%）撑起 4.7% 的增速，需求端（社零 +1.3%、固投 −5.7%）却在收缩。供需缺口是弱通胀、企业利润承压与预期偏冷的共同根源——增长的「量」达标，「价」与「信心」仍待修复。'],
            ['价格链：PPI 转正、CPI 低位的错位', '#e8a317',
              '6 月 PPI 同比 +4.1%（上半年累计 +1.5%）结束长期工业通缩，采掘（+4.8%）、原材料（+3.6%）领涨；而 CPI 仅 +1.0%、核心 +1.2%，猪肉 −13.4% 拖累食品。上游回暖尚未有效传导至终端需求，价格链的「上热下冷」是内需偏弱的镜像。'],
            ['新质生产力：对冲旧引擎熄火', '#22d3ee',
              '高技术制造 +13.3%、装备制造 +9.3% 显著跑赢大盘；3D 打印 +48.5%、锂电池 +39.3%、工业机器人 +28.0%。高技术产业投资 +4.6%、知识产权产品投资 +9.4% 逆势扩张。新动能正对冲地产塌陷，但体量尚不足以完全填补缺口。'],
            ['地产拖累：仍是最深的负向缺口', '#64748b',
              '房地产开发投资 −18.0%、房企到位资金 −20.2%、新开工面积 −23.4%。地产链条通过投资、土地财政与居民资产负债表三条路径拖累内需与地方财力，是「供强需弱」需求侧最沉重的砝码，止跌回稳仍在进行中。'],
          ].map(([t, c, d]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-surface)', borderLeft: `3px solid ${c}` }}>
              <div className="text-sm font-semibold mb-2" style={{ color: c }}>{t}</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-8">
        <Card title="工业分项 · 装备与高技术制造领跑（同比 %）" asSection={false}>
          <EChart option={ivaOpt} style={{ height: 260 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            规上工业 +5.4%，装备制造（+9.3%）、高技术制造（+13.3%）分别快于全部规上 3.9、7.9 个百分点。
            制造业 +5.6% 强于采矿业 +3.6%，工业结构持续向中高端与技术密集迁移。
          </p>
        </Card>
        <Card title="新质生产力 · 代表产品产量（同比 %）" asSection={false}>
          <EChart option={npfOpt} style={{ height: 260 }} />
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            3D 打印设备 +48.5%、锂离子电池 +39.3%、工业机器人 +28.0%——「能源压舱石 + 智能制造」双轮驱动，
            对应海关口径下集成电路、锂电池、电动汽车等高技术与绿色产品出口的同步高增。
          </p>
        </Card>
      </Grid>

      {/* 风险与未决项 · 台账 */}
      <Card title="风险与未决项 · 台账（已兑现 / 进行中 / 存疑）" className="mb-8">
        <Grid cols={3}>
          {[LEDGER.done, LEDGER.ongoing, LEDGER.doubt].map((col) => (
            <div key={col.label}>
              <div className="text-sm font-semibold mb-3 mono" style={{ color: col.accent }}>
                <span className="os-badge os-badge--sm mr-1" style={{ background: `${col.accent}22`, color: col.accent }}>●</span>
                {col.label}
              </div>
              <div className="flex flex-col gap-3">
                {col.items.map(([t, d]) => (
                  <div key={t} className="os-card p-3" style={{ background: 'var(--bg-elevated)', borderLeft: `2px solid ${col.accent}` }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Grid>
      </Card>

      {/* 研判要点 */}
      <Card title="研判要点 · 冷峻清单" className="mb-8">
        <Grid cols={2}>
          {VERDICTS.map(([t, d]) => (
            <div key={t} className="mb-3">
              <div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        {
          title: '供给侧：向新向优', subtitle: '工业 · 高技术 · 新质生产力',
          body: '工业 +5.4%、装备制造 +9.3%、高技术制造 +13.3% 构成本期最硬的支撑面，新旧动能换挡已在生产端兑现。',
          pillars: [['高技术制造', '+13.3%，跑赢大盘 7.9pct。'], ['新产品', '锂电 +39.3%、机器人 +28.0%。'], ['PPI 转正', '6 月 +4.1%，通缩缓解。']],
        },
        {
          title: '需求侧：内冷外热', subtitle: '消费 · 投资 · 出口',
          body: '出口 +16.9% 与消费 +1.3%、固投 −5.7% 的巨大落差，是「供强需弱」最直观的画像；外需难长期替代内需。',
          pillars: [['出口', '+13.4%，机电 +20.1%。'], ['消费', '+1.3%，服务强商品弱。'], ['投资', '−5.7%，地产 −18.0% 拖累。']],
        },
        {
          title: '下半场：稳需求、防外风', subtitle: '扩内需 · 稳地产 · 应对关税',
          body: '官方部署「加大逆周期与跨周期调节、持续扩大内需、建设强大国内市场」。地产止跌回稳与外部关税博弈是两大关键变量。',
          pillars: [['扩内需', '以旧换新 · 服务消费。'], ['稳地产', '止跌回稳仍在进行。'], ['防外风', '关税与外需回摆风险。']],
        },
      ]} />

      <ModuleFooter
        moduleId="econH1Review"
        links={[
          { to: '/econ-dashboard', label: '经济大盘 · 2026 H1', note: 'NBS 快照 + 金丝雀监测 + 三次产业结构，与本页互补。' },
          { to: '/econ-consume-15th', label: '十五五促消费 · 扩大消费规划', note: '国函〔2026〕66 号 · 对供强需弱的中期制度回应。' },
          { to: '/econ-dashboard?tab=worldbank', label: '世行经济简报 · 2026-07', note: '世界银行月度研判与基线预测（经济大盘 Tab）。' },
          { to: '/foreign-trade', label: '对外贸易 · 从世界工厂到规则博弈', note: '出口结构与伙伴版图的长周期拆解。' },
          { to: '/housing', label: '住房地产 · 行业周期', note: '地产投资 −18.0% 背后的行业周期与化债。' },
          { to: '/modules/signal-panel', label: '宏观再平衡信号灯', note: 'A/B/C 信号 · 态势合成 · 2026-07。' },
        ]}
        sourceNote={`数据来源：${SRC} · 进出口数据来源海关总署 · 数据截至 ${DATA_AS_OF}`}
        disclaimer={`GDP 与工业增加值为不变价/可比价实际增速，居民收入为实际增速，其余除特殊说明外为现价名义增速；以国家统计局官方发布为准 · 公开统计梳理 · 冷峻中立分析框架 · 非投资建议 · 非预测 · 基准 ${AS_OF_BASELINE}`}
      />
    </div>
  );
}
