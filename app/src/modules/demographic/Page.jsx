import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { AXIS, LABEL, GRID_LINE } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// ── 人口金字塔数据（示意值，单位：百万人；男性取负数用于双向条形）──
const AGE_BANDS = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+'];
const PYRAMID = {
  '1990': { label: '1990 · 增长型「金字塔」', male: [-118, -126, -130, -95, -72, -55, -38, -18, -5], female: [108, 118, 124, 92, 69, 53, 38, 20, 7] },
  '2010': { label: '2010 · 收缩型「灯笼」', male: [-83, -98, -116, -120, -118, -92, -58, -33, -12], female: [75, 90, 108, 116, 114, 90, 58, 36, 16] },
  '2024': { label: '2024 · 老龄主导「橄榄」', male: [-58, -72, -82, -108, -116, -118, -100, -55, -28], female: [52, 65, 75, 102, 112, 116, 102, 60, 38] },
  '2035': { label: '2035E · 倒挂「倒金字塔」雏形', male: [-48, -56, -64, -78, -98, -112, -116, -92, -52], female: [44, 51, 59, 73, 94, 110, 118, 100, 68] },
};
const PYRAMID_YEARS = Object.keys(PYRAMID);

function buildPyramid(year) {
  const d = PYRAMID[year];
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => {
      const band = p[0].axisValue;
      const m = Math.abs(p.find((x) => x.seriesName === '男性')?.value ?? 0);
      const f = p.find((x) => x.seriesName === '女性')?.value ?? 0;
      return `${band} 岁<br/>男性 ${m} 百万<br/>女性 ${f} 百万`;
    } },
    legend: { data: ['男性', '女性'], top: 0, textStyle: { color: LABEL.color }, itemWidth: 12, itemHeight: 12 },
    grid: { left: 56, right: 28, top: 30, bottom: 24 },
    xAxis: { type: 'value', axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, formatter: (v) => Math.abs(v) }, splitLine: { lineStyle: { color: GRID_LINE.lineStyle.color } } },
    yAxis: { type: 'category', data: AGE_BANDS, axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color }, axisTick: { show: false } },
    series: [
      { name: '男性', type: 'bar', stack: 'pop', data: d.male, itemStyle: { color: '#22d3ee' }, barWidth: '64%' },
      { name: '女性', type: 'bar', stack: 'pop', data: d.female, itemStyle: { color: '#c41e3a' }, barWidth: '64%' },
    ],
  };
}

// ── 抚养比演进（保留原老年抚养比，补充少儿与总抚养比）──
const dependencyLine = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['少儿抚养比', '老年抚养比', '总抚养比'], top: 0, textStyle: { color: LABEL.color }, itemWidth: 12, itemHeight: 12 },
  grid: { left: 44, right: 24, top: 30, bottom: 28 },
  xAxis: { type: 'category', data: ['2010', '2015', '2020', '2025E', '2030E', '2035E'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: LABEL.color }, splitLine: { lineStyle: { color: GRID_LINE.lineStyle.color } } },
  series: [
    { name: '少儿抚养比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [22.3, 22.6, 26.2, 25.0, 23.5, 22.0], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    { name: '老年抚养比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [11.9, 14.3, 19.7, 22.0, 26.5, 32.0], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } },
    { name: '总抚养比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [34.2, 36.9, 45.9, 46.6, 50.2, 54.0], lineStyle: { color: '#c41e3a', width: 2, type: 'dashed' }, itemStyle: { color: '#c41e3a' } },
  ],
};

// ── 多维趋势：TFR / 老龄化率 / 城镇化率 ──
const multiTrend = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['总和生育率(TFR)', '老龄化率(65+)', '城镇化率'], top: 0, textStyle: { color: LABEL.color }, itemWidth: 12, itemHeight: 12 },
  grid: { left: 44, right: 44, top: 30, bottom: 28 },
  xAxis: { type: 'category', data: ['2000', '2010', '2020', '2024', '2035E'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color } },
  yAxis: [
    { type: 'value', name: 'TFR', min: 0, max: 2.2, axisLabel: { color: LABEL.color }, splitLine: { lineStyle: { color: GRID_LINE.lineStyle.color } } },
    { type: 'value', name: '%', axisLabel: { formatter: '{value}%', color: LABEL.color }, splitLine: { show: false } },
  ],
  series: [
    { name: '总和生育率(TFR)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, yAxisIndex: 0, data: [1.45, 1.18, 1.30, 1.00, 1.10], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, markLine: { silent: true, symbol: 'none', lineStyle: { color: '#fb923c', type: 'dashed' }, data: [{ yAxis: 2.1, label: { formatter: '更替水平 2.1', color: '#fb923c', fontSize: 10 } }] } },
    { name: '老龄化率(65+)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, yAxisIndex: 1, data: [7.0, 8.9, 13.5, 15.6, 24.5], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    { name: '城镇化率', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, yAxisIndex: 1, data: [36.2, 49.7, 63.9, 67.0, 75.0], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' } },
  ],
};

// ── 区域人口分化（净流入/流出，示意，万人/年）──
const REGION = {
  inflow: { label: '人口净流入 TOP (2024)', data: [['广东', 74], ['浙江', 43], ['新疆', 25], ['江苏', 9], ['海南', 5], ['福建', 10]], color: '#10b981' },
  outflow: { label: '人口净流出 TOP (2024)', data: [['河南', -30], ['山东', -43], ['黑龙江', -33], ['湖南', -28], ['辽宁', -27], ['河北', -15]], color: '#fb923c' },
};
function buildRegion(mode) {
  const cfg = REGION[mode];
  const sorted = [...cfg.data].sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]));
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p) => `${p[0].axisValue}<br/>净迁移 ${p[0].value} 万人/年` },
    grid: { left: 64, right: 36, top: 16, bottom: 24 },
    xAxis: { type: 'value', axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color, formatter: (v) => Math.abs(v) }, splitLine: { lineStyle: { color: GRID_LINE.lineStyle.color } } },
    yAxis: { type: 'category', data: sorted.map((x) => x[0]), axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color }, axisTick: { show: false } },
    series: [{ type: 'bar', data: sorted.map((x) => x[1]), barWidth: '56%', itemStyle: { color: cfg.color, borderRadius: 4 }, label: { show: true, position: mode === 'inflow' ? 'right' : 'left', formatter: (p) => Math.abs(p.value), color: LABEL.color, fontSize: 11 } }],
  };
}

const talentBar = {
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 24, top: 20, bottom: 28 },
  xAxis: { type: 'category', data: ['2010', '2015', '2020', '2024'], axisLine: { lineStyle: { color: AXIS.lineStyle.color } }, axisLabel: { color: LABEL.color } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: LABEL.color }, splitLine: { lineStyle: { color: GRID_LINE.lineStyle.color } } },
  series: [{ name: '本科以上学历占比', type: 'bar', data: [8.9, 11.5, 15.5, 19.8], barWidth: 22, itemStyle: { color: '#c41e3a', borderRadius: 4 }, label: { show: true, position: 'top', formatter: '{c}%', color: LABEL.color } }],
};
const silverPie = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: false,
    itemStyle: { borderRadius: 10, borderColor: 'transparent', borderWidth: 2 },
    label: { show: true, color: LABEL.color }, emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
    labelLine: { lineStyle: { color: AXIS.lineStyle.color } },
    data: [
      { value: 40, name: '医疗保健与医药', itemStyle: { color: '#c41e3a' } },
      { value: 25, name: '养老金融服务', itemStyle: { color: '#e8a317' } },
      { value: 20, name: '智能助老硬件', itemStyle: { color: '#10b981' } },
      { value: 15, name: '适老文旅休闲', itemStyle: { color: '#22d3ee' } },
    ],
  }],
};

function Toggle({ active, onClick, children }) {
  return (
    <button onClick={onClick} className="text-xs px-3 py-1.5 rounded transition-colors"
      style={{
        background: active ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)',
        color: active ? '#fff' : 'var(--text-secondary)',
        border: active ? '1px solid #c41e3a' : '1px solid var(--border-subtle)',
        cursor: 'pointer',
      }}>{children}</button>
  );
}

// ── 三大人口拐点（示意）──
const INFLECTIONS = [
  { tag: 'PEAK', year: '2022', title: '总人口达峰', value: '14.1 亿', desc: '总人口于 2022 年触顶后转入下行通道，2025 年约 14.05 亿，规模红利窗口关闭。', accent: '#c41e3a' },
  { tag: 'POLICY', year: '2026', title: '育儿补贴落地', value: '3600 元/孩/年', desc: '政府工作报告明确育儿补贴标准，与普惠托育、生育友好社会配套，试图抬升 TFR 底部。', accent: '#22d3ee' },
  { tag: 'DEEP-AGING', year: '2033E', title: '深度老龄化时点', value: '65+ > 20%', desc: '预计 2033 年前后跨入「深度老龄化社会」门槛，社保精算压力峰值。', accent: '#e8a317' },
];

export default function Page() {
  const [pyYear, setPyYear] = useState('2024');
  const [regionMode, setRegionMode] = useState('inflow');

  return (
    <div>
      <PageHeader badge="Demographic Balance & Future Resilience" title="人口负增长 · 结构转型" subtitle="抚养比 · 老龄化 · 生育支持 · 城镇化迁移 —— 人口结构与长寿红利博弈（DATA_ANCHOR: 7th_CENSUS_UPDATE）" />
      <IntroCard>现实主义逻辑认为，人口老龄化是文明演进的物理必然。四条主线展开应对：01 老龄化熵增对冲、02 人才红利迭代、03 银发经济算法、04 生育激励与成本。核心目标是维持基本医保与社保基金的精算平衡，防止「赡养比」崩塌引发的财政系统性风险。</IntroCard>

      <StatGrid className="mb-6">
        <Stat value="14.05 亿" label="总人口 (2025 · 负增长延续)" accent="#c41e3a" />
        <Stat value="15.8%" label="老龄化率 (65+) · 2025 公报" accent="#e8a317" />
        <Stat value="1.00" label="总和生育率 (TFR) · 2024 NBS" accent="#22d3ee" />
        <Stat value="46.6%" label="总抚养比 · 2024 公报" accent="#10b981" />
      </StatGrid>

      {/* ── 三大人口拐点指标卡 ── */}
      <Grid cols={3} className="mb-6">
        {INFLECTIONS.map((it) => (
          <div key={it.title} className="os-card p-5" style={{ borderTop: `2px solid ${it.accent}` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: it.accent }}>// {it.tag}</span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{it.year}</span>
            </div>
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{it.value}</div>
            <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{it.title}</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{it.desc}</p>
          </div>
        ))}
      </Grid>

      {/* ── 交互式人口金字塔 ── */}
      <Card title="人口金字塔演化 · 从「金字塔」到「倒金字塔」（年龄×性别，百万人 · 示意）" className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {PYRAMID_YEARS.map((y) => (
            <Toggle key={y} active={pyYear === y} onClick={() => setPyYear(y)}>{y === '2035' ? '2035E' : y}</Toggle>
          ))}
          <span className="text-xs ml-2" style={{ color: 'var(--text-tertiary)' }}>{PYRAMID[pyYear].label}</span>
        </div>
        <EChart key={pyYear} option={buildPyramid(pyYear)} style={{ height: 340 }} />
        <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>结构物理：1990 年宽基底的增长型结构，在三十年内被「计划生育 + 现代化生育坍缩」逐级削薄底座，2035 年青年层窄于老年层，赡养向量开始倒挂。</p>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="抚养比演进 · 少儿 / 老年 / 总（% · 示意）"><EChart option={dependencyLine} style={{ height: 260 }} /></Card>
        <Card title="多维趋势 · 生育率 / 老龄化率 / 城镇化率（示意）"><EChart option={multiTrend} style={{ height: 260 }} /></Card>
      </Grid>

      {/* ── 区域人口分化（可切换流入/流出）── */}
      <Card title="区域人口分化 · 净迁移势能（万人/年 · 示意）" className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Toggle active={regionMode === 'inflow'} onClick={() => setRegionMode('inflow')}>净流入省份</Toggle>
          <Toggle active={regionMode === 'outflow'} onClick={() => setRegionMode('outflow')}>净流出省份</Toggle>
          <span className="text-xs ml-2" style={{ color: 'var(--text-tertiary)' }}>{REGION[regionMode].label}</span>
        </div>
        <EChart key={regionMode} option={buildRegion(regionMode)} style={{ height: 240 }} />
        <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>人口不是均匀蒸发，而是向沿海城市群虹吸。东北与中西部腹地的「人口空心化」与都市圈的「年轻化集聚」并存，区域分化即财政与产业分化。</p>
      </Card>

      <Card title="01 · 老龄化挑战：从「负担」到「资源」" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>体制正通过「渐进式延迟退休」与「个人养老金制度」实现养老负担的社会再分配，维持基本医保与社保基金的精算平衡。</p>
        <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10, background: 'var(--bg-elevated)', padding: '8px 10px' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>策略：将老龄化视为「长寿红利」，通过终身学习与适老化改造，激活退休后的「二次动员」。</p>
        </div>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="03 · 银发经济产业权重分布（示意）"><EChart option={silverPie} style={{ height: 280 }} /></Card>
        <Card title="银发经济：万亿内需锚点">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>银发经济不仅是养老，更是涵盖了医疗康复、智慧助老、老年文旅及财富管理的综合产业群。体制正通过政策引导，将 2.9 亿老龄人口转化为新的内需引擎。当「60后」一代步入老龄，其显著的数字化偏好与消费力正重塑中国商业底色。</p>
          <Grid cols={2}>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>90%</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>居家养老占比（9073 格局）</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>1.5 万亿</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>适老化改造市场潜力</p></div>
          </Grid>
        </Card>
      </Grid>

      {/* ── 人口红利 → 人才红利 转换框架 ── */}
      <Card title="02 · 人口红利 → 人才红利 · 转换框架" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>数据揭示：虽然劳动人口总量在下降，但高学历劳动力密度正在指数级增加（本科以上占比由 2010 年 8.9% 升至 2024 年 19.8%）。这是中国支撑「新质生产力」和高端制造业的最核心溢价。范式从「人海规模」迁移到「人均密度」。</p>
        <Grid cols={2}>
          <div>
            <EChart option={talentBar} style={{ height: 220 }} />
          </div>
          <div className="flex flex-col gap-3">
            {[['数量红利 · 退场', '劳动年龄人口 2012 年达峰后逐年净减，规模驱动模型失效。', '#fb923c'],
              ['质量红利 · 接棒', '受教育年限 14.1 年 + 工程师密度，单位人力产出溢价上行。', '#22d3ee'],
              ['密度红利 · 锚点', '高学历劳动力向先进制造与研发集聚，对冲总量缺口。', '#10b981']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 12 }}>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Grid>
      </Card>

      <Card title="04 · 生育激励算法：成本与意愿的校准" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>低生育率是社会现代化的「内生阻力」。中国正通过从「行政生育」向「服务生育」的范式切换，试图解决住房、教育、医疗三座大山对生育意愿的挤压。现实主义视角下，生育不仅是个体权利，更是国家主权资本的再生产，需要系统级的宏观投入。</p>
        <Grid cols={3}>
          {[['Cost Reduction Protocol', '降低生育、养育、教育全链条直接成本，缓解住房与教育支出对生育决策的挤压。'],
            ['Inclusive Childcare Services', '普惠托育服务体系扩容，将 0-3 岁照护纳入公共服务供给，释放女性劳动参与。'],
            ['Tax Incentive Mechanism', '以个税专项附加扣除与补贴工具校准家庭生育成本-收益函数。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="战略结论 · Demographic Infrastructure" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>人口问题的本质是结构转型而非总量恐慌：以教育密度对冲劳动力数量缺口，以银发内需对冲抚养比上行，以制度化生育支持托底长期再生产。三条对冲线共同决定「长寿红利」能否兑现。</p>
        <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
          <span>// HUMAN_CAPITAL: OPTIMIZING</span>
          <span>// AGING_ENTROPY: BUFFERING</span>
          <span>// STATUS: RESILIENT</span>
        </div>
      </Card>
<FrameworkTrio cards={[
        { key: 'salt', body: '老龄化负载：医保/养老精算压力。' },
        { key: 'stone', body: '人才红利密度对冲劳动力缺口。' },
        { key: 'path', body: '生育支持：成本—意愿函数系统校准。' },
      ]} />
<ModuleFooter moduleId="demographic" sourceNote="数据截至 2026-07-13 · NBS/统计公报公开口径" />
    </div>
  );
}
