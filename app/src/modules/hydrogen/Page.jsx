import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const mixDonut = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  series: [{
    type: 'pie', radius: ['58%', '78%'], center: ['50%', '45%'], label: { show: false },
    data: [
      { value: 62, name: '灰氢', itemStyle: { color: '#93a1b5' } },
      { value: 20, name: '蓝氢', itemStyle: { color: '#22d3ee' } },
      { value: 15, name: '绿氢', itemStyle: { color: '#10b981' } },
      { value: 3, name: '其他', itemStyle: { color: '#e8a317' } },
    ],
  }],
};
const costTrend = {
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 14 },
  grid: { left: 56, right: 16, top: 24, bottom: 48 },
  xAxis: { type: 'category', data: ['2020', '2022', '2024', '2026(?)', '2030(?)'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', name: '元/kW', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: 'ALK 单位投资', type: 'line', smooth: true, symbol: 'circle', data: [3500, 2800, 2200, 1800, 1300], lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' } },
    { name: 'PEM 单位投资', type: 'line', smooth: true, symbol: 'circle', data: [12000, 9500, 7500, 5000, 3000], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.08)' } },
  ],
};
const chainRadar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 14 },
  radar: {
    indicator: [{ name: '电解槽', max: 100 }, { name: '储运', max: 100 }, { name: '材料', max: 100 }, { name: '场景', max: 100 }, { name: '政策', max: 100 }, { name: '国际合作', max: 100 }],
    radius: '62%', axisName: { color: '#93a1b5', fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [
    { value: [100, 92, 55, 88, 95, 65], name: '中国', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [85, 80, 95, 75, 82, 90], name: '国际龙头', lineStyle: { color: '#e8a317', type: 'dashed' }, itemStyle: { color: '#e8a317' } },
  ] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Hydrogen · 双碳二次能源" title="绿氢 · 制储运加用" subtitle="电解槽 · 绿氢降本 · 示范城市群 —— 从灰氢到绿氢，电价决定天花板" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>电解水制氢成本中电力占比极高，与风光消纳、特高压送电及 CCUS 路径竞争；氢储能（电—氢—电）在长时场景与抽水蓄能、压缩空气互补。氢的产业化必须沿「制—储—运—加—用」全链条同步推进，任一环节短板都会抬高终端用氢成本。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="~35 元/kg" label="绿氢成本区间（示意）" accent="#c41e3a" />
        <Stat value="~15%" label="2050 终端能源占比（情景）" accent="#10b981" />
        <Stat value="400+ 项" label="国内电解槽项目（量级）" accent="#22d3ee" />
        <Stat value="100 GWh" label="氢储能规划（示意）" accent="#e8a317" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="氢源结构（示意） · 灰/蓝/绿占比随政策与电价变化"><EChart option={mixDonut} style={{ height: 250 }} /></Card>
        <Card title="制氢设备单位投资下行（元/kW · 示意）"><EChart option={costTrend} style={{ height: 250 }} /></Card>
      </Grid>

      <Card title="制 · 电解槽三条技术路线" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>碱性 (ALK) 成本低、响应慢；质子交换膜 (PEM) 适配波动电源；固体氧化物 (SOEC) 效率高、材料难度大。</p>
        <Grid cols={3}>
          {[['ALK 碱性电解槽', '成熟度高，适合大规模集中制氢；负荷调节能力相对有限。成本最低，定位基荷配套。', '#22d3ee'],
            ['PEM 电解槽', '启停快，适配风光波动；贵金属催化剂与膜材成本仍高。阶段：放量，对象：离网制氢。', '#c41e3a'],
            ['SOEC 高温电解', '可与工业余热耦合，电耗理论值低；耐久与密封为工程难点。阶段：示范，对象：化工园区。', '#e8a317']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="储 · 氢储能与长时调节">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>电—氢—电往返效率低于锂电，但储能时长可达日—周尺度；大型化工与电网侧试点探索调峰与备用容量。综合度电成本 (LCOS) 与场景匹配度决定其与锂电、抽蓄、压缩空气、液流电池的经济边界。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>效率约束</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>全链路效率决定与抽蓄、电化学储能的经济边界。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>安全规范</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>高压储氢与管道标准影响建设节奏。</p></div>
          </div>
        </Card>
        <Card title="运 · 加 · 基础设施协同">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>储运与加注是绿氢落地的中间瓶颈：管道掺氢、港口氨能接收等与油气基础设施协同可降低重复投资。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>管道掺氢与氨/甲醇载体</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>氢与氨、甲醇载体并行，西北风光基地外送与就地消纳并举。</p></div>
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>加氢站与示范城市群</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>燃料电池汽车示范城市群带动网络建设；加氢站利用率决定经济性。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="用 · 交通与重工业脱碳场景" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>重卡、航运与炼化难以直接电气化；绿钢与化工脱氢对稳定供氢与碳价敏感。2024 年场景成熟度（示意）：化工 95、交通 85、炼钢 60、出口 55、储能 45、管道 30。</p>
        <Grid cols={2}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>燃料电池重卡</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>港口与矿区示范运营；加氢站利用率决定经济性。</p></div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>氢冶金（绿钢）</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>直接还原铁 (DRI) 路线替代焦炭；绿氢成本与碳成本双变量。</p></div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="氢能产业链能力对标（示意）"><EChart option={chainRadar} style={{ height: 280 }} /></Card>
        <Card title="研判要点">
          <div className="space-y-3">
            {[['1 · 绿电成本', '仍是制氢第一变量；西北风光基地与东部负荷匹配决定外送与就地消纳。'],
              ['2 · 标准与认证', '绿氢溯源、碳足迹核算影响出口与高耗能行业采购。'],
              ['3 · 与油气基础设施协同', '管道掺氢、港口氨能接收等降低重复投资。']].map(([t, d]) => (
              <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>绿氢的天花板由电价决定，下限由全链条短板决定：电解槽降本（ALK 3500→1300、PEM 12000→3000 元/kW 区间推演）只解决「制」，储运加注与标准认证不补齐，示范城市群难以走向商业闭环。与「能源转型」「智能电网」交叉阅读。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本页为行业区间与模型推演（示意值），参考国家氢能中长期规划与主要装备企业公开材料 · 由 china.html「氢能」专题迁移</p>
    </div>
  );
}
