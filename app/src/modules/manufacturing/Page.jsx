import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const scaleBar = {
  tooltip: { trigger: 'axis' },
  grid: { left: 48, right: 40, top: 16, bottom: 24 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { show: false } },
  yAxis: { type: 'category', data: ['德国', '日本', '美国', '中国'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  series: [{ type: 'bar', data: [800, 1000, 2500, 4500], barWidth: 18, itemStyle: { color: (p) => (p.dataIndex === 3 ? '#c41e3a' : '#64748b'), borderRadius: [0, 4, 4, 0] }, label: { show: true, position: 'right', color: '#93a1b5', fontSize: 10 } }],
};
const valueChainRadar = {
  radar: { indicator: [{ name: '原始研发', max: 100 }, { name: '高价值设计', max: 100 }, { name: '精密制造', max: 100 }, { name: '品牌影响力', max: 100 }, { name: '全球化服务', max: 100 }], axisName: { color: '#93a1b5', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [30, 40, 95, 20, 25], name: '2015 状态', lineStyle: { color: '#64748b' }, itemStyle: { color: '#64748b' } },
    { value: [75, 82, 98, 65, 78], name: '2024 现状', lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
  ] }],
};
const giantsPie = {
  tooltip: { trigger: 'item' },
  series: [{ type: 'pie', radius: ['40%', '70%'], itemStyle: { borderRadius: 2, borderColor: 'transparent', borderWidth: 2 }, label: { show: true, fontSize: 10, color: '#93a1b5' }, data: [
    { value: 35, name: '高端装备', itemStyle: { color: '#c41e3a' } },
    { value: 25, name: '新一代信息技术', itemStyle: { color: '#22d3ee' } },
    { value: 15, name: '新材料', itemStyle: { color: '#e8a317' } },
    { value: 12, name: '生物医药', itemStyle: { color: '#10b981' } },
    { value: 13, name: '新能源汽车', itemStyle: { color: '#4f46e5' } },
  ] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Manufacturing · New Quality Productive Forces" title="制造业规模 · 全球价值链位势" subtitle="PMI · 增加值全球份额 · 产业升级 —— 从规模基座到供应链主权的「非对称相互依赖」" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>中国制造业增加值占全球约 30%、连续 14 年居全球第一，且拥有联合国产业分类中全部工业门类。其转型主线是四层位势的同步推进：全球份额统治力 → 价值链纵向迁徙 → 专精特新「小巨人」蜂群 → 供应链主权防御。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="~30%" label="制造业增加值全球份额（连续 14 年第一）" accent="#e8a317" />
        <Stat value="+10.2%" label="高技术制造业增速 · 引领结构化升级" accent="#c41e3a" />
        <Stat value="12,000+" label="专精特新「小巨人」· 产业链关键节点掌控者" accent="#22d3ee" />
        <Stat value="392 台" label="工业机器人密度（每万名工人 · 全球领先）" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="01 · 规模基座：全工业门类的物理冗余">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>中国拥有联合国产业分类中全部的工业门类。在现实主义视角下，这种「全产业链覆盖」不仅是经济规模，更是国家安全的物理底牌——面临单一技术封锁时，系统具备极强的「横向替代」与「逆向工程」能力。</p>
          <div className="text-xs italic mb-3" style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10, color: 'var(--text-tertiary)' }}>"The only country with 41 industrial categories, 207 sub-categories, and 666 subclasses."</div>
          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>全球制造业规模对比（模拟产值量级）</div>
          <EChart option={scaleBar} style={{ height: 240 }} />
        </Card>
        <Card title="02 · 价值链微笑曲线重塑（2015 → 2024）">
          <EChart option={valueChainRadar} style={{ height: 240 }} />
          <p className="text-[11px] italic mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>分析：中国正通过「品牌出海」与「标准制定」，强行将利润中心从中段生产向两端（研发、服务）拉升。精密制造已近满格（98），原始研发与品牌影响力由 30/20 升至 75/65。</p>
        </Card>
      </Grid>

      <Card title="03 · 隐形冠军：解决「卡脖子」的蜂群" className="mb-6">
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>专精特新企业行业分布</div>
            <EChart option={giantsPie} style={{ height: 240 }} />
          </div>
          <div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>中国制造业的突围不仅依靠航母级企业（SOE），更依赖于上万家专注细分领域的「小巨人」。它们在工业母机、精密仪器、关键材料等节点上实现了极高的自给率，这种「分布式防御」架构极大提升了产业链的整体抗打击能级。</p>
            <Grid cols={2}>
              <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-sm font-bold" style={{ color: '#e8a317' }}>90%+</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>关键零部件实现进口替代预期</p></div>
              <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-sm font-bold" style={{ color: '#e8a317' }}>3,500+</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>主导产品全球份额第一</p></div>
            </Grid>
          </div>
        </Grid>
      </Card>

      <Card title="04 · 供应链主权：构建「非对称相互依赖」" className="mb-6">
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
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，仅供结构性参考 · 由 china.html「制造业」专题迁移</p>
    </div>
  );
}
