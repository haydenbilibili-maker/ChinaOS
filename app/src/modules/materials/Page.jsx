import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const dependencyFunnel = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}' },
  series: [{
    type: 'funnel', left: '10%', top: 12, bottom: 12, width: '80%',
    min: 0, max: 100, sort: 'descending', gap: 2,
    label: { show: true, position: 'inside', fontSize: 10, color: '#fff' },
    data: [
      { value: 100, name: '初级原材料（自给）', itemStyle: { color: '#8b0000' } },
      { value: 65, name: '通用工程材料', itemStyle: { color: '#c41e3a' } },
      { value: 30, name: '特种先进材料', itemStyle: { color: '#e8a317' } },
      { value: 12, name: '极端核心辅料（进口依赖）', itemStyle: { color: '#22d3ee' } },
    ],
  }],
};

const paradigmRadar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 } },
  radar: {
    indicator: [{ name: '算力驱动', max: 100 }, { name: '数据积累', max: 100 }, { name: '实验通量', max: 100 }, { name: '周期缩短', max: 100 }, { name: '成本下降', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLine: { lineStyle: { color: '#27324a' } }, splitArea: { show: false },
  },
  series: [{
    type: 'radar',
    data: [
      { value: [30, 45, 40, 50, 40], name: '2020 水平', lineStyle: { color: '#22d3ee', width: 1 }, itemStyle: { color: '#22d3ee' } },
      { value: [95, 85, 92, 98, 80], name: '2024 现状', lineStyle: { color: '#e8a317' }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } },
    ],
  }],
};

const maturityRadar = {
  radar: {
    indicator: [{ name: '半导体材料', max: 100 }, { name: '航空航天复合材', max: 100 }, { name: '稀土永磁', max: 100 }, { name: '先进电池材料', max: 100 }, { name: '生物医用材料', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLine: { lineStyle: { color: '#27324a' } }, splitArea: { show: false },
  },
  series: [{
    type: 'radar',
    data: [{ value: [35, 75, 98, 92, 60], name: '国产成熟度指数', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.15)' } }],
  }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Advanced Materials · 深度透视" title="关键材料 · 卡脖子与国产替代" subtitle="高端材料 · 稀土 · 碳纤维 · 半导体材料 —— 先进材料与新材料产业全景" />

      <Card className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          现实主义逻辑下，材料是所有技术的「容器」。中国目前在航空发动机高温合金、光刻胶、电子特气及大硅片等环节仍面临非对称的外部限制。体制正通过<strong style={{ color: 'var(--text-primary)' }}>「国家新材料产业发展行动」</strong>将资源集中于这些物理级短板，以「逆向工程」与「前沿突破」双线并进，构建具有冗余度的战略压舱石体系。
        </p>
        <p className="text-xs mt-3 italic" style={{ color: 'var(--text-tertiary)', borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}>
          "The era of bulk materials is ending; the era of functional micro-precision has begun."
        </p>
      </Card>

      <Grid cols={4} className="mb-6">
        <Stat value="7.7 万亿" label="产业产值规模（2023 统计年报）" accent="#e8a317" />
        <Stat value="~32%" label="关键材料国产化率 · 先进制程攻坚中" accent="#c41e3a" />
        <Stat value="1/3" label="研发周期压缩比 · 基于材料基因组工程" accent="#22d3ee" />
        <Stat value="70%+" label="稀土全球产量占比 · Strategic Leverage" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="材料自主化漏斗 · 越往尖端依赖越深（自主化率 %）"><EChart option={dependencyFunnel} style={{ height: 250 }} /></Card>
        <Card title="材料基因组工程 · 研发范式跃迁（2020 vs 2024）"><EChart option={paradigmRadar} style={{ height: 250 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="核心材料子行业自主化率对比（国产成熟度指数）"><EChart option={maturityRadar} style={{ height: 280 }} /></Card>
        <Card title="核心赛道 · 定义产业上限">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>中国新材料产业正聚焦四大战略高地：</p>
          <div className="space-y-2">
            {[['碳纤维', '支撑航空航天减重，T800 级已实现稳定量产。', '#c41e3a'],
              ['第三代半导体', '以碳化硅（SiC）为核心，主导电动汽车补能革命。', '#22d3ee'],
              ['高性能合金', '攻克航空发动机叶片的「单晶」难关。', '#e8a317'],
              ['稀土功能材料', '将资源优势转化为磁性、光学器件的全球垄断地位。', '#10b981']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="战略导论 · 破解「卡脖子」的物理边界">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            高温合金、光刻胶、电子特气、大硅片构成「极端核心辅料」层，自主化率仅约 12%，是非对称限制最集中的物理边界。突破路径不是单点替代，而是把材料、设计与制造工艺整合为可冗余的体系能力。
          </p>
        </Card>
        <Card title="材料基因组工程 · AI for Science">
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center text-xs"><span style={{ color: 'var(--text-tertiary)' }}>高通量计算介入率</span><span className="font-bold mono" style={{ color: '#22d3ee' }}>65%</span></div>
            <div className="flex justify-between items-center text-xs"><span style={{ color: 'var(--text-tertiary)' }}>AI 预测准确度</span><span className="font-bold mono" style={{ color: '#e8a317' }}>~88%</span></div>
          </div>
          <p className="text-[11px] italic leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>AI for Science 正在将材料研发从「试错法」推向「设计法」，研发周期压缩至传统模式的约 1/3。</p>
        </Card>
      </Grid>

      <Card title="优势侧 · 资源与专利的双重筹码" className="mb-6">
        <Grid cols={2}>
          <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.25)' }}>
            <div className="text-lg font-bold mono" style={{ color: '#e8a317' }}>95%</div>
            <div className="text-[10px] uppercase" style={{ color: 'var(--text-tertiary)' }}>稀土永磁全球市场占有率</div>
          </div>
          <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.25)' }}>
            <div className="text-lg font-bold mono" style={{ color: '#e8a317' }}>Top 1</div>
            <div className="text-[10px] uppercase" style={{ color: 'var(--text-tertiary)' }}>石墨烯领域专利产出量</div>
          </div>
        </Grid>
      </Card>

      <Card title="调研结论 · 构建物理级防御" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          先进材料的自主化是中国从「工业规模」向「工业主权」转型的最后关卡。未来的竞争将不再是单一材料的强度或硬度，而是材料、设计与制造工艺的<strong style={{ color: 'var(--text-primary)' }}>「深度嵌合」</strong>。中国正通过建立国家级新材料中试基地，打通实验室与工厂之间的「死亡之谷」，以确保护航「新质生产力」的每一粒粒子都具有战略确定性。
        </p>
        <div className="flex flex-wrap gap-4 text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>
          <span>// REPLACEMENT_RATE: CLIMBING</span>
          <span>// INNOVATION: DATA-DRIVEN</span>
          <span>// SOVEREIGNTY: UNBREAKABLE</span>
        </div>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>「微观粒子是宏观大国的物理底色」· 数据来源：行业白皮书及公开研报，数值为示意 · 由 china.html「关键材料」专题迁移</p>
    </div>
  );
}
