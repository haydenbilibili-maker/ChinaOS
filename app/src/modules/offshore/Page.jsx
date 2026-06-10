import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// 主权—市场接口雷达：法治 / 资本 / 信息 / 人才 / 国安适配（源自 china.html offshore 专题）
const sovereigntyRadar = {
  radar: {
    indicator: [
      { name: '法治可预期', max: 100 }, { name: '资本流动', max: 100 }, { name: '信息枢纽', max: 100 },
      { name: '人才密度', max: 100 }, { name: '国家安全适配', max: 100 },
    ],
    axisName: { color: '#93a1b5', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
    splitArea: { show: false },
  },
  series: [{ type: 'radar', data: [{ value: [88, 92, 90, 85, 78], name: 'HK 窗口', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.15)' } }] }],
};

// 制度张力与消解路径：国安法后再平衡四个维度的「消解进度」（示意）
const dissolutionBar = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['国安法', '选举改革', '经济融合', '国际叙事'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  series: [{ type: 'bar', data: [72, 68, 85, 55], barWidth: 28, itemStyle: { color: '#c41e3a', borderRadius: 4 }, label: { show: true, position: 'top', color: '#93a1b5' } }],
};

// 离岸窗口效用结构（源为 Chart.js doughnut，迁移为 ECharts 环形图）
const utilityPie = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  series: [{
    type: 'pie', radius: ['52%', '74%'], center: ['50%', '44%'], label: { show: false },
    data: [
      { value: 38, name: '投融资通道', itemStyle: { color: '#c41e3a' } },
      { value: 22, name: '风险管理', itemStyle: { color: '#22d3ee' } },
      { value: 25, name: '专业服务', itemStyle: { color: '#e8a317' } },
      { value: 15, name: '人才与信息', itemStyle: { color: '#10b981' } },
    ],
  }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="HK-Macao Offshore · 一国两制" title="普通法窗口 · 离岸人民币" subtitle="香港金融枢纽 · 离岸 RMB · 制度再平衡 · 大湾区 —— 主权与市场的接口工程" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>香港是中国主权之内、普通法体系之上的资本自由港：既是全球最大离岸人民币业务枢纽，也是内地企业投融资与风险管理的「超级联系人」。国家安全立法之后，这一窗口的效用并未关闭，而是进入「安全底座 + 市场开放」的再平衡阶段——其长期价值取决于法治可预期性与资本自由流动能否同时维持。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="≈1 万亿元" label="香港离岸 RMB 存款规模" accent="#c41e3a" />
        <Stat value="≈75%" label="全球离岸 RMB 结算经香港" accent="#22d3ee" />
        <Stat value="14 万亿+" label="大湾区 GDP（元 · 约全国 1/9）" accent="#e8a317" />
        <Stat value="78/100" label="国家安全适配度（雷达 · 示意）" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="主权—市场接口雷达（示意）"><EChart option={sovereigntyRadar} style={{ height: 260 }} /></Card>
        <Card title="制度张力与消解路径（示意）"><EChart option={dissolutionBar} style={{ height: 260 }} /></Card>
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="离岸窗口效用结构（示意）"><EChart option={utilityPie} style={{ height: 260 }} /></Card>
        <Card title="离岸人民币：在岸之外的「试验田」">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>CNH 市场让人民币在资本项目未完全开放的前提下实现「有限国际化」：点心债、互换通、跨境理财通等机制在香港先行先试，价格信号反向校准在岸改革。</p>
          <div className="space-y-2">
            {[['#c41e3a', '互联互通机制', '沪深港通、债券通、互换通构成在岸—离岸的受控双向管道，额度与品种逐步扩容。'],
              ['#22d3ee', 'CNH 定价功能', '离岸汇率与利率反映真实市场预期，是观察资本流动压力的高频窗口。']].map(([c, t, d]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="窗口的四重制度功能" className="mb-6">
        <Grid cols={4}>
          {[['普通法窗口', '#c41e3a', '香港保留普通法体系与独立终审权，合同执行与司法可预期性是国际资本停留的底层前提，也是与内地法域最大的制度差。'],
            ['超级联系人', '#22d3ee', '内地企业出海的投融资通道、IPO 首选地与离岸架构枢纽；同时把国际规则、人才与信息反向输入内地。'],
            ['风险防火墙', '#e8a317', '联系汇率与独立关税区使香港成为内地金融风险的缓冲层——制裁、汇率与资本管制冲击先在离岸消化。'],
            ['大湾区接口', '#10b981', '与深圳、广州构成「研发—制造—融资」闭环；横琴、前海、河套等合作区是制度对接的物理试验场。']].map(([t, c, d]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="国安法后的再平衡">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>2020 年国安法与 2021 年选举制度改革重置了政治框架；经济融合（85）推进最快，国际叙事修复（55）仍是短板。北京的目标不是关闭窗口，而是确保窗口「可控地开着」。</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>关键观察指标：资金净流入方向、国际法律与专业服务机构留驻情况、外籍法官与仲裁业务的延续性。</p>
        </Card>
        <Card title="澳门：另一种离岸样本">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>澳门以博彩税收支撑高福利财政，正在「经济适度多元化」框架下向中医药、现代金融与会展转型；横琴粤澳深度合作区是其腹地化的制度载体。</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>与香港不同，澳门的离岸功能更多体现为葡语国家经贸平台与人民币清算的补充节点。</p>
        </Card>
      </Grid>

      <Card title="系统观察" className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>离岸窗口的价值恰恰在于「不同」：一旦香港在法治、信息与资本流动上与内地完全同构，窗口即失去存在意义。再平衡的真正考题，是在国家安全的刚性约束下，为制度差保留足够的弹性空间——这是一项需要持续校准的接口工程，而非一次性的政治结算。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>本页为分析框架示意，不构成政策或法律判断；图表数据为公开信息整理与演示值 · 由 china.html「港澳离岸」专题迁移</p>
    </div>
  );
}
