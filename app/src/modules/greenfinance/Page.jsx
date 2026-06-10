import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const AXIS = { lineStyle: { color: '#27324a' } };
const SPLIT = { lineStyle: { color: 'rgba(148,163,184,0.1)' } };

const growthTrend = {
  legend: { data: ['绿色贷款余额', '绿色债券存量'], textStyle: { color: '#93a1b5', fontSize: 11 }, top: 0 },
  grid: { left: 44, right: 16, top: 32, bottom: 24 },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024(E)'], axisLine: AXIS },
  yAxis: { type: 'value', name: '万亿', nameTextStyle: { color: '#93a1b5' }, splitLine: SPLIT },
  series: [
    { name: '绿色贷款余额', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [10.2, 12.0, 15.9, 22.0, 30.1, 35.5], lineStyle: { color: '#10b981', width: 3 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.15)' } },
    { name: '绿色债券存量', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [1.1, 1.4, 1.8, 2.8, 3.5, 4.2], lineStyle: { color: '#e8a317', width: 2, type: 'dashed' }, itemStyle: { color: '#e8a317' } },
  ],
};
const carbonSector = {
  legend: { data: ['配额缺口压力 (%)', '履约完成度指数'], textStyle: { color: '#93a1b5', fontSize: 11 }, bottom: 0 },
  grid: { left: 100, right: 24, top: 12, bottom: 32 },
  xAxis: { type: 'value', splitLine: SPLIT },
  yAxis: { type: 'category', data: ['航空/航运', '造纸', '有色/化工', '水泥/建材 (扩围)', '钢铁 (扩围)', '电力 (配额)'], axisLine: AXIS },
  series: [
    { name: '配额缺口压力 (%)', type: 'bar', data: [5, 8, 10, 12, 15, 45], barWidth: 10, itemStyle: { color: '#10b981', borderRadius: 3 } },
    { name: '履约完成度指数', type: 'bar', data: [55, 65, 70, 78, 92, 85], barWidth: 10, itemStyle: { color: '#22d3ee', borderRadius: 3 } },
  ],
};
const esgDonut = {
  legend: { orient: 'vertical', right: 8, top: 'center', textStyle: { color: '#93a1b5', fontSize: 11 } },
  series: [{
    type: 'pie', radius: ['58%', '78%'], center: ['38%', '50%'],
    label: { show: false },
    data: [
      { value: 15, name: 'A 级 (领先)', itemStyle: { color: '#10b981' } },
      { value: 30, name: 'B 级 (中等)', itemStyle: { color: '#22d3ee' } },
      { value: 35, name: 'C 级 (滞后)', itemStyle: { color: '#e8a317' } },
      { value: 10, name: 'D 级 (高风险)', itemStyle: { color: '#c41e3a' } },
      { value: 10, name: '未覆盖', itemStyle: { color: 'rgba(148,163,184,0.25)' } },
    ],
  }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Green Finance · Capital for Sustainability" title="绿色信贷债券 · 转型金融" subtitle="碳定价 · ESG · 绿债市场 · 碳金融工具" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>把环境外部性「定价」写进资产负债表：绿色贷款、绿色债券与转型金融工具并行，目标是在「双碳」约束下降低高碳资产的再融资成本，并把能效、碳强度纳入授信与评级。绿色金融是宏观审慎与产业政策的交叉接口。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="~34 万亿" label="本外币绿色贷款余额 (RMB)" accent="#10b981" />
        <Stat value="40%+" label="绿债投向清洁交通/能源" accent="#22d3ee" />
        <Stat value="#1" label="全球绿债发行体量（示意）" accent="#e8a317" />
        <Stat value="8.5 亿吨" label="全国碳市场年覆盖排放（量级）" accent="#c41e3a" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="绿色融资余额趋势（万亿 · 示意）"><EChart option={growthTrend} style={{ height: 250 }} /></Card>
        <Card title="分行业配额压力与履约进度（示意）"><EChart option={carbonSector} style={{ height: 250 }} /></Card>
      </Grid>

      <Card title="全国碳市场与 MRV" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>配额（CEA）清缴、CCER 重启与数据质量（MRV）共同决定碳价发现效率；电力行业先行，钢铁、水泥等扩围抬高合规成本曲线。</p>
        <Grid cols={3}>
          {[['配 · 碳排放配额 (Allowances)', '年度基准线法分配 + 有偿拍卖试点；清缴周期末价格波动放大，与煤电边际成本联动。电力覆盖 99%+，扩围至工业。', '#10b981'],
            ['证 · CCER 国家核证自愿减排', '重启后聚焦林业、可再生能源等方法学；抵消比例受限（上限约 5%），避免「低价冲抵」稀释减排严肃性。', '#e8a317'],
            ['测 · 监测报告核查 MRV', '在线监测（CEMS）+ 台账 + 第三方核查；数据造假入刑与配额罚没抬高违法成本，执法主体为生态环境部。', '#22d3ee']].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="A 股上市公司 ESG 评级分布（% · 示意）"><EChart option={esgDonut} style={{ height: 250 }} /></Card>
        <Card title="ESG 披露 · 从自愿到半强制">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>上市公司可持续发展报告指引与央企控股公司 ESG 专项报告并行，推动环境指标可比；银行间市场绿色债券募集资金用途披露亦趋严。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>E · 环境维度</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>范围一/二碳排放、能耗强度、污染物排放与环保处罚纳入重点。</p></div>
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>S/G · 社会与治理</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>供应链劳工、社区关系与董事会气候监督职责逐步写入模板。</p></div>
          </div>
        </Card>
      </Grid>

      <Card title="国际可持续分类法 · 对接与话语权" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>中欧《共同分类目录》(Common Ground Taxonomy) 等技术对话降低跨境绿债认证摩擦；同时推动人民币绿色资产被纳入离岸指数。</p>
        <Grid cols={2}>
          <div className="os-card p-4 text-center"><div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>目录重合度</div><div className="text-lg font-bold mono" style={{ color: 'var(--text-primary)' }}>议题级 80%+</div></div>
          <div className="os-card p-4 text-center"><div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>离岸认受</div><div className="text-lg font-bold mono" style={{ color: 'var(--text-primary)' }}>指数纳入推进</div></div>
        </Grid>
      </Card>

      <Card title="调研要点" className="mb-6">
        <Grid cols={3}>
          {[['1 · 碳价与煤电成本', '配额收紧与 CCER 价格共同决定火电边际成本，沿电价链向工业与居民传导。'],
            ['2 · 转型金融标准', '从「纯绿」扩展到钢铁、建材、航运等「棕色」行业可信转型计划与 KPI；年度转型资金需求量级达千亿并逐年抬升（2025E 约 120 → 2035E 约 210，千亿示意）。'],
            ['3 · 碳边境调节 (CBAM)', '欧盟等规则外溢，推动出口部门加速产品碳足迹核算与绿电采购。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>绿色金融是宏观审慎与产业政策的交叉接口；判断其成色，需区分「漂绿」叙事与可审计现金流——标准、披露与 MRV 数据质量决定碳价信号能否真实传导。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为教学演示与示意值；政策与市场规模以央行、证监会、生态环境部最新发布为准 · 由 china.html「绿色金融」专题迁移</p>
    </div>
  );
}
