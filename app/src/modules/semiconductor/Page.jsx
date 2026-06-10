import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

// 产业链四环节（自主度/资本强度/人才/生态/出口管制敏感度 · 示意）
const LINK = {
  design: { title: '设计 (EDA/IP)', note: '点工具突破与全流程追赶；先进工艺 PDK 与验证算力成本构成隐性壁垒。', radar: [40, 70, 65, 55, 90] },
  fab: { title: '制造 (Foundry)', note: '成熟产能与先进节点博弈；先进逻辑受 EUV 与良率约束。', radar: [35, 95, 60, 50, 95] },
  equip: { title: '设备 (含光刻链)', note: '零部件与子系统长周期攻关，光刻链是最硬约束。', radar: [20, 90, 50, 40, 98] },
  material: { title: '材料 (Materials)', note: '认证与工艺共演进，光刻胶/电子特气等持续突破。', radar: [30, 60, 55, 45, 80] },
};
const RADAR_IND = [{ name: '自主度', max: 100 }, { name: '资本强度', max: 100 }, { name: '人才', max: 100 }, { name: '生态', max: 100 }, { name: '管制敏感', max: 100 }];

const ieChart = {
  legend: { data: ['进口', '出口'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2021', '2023', '2024E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '亿$', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '进口', type: 'bar', data: [3055, 4326, 3494, 3850], barWidth: 16, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
    { name: '出口', type: 'bar', data: [1015, 1538, 1360, 1500], barWidth: 16, itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
  ],
};
const fundChart = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['一期', '二期', '三期'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '制造/设计', type: 'bar', stack: 'x', data: [70, 55, 45], itemStyle: { color: '#c41e3a' } },
    { name: '设备材料', type: 'bar', stack: 'x', data: [20, 35, 40], itemStyle: { color: '#22d3ee' } },
    { name: '封装/其他', type: 'bar', stack: 'x', data: [10, 10, 15], itemStyle: { color: '#e8a317' } },
  ],
  legend: { data: ['制造/设计', '设备材料', '封装/其他'], textStyle: { color: '#93a1b5' }, top: 0 },
};

export default function Page() {
  const [link, setLink] = useState('design');
  const l = LINK[link];
  return (
    <div>
      <PageHeader badge="Semiconductor · 芯片主权" title="半导体与芯片主权" subtitle="成熟制程筑底 · 先进封装换道 · 大基金与出口管制 —— 算力与工业的硬约束" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>中国为全球最大芯片进口国与新兴制造基地；大基金三期与地方产投加码，但先进光刻、EDA 与部分材料仍受制于人。现实主义视角下，<strong style={{ color: 'var(--text-primary)' }}>成熟制程 + Chiplet + 特色工艺</strong>构成可辩护的「主权防御带」。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="~4,000 亿$" label="年进口额(区间)" accent="#c41e3a" />
        <Stat value="~25%" label="全球产值份额(E)" accent="#22d3ee" />
        <Stat value="大基金 III 期" label="聚焦卡脖子环节" accent="#e8a317" />
        <Stat value="TOP 3" label="消费/通信/计算应用" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="IC 进出口与自给（亿$ · 示意）"><EChart option={ieChart} style={{ height: 240 }} /><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>进口仍高于出口；结构向设备、材料自主改善缓慢。</p></Card>
        <Card title="设计—制造—设备—材料 · 点环节看雷达">
          <div className="flex gap-1 flex-wrap mb-3">
            {Object.keys(LINK).map((k) => (
              <button key={k} onClick={() => setLink(k)} className="text-xs px-2 py-1 rounded mono" style={{ background: k === link ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: k === link ? '#fff' : 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>{LINK[k].title.split(' ')[0]}</button>
            ))}
          </div>
          <EChart option={{ radar: { indicator: RADAR_IND, axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } }, series: [{ type: 'radar', data: [{ value: l.radar, name: l.title, lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }] }} style={{ height: 180 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{l.note}</p>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="大基金三期投向结构（堆叠 % · 示意）"><EChart option={fundChart} style={{ height: 240 }} /><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>三期更强调设备材料与制造环节连续性投入，与地方国资、科创板退出耦合；需防重复建设与估值泡沫。</p></Card>
        <Card title="成熟制程防御带">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>28nm 及以上成熟节点支撑汽车、工控、家电与大量模拟/功率器件，中国在产能规模与成本上具优势。先进数字逻辑仍受 EUV 与良率约束，Chiplet、2.5D/3D 封装成为性能补偿路径。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>汽车与功率</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>SiC/GaN 与 MCU 需求抬升国产化窗口。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>先进封装 (Chiplet)</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>互连密度与热管理决定等效制程「跳跃」幅度。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="战略结论" className="mb-6">
        <Grid cols={3}>
          {[['1 · 换道超车在封装与系统', 'EUV 短缺约束下，以先进封装与系统级优化维持 AI 与 HPC 可用性，是理性选择。'],
            ['2 · 功率与车规是现金牛', 'SiC、IGBT、车规 MCU 绑定新能源车与电网改造，国产化率提升具确定政策红利。'],
            ['3 · 出口管制常态化', '设备、EDA、高算力 GPU 的长臂管辖使「芯片主权」与外交、金融制裁工具箱联动。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="制度锚点"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>半导体是大基金、科创板与地方招商的交汇点；若缺乏良率与迭代数据闭环，资本密度可能转化为过剩产能而非技术主权。</p></Card>

      <FrameworkTrio cards={[
        { title: '芯片主权逻辑', subtitle: '成熟 + 封装换道', body: 'EUV 短缺约束下，以成熟制程 + Chiplet + 先进封装维持 AI/HPC 可用性，是理性主权防御带。功率与车规是现金牛窗口。', pillars: [['28nm+', '成熟节点规模优势。'], ['Chiplet', '等效制程跳跃。'], ['SiC/GaN', '新能源车绑定。']] },
        { title: '大基金 · 摸石头', subtitle: 'I → II → III', body: '三期更强调设备材料与制造环节连续性投入。需防重复建设与估值泡沫——资本密度须转化为良率数据闭环。', pillars: [['设计 EDA', '管制敏感 90。'], ['EUV 设备', '最硬约束 98。'], ['出口管制', '长臂管辖常态化。']] },
        { title: '升级路径 · 硅盾对照', subtitle: '台海 · 10nm', body: '10nm 以下产能高度集中于台海——半导体模块与台海/科技树形成三角：卡脖子清单 ↔ 硅盾人质 ↔ 国产替代节奏。', pillars: [['进口 4000 亿$', '最大芯片进口国。'], ['产值 ~25%', '全球份额攀升中。'], ['TOP3 应用', '消费/通信/计算。']] },
      ]} />

      <ModuleFooter moduleId="semiconductor" sourceNote="由 china.html「半导体」专题迁移升级" />
    </div>
  );
}
