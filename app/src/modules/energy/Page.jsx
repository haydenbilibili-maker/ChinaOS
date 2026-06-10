import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const AXIS = { lineStyle: { color: '#27324a' } };
const GRID_LINE = { lineStyle: { color: 'rgba(148,163,184,0.1)' } };
const LABEL = { color: '#93a1b5', fontSize: 10 };

// 一次能源消费结构演变（% · 堆叠）
const mixShift = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: { left: 36, right: 16, top: 16, bottom: 42 },
  xAxis: { type: 'category', data: ['2015', '2018', '2021', '2024'], axisLine: AXIS, axisLabel: LABEL },
  yAxis: { type: 'value', max: 100, splitLine: GRID_LINE, axisLabel: { ...LABEL, formatter: '{value}%' } },
  series: [
    { name: '煤炭占比', type: 'bar', stack: 'total', data: [64, 59, 56, 52], itemStyle: { color: '#c41e3a' }, barWidth: 26 },
    { name: '油气及其他', type: 'bar', stack: 'total', data: [24, 27, 28, 29.5], itemStyle: { color: '#22d3ee' } },
    { name: '非化石能源', type: 'bar', stack: 'total', data: [12, 14, 16, 18.5], itemStyle: { color: '#10b981' } },
  ],
};

// 特高压电网能级雷达
const uhvRadar = {
  radar: {
    indicator: [{ name: '跨区输电容量', max: 100 }, { name: '数字化调度', max: 100 }, { name: '绿电消纳率', max: 100 }, { name: '网损控制', max: 100 }, { name: '应急恢复', max: 100 }],
    axisName: { color: '#93a1b5', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } },
    splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [95, 88, 92, 85, 98], name: '电网能级', lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.12)' } }] }],
};

// 全国碳排放权交易量与价格趋势
const carbonMarket = {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  grid: { left: 36, right: 16, top: 16, bottom: 42 },
  xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024'], axisLine: AXIS, axisLabel: LABEL },
  yAxis: { type: 'value', splitLine: GRID_LINE, axisLabel: LABEL },
  series: [
    { name: '交易均价（元/吨）', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [45, 58, 72, 92], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.15)' } },
    { name: '累计成交量（指数）', type: 'bar', data: [30, 45, 85, 120], barWidth: 18, itemStyle: { color: '#22d3ee', opacity: 0.55, borderRadius: 3 } },
  ],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Energy · 双碳" title="一次能源结构 · 绿色转型" subtitle="能源压舱石 · 对外依存 · 双碳 · 新型电力系统 —— 能源转型与「双碳」战略的现实主义逻辑" />

      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>现实主义逻辑下，能源转型是应对「马六甲困境」的物理方案：通过饱和式的风电、光伏装机，把能源生产从依赖进口化石燃料（外部脆弱性）转向利用本土气候资源（内部自主性）。挑战在于用「源网荷储」一体化，化解可再生能源随机性与电网稳定性的矛盾。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="~72%" label="原油对外依存度 · 重点攻坚风险点" accent="#c41e3a" />
        <Stat value="50.4%" label="可再生能源装机占比" accent="#10b981" />
        <Stat value="~18.5%" label="非化石能源消费比 · 向 20% 跨越" accent="#22d3ee" />
        <Stat value="4.2%" label="碳排放强度降幅（2024 目标预期）" accent="#e8a317" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="结构迁徙 · 一次能源消费占比演变（%）">
          <EChart option={mixShift} style={{ height: 250 }} />
          <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>从「黑色」向「绿色」的重心偏移：煤炭占比由 64% 降至 52%，非化石能源升至 18.5%；新型电力系统协议 —— RENEWABLES_FIRST。</p>
        </Card>
        <Card title="特高压能量走廊 · 电网能级评估">
          <EChart option={uhvRadar} style={{ height: 250 }} />
          <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>特高压（UHV）是「西电东送」的物理大动脉，覆盖全部省份，将西部沙漠绿电秒级输送至东部负荷中心，消解能源供需的地理错配。</p>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="全国碳排放权交易量与价格趋势"><EChart option={carbonMarket} style={{ height: 260 }} /></Card>
        <Card title="碳交易 · 让减排具备财务理性">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>中国已建立全球覆盖温室气体排放量最大的碳市场。其核心逻辑不是惩罚，而是通过「市场定价」引导资本流向低碳技术：当「排碳有价、减碳有偿」成为财务报表的刚性约束，工业体系的转型将从行政命令驱动转向内生的经济利益驱动。</p>
          <Grid cols={2}>
            <div className="p-3 rounded" style={{ background: 'rgba(232,163,23,0.08)', border: '1px solid rgba(232,163,23,0.25)' }}>
              <div className="text-lg font-bold mono" style={{ color: '#e8a317' }}>90+ 元</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>当前碳价基准（CEA）</div>
            </div>
            <div className="p-3 rounded" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <div className="text-lg font-bold mono" style={{ color: '#10b981' }}>50 亿吨+</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>覆盖二氧化碳排放量</div>
            </div>
          </Grid>
        </Card>
      </Grid>

      <Card title="四大支柱 · 新型能源体系的工程拆解" className="mb-6">
        <Grid cols={4}>
          {[['01 能源结构脱碳', '饱和式风光装机替代进口碳氢化合物；「源网荷储」一体化对冲可再生能源的出力随机性。', '#10b981'],
            ['02 特高压能量走廊', '跨区输电容量与数字化调度构成全域能量对流，西部绿电与东部负荷在物理层完成再平衡。', '#e8a317'],
            ['03 碳交易与金融杠杆', '碳价从 45 元升至 90+ 元，市场定价让减排成为可计量的财务变量，资本随之流向低碳技术。', '#22d3ee'],
            ['04 能源主权保障', '原油对外依存 ~72% 仍是重点攻坚风险点；煤电压舱石从「主力电源」转向「调节电源」，为绿电突围腾挪系统空间。', '#c41e3a']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="战略结论 · 构建能源防线" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>「双碳」目标的实现是中国彻底摆脱油气进口依赖、规避地缘政治断供风险的唯一物理路径。未来的竞争不仅是能源量的竞争，更是「全生命周期效率」与「电网调度算法」的竞争 —— 通过「风光水核」多能互补，构建一套具有极高抗冲击性的现代化能源体系。</p>
        <div className="flex flex-wrap gap-4 text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>
          <span>{'// ENERGY_MIX: OPTIMIZING'}</span>
          <span>{'// GRID_RESILIENCE: RECONSTRUCTING'}</span>
          <span>{'// STATUS: SECURE'}</span>
        </div>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>「电子流动的速度即是主权扩张的速度」 · 数据来源：公开能源白皮书及行业研报，部分为示意值 · 由 china.html「能源」专题迁移</p>
    </div>
  );
}
