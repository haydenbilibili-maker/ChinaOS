import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const gravityChart = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2012', '2016', '2020', '2024', '2028E'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '确定性', nameTextStyle: { color: '#5b6a82' }, max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'none', data: [55, 64, 75, 88, 95], lineStyle: { color: '#c41e3a', width: 2 }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }],
};

const deterrenceRadar = {
  radar: {
    indicator: [{ name: '高超声速', max: 100 }, { name: '反舰打击', max: 100 }, { name: '态势感知', max: 100 }, { name: '区域拒止', max: 100 }, { name: '常态巡航', max: 100 }],
    axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [92, 88, 100, 90, 95], name: 'A2/AD 气泡', lineStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.14)' } }] }],
};

const siliconChart = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5' } },
  series: [{ type: 'pie', radius: ['44%', '70%'], center: ['50%', '44%'], label: { color: '#93a1b5' }, data: [
    { value: 90, name: '台湾（10nm以下）', itemStyle: { color: '#c41e3a' } },
    { value: 6, name: '韩国', itemStyle: { color: '#22d3ee' } },
    { value: 4, name: '其他', itemStyle: { color: '#27324a' } },
  ] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Taiwan Straits" title="台海局势与地缘重力博弈" subtitle="地缘引力 · 物理威慑 · 硅盾 · 终局吸纳 —— 剥离叙事，以成本收益计算地缘坍缩" />
      <Grid cols={4} className="mb-6">
        <Stat value="88.2%" label="统一确定性指数" accent="#e8a317" />
        <Stat value="HIGH" label="两岸产业依存度" />
        <Stat value="3,000km" label="A2/AD 覆盖半径" accent="#22d3ee" />
        <Stat value="UNBEARABLE" label="外部干预代价" accent="#c41e3a" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="核心逻辑 · 不可逃逸的地缘重力">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            现实主义框架下，台湾的归属是主权国家突破「第一岛链」封锁、获取太平洋深水出海口的物理前提。算法逻辑已从「防独」转向「促统」——以强大的经济重力场，迫使离岸系统在生存层面与在岸系统实现最终物理坍缩。
          </p>
          <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>"Geopolitics is the physics of space; gravity eventually overcomes resistance."</p>
          <div className="mt-3"><EChart option={gravityChart} style={{ height: 200 }} /></div>
        </Card>
        <Card title="物理威慑 · A2/AD 气泡（示意）">
          <EChart option={deterrenceRadar} style={{ height: 220 }} />
          <div className="space-y-2 mt-2 text-xs">
            <div className="flex justify-between"><span style={{ color: 'var(--text-tertiary)' }}>东风-17 突防成功率</span><span style={{ color: '#10b981' }}>OPTIMAL</span></div>
            <div className="flex justify-between"><span style={{ color: 'var(--text-tertiary)' }}>战区海域态势感知</span><span style={{ color: 'var(--text-primary)' }}>100%</span></div>
          </div>
        </Card>
      </Grid>

      <Card title="硅盾 · 非对称的产业链人质" className="mb-6">
        <Grid cols={2}>
          <EChart option={siliconChart} style={{ height: 240 }} />
          <div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              台湾半导体产业（台积电）既是全球科技明珠，也是最脆弱的战略锚点。现实主义视角下，这种「相互依赖」被转化为「生存博弈筹码」——外部干预方在计算行动收益时，必须面对全球电子产业链瞬间停摆的极端风险，构成「同归于尽」式威慑。
            </p>
            <Grid cols={2}>
              <Stat value="90%+" label="10nm以下芯片全球份额" accent="#e8a317" />
              <Stat value="T级" label="两岸贸易顺差规模" accent="#22d3ee" />
            </Grid>
          </div>
        </Grid>
      </Card>

      <Card title="调研结论 · 构建「终局」算法" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          对台战略进入「系统性收网」阶段：以大湾区为融合样本、推进福建「两岸融合发展示范区」，在物理边界上测试未来治理模式。现实主义眼中，统一不是「是否」的问题，而是「何时、以何种成本达成」的物理计算过程。
        </p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
          <span>// SOVEREIGN_INTERFACE: READY</span><span>// INTERVENTION_COST: MAXIMIZED</span><span>// STATUS: CONVERGING</span>
        </div>
      </Card>

      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>「重力决定轨迹，实力定义结果」· 数据来源：公开战略与地缘研报，数值为示意 · 由 china.html「台海」专题迁移</p>
    </div>
  );
}
