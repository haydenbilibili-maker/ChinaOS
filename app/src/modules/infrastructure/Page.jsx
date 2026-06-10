import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const railRadar = {
  radar: {
    indicator: [
      { name: '通达度', max: 100 },
      { name: '平均速度', max: 100 },
      { name: '调度智能化', max: 100 },
      { name: '成本控制', max: 100 },
      { name: '安全冗余', max: 100 },
    ],
    axisName: { color: '#93a1b5', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
    splitArea: { show: false },
    axisLine: { lineStyle: { color: '#27324a' } },
  },
  series: [{
    type: 'radar',
    data: [{ value: [98, 95, 92, 88, 96], name: '中国高铁系统 (2024)', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.2)' } }],
  }],
};

const hubBar = {
  grid: { left: 40, right: 16, top: 20, bottom: 28 },
  xAxis: { type: 'category', data: ['洋山港', '宁波舟山', '新加坡', '鹿特丹'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 11 } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  series: [{
    type: 'bar',
    barWidth: 26,
    data: [
      { value: 95, itemStyle: { color: '#c41e3a' } },
      { value: 92, itemStyle: { color: '#c41e3a' } },
      { value: 88, itemStyle: { color: '#475569' } },
      { value: 82, itemStyle: { color: '#475569' } },
    ],
    itemStyle: { borderRadius: 3 },
    label: { show: true, position: 'top', color: '#93a1b5', fontSize: 10 },
  }],
};

const lowAltTreemap = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'treemap',
    top: 8, left: 0, right: 0, bottom: 8,
    breadcrumb: { show: false },
    roam: false,
    nodeClick: false,
    data: [
      { name: '物流配送', value: 40, itemStyle: { color: '#c41e3a' } },
      { name: '个人出行(eVTOL)', value: 25, itemStyle: { color: '#22d3ee' } },
      { name: '应急救援', value: 15, itemStyle: { color: '#e8a317' } },
      { name: '农林植保', value: 12, itemStyle: { color: '#10b981' } },
      { name: '空域管理软件', value: 8, itemStyle: { color: '#475569' } },
    ],
    label: { show: true, formatter: '{b}\n{c}%', fontSize: 11, color: '#f8fafc' },
  }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Infrastructure · 现代化基建" title="新老基建 · 投资与回报" subtitle="专项债 · 逆周期 · 回报机制 —— 轨道上的中国、智慧枢纽与低空经济的全域流转网络" />

      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>现实主义逻辑下，基建不只是交通工具，更是中枢对国土空间实施「物理级对齐」的工具——「Infrastructure as the hard operating system of a continental economy」。从「八纵八横」高铁网到自动化码头与低空数字航路，投资的回报机制正从直接收费转向时空压缩带来的交易成本下降与超大规模市场的「高粘性流转」。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="4.5 万km" label="高铁运营里程 · 全球占比超 70%" accent="#e8a317" />
        <Stat value="5,000 亿" label="低空经济产值规模（2023）· 向万亿级迈进" accent="#c41e3a" />
        <Stat value="18 个" label="自动化码头 · 全球第一规模集群" accent="#22d3ee" />
        <Stat value="14.4%" label="物流成本占 GDP 比重 · 2035 目标 10%" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="01 轨道重构 · 大一统物理学的时空压缩">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>通过「八纵八横」主通道建设，中国实现了从「省域经济」向「城市群一体化」的逻辑跨越。时空的压缩降低了行政与经济的交易成本，确立了超大规模市场在物理层面的「高粘性流转」。</p>
          <EChart option={railRadar} style={{ height: 230 }} />
        </Card>
        <Card title="02 全球枢纽效能对比（效率综合指数）">
          <EChart option={hubBar} style={{ height: 200 }} />
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-tertiary)' }}>洋山四期自动化率</span><span className="font-bold mono" style={{ color: '#10b981' }}>100.0%</span></div>
            <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-tertiary)' }}>中欧班列年开行量</span><span className="font-bold mono" style={{ color: '#e8a317' }}>1.7 万列</span></div>
          </div>
          <p className="text-[11px] mt-3 italic" style={{ color: 'var(--text-tertiary)' }}>智慧港口与铁海联运正成为中国掌控全球价值链流向的物理关口。</p>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="03 低空经济应用场景与市场潜力矩阵"><EChart option={lowAltTreemap} style={{ height: 280 }} /></Card>
        <Card title="低空经济 · 万亿级「向上」空间">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>低空经济（3000 米以下）被定义为新质生产力的重要支柱。中国在 eVTOL（电动垂直起降飞行器）与工业无人机领域已占据先发优势——谁定义了低空空域的规则与航路，谁就掌握了未来的三维交通主权。通过「数字航路」建设，中国正尝试在城市上空构建一套平行的无人化高效物流网。</p>
          <Grid cols={2}>
            <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
              <div className="text-base font-bold mono" style={{ color: '#e8a317' }}>EH216-S</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>全球首张无人驾驶适航证</div>
            </div>
            <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
              <div className="text-base font-bold mono" style={{ color: '#e8a317' }}>200 万+</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>全国无人机持有量</div>
            </div>
          </Grid>
        </Card>
      </Grid>

      <Card title="投资与回报的制度逻辑" className="mb-6">
        <Grid cols={3}>
          {[['专项债 · 项目收益自平衡', '新基建以专项债与政策性金融为主渠道，要求项目现金流覆盖本息；回报从「土地溢价」转向「运营收益 + 网络外部性」。'],
            ['逆周期 · 托底与挤出之辩', '基建投资是逆周期工具箱的核心抓手；边际回报递减下，重心从「铁公基」增量转向存量提效与数字化改造。'],
            ['回报机制 · 时空压缩红利', '高铁与枢纽的真实回报体现在交易成本下降、要素流转加速与城市群一体化，难以被单一项目报表完全捕捉。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="04 调研结论 · 构建全域流转体系" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>现代化基建不仅是钢筋水泥的堆砌，它是国家权力的物理延伸。随着低空空域的开放与数字化，中国正构建一个涵盖「地、海、空、天」的全域流转网络。这一网络的最终目的是实现生产要素的「零摩擦移动」，为超大规模文明体提供支撑其长周期运行的物理底座。</p>
        <div className="flex flex-wrap gap-4 text-[10px] mono uppercase" style={{ color: 'var(--text-tertiary)' }}>
          <span>// INFRA_NETWORK: CONNECTED</span>
          <span>// LOW_ALTITUDE_AIRSPACE: REFORMING</span>
          <span>// STATUS: OPTIMIZING</span>
        </div>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>「基建是秩序的物理容器，速度是国力的量化指标」 · 数据来源：公开基建与低空经济研报，部分为示意值 · 由 china.html「基建」专题迁移</p>
    </div>
  );
}
