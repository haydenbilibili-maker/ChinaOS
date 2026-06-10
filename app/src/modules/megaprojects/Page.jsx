import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const AXIS = { lineStyle: { color: '#27324a' } };
const SPLIT = { lineStyle: { color: 'rgba(148,163,184,0.1)' } };

// 投资重心演变：传统基建存量（柱）vs 新基建增速（线）—— 示意趋势，非精确统计原值
const infraTrend = {
  grid: { left: 48, right: 48, top: 36, bottom: 24 },
  legend: { top: 0, textStyle: { color: '#93a1b5' } },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024E', '2025E'], axisLine: AXIS },
  yAxis: [
    { type: 'value', name: '存量(万亿)', nameTextStyle: { color: '#93a1b5' }, splitLine: SPLIT },
    { type: 'value', name: '增速(%)', max: 35, nameTextStyle: { color: '#93a1b5' }, splitLine: { show: false } },
  ],
  series: [
    { name: '传统基建投资存量估算（万亿元·示意）', type: 'bar', data: [12, 14, 16, 17.5, 18.2, 18.8, 19.5, 21, 22.5, 23.5, 24.5], barWidth: 14, itemStyle: { color: '#22d3ee', borderRadius: 3, opacity: 0.8 } },
    { name: '新基建投资增速（%·示意）', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 6, data: [5, 8, 12, 18, 22, 28, 25, 20, 18, 15, 14], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' } },
  ],
};

// 多维 ROI：资本市场模型 vs 综合战略取向（示意权重，非实证回归结果）
const roiRadar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  radar: {
    indicator: [{ name: '直接财务回报', max: 100 }, { name: '产业链带动', max: 100 }, { name: '区域协调', max: 100 }, { name: '地缘与国防安全', max: 100 }, { name: '前沿技术突破', max: 100 }],
    radius: '62%', axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
  },
  series: [{ type: 'radar', data: [
    { value: [30, 95, 90, 100, 95], name: '国家战略评估（示意）', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.18)' } },
    { value: [95, 40, 10, 5, 60], name: '纯商业资本评估（示意）', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.15)' } },
  ] }],
};

const CASES = [
  ['🚄 八纵八横高铁网 · 时空压缩与经济重塑', '#c41e3a',
    '表层目标是城际通达、缓解春运等峰值出行压力；深层是缩短时空距离，强化京津冀、长三角、大湾区等轴带联系，装备与工程能力外溢至雅万高铁等境外项目，网络在人员物资快速投送上的应急动员价值常被讨论。',
    '争议与风险：建设与运营主体负债、中西部线路客流与财务可持续性、土地与环保约束等需长期平衡。'],
  ['🌊 南水北调 · 跨流域水资源配置', '#22d3ee',
    '东线、中线已大规模通水，西线方案仍在论证。缓解华北地下水超采、支撑城市与工业用水结构；同时涉及移民安置、生态补偿与调出区利益协调，以及长距离输水的成本、水价与财政补贴机制。',
    '争议与风险：终端水价与全成本回收、汉江等中下游生态与航运影响、干旱年调度规则等。'],
  ['💻 东数西算 · 算力与能源协同', '#e8a317',
    '八大枢纽、十大集群为国家发改委等公开布局框架。将时延不敏感算力向西部清洁能源优势区布局，降低 PUE 与碳强度，带动西部数字产业投资；核心热数据与低时延业务仍依赖东部与边缘节点。',
    '前沿挑战：跨区域算力调度、电价与市场机制、数据安全与灾备层级设计等。'],
];

const LOGICS = [
  ['⚙ 逆周期调节与产能蓄水池', '#22d3ee', '下行周期中，大型工程可吸纳钢铁、水泥等基础产能，稳定就业并通过乘数效应传导信用与流动性（示意性表述）。'],
  ['🗺 打破胡焕庸线：空间资源重配', '#c41e3a', '南水北调、西气东输、西电东送等，以工程手段缓解资源与人口、产业的空间错配，支撑全国统一大市场物理连通。'],
  ['🛡 国家安全与底线思维', '#10b981', '大飞机、北斗、关键基础设施等，在地缘紧张背景下更强调供应链与技术自主，财务回报常退居次要。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Mega Projects · Macro-Strategy Briefing" title="超级工程 · 国家能力与空间重塑" subtitle="铁公基 · 胡焕庸线 · 多维 ROI · 战略外部性" />

      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>超级工程（Mega Projects）不仅是工程技术的集中展示，也是跨越发展陷阱、重塑经济地理、对冲地缘风险的宏观政策工具。在西方经济学语境下，许多超级工程因漫长投资回报期而显得「不经济」——但决策层往往同时核算<strong style={{ color: 'var(--text-primary)' }}>综合国家账本</strong>：外部性、安全与区域平衡。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="八纵八横" label="高铁网主骨架 · 标准输出至雅万高铁" accent="#c41e3a" />
        <Stat value="东+中线" label="南水北调已大规模通水 · 西线论证中" accent="#22d3ee" />
        <Stat value="8枢纽/10集群" label="东数西算全国布局框架" accent="#e8a317" />
        <Stat value="~24.5万亿" label="传统基建存量估算（2025E·示意）" accent="#10b981" />
      </Grid>

      <Card title="一 · 超级工程的决策底层逻辑" className="mb-6">
        <Grid cols={3}>
          {LOGICS.map(([t, c, d]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="二 · 投资重心演变：「铁公基」与「新基建」（示意趋势）" className="mb-6">
        <EChart option={infraTrend} style={{ height: 280 }} />
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>数据洞察：传统基建存量巨大、边际效益分化；新基建（5G、特高压、算力枢纽）增速阶段性走高，成为数字化与能源转型的载体之一。</p>
      </Card>

      <div className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>三 · 战略级案例拆解</div>
      <Grid cols={3} className="mb-6">
        {CASES.map(([t, c, body, risk]) => (
          <Card key={t} title={t}>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p>
            <p className="text-[11px] mt-3 leading-relaxed" style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10, color: 'var(--text-tertiary)' }}>{risk}</p>
          </Card>
        ))}
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="四 · 多维 ROI：商业资本 vs 国家战略维度权重（示意）"><EChart option={roiRadar} style={{ height: 300 }} /></Card>
        <Card title="资本市场模型 vs 综合战略取向">
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p><strong style={{ color: 'var(--text-primary)' }}>商业 ROI 导向：</strong>强调现金流、回收期、DCF；对偏远线型基础设施往往给出偏低财务评分。</p>
            <p><strong style={{ color: 'var(--text-primary)' }}>国家战略取向：</strong>将产业链、区域协调、安全与长期风险对冲纳入，财务指标仅为维度之一。</p>
            <p className="text-xs" style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10, color: 'var(--text-tertiary)' }}>审视超级工程时，需同时区分<strong>可货币化收益</strong>与<strong>公共品外部性</strong>，避免单一财务指标误判。</p>
          </div>
        </Card>
      </Grid>

      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>超级工程的真正回报写在「综合国家账本」上：逆周期托底、空间重配与安全冗余三者叠加，构成单一商业 ROI 无法捕捉的战略外部性；其代价——债务、生态与利益协调——同样需要长期核算。图表为定性趋势示意，不构成投资建议或工程审计依据。</p></Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值 · 由 mega-projects.html 独立报告迁移，原文保留 · <a href="../mega-projects.html" target="_blank" rel="noreferrer" style={{ color: 'var(--cyber-cyan, #22d3ee)' }}>查看全文</a></p>
    </div>
  );
}
