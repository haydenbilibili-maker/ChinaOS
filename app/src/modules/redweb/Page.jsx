import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// 红色资本离岸资产类型（聚合估算 · 示意，不指向具体个人）
const assetChart = {
  grid: { left: 90, right: 24, top: 16, bottom: 24 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['离岸信托', '不动产包', '代持/壳公司', '私募股权 PE'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [56, 142, 210, 89], barWidth: 14, itemStyle: { color: '#c41e3a', borderRadius: 3 }, label: { show: true, position: 'right', color: '#93a1b5' } }],
};

const TRANSFER = [
  ['1. 权力变现', '利用批文、土地审批或牌照获取初始资本。'],
  ['2. 白手套代持', '资金进入特定民营企业或代理人名下，切断直接法律联系。'],
  ['3. 离岸架构', '在 BVI/开曼设壳公司，经 VIE 架构反向控制境内资产。'],
  ['4. 终端清洗', '购买海外不动产、艺术品或设立家族信托。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Red Net · 结构分析" title="红网 · 权贵网络的结构逻辑" subtitle="宗族联邦 · 代际转移 · 白手套机制 · 军工复合体 —— 作为结构现象的分析框架" />

      <Card title="分析框架 · 「宗族联邦」假说" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          本模块从政治经济学视角，把「权贵网络」作为一种<strong style={{ color: 'var(--text-primary)' }}>结构现象</strong>来分析：在「党指挥枪」的制度表象之下，存在由血缘、联姻与利益交换编织的精英闭环。反腐运动对「山头主义」形成持续清洗，但权力—资本的耦合通过「白手套」与离岸架构得以延续。
          <span style={{ color: 'var(--text-tertiary)' }}> 本页仅作机制层面的结构分析，不构建针对具体个人/家族的指认或财富指认。</span>
        </p>
      </Card>

      <Grid cols={3} className="mb-6">
        <Stat value="结构现象" label="分析对象" accent="#c41e3a" />
        <Stat value="金融·能源·军工" label="耦合密集领域" />
        <Stat value="政治 × 资本 × 联姻" label="数据维度" accent="#22d3ee" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="代际权力转移状态（模型 · 示意）">
          {[['红二代（掌权中）', 45, '#c41e3a'], ['红三代（接班/商业化）', 35, '#e8a317'], ['边缘化/被清洗', 20, '#64748b']].map(([t, v, c]) => (
            <div key={t} className="mb-3">
              <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>{t}</span><span className="mono" style={{ color: 'var(--text-primary)' }}>{v}%</span></div>
              <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3 }}><div style={{ width: `${v}%`, height: '100%', background: c, borderRadius: 3 }} /></div>
            </div>
          ))}
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>红三代更多转向私募股权(PE)与离岸资本运作，形成「一家两制」（父辈从政、子辈经商）模式。</p>
        </Card>
        <Card title="离岸资产类型分布（聚合估算 · 示意）">
          <EChart option={assetChart} style={{ height: 220 }} />
        </Card>
      </Grid>

      <Card title="利益联结机制 · 政治内婚（Political Endogamy）" className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          联姻被用于巩固政治保护伞与商业利益，形成封闭的精英闭环。「白手套」现象普遍：核心成员往往不直接持股，而通过几层离岸结构由代理人代持——这是权力与资本相互置换的一般机制。
        </p>
      </Card>

      <Card title="资本运作路径 · 一般机制" className="mb-6">
        <Grid cols={4}>
          {TRANSFER.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 12 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="军工复合体 · 「枪杆子」的结构封闭性">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          军工复合体是权贵网络中最核心、最封闭的利益堡垒。历史上大型军贸企业的核心管理层一度由「军二代」群体把持，凭父辈在军队中的威望影响武器进出口审批。当前军队改革不仅是架构调整，更是对「山头主义」的清洗——<strong style={{ color: 'var(--text-primary)' }}>郭伯雄、徐才厚等已被依法查处的公开案件</strong>标志着军权的重新集中。
        </p>
        <div className="p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
          <span className="text-xs font-bold" style={{ color: 'var(--china-red)' }}>核心观察</span>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>多数「军二代」已退出军队实权岗位，影响力更多转化为军工企业的商业咨询或隐形顾问角色。</p>
        </div>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        本模块为结构层面的政治经济学分析（OSINT），数值为模型示意，不构成对具体个人的事实指认或投资/决策依据 · 框架迁自 china.html「红网」专题（原页含个案数据，迁移时按公开个案与聚合口径处理）
      </p>
    </div>
  );
}
