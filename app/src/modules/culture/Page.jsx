import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const exportTrend = {
  grid: { left: 48, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'none', data: [900, 1050, 1100, 1280, 1380, 1500, 1600], lineStyle: { color: '#e8a317', width: 2 }, areaStyle: { color: 'rgba(232,163,23,0.1)' } }],
};
const influenceRadar = {
  radar: { indicator: [{ name: '游戏', max: 100 }, { name: '短视频', max: 100 }, { name: '微短剧', max: 100 }, { name: '网文', max: 100 }, { name: '国潮', max: 100 }, { name: '影视', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [95, 92, 80, 75, 70, 55], name: '文化影响力', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};
const forecast = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2024', '2026E', '2028E', '2030E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [1600, 2200, 3000, 4000], barWidth: 30, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } }],
};

const TRACKS = [
  ['游戏出海（3A & Mobile）', '手游长期占据全球收入头部，3A 打开主机与高端市场，工业管线与发行能力构成核心壁垒。', 'Steam 全球登顶'],
  ['短视频出海（TikTok）', '算法分发重构全球注意力分配，本土化运营与创作者生态形成网络效应，深度嵌入海外日常。', '算法分发优势'],
  ['微短剧出海（Short Drama）', '竖屏微短剧以高密度情节与付费订阅模式，在海外快速跑通内容工业化变现路径。', '付费订阅模式'],
  ['国潮品牌出海', '设计、潮玩与新消费借社媒种草进入海外，国潮美学成为 Z 世代认同的消费符号。', '国潮品牌 3.0'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Culture · Digital Soft Power" title="文化产业与数字软实力" subtitle="国潮 · 短剧出海 · TikTok · Z 世代 —— 工业化内容生产沿不同载体同步穿透全球" />
      <Grid cols={4} className="mb-6">
        <Stat value="1,600 亿$" label="文化出口规模" accent="#e8a317" />
        <Stat value="10 亿+" label="海外用户规模" accent="#22d3ee" />
        <Stat value="16,000 部" label="网文作品出海" />
        <Stat value="#1" label="游戏出海份额" accent="#c41e3a" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="文化出口趋势（2018–2024 · 亿$）"><EChart option={exportTrend} style={{ height: 240 }} /></Card>
        <Card title="文化影响力多维评估（2024 · 示意）"><EChart option={influenceRadar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="内容出海的四条主赛道" className="mb-6">
        <Grid cols={2}>
          {TRACKS.map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="穿透文化折扣 · 两条破壁路径">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>跨文化传播长期受困于文化折扣（Cultural Discount）：内容跨越语言与价值差异时影响力衰减。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>技术破壁</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>以虚幻引擎 UE5 等工业化工具提升体验，用通用视觉语言降低跨文化理解成本。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>本土化运营</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>建立本地团队与创作者网络，按区域调整题材与发行节奏，重建在地情感连接。</p></div>
          </div>
        </Card>
        <Card title="展望 2030 · 从内容出海到生态出海">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>下一阶段竞争不再是单一爆款，而是 IP 生态与生产工具的全球化输出，文化软实力沉淀为可复用的内容基础设施。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>超级 IP 矩阵</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>头部 IP 跨游戏/影视/衍生品联动，构建可持续的全球粉丝经济。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>AIGC 重塑内容生产</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>以 AI 压缩制作成本与周期，让多语言/多市场内容供给规模化。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="文化出口规模增长预测（示意）" className="mb-6"><EChart option={forecast} style={{ height: 220 }} /></Card>

      <Card title="系统视角下的三条路径" className="mb-6">
        <Grid cols={3}>
          {[['1 · 内容工业化与产能复用', '把爆款经验沉淀为可复制的生产管线，以工具与流程降低单部作品成本与风险。'],
            ['2 · 从单品到生态运营', '围绕头部内容构建跨品类 IP，把一次性流量转化为长期用户资产与衍生收入。'],
            ['3 · 渠道与合规并重', 'TikTok 等平台监管收紧下，分散渠道依赖、建设自有阵地，按区域满足数据与内容合规。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="现实约束"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>地缘政治与平台监管构成最大不确定性，文化折扣短期难消除；出海仍是高波动、长周期的系统工程，而非线性增长。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合与示意值，部分参考 Sensor Tower 等第三方口径 · 由 tabs/culture.html 迁移</p>
    </div>
  );
}
