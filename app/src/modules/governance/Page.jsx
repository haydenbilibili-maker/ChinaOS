import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const efficiencyTrend = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2015', '2018', '2021', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '办理日', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [15, 8, 4, 1.5], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};
const govRadar = {
  radar: { indicator: [{ name: '危机响应', max: 100 }, { name: '民意感知', max: 100 }, { name: '资源汲取', max: 100 }, { name: '执行穿透', max: 100 }, { name: '风险预判', max: 100 }, { name: '协同赋能', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [96, 88, 92, 90, 85, 78], name: '治理竞争力', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};
const actorBar = {
  legend: { data: ['1990', '2024'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 60, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['市场/企业', '社会组织', '科层行政', '党政中枢'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [
    { name: '1990', type: 'bar', data: [20, 5, 45, 30], barWidth: 9, itemStyle: { color: '#64748b' } },
    { name: '2024', type: 'bar', data: [28, 14, 28, 30], barWidth: 9, itemStyle: { color: '#c41e3a' } },
  ],
};

const GRID = [
  ['最小治理单元', '每个社区网格配备专职网格员，采集人、地、物、情、事数据——物理世界的数字化映射。', '覆盖率 100% · 权力末端激活'],
  ['闭环处置算法', '移动终端实现「发现-上报-派单-处置-反馈」闭环，反应速度由天级缩短至小时级。', '算法化流转 · 消除死角'],
  ['枫桥经验 2.0', '「矛盾不上交、平安不出事」，大数据提前预警社会冲突，服务下沉到家门口。', '预防性治理 · 社会心理调适'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Governance · 治理算法" title="国家治理现代化与赛博协同" subtitle="重塑国家大脑 ——「治理」作为一种算法、一场超大规模社会协作效率的物理实验" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>现实主义逻辑下，治理现代化的本质是「熵减过程」。面对 14 亿人口的超大规模社会，体制通过数字化转型把社会运作转化为可监测的数据流，实现中枢意志在微观层面的「低摩擦」穿透——这不是自动化，而是权力的重新编程。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="扁平化" label="压缩指挥层级" accent="#22d3ee" />
        <Stat value="全天候" label="实时反馈响应" />
        <Stat value="穿透性" label="意志直达末梢" accent="#c41e3a" />
        <Stat value="预判式" label="风险前置拆弹" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="政务事项办理时效演进（办理日 · 示意）"><EChart option={efficiencyTrend} style={{ height: 240 }} /></Card>
        <Card title="国家治理竞争力多维指数（2024 · 示意）"><EChart option={govRadar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="穿透式网格 · 物理空间的数字化切片" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>将国土空间划分为数百万个微观「网格」，实现对社会每一根毛细血管的实时感应与精准投射。</p>
        <Grid cols={3}>
          {GRID.map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="数字政府 · 从「人跑」到「数跑」">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>「一网通办」与「一网统管」打破部门墙，实现对社会资源的高效汲取与精准分配——一种「非接触式治理」。</p>
          <Grid cols={2}>
            <Stat value="40%+" label="高频事项零人工办结" accent="#22d3ee" />
            <Stat value="24h" label="城市大脑全息感知" accent="#c41e3a" />
          </Grid>
        </Card>
        <Card title="治理参与主体权重演变（1990 vs 2024 · 示意）"><EChart option={actorBar} style={{ height: 220 }} /></Card>
      </Grid>

      <Card title="调研结论 · 构建共治韧性" className="mb-6">
        <Grid cols={3}>
          {[['1 · 从行政封闭到社会开放', '「党建引领、社会参与」的开放系统，借企业技术能力支撑公共治理，主权逻辑与技术逻辑合流。'],
            ['2 · 数字化定义的「法治」', '算法部分替代自由裁量，以数字化程序约束减少基层随意性，建立「规则数据化」的现代法治观。'],
            ['3 · 不可逾越的安全阈值', '所有效率提升最终服从系统稳定性；大数据反馈不仅优化服务，更实时检测并对冲系统性风险。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="调研组总结"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>中国治理现代化是一场关于「超大规模社会协作效率」的物理实验。通过数字化手段，试图证明集权体系在智能时代具备比代议制更高的响应速度与治理效能。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据来源：国家统计局、民政部公报及智慧城市研究白皮书，数值为示意 · 由 china.html「国家治理」专题迁移</p>
    </div>
  );
}
