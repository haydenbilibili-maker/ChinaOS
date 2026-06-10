import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const dependencyLine = {
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 24, top: 20, bottom: 28 },
  xAxis: { type: 'category', data: ['2010', '2015', '2020', '2025E', '2030E'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ name: '老年抚养比', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [11.9, 14.3, 19.7, 24.5, 31.0], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } }],
};
const talentBar = {
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 24, top: 20, bottom: 28 },
  xAxis: { type: 'category', data: ['2010', '2015', '2020', '2024'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ name: '本科以上学历占比', type: 'bar', data: [8.9, 11.5, 15.5, 19.8], barWidth: 22, itemStyle: { color: '#c41e3a', borderRadius: 4 }, label: { show: true, position: 'top', formatter: '{c}%', color: '#93a1b5' } }],
};
const silverPie = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: false,
    itemStyle: { borderRadius: 10, borderColor: 'transparent', borderWidth: 2 },
    label: { show: true, color: '#93a1b5' }, emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
    labelLine: { lineStyle: { color: '#27324a' } },
    data: [
      { value: 40, name: '医疗保健与医药', itemStyle: { color: '#c41e3a' } },
      { value: 25, name: '养老金融服务', itemStyle: { color: '#e8a317' } },
      { value: 20, name: '智能助老硬件', itemStyle: { color: '#10b981' } },
      { value: 15, name: '适老文旅休闲', itemStyle: { color: '#22d3ee' } },
    ],
  }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Demographic Balance & Future Resilience" title="人口负增长 · 结构转型" subtitle="抚养比 · 老龄化 · 生育支持 · 城镇化迁移 —— 人口结构与长寿红利博弈（DATA_ANCHOR: 7th_CENSUS_UPDATE）" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>现实主义逻辑认为，人口老龄化是文明演进的物理必然。四条主线展开应对：01 老龄化熵增对冲、02 人才红利迭代、03 银发经济算法、04 生育激励与成本。核心目标是维持基本医保与社保基金的精算平衡，防止「赡养比」崩塌引发的财政系统性风险。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="21.1%" label="老龄人口占比 (60+) · 进入中度老龄化" accent="#e8a317" />
        <Stat value="14.1 年" label="劳动力平均受教育年限 · 质量红利对冲数量缺口" accent="#22d3ee" />
        <Stat value="~1.0" label="总和生育率 (TFR) · 低于更替水平 2.1" accent="#c41e3a" />
        <Stat value="30 万亿" label="银发市场规模 (Silver) · 2035 预期规模 (RMB)" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="老年抚养比变化趋势（% · 模拟数据）"><EChart option={dependencyLine} style={{ height: 240 }} /></Card>
        <Card title="人才红利迭代 · 本科以上学历占比（%）"><EChart option={talentBar} style={{ height: 240 }} /></Card>
      </Grid>

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

      <Card title="02 · 人才红利迭代：从数量到密度" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>数据揭示：虽然劳动人口总量在下降，但高学历劳动力密度正在指数级增加（本科以上占比由 2010 年 8.9% 升至 2024 年 19.8%）。这是中国支撑「新质生产力」和高端制造业的最核心溢价。</p>
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

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据锚点：第七次人口普查及公开统计综合整理，部分为示意值 · 由 china.html「人口」专题迁移</p>
    </div>
  );
}
