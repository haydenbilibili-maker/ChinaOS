import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const AXIS = '#27324a';
const SPLIT = 'rgba(148,163,184,0.1)';
const TXT = '#93a1b5';

const scaleBar = {
  tooltip: { trigger: 'axis' },
  grid: { left: 48, right: 40, top: 16, bottom: 24 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: SPLIT } }, axisLabel: { show: false } },
  yAxis: { type: 'category', data: ['德国', '日本', '美国', '中国'], axisLine: { lineStyle: { color: AXIS } }, axisLabel: { color: TXT } },
  series: [{ type: 'bar', data: [800, 1000, 2500, 4500], barWidth: 18, itemStyle: { color: (p) => (p.dataIndex === 3 ? '#c41e3a' : '#64748b'), borderRadius: [0, 4, 4, 0] }, label: { show: true, position: 'right', color: TXT, fontSize: 10 } }],
};
const valueChainRadar = {
  radar: { indicator: [{ name: '原始研发', max: 100 }, { name: '高价值设计', max: 100 }, { name: '精密制造', max: 100 }, { name: '品牌影响力', max: 100 }, { name: '全球化服务', max: 100 }], axisName: { color: TXT, fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [30, 40, 95, 20, 25], name: '2015 状态', lineStyle: { color: '#64748b' }, itemStyle: { color: '#64748b' } },
    { value: [75, 82, 98, 65, 78], name: '2024 现状', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
  ] }],
};
const giantsPie = {
  tooltip: { trigger: 'item' },
  series: [{ type: 'pie', radius: ['40%', '70%'], itemStyle: { borderRadius: 2, borderColor: 'transparent', borderWidth: 2 }, label: { show: true, fontSize: 10, color: TXT }, data: [
    { value: 35, name: '高端装备', itemStyle: { color: '#c41e3a' } },
    { value: 25, name: '新一代信息技术', itemStyle: { color: '#22d3ee' } },
    { value: 15, name: '新材料', itemStyle: { color: '#e8a317' } },
    { value: 12, name: '生物医药', itemStyle: { color: '#10b981' } },
    { value: 13, name: '新能源汽车', itemStyle: { color: '#8b5cf6' } },
  ] }],
};

// 制造业增加值规模 / 全球占比趋势
const shareTrend = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['增加值（万亿美元）', '全球占比 %'], textStyle: { color: TXT, fontSize: 10 }, top: 0 },
  grid: { left: 44, right: 44, top: 32, bottom: 24 },
  xAxis: { type: 'category', data: ['2004', '2008', '2012', '2016', '2020', '2024'], axisLine: { lineStyle: { color: AXIS } }, axisLabel: { color: TXT, fontSize: 10 } },
  yAxis: [
    { type: 'value', name: '万亿$', nameTextStyle: { color: TXT, fontSize: 9 }, splitLine: { lineStyle: { color: SPLIT } }, axisLabel: { color: TXT, fontSize: 10 } },
    { type: 'value', name: '%', nameTextStyle: { color: TXT, fontSize: 9 }, splitLine: { show: false }, axisLabel: { color: TXT, fontSize: 10 } },
  ],
  series: [
    { name: '增加值（万亿美元）', type: 'bar', data: [0.8, 1.7, 2.9, 3.2, 3.9, 4.7], barWidth: 16, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } },
    { name: '全球占比 %', type: 'line', yAxisIndex: 1, data: [9, 18, 24, 26, 29, 30], smooth: true, lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' }, symbolSize: 6 },
  ],
};

// GVC 微笑曲线：x = 价值链环节，y = 附加值率
const smileStages = ['研发 / 设计', '关键零部件', '组装 / 制造', '品牌 / 营销', '服务'];
const smileChinaNow = [42, 55, 90, 50, 45];   // 中国当前位势（在中段最强）
const smileTarget = [80, 78, 88, 78, 75];      // 向两端攀升目标
const smileGlobalLeader = [88, 82, 60, 90, 85]; // 发达经济体典型形态（两端高）

function buildSmile(active) {
  const baseLine = (name, data, color, width, area) => ({
    name, type: 'line', smooth: true, data,
    symbol: 'circle', symbolSize: 8,
    lineStyle: { color, width },
    itemStyle: { color },
    areaStyle: area ? { color: 'rgba(196,30,58,0.08)' } : undefined,
    emphasis: { focus: 'series' },
  });
  const series = [
    baseLine('发达经济体形态', smileGlobalLeader, '#5b6a82', 1.5),
    baseLine('攀升目标', smileTarget, '#22d3ee', 1.5),
    baseLine('中国当前位势', smileChinaNow, '#c41e3a', 2.5, true),
  ];
  // 高亮选中环节的标记
  if (active != null) {
    series.push({
      name: 'mark', type: 'scatter', data: [[active, smileChinaNow[active]]],
      symbolSize: 18, itemStyle: { color: 'transparent', borderColor: '#e8a317', borderWidth: 2 }, z: 10, silent: true,
    });
  }
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['中国当前位势', '攀升目标', '发达经济体形态'], textStyle: { color: TXT, fontSize: 10 }, top: 0 },
    grid: { left: 48, right: 24, top: 34, bottom: 40 },
    xAxis: { type: 'category', data: smileStages, axisLine: { lineStyle: { color: AXIS } }, axisLabel: { color: TXT, fontSize: 10, interval: 0 } },
    yAxis: { type: 'value', name: '附加值率', nameTextStyle: { color: TXT, fontSize: 9 }, min: 30, max: 100, splitLine: { lineStyle: { color: SPLIT } }, axisLabel: { color: TXT, fontSize: 10 } },
    series,
  };
}

const stageDetail = [
  { k: '研发 / 设计', pos: '攀升中 · 缺口大', desc: '基础研究与原始创新仍是短板：高端 EDA、工业软件、核心算法专利受制于人。附加值率约 42%，目标 80%，是「微笑曲线」左端的主战场。', accent: '#22d3ee' },
  { k: '关键零部件', pos: '部分卡脖子', desc: '光刻机、高端轴承、工业母机数控系统、航空发动机等环节存在断点。专精特新「小巨人」蜂群正逐点替代，自给率持续爬升。', accent: '#e8a317' },
  { k: '组装 / 制造', pos: '绝对统治 · 已满格', desc: '附加值率 90，全球无可替代。规模、效率、配套完整度构成物理护城河——这是「世界工厂」的基座，但也是利润最薄的曲线底部。', accent: '#c41e3a' },
  { k: '品牌 / 营销', pos: '加速出海', desc: '新能源车、家电、消费电子品牌正强行向右端爬升。从「贴牌代工」到「自主品牌全球化」，附加值率由 20 升至 50，目标 78。', accent: '#8b5cf6' },
  { k: '服务', pos: '制造服务化', desc: '工业互联网、后市场服务、整体解决方案输出（高铁/盾构/特高压「交钥匙」工程）。服务化是锁定客户、构建「不可脱钩」依赖的关键。', accent: '#10b981' },
];

// 门类数据（示意值）
const sectors = {
  装备: { scale: '8.5 万亿', share: '约 35%', gvc: '中段统治 · 高端攀升', neck: '高端数控机床 / 工业母机系统 / 高端轴承', robot: 410, color: '#c41e3a',
    note: '工程机械、轨道交通、电力装备全球领先；高铁、盾构机、特高压输出「交钥匙」工程，但五轴联动机床、精密减速器仍依赖进口。' },
  电子: { scale: '14 万亿', share: '约 36%', gvc: '组装为王 · 芯片受制', neck: '先进制程芯片 / 高端光刻机 / EDA 工具', robot: 380, color: '#22d3ee',
    note: '消费电子组装全球枢纽，但价值链利润集中在上游芯片与设计；成熟制程已具规模优势，先进制程被卡。' },
  汽车: { scale: '11 万亿', share: '约 32%', gvc: '换道超车 · 新能源领先', neck: '高端车规芯片 / 部分基础软件', robot: 470, color: '#8b5cf6',
    note: '新能源汽车产销全球第一，电池/电机/电控全链自主，出口跃居世界第一；燃油车时代的发动机/变速箱差距被电动化抹平。' },
  船舶: { scale: '1.2 万亿', share: '约 50%', gvc: '规模第一 · 高端补强', neck: '高端船用主机 / LNG 围护系统', robot: 220, color: '#10b981',
    note: '造船三大指标（完工量/新接订单/手持订单）全球第一，LNG 船、大型邮轮等高附加值船型实现突破。' },
  家电: { scale: '1.8 万亿', share: '约 55%', gvc: '品牌出海 · 高端化', neck: '高端压缩机芯片 / 部分传感器', robot: 360, color: '#e8a317',
    note: '全产业链完整、成本与品牌双优，自主品牌（白电/黑电）全球市占率第一，正向高端智能家居生态跃迁。' },
  纺织: { scale: '3.2 万亿', share: '约 45%', gvc: '规模庞大 · 价值偏低', neck: '高端功能性纤维 / 部分染料助剂', robot: 95, color: '#fb923c',
    note: '全球最大纺织品出口国，化纤产能占全球七成；但深陷微笑曲线底部，向品牌设计与功能性新材料攀升空间巨大。' },
};
const sectorKeys = Object.keys(sectors);

function sectorScaleBar(active) {
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 40, top: 16, bottom: 24 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: SPLIT } }, axisLabel: { show: false } },
    yAxis: { type: 'category', data: sectorKeys, axisLine: { lineStyle: { color: AXIS } }, axisLabel: { color: TXT, fontSize: 11 } },
    series: [{
      type: 'bar', barWidth: 16,
      data: sectorKeys.map((k) => ({ value: sectors[k].robot, itemStyle: { color: k === active ? sectors[k].color : '#3a4660', borderRadius: [0, 4, 4, 0] } })),
      label: { show: true, position: 'right', color: TXT, fontSize: 10, formatter: '{c} 台/万人' },
    }],
  };
}

const upgradePath = [
  { t: '规模', en: 'SCALE', accent: '#c41e3a', d: '全工业门类覆盖（41 大类 / 207 中类 / 666 小类），增加值占全球约 30%。规模本身即国防级冗余——封锁面临横向替代。' },
  { t: '效率', en: 'EFFICIENCY', accent: '#e8a317', d: '工业机器人密度 392 台/万人、5G + 工业互联网 + 数字孪生，把成本与交期压到全球最优，巩固组装中段的物理护城河。' },
  { t: '自主', en: 'AUTONOMY', accent: '#22d3ee', d: '专精特新「小巨人」逐点替代卡脖子环节，关键零部件、工业软件、核心材料自给率持续爬升——价值链左端攻坚。' },
  { t: '品牌', en: 'BRAND', accent: '#10b981', d: '新能源/家电/电子自主品牌全球化，从代工走向标准制定与服务输出——价值链右端跃迁，锁定「不可脱钩」依赖。' },
];

export default function Page() {
  const [stage, setStage] = useState(2); // 默认高亮「组装/制造」（当前统治位）
  const [sector, setSector] = useState('汽车');
  const sd = sectors[sector];

  return (
    <div>
      <PageHeader badge="Manufacturing · New Quality Productive Forces" title="制造业规模 · 全球价值链位势" subtitle="GVC 微笑曲线 · 增加值全球份额 · 门类位势 —— 从世界工厂到制造强国的「非对称相互依赖」" />
      <IntroCard>中国制造业增加值占全球约 30%、连续 14 年居全球第一，且拥有联合国产业分类中全部工业门类。其转型主线是沿微笑曲线的纵向迁徙：组装中段已达绝对统治，真正的变量在于研发设计（左端）与品牌服务（右端）的爬升速度能否跑赢外部脱钩的速度。</IntroCard>
      <Grid cols={4} className="mb-6">
        <Stat value="~30%" label="制造业增加值全球份额（连续 14 年第一）" accent="#e8a317" />
        <Stat value="+10.2%" label="高技术制造业增速 · 引领结构化升级" accent="#c41e3a" />
        <Stat value="12,000+" label="专精特新「小巨人」· 产业链关键节点掌控者" accent="#22d3ee" />
        <Stat value="392 台" label="工业机器人密度（每万名工人 · 全球领先）" accent="#10b981" />
      </Grid>

      {/* 关键指标卡 */}
      <Grid cols={4} className="mb-6">
        {[['增加值 / GDP', '约 27%', '制造业占国民经济比重 · 守住实体根基', '#c41e3a'],
          ['全球占比', '约 30%', '超美日德之和 · 连续 14 年第一', '#e8a317'],
          ['门类完整度', '100%', '全部 41 大类工业门类 · 唯一', '#22d3ee'],
          ['机器人密度', '392 台/万人', '超德日 · 自动化率全球领先', '#10b981']].map(([l, v, d, c]) => (
          <div key={l} className="os-card p-5" style={{ borderLeft: `3px solid ${c}` }}>
            <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>{l}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: c }}>{v}</div>
            <p className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{d}</p>
          </div>
        ))}
      </Grid>

      {/* GVC 微笑曲线交互 */}
      <Card title="01 · GVC 微笑曲线：价值链位势与「向两端攀升」" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>微笑曲线的两端（研发设计、品牌服务）附加值高，中段（组装制造）附加值最薄。中国当前形态是一条「倒微笑」——中段满格、两端塌陷。国家战略即是把曲线两端强行拉升，逼近发达经济体形态。点击环节查看说明。</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {smileStages.map((s, i) => {
            const on = i === stage;
            return (
              <button key={s} onClick={() => setStage(i)} className="text-xs font-semibold px-3 py-1.5 rounded transition-all" style={{
                background: on ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)',
                color: on ? '#fff' : 'var(--text-secondary)',
                border: on ? '1px solid #c41e3a' : '1px solid #27324a',
              }}>{s}</button>
            );
          })}
        </div>
        <Grid cols={2}>
          <EChart option={buildSmile(stage)} style={{ height: 300 }} />
          <div className="os-card p-5" style={{ borderLeft: `3px solid ${stageDetail[stage].accent}`, background: 'var(--bg-surface)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-base font-bold" style={{ color: stageDetail[stage].accent }}>{stageDetail[stage].k}</div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded" style={{ color: stageDetail[stage].accent, border: `1px solid ${stageDetail[stage].accent}` }}>{stageDetail[stage].pos}</span>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{stageDetail[stage].desc}</p>
            <div className="flex gap-4">
              <div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>当前附加值率</div><div className="text-lg font-bold" style={{ color: '#c41e3a' }}>{smileChinaNow[stage]}</div></div>
              <div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>攀升目标</div><div className="text-lg font-bold" style={{ color: '#22d3ee' }}>{smileTarget[stage]}</div></div>
              <div><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>发达经济体</div><div className="text-lg font-bold" style={{ color: '#5b6a82' }}>{smileGlobalLeader[stage]}</div></div>
            </div>
          </div>
        </Grid>
      </Card>

      {/* 门类选择器 */}
      <Card title="02 · 门类位势透视：规模 · 全球份额 · 卡脖子点" className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {sectorKeys.map((k) => {
            const on = k === sector;
            return (
              <button key={k} onClick={() => setSector(k)} className="text-xs font-semibold px-4 py-1.5 rounded transition-all" style={{
                background: on ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)',
                color: on ? '#fff' : 'var(--text-secondary)',
                border: on ? '1px solid #c41e3a' : '1px solid #27324a',
              }}>{k}</button>
            );
          })}
        </div>
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>各门类机器人密度对比（台 / 万人 · 示意）</div>
            <EChart option={sectorScaleBar(sector)} style={{ height: 240 }} />
          </div>
          <div className="os-card p-5" style={{ borderLeft: `3px solid ${sd.color}`, background: 'var(--bg-surface)' }}>
            <div className="text-base font-bold mb-3" style={{ color: sd.color }}>{sector}制造</div>
            <Grid cols={2}>
              <div className="mb-2"><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>规模量级</div><div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{sd.scale}</div></div>
              <div className="mb-2"><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>全球份额</div><div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{sd.share}</div></div>
            </Grid>
            <div className="mb-3"><div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>GVC 位势</div><div className="text-sm font-semibold" style={{ color: sd.color }}>{sd.gvc}</div></div>
            <div className="mb-3"><div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>卡脖子点（示意）</div><div className="text-xs font-semibold" style={{ color: '#fb923c' }}>{sd.neck}</div></div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sd.note}</p>
          </div>
        </Grid>
      </Card>

      {/* 规模趋势 + 门类规模对比 */}
      <Grid cols={2} className="mb-6">
        <Card title="03 · 增加值规模 / 全球占比趋势（2004 → 2024）">
          <EChart option={shareTrend} style={{ height: 260 }} />
          <p className="text-[11px] italic mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>分析：二十年间增加值由 0.8 升至 4.7 万亿美元，全球占比由 9% 跃至约 30%。规模统治力已成事实，曲线进入「占比饱和、向价值链两端要利润」的新阶段。</p>
        </Card>
        <Card title="04 · 全球制造业规模对比（模拟产值量级）">
          <EChart option={scaleBar} style={{ height: 240 }} />
          <div className="text-xs italic mt-3" style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10, color: 'var(--text-tertiary)' }}>"The only country with 41 industrial categories, 207 sub-categories, and 666 subclasses." —— 全产业链覆盖即国家安全的物理底牌。</div>
        </Card>
      </Grid>

      {/* 升级路径框架 */}
      <Card title="05 · 「世界工厂 → 制造强国」升级路径" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>四级跃迁的同步推进：规模筑底 → 效率压成本 → 自主补短板 → 品牌占两端。前两级已完成，后两级是当前主战场，也是与外部脱钩赛跑的核心变量。</p>
        <Grid cols={4}>
          {upgradePath.map((s, i) => (
            <div key={s.t} className="os-card p-5" style={{ borderTop: `3px solid ${s.accent}` }}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold" style={{ color: s.accent }}>{i + 1}</span>
                <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{s.t}</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: s.accent }}>{s.en}</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="06 · 价值链微笑曲线重塑（2015 → 2024）">
          <EChart option={valueChainRadar} style={{ height: 240 }} />
          <p className="text-[11px] italic mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>分析：中国正通过「品牌出海」与「标准制定」，强行将利润中心从中段生产向两端（研发、服务）拉升。精密制造已近满格（98），原始研发与品牌影响力由 30/20 升至 75/65。</p>
        </Card>
        <Card title="07 · 隐形冠军：解决「卡脖子」的蜂群">
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>专精特新企业行业分布</div>
          <EChart option={giantsPie} style={{ height: 200 }} />
          <Grid cols={2}>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-sm font-bold" style={{ color: '#e8a317' }}>90%+</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>关键零部件进口替代预期</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-sm font-bold" style={{ color: '#e8a317' }}>3,500+</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>主导产品全球份额第一</p></div>
          </Grid>
        </Card>
      </Grid>

      <Card title="08 · 供应链主权：构建「非对称相互依赖」" className="mb-6">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>中国不仅在补齐短板，更在强化长板。通过在新能源产业链、成熟制程芯片应用、以及高铁/盾构机等领域的绝对优势，构建一套「让外部无法脱钩」的物理阻尼。在现实主义博弈中，这种「不可替代性」是比关税更强大的谈判筹码。</p>
        <div className="flex flex-wrap gap-2">
          {['Digital Supply Chain Twins', 'Industrial Internet Synergy', 'Sovereign Manufacturing Bases'].map((t) => (
            <span key={t} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded" style={{ color: 'var(--text-tertiary)', border: '1px solid #27324a' }}>{t}</span>
          ))}
        </div>
      </Card>

      <Card title="升级路径与制度逻辑" className="mb-6">
        <Grid cols={3}>
          {[['1 · 规模即安全', '全产业链覆盖（41 大类 / 207 中类 / 666 小类）使技术封锁面临横向替代与逆向工程的双重消解，规模本身构成国防级冗余。'],
            ['2 · 位势即利润', '微笑曲线两端化：从代工中段向原始研发与全球化服务迁徙，高技术制造业 +10.2% 增速是位势上移的结构信号。'],
            ['3 · 节点即筹码', '12,000+ 小巨人占据产业链关键节点，与新能源/高铁等长板共同形成「非对称相互依赖」的谈判结构。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
<Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>End of Segment: Industrial Backbone Architecture —— CAPACITY: OPTIMIZED · VALUE_CHAIN: ASCENDING · STATUS: RESILIENT。规模统治力已成事实，真正的变量在于价值链两端（原始研发与品牌服务）的爬升速度能否跑赢外部脱钩的速度。</p></Card>
<FrameworkTrio cards={[
        { key: 'salt', body: '微笑曲线：从代工中段向研发/品牌攀升。' },
        { key: 'stone', body: '专精特新蜂群：卡脖子节点进口替代。' },
        { key: 'path', body: '非对称相互依赖：长板锁定谈判筹码。' },
      ]} />
<ModuleFooter moduleId="manufacturing" sourceNote="由 china.html「制造业」专题迁移" />
    </div>
  );
}
