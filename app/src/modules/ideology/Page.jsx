import React, { useState } from 'react';
import { PageHeader, Card, Grid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 意识形态理论分析（自由 / 马克思 / 民族 / 保守 / 新自由 / 无政府 / 社达 / 法西斯·反面参照）
// ----------------------------------------------------------------------------
// 思想史与政治哲学梳理，用于理解叙事背后的人性假设与历史观；非价值倡导。
// ============================================================================

const IDEOLOGIES = {
  liberalism: {
    label: '自由主义', color: '#22d3ee', origin: '洛克 · 密尔 · 哈耶克',
    human: '个体理性、自利且可自我决定；天赋权利先于国家。',
    value: '个人自由、私有产权、法治、有限政府、市场自发秩序。',
    state: '国家是「守夜人」：保护权利与契约，尽量不干预。',
    history: '非目的论：自由扩展是渐进试错，无必然终点。',
    critique: '被批评忽视实质不平等、原子化个人、市场失灵与公地问题。',
    project: '与「营商环境/法治/民营经济」模块的市场化逻辑相通，但与「集中力量办大事」张力明显。',
    radar: [95, 40, 25, 30, 50],
  },
  marxism: {
    label: '马克思主义', color: '#c41e3a', origin: '马克思 · 恩格斯 · 列宁',
    human: '人是社会关系的总和；意识由物质生产方式决定（存在决定意识）。',
    value: '消灭剥削、生产资料公有、按需分配、阶级解放。',
    state: '国家是阶级统治工具；过渡期无产阶级专政，终极目标国家消亡。',
    history: '历史唯物主义 · 目的论：生产力—生产关系矛盾推动社会形态依次演进。',
    critique: '被批评经济决定论过强、计划经济的信息与激励难题、实践中的集权风险。',
    project: '是「国有资本/共同富裕/制度演进」的理论底色；中国语境下与市场要素长期并轨（双轨）。',
    radar: [30, 95, 90, 95, 70],
  },
  socialdarwin: {
    label: '社会达尔文主义', color: '#e8a317', origin: '斯宾塞 · 萨姆纳（达尔文本人并不主张）',
    human: '人群如物种，竞争中「适者生存」；强弱分化是自然法则。',
    value: '竞争、效率、优胜劣汰；反对对弱者的「人为」扶助。',
    state: '国家应少干预，让竞争自然淘汰——极端形态滑向种族/国族优越论。',
    history: '将生物进化误用于社会：把现状强弱说成「自然且正当」。',
    critique: '科学上错误（自然选择≠社会应然）、伦理上危险（曾为殖民、优生、法西斯背书）。',
    project: '作为「反面参照系」：大国博弈中的丛林叙事、产业「内卷」与淘汰逻辑可借其识别与警惕。',
    radar: [70, 30, 60, 10, 85],
  },
  nationalism: {
    label: '民族主义', color: '#10b981', origin: '赫尔德 · 马志尼 · 费希特',
    human: '人首先是民族/国族共同体的成员；身份、语言与历史先于个体选择。',
    value: '民族自决、文化认同、主权统一、共同体优先于个人。',
    state: '国家应是民族意志的载体，对外捍卫主权、对内凝聚认同。',
    history: '半目的论：民族「复兴/崛起」叙事，把历史读作共同体命运的实现。',
    critique: '易滑向排外与族群对立；「想象的共同体」可被动员，掩盖内部阶级与利益分化。',
    project: '与「大国博弈/民族复兴/主权叙事」直接对接；是凝聚动员的强力话语，也是对外摩擦的火源。',
    radar: [35, 45, 70, 65, 60],
  },
  conservatism: {
    label: '保守主义', color: '#fb923c', origin: '柏克 · 奥克肖特 · 托克维尔',
    human: '人理性有限、易犯错；秩序与德性靠传统、习俗与中间团体维系。',
    value: '渐进改良、尊重传统与权威、家庭/社群/宗教等中间结构、审慎。',
    state: '国家应稳健有限，警惕激进重构；维护既有秩序与社会纽带。',
    history: '反目的论：拒斥宏大蓝图，相信经验积累胜于理性设计。',
    critique: '被批评为既得利益辩护、对结构性不公反应迟缓、抗拒必要变革。',
    project: '与「制度演进/稳中求进/治理审慎」相通；提供对激进改革的「刹车」视角与路径依赖解释。',
    radar: [50, 40, 50, 20, 45],
  },
  neoliberalism: {
    label: '新自由主义', color: '#8b5cf6', origin: '哈耶克 · 弗里德曼 · 朝圣山学社',
    human: '人是理性的市场行为者；价格信号比集中计划更能配置资源。',
    value: '私有化、放松管制、自由贸易、财政紧缩、市场扩展至更多领域。',
    state: '国家退为「市场守护者」：保护产权与竞争秩序，减少再分配干预。',
    history: '非目的论但有强方向感：相信市场化是通向效率与自由的普遍路径。',
    critique: '被批评加剧贫富分化、金融化风险、公共服务退化、「市场逻辑」侵蚀社会领域。',
    project: '是「市场化改革/营商环境/对外开放」的工具底色，但与「共同富裕/国有主导」存在再分配张力。',
    radar: [90, 30, 20, 35, 75],
  },
  anarchism: {
    label: '无政府主义', color: '#06b6d4', origin: '蒲鲁东 · 巴枯宁 · 克鲁泡特金',
    human: '人本可自治互助；强制性权威（而非人性）才是腐化与压迫之源。',
    value: '废除国家与强制等级、自愿结社、互助、直接民主、自下而上自治。',
    state: '反对国家本身：主张以横向、自治的联合体取代集中权力机器。',
    history: '反目的论且反集权：解放是去中心化的持续实践，无须经由国家阶段。',
    critique: '被批评在大规模社会中协调与防御难题、易陷入碎片化或被强权吞并。',
    project: '作为「极端去中心化」参照：用以审视平台自治、社区共治与「强国家」路径的边界与代价。',
    radar: [80, 75, 5, 15, 30],
  },
  fascism: {
    label: '法西斯主义', color: '#ef4444', origin: '反面参照 · 历史警示（墨索里尼 · 纳粹德国）',
    human: '否定个体与平等；个人只在为「民族/国家」献身的整体中才有意义。',
    value: '极端民族主义 + 领袖崇拜 + 暴力净化 + 反理性的意志神话；排斥多元。',
    state: '极权国家吞没社会：一党、一领袖、一意志，取消权利与制衡。',
    history: '伪目的论：以「民族再生/优等」神话动员，实为暴力与扩张的话语外衣。',
    critique: '历史已证其灾难性——战争、屠杀与极权恐怖；在思想史中作反面警示而非选项。',
    project: '【反面参照·历史警示】用以识别并警惕：领袖崇拜、暴力排外、取消制衡等危险信号，绝非倡导。',
    radar: [5, 10, 95, 90, 95],
  },
};
const RADAR_IND = [{ name: '个人主义', max: 100 }, { name: '平等取向', max: 100 }, { name: '国家干预', max: 100 }, { name: '历史目的论', max: 100 }, { name: '竞争/淘汰', max: 100 }];

const DIMS = [['人性假设', 'human'], ['核心价值', 'value'], ['国家角色', 'state'], ['历史观', 'history'], ['主要批判', 'critique'], ['项目投射', 'project']];

export default function Page() {
  const [k, setK] = useState('marxism');
  const x = IDEOLOGIES[k];
  const compare = {
    legend: { data: Object.values(IDEOLOGIES).map((v) => v.label), textStyle: { color: '#93a1b5' }, top: 0 },
    radar: { indicator: RADAR_IND, axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
    series: [{ type: 'radar', data: Object.values(IDEOLOGIES).map((v) => ({ value: v.radar, name: v.label, lineStyle: { color: v.color }, areaStyle: { color: v.color + '22' } })) }],
  };
  return (
    <div>
      <PageHeader badge="Cognition · 意识形态理论" title="意识形态理论分析"
        subtitle="自由主义 · 马克思主义 · 民族主义 · 保守主义 · 新自由主义 · 无政府主义 · 社会达尔文主义 · 法西斯主义（反面参照）—— 透视叙事背后的人性假设、国家角色与历史观" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        意识形态不是空洞口号，而是一套关于<strong style={{ color: 'var(--text-primary)' }}>人性、平等、国家与历史</strong>的底层假设。看懂一种主张选了哪套假设，就能预判它在政策上的取舍。本模块作思想史与政治哲学的结构对照，<strong style={{ color: 'var(--text-primary)' }}>非价值倡导</strong>。
      </p></Card>
      <div className="flex gap-1 flex-wrap mb-4">
        {Object.entries(IDEOLOGIES).map(([key, v]) => (
          <button key={key} onClick={() => setK(key)} className="text-sm px-3 py-1.5 rounded mono"
            style={{ background: key === k ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: key === k ? '#fff' : 'var(--text-secondary)', border: `1px solid ${key === k ? v.color : 'transparent'}`, cursor: 'pointer' }}>{v.label}</button>
        ))}
      </div>

      <Grid cols={2} className="mb-6">
        <Card title={`${x.label} · 维度拆解`}>
          <div className="text-xs mono mb-3" style={{ color: x.color }}>代表：{x.origin}</div>
          <div className="space-y-2">
            {DIMS.map(([label, key]) => (
              <div key={key} style={{ borderLeft: `2px solid ${x.color}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{x[key]}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="八大意识形态 · 五维对照（示意）">
          <EChart option={compare} style={{ height: 300 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>同一坐标系下的相对位置：个人主义↔集体、平等↔效率、小政府↔强干预、有无历史目的论、竞争淘汰强度。</p>
        </Card>
      </Grid>

      <Card title="意识形态光谱 · 左—右 / 国家—个人 定位（示意）" className="mb-6">
        <div style={{ position: 'relative', height: 300, background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
          {/* 坐标轴 */}
          <div style={{ position: 'absolute', left: '50%', top: 12, bottom: 12, width: 1, background: 'rgba(148,163,184,0.2)' }} />
          <div style={{ position: 'absolute', top: '50%', left: 12, right: 12, height: 1, background: 'rgba(148,163,184,0.2)' }} />
          <span className="text-[11px] mono" style={{ position: 'absolute', left: 14, top: '48%', color: 'var(--text-tertiary)' }}>← 左 / 平等</span>
          <span className="text-[11px] mono" style={{ position: 'absolute', right: 14, top: '48%', color: 'var(--text-tertiary)' }}>右 / 效率 →</span>
          <span className="text-[11px] mono" style={{ position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)', color: 'var(--text-tertiary)' }}>↑ 强国家</span>
          <span className="text-[11px] mono" style={{ position: 'absolute', left: '50%', bottom: 6, transform: 'translateX(-50%)', color: 'var(--text-tertiary)' }}>↓ 个人/去中心</span>
          {Object.values(IDEOLOGIES).map((v) => {
            // x：右倾 = (效率/竞争 - 平等) 归一；y：国家干预（越高越靠上）
            const xv = 50 + (v.radar[4] - v.radar[1]) / 2;          // 0..100
            const yv = 100 - v.radar[2];                            // 干预高→靠上
            return (
              <div key={v.label} style={{ position: 'absolute', left: `${Math.max(6, Math.min(94, xv))}%`, top: `${Math.max(8, Math.min(92, yv))}%`, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: v.color, boxShadow: `0 0 6px ${v.color}` }} />
                <span className="text-[11px] mono" style={{ color: v.color }}>{v.label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>横轴：左（平等）↔右（效率/竞争）；纵轴：强国家干预↔个人/去中心。坐标由五维雷达定性折算，仅作思想史结构定位示意。</p>
      </Card>

      <Card title="作为思想工具 · 识别叙事的底层假设">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          现实政策往往是多套意识形态的<strong style={{ color: 'var(--text-primary)' }}>杂糅</strong>：中国语境下，马克思主义的历史观与国家角色 + 市场化的（新）自由主义工具 + 民族复兴的凝聚话语 + 治理上的保守审慎 + 对丛林竞争（社会达尔文式）的警惕，构成多轨张力；而无政府主义与法西斯主义（反面参照）则标出去中心化与极权两端的边界。读懂这些坐标，就能解析「共同富裕」「集中力量办大事」「民族复兴」「内卷」等话语各自调用了哪套假设——这是与<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>权力逻辑 / 国有资本 / 民营经济 / 文明透视</span>对照阅读的认知底座。
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模块为政治哲学/思想史的结构性梳理与思想工具，雷达为定性示意，不代表任何立场倡导。</p>
    </div>
  );
}
