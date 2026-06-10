import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const tradeShare = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2021', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [43, 48, 53, 55], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } }],
};
const contribBar = {
  grid: { left: 90, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['企业数量', '城镇就业', '技术创新', 'GDP', '税收'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [90, 80, 70, 60, 50], barWidth: 15, itemStyle: { color: '#c41e3a', borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%+', color: '#93a1b5' } }],
};
const envRadar = {
  radar: { indicator: [{ name: '市场准入', max: 100 }, { name: '产权保护', max: 100 }, { name: '融资可得', max: 100 }, { name: '公平竞争', max: 100 }, { name: '政策稳定', max: 100 }, { name: '账款清欠', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [72, 78, 65, 70, 68, 60], name: '营商环境', lineStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.12)' } }] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Private Economy · 五六七八九" title="民营经济与市场主体贡献" subtitle="民营经济促进法 · 56789 · 产权保护 —— 从「两个毫不动摇」到「31 条」的预期管理" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>民营经济贡献了约五成税收、六成 GDP、七成技术创新、八成城镇就业、九成市场主体。其活力取决于稳定预期、公平准入与产权保护三项制度供给是否到位。</p></Card>
      <Grid cols={5} className="mb-6">
        <Stat value="50%+" label="税收贡献" accent="#c41e3a" />
        <Stat value="60%+" label="GDP 贡献" />
        <Stat value="70%+" label="技术创新" accent="#22d3ee" />
        <Stat value="80%+" label="城镇就业" accent="#e8a317" />
        <Stat value="90%+" label="市场主体" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="民企进出口占比走势（% · 示意）"><EChart option={tradeShare} style={{ height: 240 }} /></Card>
        <Card title="民营经济「56789」贡献（示意）"><EChart option={contribBar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="创新主力 · 从就业蓄水池到技术策源地" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>民营企业承担多数研发投入与专利产出，贡献约 90% 的高新技术企业数量，是专利申请与成果转化的主要来源。</p>
        <Grid cols={3}>
          {[['技术创新主体', '约 90% 高新技术企业为民营，研发效率与市场敏感度构成创新链关键环节。'],
            ['研发投入强度', '规模以上民营工业研发投入持续增长；但融资成本与回报周期制约中小企业长期投入。'],
            ['专精特新 · 小巨人', '以专精特新、「小巨人」与单项冠军构建分层培育，绝大多数入选企业为民营。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="营商环境多维度评估（2024 · 示意）"><EChart option={envRadar} style={{ height: 260 }} /></Card>
        <Card title="营商环境与信心修复">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>信心比黄金更重要。2024 年以来政策重心从单纯刺激转向稳定预期与公平竞争，通过立法保障产权、破除隐性壁垒，修复民营资本的长期投资意愿。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>民营经济促进法</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>以法律形式确立平等地位与产权保护，稳定长期制度预期。</p></div>
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>破除市场准入壁垒</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>落实负面清单与公平竞争审查，清理隐性门槛，向民营资本开放更多领域。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="制度逻辑与关键变量" className="mb-6">
        <Grid cols={3}>
          {[['1 · 从政策善意到法律确权', '「民营经济促进法」将平等保护与公平竞争由文件上升为法律义务，降低制度的不确定性与可逆性。'],
            ['2 · 预期重于刺激', '真正约束投资的是对产权与政策稳定性的信心，而非短期补贴；预期管理已成政策核心抓手。'],
            ['3 · 准入即活力', '破除隐性壁垒、落实公平竞争审查，决定民营资本能否进入高回报领域，是激活内生动力的关键。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>「五六七八九」描述的是贡献度，而非话语权；民营经济的真实地位，最终取决于法律执行与公平竞争能否从条文落到个案。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理与示意值，仅供结构性参考 · 由 tabs/private.html 迁移</p>
    </div>
  );
}
