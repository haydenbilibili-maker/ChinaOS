import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const grainLine = {
  grid: { left: 56, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2018', '2019', '2020', '2021', '2022', '2023'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', min: 12800, axisLabel: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [13158, 13277, 13390, 13657, 13731, 13908], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.12)' } }],
};
const techBar = {
  grid: { left: 80, right: 40, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, axisLabel: { color: '#93a1b5', formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['遥感监测', '冷链覆盖', '益农信息社', '宽带通达', '电商服务站'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  series: [{ type: 'bar', data: [38, 45, 60, 85, 92], barWidth: 14, itemStyle: { color: '#22d3ee', borderRadius: 3 }, label: { show: true, position: 'right', formatter: '{c}%', color: '#93a1b5' } }],
};
const incomeLine = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2014', '2016', '2018', '2020', '2022', '2023'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', min: 2.0, max: 2.9, axisLabel: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [2.75, 2.72, 2.69, 2.56, 2.45, 2.39], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } }],
};

const fiveLines = [
  ['粮 · 稳产保供', '主产区利益补偿与耕地占补平衡挂钩，抑制「非粮化」冲动。', '#产能红线'],
  ['肉 · 畜禽与饲料', '豆粕减量替代与规模化养殖环保约束抬高固定成本。', '#成本曲线'],
  ['果 · 特色经济作物', '地理标志与冷链决定溢价能否留在县域。', '#品牌与渠道'],
  ['工 · 农产品加工', '预制菜、中央厨房与县域产业园绑定用地与能耗指标。', '#增值留存'],
  ['游 · 乡村旅游', '与基础设施和数字支付渗透率强相关，防止低水平重复建设。', '#流量变现'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Rural · 粮食安全党政同责" title="乡村振兴 · 县域与土地制度" subtitle="粮食产能 · 县域产业 · 宅基地 · 城乡要素流动" />

      <Card className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          把饭碗端牢——产能与储备一起算。高标准农田、种业振兴与农业社会化服务并行，目标是在极端气候与地缘波动下维持口粮绝对安全；粮食安全实行党政同责，产能红线与生态红线（耕地、地下水）构成双重硬约束。
        </p>
      </Card>

      <Grid cols={4} className="mb-6">
        <Stat value="1.3 万亿斤+" label="粮食年产量量级" accent="#10b981" />
        <Stat value="10 亿亩" label="高标准农田累计（量级）" accent="#c41e3a" />
        <Stat value="2.39 : 1" label="城乡居民收入比（2023 示意）" accent="#e8a317" />
        <Stat value="45%" label="县域冷链覆盖推进度（示意）" accent="#22d3ee" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="粮食产量（万吨 · 示意）—— 连续十余年稳定在 1.3 万亿斤以上"><EChart option={grainLine} style={{ height: 240 }} /></Card>
        <Card title="城乡居民收入比走势（农村=1 · 全国示意）"><EChart option={incomeLine} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="产业振兴五条线 · 种养加销旅贯通" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>财政、金融与土地指标向县域特色产业倾斜，五条产业线各有约束与变现逻辑。</p>
        <Grid cols={5}>
          {fiveLines.map(([t, d, tag]) => (
            <div key={t} style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <div className="text-[10px] mt-2 font-bold" style={{ color: '#10b981' }}>{tag}</div>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="县域数字基建推进度（示意 %）"><EChart option={techBar} style={{ height: 240 }} /></Card>
        <Card title="数字乡村与冷链 · 最初一公里">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>行政村光纤与 4G 覆盖接近全面，电商进村缩短流通环节；短板在冷链「最初一公里」与农产品上行品控标准。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>通达率</div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>行政村宽带通达率政策目标 100%，实际运维与资费可及性仍分化。</p>
            </div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>冷链渗透率</div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>生鲜损耗率每降 1 个百分点，相当于变相增产；与电力与道路载荷绑定。</p>
            </div>
          </div>
        </Card>
      </Grid>

      <Card title="城乡收入比收敛 · 收入结构拆解" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>2023 年城乡居民人均可支配收入之比约 2.39（示意），工资性收入与转移支付贡献显著，财产性收入仍薄。</p>
        <Grid cols={3}>
          {[['工资与务工', '县域就业承载力与户籍制度改革共同决定农民工回流速度。'],
            ['转移与社保', '新农合、低保与农业补贴平滑波动，但长期要靠产业与资产收益。'],
            ['财产性收入', '集体经营性建设用地入市与宅基地改革试点，决定「财产性收入」的天花板。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="乡村振兴多维评估（2024 全国平均 · 示意）" className="mb-6">
        <Grid cols={3}>
          {[['粮食产能 82 / 特色产业 88', '产能与产业两端基础最好，是政策资源长期倾斜的结果。'],
            ['基础设施 70 / 治理效能 65', '基建折旧与基层治理是中段短板，奖补退出后最易回落。'],
            ['人居环境 85 / 数字渗透 90', '数字渗透领先于物理基建，电商与支付下沉快于冷链与道路。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="调研结论" className="mb-6">
        <Grid cols={3}>
          {[['1 · 增产靠单产与结构', '粮食安全与生态红线（耕地、地下水）硬约束下，增产主要靠单产与结构，而非简单扩面。'],
            ['2 · 县域产业防空心化', '县域产业若不能与物流、电力、人力资本同步升级，财政奖补退出后易出现空心化。'],
            ['3 · 土地制度定天花板', '集体经营性建设用地入市与宅基地改革试点，决定农民「财产性收入」的天花板。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="系统观察">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          乡村振兴是长周期资产负债表修复：人口回流、基建折旧与产业迭代需同屏评估。城乡要素流动的方向最终由土地制度与县域就业承载力共同决定。
        </p>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为示意；政策与农情以农业农村部、国家统计局发布为准 · 由 china.html「乡村振兴」专题迁移</p>
    </div>
  );
}
