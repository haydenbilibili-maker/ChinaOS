import React, { useState } from 'react';
import { PageHeader, Card, Grid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 意识形态理论分析（自由主义 / 马克思主义 / 社会达尔文主义）
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
        subtitle="自由主义 · 马克思主义 · 社会达尔文主义 —— 透视叙事背后的人性假设、国家角色与历史观" />
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
        <Card title="三大意识形态 · 五维对照（示意）">
          <EChart option={compare} style={{ height: 300 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>同一坐标系下的相对位置：个人主义↔集体、平等↔效率、小政府↔强干预、有无历史目的论、竞争淘汰强度。</p>
        </Card>
      </Grid>

      <Card title="作为思想工具 · 识别叙事的底层假设">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          现实政策往往是几套意识形态的<strong style={{ color: 'var(--text-primary)' }}>杂糅</strong>：中国语境下，马克思主义的历史观与国家角色 + 市场化的自由主义工具 + 对丛林竞争（社会达尔文式）的警惕，构成「双轨」张力。读懂这三套坐标，就能解析「共同富裕」「集中力量办大事」「内卷」等话语各自调用了哪套假设——这是与<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>权力逻辑 / 国有资本 / 民营经济 / 文明透视</span>对照阅读的认知底座。
        </p>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本模块为政治哲学/思想史的结构性梳理与思想工具，雷达为定性示意，不代表任何立场倡导。</p>
    </div>
  );
}
