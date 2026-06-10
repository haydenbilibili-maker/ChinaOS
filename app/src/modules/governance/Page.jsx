import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const effTrend = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2015', '2018', '2021', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '天', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [18, 9, 4, 1.5], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};
const govRadar = {
  radar: { indicator: [{ name: '危机响应', max: 100 }, { name: '民意感知', max: 100 }, { name: '执行穿透', max: 100 }, { name: '资源调配', max: 100 }, { name: '风险预判', max: 100 }, { name: '协同赋能', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [96, 88, 92, 90, 85, 80], name: '治理竞争力', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }] }],
};
const actorTrend = {
  legend: { data: ['1990', '2024'], textStyle: { color: '#93a1b5' }, top: 0 },
  grid: { left: 60, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['社会组织', '市场/平台', '基层自治', '科层行政'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [
    { name: '1990', type: 'bar', data: [5, 10, 15, 70], barWidth: 9, itemStyle: { color: '#27324a' } },
    { name: '2024', type: 'bar', data: [15, 25, 25, 35], barWidth: 9, itemStyle: { color: '#22d3ee' } },
  ],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="National Governance" title="国家治理现代化与赛博协同" subtitle="治理逻辑 · 网格体系 · 数字政府 · 效能评估 —— 治理作为一种「熵减算法」" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>面对 14 亿人口的超大规模社会，治理现代化的本质是「熵减过程」。体制通过数字化把社会运作转化为可监测的数据流，实现中枢意志在微观层面的「低摩擦」穿透——这不是简单自动化，而是权力的重新编程。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="扁平化" label="压缩指挥层级" accent="#c41e3a" />
        <Stat value="全天候" label="实时反馈响应" accent="#22d3ee" />
        <Stat value="穿透性" label="意志直达末梢" accent="#e8a317" />
        <Stat value="预判式" label="风险前置拆弹" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="政务事项办理时效演进（天 · 示意）"><EChart option={effTrend} style={{ height: 240 }} /><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>数字化对传统官僚行政效率的强制性提速。</p></Card>
        <Card title="国家治理竞争力多维指数（2024 · 示意）"><EChart option={govRadar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="穿透式网格 · 物理空间的数字化切片" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>把国土空间划分为数百万个微观「网格」，实现对社会每一根毛细血管的实时感应与精准投射。</p>
        <Grid cols={3}>
          {[['最小治理单元', '每个社区网格配专职网格员，采集人、地、物、情、事数据，是「物理世界的数字化映射」。', '覆盖全域 100%'],
            ['闭环处置算法', '移动终端实现「发现-上报-派单-处置-反馈」闭环，官僚反应速度由天级缩短至小时级。', '算法化自动流转'],
            ['枫桥经验 2.0', '「矛盾不上交、平安不出事」，大数据提前预警社会冲突，法律与调解服务下沉家门口。', '预防性治理']].map(([t, d, tag]) => (
            <div key={t} className="os-card p-4" style={{ background: 'var(--bg-elevated)' }}><div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-tertiary)' }}>{d}</p><span className="text-[10px] mono" style={{ color: 'var(--cyber-cyan)' }}>{tag}</span></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="数字政府 · 从「人跑」到「数跑」">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>「一网通办」与「一网统管」打破部门墙，实现对社会资源的高效汲取与精准分配——一种「非接触式治理」。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>政务服务「秒办」</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>AI 审核代替人工，超 40% 高频事项实现零人工干预自动办结。</p></div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>城市大脑 (City Brain)</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>集成交通、城管、环保等多源数据，24 小时全息感知城市运行体征。</p></div>
          </div>
        </Card>
        <Card title="治理参与主体权重演变（1990 vs 2024 · 示意）"><EChart option={actorTrend} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="调研结论 · 构建共治韧性" className="mb-6">
        <Grid cols={3}>
          {[['1 · 从行政封闭到社会开放', '「党建引领、社会参与」开放系统，利用企业（腾讯、阿里）技术能力支撑公共治理，主权逻辑与技术逻辑合流。'],
            ['2 · 数字化定义的「法治」', '算法部分替代自由裁量，经数字化程序约束减少基层随意性，建立「规则数据化」的现代法治观。'],
            ['3 · 不可逾越的「安全阈值」', '所有效率提升最终服从系统稳定性；大数据反馈既优化服务，也实时检测并对冲系统性风险。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="调研组总结"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>治理现代化是一场关于「超大规模社会协作效率」的物理实验：通过数字化手段，试图证明集权体系在智能时代具备比代议制更高的响应速度与治理效能。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据来源：国家统计局、民政部公报及智慧城市研究白皮书，部分为示意值 · 由 china.html「国家治理现代化」专题迁移</p>
    </div>
  );
}
