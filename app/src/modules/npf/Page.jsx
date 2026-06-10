import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const years = ['2020', '2021', '2022', '2023', '2024'];
const mkLine = (name, data, color) => ({ name, type: 'line', smooth: true, symbol: 'none', data, lineStyle: { color, width: 2 }, itemStyle: { color }, areaStyle: { color: color + '18' } });
const trackHeat = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: { left: 40, right: 16, top: 20, bottom: 44 },
  xAxis: { type: 'category', data: years, axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    mkLine('商业航天/星座', [40, 55, 68, 85, 110], '#22d3ee'),
    mkLine('量子信息', [20, 30, 45, 70, 95], '#c41e3a'),
    mkLine('深海与极地', [15, 25, 38, 50, 65], '#e8a317'),
    mkLine('生物制造', [25, 40, 58, 80, 105], '#10b981'),
  ],
};
const competenceRadar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  radar: { radius: '62%', indicator: [{ name: '技术深度', max: 100 }, { name: '工程化', max: 100 }, { name: '资本深度', max: 100 }, { name: '人才密度', max: 100 }, { name: '标准话语', max: 100 }, { name: '安全冗余', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: '#27324a' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [85, 95, 75, 98, 70, 88], name: '中国', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.18)' } },
    { value: [98, 92, 95, 90, 98, 92], name: '美国（参照）', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.10)' } },
  ] }],
};
const capitalDoughnut = {
  legend: { orient: 'vertical', right: 8, top: 'middle', textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  series: [{ type: 'pie', radius: ['58%', '78%'], center: ['38%', '50%'], label: { show: false },
    data: [
      { value: 30, name: '制造与材料', itemStyle: { color: '#22d3ee' } },
      { value: 25, name: '数字与算力', itemStyle: { color: '#c41e3a' } },
      { value: 20, name: '生命科技', itemStyle: { color: '#10b981' } },
      { value: 15, name: '绿色低碳', itemStyle: { color: '#e8a317' } },
      { value: 10, name: '空天海洋', itemStyle: { color: '#93a1b5' } },
    ] }],
};

const tracks = [
  ['#22d3ee', '空 · 商业航天与低轨星座', '星网、千帆等星座与可回收火箭试验并行，地面终端与频轨协调决定商用节奏；与长三角 G60 星链产业带等政策试点叠加。', '形成自主星座服务能力与出口套餐', '批量化卫星制造与发射成本曲线拐点'],
  ['#c41e3a', '量 · 量子信息与未来计算', '量子计算演示机与保密通信干线并进；与智算中心、超算混合编排探索接口标准。', '关键材料与测控自主可控', '纠错比特数与相干时间工程化里程碑'],
  ['#e8a317', '海 · 深海、极地与大科学装置', '深海装备、极地航道与海洋观测网支撑资源与安全议题；大科学装置产出向企业转移。', '深海进入、探测、开发能力体系化', '载人/无人深潜与海底数据中心试点'],
  ['#10b981', '生 · 生物制造与未来健康', '合成生物、细胞治疗与高端医疗器械协同；AI 辅助诊断与医保支付改革塑造需求曲线。', 'BT+IT 融合下的产业链安全', '三类证与出海注册批量突破'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="New Productive Forces · 技术革命性突破 × 要素创新性配置" title="新质生产力 · 未来产业" subtitle="原始创新 · 无人区布局 · 全要素生产率 —— 从规模扩张到生产率与产业安全（2024–2026 观察）" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>「新质生产力」在政策语境中承接增速换挡期的契约更新：以前沿技术、绿色化与数字化提升全要素生产率，同时服务「发展与安全」统筹。其落地依赖<b style={{ color: 'var(--text-primary)' }}>研发投入强度</b>、<b style={{ color: 'var(--text-primary)' }}>算力与数据要素</b>、<b style={{ color: 'var(--text-primary)' }}>产业链备份</b>三类约束的联合求解。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="~2.7%" label="R&D / GDP（2024）" accent="#c41e3a" />
        <Stat value="8+" label="未来产业主赛道（示意）" accent="#22d3ee" />
        <Stat value="4" label="热度模型对比赛道：空/量/海/生" accent="#e8a317" />
        <Stat value="30%" label="资本投向制造与材料占比（示意）" accent="#10b981" />
      </Grid>

      <Card title="传统动能 vs 新质动能" className="mb-6">
        <Grid cols={2}>
          <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}>
            <div className="text-xs font-semibold" style={{ color: '#c41e3a' }}>旧 · 边际回报递减</div>
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>土地—基建—地产链条的边际回报递减；债务滚动与地方财政压力抬高系统性维护成本。</p>
          </div>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold" style={{ color: '#22d3ee' }}>新 · 要素重新配置</div>
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>算力、数据、专利与标准嵌入制造与服务；政策工具从补贴转向首台套、政府采购、大基金与揭榜挂帅组合。</p>
          </div>
        </Grid>
      </Card>

      <Card title="未来产业热度指数（政策关注度 × 资本开支 × 专利增速 · 模型示意，非官方统计）" className="mb-6">
        <EChart option={trackHeat} style={{ height: 280 }} />
      </Card>

      <Card title="四条未来产业主赛道 · 战略目标与关键里程碑" className="mb-6">
        <Grid cols={2}>
          {tracks.map(([color, title, desc, goal, milestone]) => (
            <div key={title} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>战略目标：{goal}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>关键里程碑：{milestone}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="新质生产力维度对比（示意）"><EChart option={competenceRadar} style={{ height: 280 }} /></Card>
        <Card title="生产率、备份与标准">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>新质生产力不是单一技术标签，而是在约束条件下提升 TFP：能源与算力成本、关键设备可得性、人才密度与知识产权保护共同决定「能落地多少」。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>标准与互操作性</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>工业互联网、车路云、低轨终端协议若分裂，将抬高全社会切换成本。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>产业链备份与冗余</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>成熟制程、材料与工业软件的「双源」布局，是安全溢价而非重复建设。</p></div>
          </div>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="2024 未来产业相关资本结构（示意 %）"><EChart option={capitalDoughnut} style={{ height: 260 }} /></Card>
        <Card title="耐心资本与「十年窗」">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>未来产业回报周期长、失败率高，需要国家大基金、产投与 REITs 等工具匹配现金流；地方政府若仍以短期产值考核，易导致低水平重复。</p>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>政策工具</div>
          <ul className="text-[11px] space-y-1.5" style={{ color: 'var(--text-tertiary)', listStyle: 'none', padding: 0 }}>
            <li><span style={{ color: '#22d3ee' }}>●</span> 大基金三期与专项债</li>
            <li><span style={{ color: '#22d3ee' }}>●</span> 首台套保险与政府采购</li>
            <li><span style={{ color: '#22d3ee' }}>●</span> 数据要素与算力券试点</li>
          </ul>
        </Card>
      </Grid>

      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>新质生产力的成色不取决于赛道名单的长度，而取决于研发强度、耐心资本与标准话语权能否在「十年窗」内同向收敛；若考核仍以短期产值为锚，未来产业容易退化为新一轮重复建设。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>曲线与占比为模型示意；政策与投融资以部委公报及市场披露为准 · 由 china.html「新质生产力」专题迁移</p>
    </div>
  );
}
