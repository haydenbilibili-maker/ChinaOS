import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const scaleLine = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2015', '2018', '2021', '2023', '2025(E)', '2030(?)'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value} GW', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ name: '在运+在建装机 (GW)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [26, 42, 53, 57, 72, 110], lineStyle: { color: '#22d3ee', width: 3 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }],
};

const genEvolution = {
  grid: { left: 40, right: 16, top: 16, bottom: 50 },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  xAxis: { type: 'category', data: ['华龙/M310+', '高温气冷堆', '快堆示范', '熔盐堆', '小型堆'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10 } },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '2020 工程化', type: 'bar', data: [85, 70, 30, 25, 15], barWidth: 12, itemStyle: { color: '#e8a317', borderRadius: 3 } },
    { name: '2024(E) 工程化', type: 'bar', data: [98, 92, 95, 55, 42], barWidth: 12, itemStyle: { color: '#c41e3a', borderRadius: 3 } },
  ],
};

const competenceRadar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 12 },
  radar: { indicator: [{ name: '设计总包', max: 100 }, { name: '设备', max: 100 }, { name: '燃料', max: 100 }, { name: '运维', max: 100 }, { name: '融资', max: 100 }, { name: '出口', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [95, 100, 98, 95, 88, 70], name: '核电产业链能力（中国 · 2024）', lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.12)' } },
    { value: [95, 90, 100, 85, 92, 75], name: '聚变研发维度（国内装置）', lineStyle: { color: '#22d3ee', type: 'dashed' }, itemStyle: { color: '#22d3ee' } },
  ] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Nuclear · 基荷 · 低碳 · 可控" title="核电核准装机 · 四代堆" subtitle="华龙一号 · HTR-PM · 燃料循环 · 基荷主权" />

      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>在风光波动之后「稳定出力」的制度安排：核电提供年利用小时数高、碳排低的基荷电力，与抽水蓄能、特高压共同构成新型电力系统的「物理底盘」。在运与核准机组规模居全球前列，四代堆示范验证固有安全性与燃料循环。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="55+ 台" label="在运机组（量级）" accent="#c41e3a" />
        <Stat value="#1" label="在建核电规模" accent="#22d3ee" />
        <Stat value="~5%" label="全国发电量占比" accent="#e8a317" />
        <Stat value="自主" label="三代技术成套" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="装机与规划（GW · 示意 · 2030 前后为区间预测）"><EChart option={scaleLine} style={{ height: 250 }} /></Card>
        <Card title="技术成熟度与工程化程度（示意 %）"><EChart option={genEvolution} style={{ height: 250 }} /></Card>
      </Grid>

      <Card title="第四代技术路线 · 安全性 / 燃料利用 / 工业供热分工（示意对比，非设备认证结论）" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>气 · 高温气冷堆 (HTR-PM)</div>
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>石球燃料与氦气冷却，失冷工况下余热导出依赖物理机制，示范工程验证固有安全。</p>
            <p className="text-[10px] mt-1 mono" style={{ color: '#22d3ee' }}>场景：热电联供 · 出口：高温蒸汽</p>
          </div>
          <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}>
            <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>快 · 快中子堆 (FBR)</div>
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>提高铀资源利用率，闭合燃料循环路径与后处理、嬗变长寿命核素联动。</p>
            <p className="text-[10px] mt-1 mono" style={{ color: '#c41e3a' }}>燃料：MOX 路线 · 周期：数十年尺度</p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>盐 · 熔盐堆 (MSR)</div>
            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>常压高温、适合钍基循环探索；工程化仍处材料与腐蚀控制攻关阶段。</p>
            <p className="text-[10px] mt-1 mono" style={{ color: '#e8a317' }}>阶段：示范前 · 监管：专项审评</p>
          </div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="聚变研发 · 「人造太阳」长周期">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>EAST、HL-3 等装置持续刷新等离子体参数；ITER 与 CFETR 路线牵动全球供应链。聚变商用仍受材料、能量增益与经济性约束，宜与裂变基荷解耦评估。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>EAST 长脉冲</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>高约束模式与加热功率协同，为聚变堆运行窗口积累数据。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>ITER 国际合作</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>工程与采购进度牵动全球部件交付；地缘因素可能影响节点。</p></div>
          </div>
        </Card>
        <Card title="产业链能力与聚变维度雷达（2024 · 示意）"><EChart option={competenceRadar} style={{ height: 260 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="核电 + 多元场景 · SMR 小型模块化反应堆">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>小型模块化反应堆 (SMR) 面向工业供热、海岛与数据中心供电；审批、安全壳与应急体系是制度成本。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>供热</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>替代燃煤锅炉，服务北方清洁供暖与化工园区。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>制氢</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>高温热耦合制氢路线，与绿氢、工业脱碳联动。</p></div>
          </div>
        </Card>
        <Card title="2030 核电装机结构（示意）">
          <div className="space-y-2">
            {[['三代压水堆（华龙一号等）', 70, '#c41e3a'], ['四代示范', 12, '#22d3ee'], ['小型堆', 8, '#e8a317'], ['供热', 5, '#10b981'], ['其他', 5, '#93a1b5']].map(([name, pct, color]) => (
              <div key={name}>
                <div className="flex justify-between text-[11px]" style={{ color: 'var(--text-secondary)' }}><span>{name}</span><span className="mono" style={{ color }}>{pct}%</span></div>
                <div style={{ height: 6, background: 'rgba(148,163,184,0.1)', borderRadius: 3, marginTop: 2 }}><div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} /></div>
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-3 italic" style={{ color: 'var(--text-tertiary)' }}>结构比例为示意推演，以主管部门发布为准。</p>
        </Card>
      </Grid>

      <Card title="研判要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 核准节奏', '与沿海厂址、冷却水与电网接入强绑定，年均新开工台数存在政策区间。'],
            ['2 · 燃料与循环', '天然铀对外依存与浓缩能力构成「能源主权」子议题；快堆与闭式循环拉长博弈周期。'],
            ['3 · 公众接受度', '与信息公开、邻避治理相关；沿海与内陆项目审批逻辑不同。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="数据说明"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>本页为公开资料与行业推演；装机与占比请以国家能源局、中核集团等发布为准。与「能源主权」「氢能」「智能电网」模块交叉阅读。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>参考：中国核能行业协会、IAEA 公开资料 · 数据为示意值，仅供结构性参考 · 由 china.html「核电」专题迁移</p>
    </div>
  );
}
