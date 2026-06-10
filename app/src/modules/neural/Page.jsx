import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const AXIS = '#27324a';
const GRID = 'rgba(148,163,184,0.1)';
const TEXT = '#93a1b5';

// BCI 对全要素生产率的非线性贡献（源：bci-productivity-chart）
const productivity = {
  grid: { left: 44, right: 16, top: 24, bottom: 24 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'PEAK'], axisLine: { lineStyle: { color: AXIS } }, axisLabel: { color: TEXT } },
  yAxis: { type: 'value', name: 'Neural Efficiency', nameTextStyle: { color: TEXT }, splitLine: { lineStyle: { color: GRID } }, axisLabel: { color: TEXT } },
  series: [{ type: 'bar', data: [20, 45, 75, 90, 98], barWidth: 22, itemStyle: { color: '#c41e3a', borderRadius: [4, 4, 0, 0] }, label: { show: true, position: 'top', color: TEXT, fontSize: 10 } }],
};
// 侵入式 vs 非侵入式：信号质量与风险权衡（示意）
const pathwayRadar = {
  tooltip: {},
  legend: { top: 0, textStyle: { color: TEXT }, data: ['全植入式（侵入）', '头皮电极（非侵入）'] },
  radar: { indicator: [{ name: '信号分辨率', max: 100 }, { name: '通道密度', max: 100 }, { name: '佩戴便利', max: 100 }, { name: '生物安全', max: 100 }, { name: '伦理门槛', max: 100 }], axisName: { color: TEXT }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [95, 92, 35, 55, 40], name: '全植入式（侵入）', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [55, 50, 90, 88, 80], name: '头皮电极（非侵入）', lineStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' } },
  ] }],
};
// 全球 BCI 核心专利占比（示意）
const patentShare = {
  grid: { left: 70, right: 28, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 40, splitLine: { lineStyle: { color: GRID } }, axisLabel: { color: TEXT, formatter: '{value}%' } },
  yAxis: { type: 'category', data: ['其他', '欧盟', '中国', '美国'], axisLine: { lineStyle: { color: AXIS } }, axisLabel: { color: TEXT } },
  series: [{ type: 'bar', data: [14.5, 18, 32.5, 35], barWidth: 15, itemStyle: { color: '#e8a317', borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%', color: TEXT } }],
};

const apps = [
  ['无损工业指挥', '#c41e3a', '脑控机器人、外骨骼，实现人机一体化精确作业。'],
  ['情感认知增强', '#22d3ee', '监测压力与疲劳，动态调节官僚系统的工作荷载。'],
  ['神经资产保护', '#10b981', '通过加密芯片保护核心技术人员的知识产权资产。'],
  ['辅助决策加速', '#e8a317', '通过算力辅助缩短决策时延，对冲宏观不确定性。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Neural Sovereignty · 神经主权" title="脑机接口 · 神经数据主权" subtitle="侵入/非侵入 · 神经数据 · 伦理规制 —— 从「全植入式电极」到「认知域防御」的物理闭环" />

      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>在现实主义视角下，脑机接口（BCI）是解决人口老龄化背景下「智力剩余价值」再开发的物理路径。中国正通过全植入式电极技术，试图实现大脑信号与工业总线的直接握手；其核心命题是「神经数据主权」——通过对神经元放电模式加密，防止外部算法实施「认知劫持」或「非授权动员」，使系统防御从语义层向电生理层深度下沉。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="400 亿+" label="脑科学 R&D 年度预算 (RMB)" accent="#c41e3a" />
        <Stat value="32.5%" label="BCI 核心专利全球占比" accent="#22d3ee" />
        <Stat value="2,048" label="单芯片神经元传感通道数" accent="#e8a317" />
        <Stat value="TIER 1" label="生物数据防火墙能级" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="BCI 对全要素生产率的非线性贡献模型（示意）"><EChart option={productivity} style={{ height: 250 }} /></Card>
        <Card title="侵入式 vs 非侵入式 · 信号与风险权衡（示意）"><EChart option={pathwayRadar} style={{ height: 250 }} /></Card>
      </Grid>

      <Card title="01 认知域防御 · 构建「不可侵犯」的认知疆域" className="mb-6">
        <Grid cols={2}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>关键在于把数据估值上升为「主权级」资产：在芯片端锁定解码算法、在制度端锁定数据确权，使神经通路本身成为受加密保护的关键基础设施。这是对标 Neuralink 等侵入式 BCI 路线后的差异化选择——不追求单点带宽极限，而以「电生理层防御」与「神经数据主权」为先决条件。</p>
          <div style={{ fontFamily: 'monospace', fontSize: 11, background: 'rgba(0,0,0,0.25)', border: '1px solid #27324a', borderRadius: 12, padding: 16 }} className="space-y-2">
            <div className="flex justify-between"><span style={{ color: '#c41e3a' }}>STATUS:</span><span style={{ color: '#10b981' }}>SYSTEM_UP</span></div>
            <div className="flex justify-between"><span style={{ color: '#c41e3a' }}>DATA_VALUATION:</span><span style={{ color: TEXT }}>SOVEREIGN_CLASS</span></div>
            <div className="flex justify-between"><span style={{ color: '#c41e3a' }}>ETHICAL_BOUND:</span><span style={{ color: '#e8a317' }}>CALIBRATED</span></div>
            <div style={{ height: 4, background: '#27324a', borderRadius: 4, marginTop: 8, overflow: 'hidden' }}><div style={{ height: '100%', width: '75%', background: '#22d3ee', borderRadius: 4 }} /></div>
          </div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="02 神经算力应用矩阵">
          <div className="space-y-3">
            {apps.map(([t, c, d]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
        <Card title="全球 BCI 核心专利占比（示意）"><EChart option={patentShare} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="03 神经拟态芯片 · 碳基突围的战略溢价" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>在硅基芯片受限的物理约束下，中国通过「生物智能与硅基计算的混合集成」实施换道：模拟人类大脑非对称的信息处理方式，新型芯片以约万分之一（10⁴×）的功耗实现同等规模的计算能级。这不仅是硬件胜利，更是对「功耗主权」的占领。</p>
        <Grid cols={2}>
          {[['存算一体化', '#22d3ee', '模拟突触结构，彻底消除冯诺依曼瓶颈。'],
            ['原生生物安全', '#10b981', '基于生物指纹的指令验证，不可被黑客模拟。']].map(([t, c, d]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="伦理规制框架 · 神经数据确权的三道闸门" className="mb-6">
        <Grid cols={3}>
          {[['1 · 知情与可逆同意', '侵入式植入须建立分层、可撤回的知情同意，伦理审查与生物安全评估前置于临床。'],
            ['2 · 神经数据确权', '神经元放电数据归属个体，禁止未授权采集、训练与跨境流转，确立「认知操控防御锁定」。'],
            ['3 · 认知操控红线', '禁止以 BCI 实施非授权动员或「洗脑」，在电生理层划定不可侵犯的认知自主权边界。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="04 战略结论 · 构建「生命级」的安全防火墙" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>神经主权是 China OS 向人类生物本质发起的最后整合：通过在芯片端锁定解码算法、在制度端锁定数据确权，构建一个即便面临非对称文明竞争、仍能保持核心管理层意识清晰、基层动员高效、且关键技术知识库不被「洗脑」或「外流」的物理闭环。在二十一世纪的终局，谁掌握了神经元的密钥，谁就掌握了文明的存档权。</p>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，仅供结构性参考 · 由 china.html「脑机接口」专题迁移</p>
    </div>
  );
}
