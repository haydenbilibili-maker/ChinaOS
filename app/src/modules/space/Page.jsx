import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const axis = { axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } };
const split = { splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } };

const launchTrend = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2015', '2017', '2019', '2021', '2023', '2024(E)'], ...axis },
  yAxis: { type: 'value', ...axis, ...split },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [19, 22, 34, 55, 67, 85], lineStyle: { color: '#22d3ee', width: 3 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.12)' } }],
};
const costEvolution = {
  grid: { left: 56, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2010', '2015', '2020', '2023', '2025(E)', '2030(E)'], ...axis },
  yAxis: { type: 'value', ...axis, ...split, axisLabel: { color: '#93a1b5', formatter: '${value}' } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [20000, 15000, 8000, 4500, 2000, 800], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }],
};
const competenceRadar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  radar: { indicator: [{ name: '运载', max: 100 }, { name: '卫星平台', max: 100 }, { name: '测控', max: 100 }, { name: '应用', max: 100 }, { name: '出口', max: 100 }, { name: '人才', max: 100 }], radius: '62%', axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [92, 85, 95, 70, 82, 88], name: '中国', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.15)' } },
    { value: [98, 95, 98, 98, 95, 98], name: '美国', lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.08)' } },
    { value: [75, 70, 85, 50, 80, 72], name: '欧盟', lineStyle: { color: '#10b981', type: 'dashed' }, itemStyle: { color: '#10b981' } },
  ] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Space · 高边疆" title="北斗导航 · 商业航天与轨道资产" subtitle="发射次数 · 星座 · 商业航天 · 轨道资源 —— 发射频次与入轨成本的双轨竞赛" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>国家队与商业火箭共同抬升年发射次数；可回收液体火箭降低每公斤入轨成本。低轨星座争夺轨道面与频谱资源，ITU 规则下「先登先占」驱动申报与发射节奏，与 6G 星地一体化互为前置条件。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="万亿级" label="商业航天市场（区间）" accent="#c41e3a" />
        <Stat value="1.5 万颗+" label="星座规划规模（示意）" accent="#22d3ee" />
        <Stat value="450+ 颗" label="在轨商业卫星（量级）" accent="#e8a317" />
        <Stat value="#2" label="年发射次数排名" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="年发射次数（次 · 示意）：2024(E) 约 85 次"><EChart option={launchTrend} style={{ height: 240 }} /><p className="text-[11px] mt-2 text-center italic" style={{ color: 'var(--text-tertiary)' }}>商业发射占比持续提升。</p></Card>
        <Card title="入轨成本演进（美元/kg · 示意）"><EChart option={costEvolution} style={{ height: 240 }} /><p className="text-[11px] mt-2 text-center italic" style={{ color: 'var(--text-tertiary)' }}>可回收液体火箭目标将成本压至 5,000 美元/kg 以下。</p></Card>
      </Grid>

      <Card title="巨型星座与频谱/轨道 · ITU「先登先占」" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>轨道位与无线电频率是「非再生性战略资源」；星间链路与地面站布局决定时延与抗毁性。国网（GW）已申报约 1.3 万颗节点，与千帆（G60）合计规划逾 2.5 万颗。</p>
        <Grid cols={3}>
          {[['千帆 (G60)', '长三角产业配套；面向宽带与物联网载荷，与地面 5G/6G 协同。规划：万颗级 · 场景：低时延。', '#22d3ee'],
            ['国网 (SatNet)', '国家队星座，强调普遍服务与应急通信；与「一带一路」信息通道联动。规模：万颗级 · 对象：国土全域。', '#c41e3a'],
            ['遥感星座', '对地观测数据服务农业、环保与防务；分辨率与重访周期竞争白热化。商业：放量 · 出口：数据合规。', '#e8a317']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="可复用火箭与发射经济性">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>液氧甲烷（朱雀二号）、垂直回收（力箭、天龙系列）与海上平台降低试错成本；与 SpaceX 相比仍处追赶期，发射保险与供应链是隐性成本。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>可回收运载 (RLV)</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>一级回收与多次复用摊薄单次发射成本；发动机可复用次数目标 20+ 次，年化发射通量预期 100+ 次。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>测控与落区</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>海上发射与内陆落区管理影响年发射窗口。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>投资结构（示意）</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>火箭 40% · 卫星 30% · 地面站 15% · 遥感 10% · 通信运营 5%。</p></div>
          </div>
        </Card>
        <Card title="航天产业链能力对比（示意 · 中国/美国/欧盟）"><EChart option={competenceRadar} style={{ height: 300 }} /></Card>
      </Grid>

      <Card title="星座能力对比（2024 · 示意 · 国内星座 2025E vs Starlink）" className="mb-6">
        <Grid cols={5}>
          {[['覆盖', 85, 95], ['时延', 80, 98], ['抗毁', 75, 98], ['成本', 92, 90], ['出口', 88, 95]].map(([dim, cn, sl]) => (
            <div key={dim} className="text-center">
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{dim}</div>
              <div className="text-lg font-bold mono" style={{ color: '#22d3ee' }}>{cn}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>国内星座</div>
              <div className="text-lg font-bold mono mt-1" style={{ color: '#93a1b5' }}>{sl}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Starlink</div>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-3 italic" style={{ color: 'var(--text-tertiary)' }}>国内星座在成本端接近，覆盖/时延/抗毁取决于组网密度与星间链路成熟度。</p>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="北斗导航 · 时空基准底座">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>北斗三号全球组网提供独立时空基准，是轨道资产中最早完成闭环的国家星座；短报文与高精度增值服务向交通、电力、金融授时与大众消费渗透。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>授时与定位主权</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>摆脱对 GPS 单一依赖；关键基础设施授时安全自主可控。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>产业外溢</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>高精度位置服务与低轨通信星座互补，构成「通导遥」一体化底座。</p></div>
          </div>
        </Card>
        <Card title="深空与月球资源叙事">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>月球南极水冰与氦-3 开发仍处探测阶段；工程可行性取决于运载成本与在轨制造 (ISRU)。</p>
          <div className="space-y-2">
            {[['月球基地', '科研站与资源勘查先行。'],
              ['小行星采矿', '远期期权，受制于运载与法律框架。']].map(([t, d]) => (
              <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 轨道与频谱', '「不可再生」战略资源；国际协调与电磁兼容成本上升。'],
            ['2 · 出口与制裁', '卫星部件与遥感数据跨境流动面临合规审查。'],
            ['3 · 星地一体', '与 6G 标准、手机直连卫星强耦合，牵动运营商与设备商生态。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>星网建设的本质是「物流效率」：谁先把每公斤入轨成本压到位，谁就拥有轨道面与频谱的实际占有权；轨道资产的竞争终局不在天上，而在火箭工厂与发射场的周转率。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开研报与行业示意值（参考 SIA《航天产业报告》等），仅供结构性参考 · 与「低轨星网」专题页可对照阅读 · 由 china.html「航天」专题迁移</p>
    </div>
  );
}
