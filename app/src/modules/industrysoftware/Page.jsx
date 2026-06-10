import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const axis = { axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } };
const split = { splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } };

const maturityBar = {
  grid: { left: 44, right: 20, top: 24, bottom: 28 },
  xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2025E'], ...axis },
  yAxis: { type: 'value', min: 0, max: 100, axisLabel: { color: '#93a1b5' }, ...split },
  series: [{ type: 'bar', data: [15, 30, 55, 78, 92], barWidth: '52%', itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] }, label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10 } }],
};
const autonomyBar = {
  grid: { left: 110, right: 44, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#93a1b5' }, ...split },
  yAxis: { type: 'category', data: ['三维几何内核', '国产服务器 OS', 'PLC/DCS 自主化', 'Ecosystem Sync', 'Algorithm Autonomy'], ...axis },
  series: [{ type: 'bar', data: [
    { value: 25, itemStyle: { color: '#c41e3a' } },
    { value: 35, itemStyle: { color: '#e8a317' } },
    { value: 42, itemStyle: { color: '#e8a317' } },
    { value: 65, itemStyle: { color: '#22d3ee' } },
    { value: 82, itemStyle: { color: '#10b981' } },
  ], barWidth: 13, itemStyle: { borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5', fontSize: 10 } }],
};
const growthLine = {
  grid: { left: 44, right: 20, top: 24, bottom: 28 },
  xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023'], ...axis },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: '#93a1b5' }, ...split },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [11.2, 13.6, 15.8, 18.5], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};

const term = (k, v, c) => (
  <div key={k} className="flex justify-between text-[11px] mono"><span style={{ color: 'var(--text-tertiary)' }}>{k}</span><span style={{ color: c }}>{v}</span></div>
);

export default function Page() {
  return (
    <div>
      <PageHeader badge="Industrial Software · 算法主权" title="工业软件 · 信创替代" subtitle="CAD/CAE/EDA · 嵌入式 · 信创进度 · 卡脖子 —— 定义制造之魂的算法主权" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>「如果半导体是工业的心脏，那么工业软件就是它的灵魂。在现实主义棋局中，谁掌握了三维建模内核与仿真算法，谁就拥有了物理世界在数字空间的『解释权』和『修改权』。」</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="2,800 亿" label="工业软件产值规模（2023 统计年报）" accent="#c41e3a" />
        <Stat value="18.5%" label="研发设计软件增速 · 稳居工业类第一" accent="#10b981" />
        <Stat value="35%+" label="国产服务器 OS 份额 · openEuler 贡献度领先" accent="#22d3ee" />
        <Stat value="42.0%" label="PLC/DCS 自主化率 · 电力石化核心领域突破" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="国产工业软件核心算法成熟度（2020-2025E · 指数）"><EChart option={maturityBar} style={{ height: 240 }} /></Card>
        <Card title="研发设计类软件增速走势（% · 示意）"><EChart option={growthLine} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="战略命门 · 研发设计类软件的物理攻坚" className="mb-6">
        <Grid cols={2}>
          <div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>现实主义逻辑下，CAD（设计）、CAE（仿真）、EDA（电子设计自动化）是工业体系的「主板」。中国目前在三维几何建模内核、多物理场耦合算法等底层协议上，正面临非对称的外部锁定。</p>
            <div className="p-4 rounded space-y-2" style={{ background: 'rgba(148,163,184,0.06)', border: '1px solid var(--border-subtle)' }}>
              {term('CHOKE_POINT:', 'GEOMETRIC_KERNEL', '#c41e3a')}
              {term('PROGRESS:', '3D_NUCLEUS_ALPHA_V4', '#10b981')}
              {term('STATUS:', 'D-U-V_MASK_ALGORITHM_OK', '#22d3ee')}
              <div style={{ height: 6, background: 'rgba(148,163,184,0.15)', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', width: '25%', background: '#10b981', borderRadius: 3 }} /></div>
            </div>
            <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>核心路径是「产学研压强式投入」：通过国家级大科学装置对冲商业软件在物理实验数据上的缺失，直接跨越到基于 AI 的「新一代仿真范式」。</p>
          </div>
          <div><div className="text-xs font-semibold mb-2 text-center" style={{ color: '#10b981' }}>卡脖子环节自主化 / 进度评估（% · 示意）</div><EChart option={autonomyBar} style={{ height: 240 }} /></div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="数字底座 · OS 主权锁定">
          <div className="space-y-3">
            {[['鸿蒙 (HarmonyOS)', '实现工控设备、传感器、车载系统的微内核统一，解决碎片化。', '#10b981'],
              ['欧拉 (openEuler)', '面向数字基础设施，确立服务器与云计算的开源主权底座。', '#22d3ee'],
              ['极速实时响应', '工业内核时延降至微秒级，保障精密制造的物理安全。', '#e8a317'],
              ['全栈生态隔离', '构建独立于 X86/ARM 的逻辑闭环，防范系统级后门风险。', '#c41e3a']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
        <Card title="Software Sovereignty Score · 综合数字强度指数">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold mono" style={{ color: 'var(--text-primary)' }}>88<span className="text-sm ml-1" style={{ color: '#10b981' }}>#Alpha</span></div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Comprehensive Digital Strength Index</div>
          </div>
          <div className="space-y-3">
            {[['Algorithm Autonomy', 'REINFORCED', 82], ['Ecosystem Sync', '94.5%', 65]].map(([k, v, w]) => (
              <div key={k}>
                <div className="flex justify-between text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}><span>{k}:</span><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{v}</span></div>
                <div style={{ height: 6, background: 'rgba(148,163,184,0.15)', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: `${w}%`, background: '#10b981', borderRadius: 3 }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="软件定义制造 · 全连接工厂的系统逻辑" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>中国正利用 5G-A + 工业互联网重新编写工厂的「运行手册」。MES（执行系统）与 ERP（管理系统）的深度耦合，使得生产不再是盲目的机械运动，而是基于实时数据流的「按需调度算法」。这种「工业大脑」的普及，是制造业实现成本下探与柔性定制的关键杠杆。</p>
        <Grid cols={2}>
          {[['全流程数字化建模', '实现从设计图纸到产线指令的「零人工干预」流转。', '#22d3ee'],
            ['供应链风险监测', '算法实时监控全球物流与库存，预判外部中断并自动寻源。', '#e8a317']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="战略结论 · 构建数字世界的防御深度" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>工业软件不仅是效率问题，它是 China OS v2.0 维护「制造主权」的最后一道算法防线。通过在底层操作系统建立「物理隔绝」、在研发设计领域实施「换道超车」、在生产环节实现「智能闭环」，中国正试图将工业知识彻底资产化与安全化。在现实主义的棋局中，一套自主可控的工业软件体系，是国家工业机器在面临极端非对称制裁时，仍能保持高精度、长周期运转的唯一逻辑保障。</p>
        <div className="flex flex-wrap gap-4 text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>
          {['KERNEL_AUTONOMY: ESTABLISHED', 'SOFTWARE_DEFENSE_LINE: SECURE', 'STATUS: SYSTEM_RUNNING_STABLE'].map((s) => (
            <span key={s} className="flex items-center gap-1.5"><span style={{ width: 6, height: 6, borderRadius: 3, background: '#10b981', display: 'inline-block' }} />{s}</span>
          ))}
        </div>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>「逻辑决定执行，代码重构物理」 — RIA · 数据为公开信息综合整理与示意值 · 由 china.html「工业软件」专题迁移</p>
    </div>
  );
}
