import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt, donutOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const H2_TYPES = [
  { key: 'grey', label: '灰氢', accent: '#64748b', share: 62, cost: 12, desc: '煤制氢/天然气重整为主，碳排放高但成本最低——过渡期的现实选择，绿氢替代需时间。' },
  { key: 'blue', label: '蓝氢', accent: '#22d3ee', share: 20, cost: 18, desc: '化石制氢 + CCUS 捕集，成本介于灰氢与绿氢之间；化工园区示范先行。' },
  { key: 'green', label: '绿氢', accent: '#10b981', share: 15, cost: 35, desc: '电解水制氢，电力占比极高；西北风光基地 + 特高压是降本物理路径——电价决定天花板。' },
];

const PHASES = [
  { period: '2020–2022', title: '规划起步', accent: '#64748b', desc: '国家氢能中长期规划出台，示范城市群启动，电解槽项目备案 400+。' },
  { period: '2023–2024', title: '设备降本', accent: '#e8a317', desc: 'ALK 单位投资 3500→2200 元/kW，PEM 仍处高位；绿氢成本 ~35 元/kg。' },
  { period: '2025–2030', title: '商业闭环', accent: '#c41e3a', desc: '绿氢目标成本 15 元/kg 以下；储运加注与标准认证决定能否走向规模。' },
];

export default function Page() {
  const [h2, setH2] = useState('green');
  const [phaseIdx, setPhaseIdx] = useState(1);
  const h = H2_TYPES.find((x) => x.key === h2) || H2_TYPES[2];

  const mixDonut = useMemo(() => donutOpt([
    { value: h2 === 'grey' ? 75 : 62, name: '灰氢', itemStyle: { color: '#93a1b5' } },
    { value: h2 === 'blue' ? 30 : 20, name: '蓝氢', itemStyle: { color: '#22d3ee' } },
    { value: h2 === 'green' ? 35 : 15, name: '绿氢', itemStyle: { color: '#10b981' } },
    { value: 3, name: '其他', itemStyle: { color: '#e8a317' } },
  ]), [h2]);

  const costTrend = useMemo(() => ({
    grid: GRID,
    legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
    xAxis: categoryX(['2020', '2022', '2024', '2026E', '2030E']),
    yAxis: valueY({ name: '元/kg' }),
    series: [{ type: 'line', smooth: true, name: `${h.label}成本`,
      data: h2 === 'green' ? [45, 38, 35, 22, 15] : h2 === 'blue' ? [22, 20, 18, 16, 14] : [12, 12, 11, 10, 9],
      lineStyle: { color: h.accent, width: 2 }, itemStyle: { color: h.accent },
      areaStyle: { color: `${h.accent}18` } }],
  }), [h2, h]);

  const chainRadar = radarOpt(['电解槽', '储运', '材料', '场景', '政策', '国际合作'],
    h2 === 'green' ? [100, 92, 55, 88, 95, 65] : [85, 80, 70, 75, 90, 60],
    { name: '中国', color: h.accent });

  return (
    <div>
      <PageHeader badge="Hydrogen · 双碳二次能源" title="绿氢 · 制储运加用" subtitle="电解槽 · 绿氢降本 · 示范城市群" />
      <IntroCard>电解水制氢成本中<strong style={{ color: 'var(--text-primary)' }}>电力占比极高</strong>，与风光消纳、特高压送电及 CCUS 路径竞争。氢的产业化必须沿「制—储—运—加—用」全链条同步推进，任一环节短板都会抬高终端用氢成本。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value={`~${h.cost} 元/kg`} label={`${h.label}成本 · 切换`} accent={h.accent} />
        <Stat value={`${h.share}%`} label="当前结构占比（示意）" accent="#22d3ee" />
        <Stat value="400+ 项" label="国内电解槽项目" accent="#e8a317" />
        <Stat value="~15%" label="2050 终端能源占比（情景）" accent="#10b981" />
      </Grid>

      <Card title="交互① · 氢源类型选择器" className="mb-6">
        <SelectorBar items={H2_TYPES} activeKey={h2} onSelect={setH2} />
        <div className="os-card p-4 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${h.accent}` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{h.desc}</p>
        </div>
        <Grid cols={2}>
          <Card title="氢源结构（随类型切换）"><EChart option={mixDonut} style={{ height: 220 }} /></Card>
          <Card title="制氢成本曲线"><EChart option={costTrend} style={{ height: 220 }} /></Card>
        </Grid>
      </Card>

      <Card title="交互② · 产业化阶段时间线" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="氢能产业链能力对标"><EChart option={chainRadar} style={{ height: 280 }} /></Card>
        <Card title="制 · 电解槽三条路线">
          <div className="space-y-2">
            {[['ALK 碱性', '成熟度高，适合大规模集中制氢；成本最低。', '#22d3ee'],
              ['PEM 质子交换膜', '启停快，适配风光波动；贵金属成本高。', '#c41e3a'],
              ['SOEC 高温电解', '可与工业余热耦合；耐久与密封攻关中。', '#e8a317']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '绿电成本', subtitle: '第一变量', body: '西北风光基地与东部负荷匹配决定外送与就地消纳；电价每降 0.1 元，绿氢成本降 ~2 元/kg。', pillars: [['风光基地', '源网荷储一体化。'], ['特高压', '西电东送耦合。'], ['消纳', '弃风弃光制氢。']] },
        { title: '储运瓶颈', subtitle: '中间环节', body: '管道掺氢、液氨/甲醇载体与加氢站网络是绿氢落地中间瓶颈；与油气基础设施协同降低重复投资。', pillars: [['管道掺氢', '降低新建成本。'], ['加氢站', '利用率决定经济。'], ['安全规范', '高压储氢标准。']] },
        { title: '应用场景', subtitle: '重卡 · 绿钢', body: '重卡、航运与炼化难以直接电气化；绿钢 DRI 路线替代焦炭，绿氢成本与碳成本双变量。', pillars: [['燃料电池重卡', '港口矿区示范。'], ['氢冶金', 'DRI 替代焦炭。'], ['标准认证', '绿氢溯源出口。']] },
      ]} />

      <ModuleFooter moduleId="hydrogen" sourceNote="由 china.html「氢能」专题迁移升级" />
    </div>
  );
}
