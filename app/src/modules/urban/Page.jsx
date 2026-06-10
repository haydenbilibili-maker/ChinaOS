import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import ChinaMap from '../../lib/viz/ChinaMap.jsx';

// 各省常住人口城镇化率（% · 示意，沿海高内陆低）
const URBANIZATION = [
  { name: '上海市', value: 88 }, { name: '北京市', value: 88 }, { name: '天津市', value: 85 },
  { name: '广东省', value: 75 }, { name: '江苏省', value: 74 }, { name: '浙江省', value: 73 },
  { name: '辽宁省', value: 73 }, { name: '黑龙江省', value: 67 }, { name: '福建省', value: 70 },
  { name: '重庆市', value: 71 }, { name: '内蒙古自治区', value: 68 }, { name: '山东省', value: 65 },
  { name: '湖北省', value: 65 }, { name: '陕西省', value: 64 }, { name: '山西省', value: 64 },
  { name: '河北省', value: 62 }, { name: '江西省', value: 62 }, { name: '安徽省', value: 61 },
  { name: '湖南省', value: 60 }, { name: '四川省', value: 59 }, { name: '河南省', value: 57 },
  { name: '广西壮族自治区', value: 56 }, { name: '贵州省', value: 55 }, { name: '甘肃省', value: 54 },
  { name: '云南省', value: 53 }, { name: '新疆维吾尔自治区', value: 58 }, { name: '西藏自治区', value: 38 },
];
const POPULATION = [
  { name: '广东省', value: 12700 }, { name: '山东省', value: 10100 }, { name: '河南省', value: 9800 },
  { name: '江苏省', value: 8500 }, { name: '四川省', value: 8400 }, { name: '河北省', value: 7400 },
  { name: '浙江省', value: 6600 }, { name: '湖南省', value: 6600 }, { name: '安徽省', value: 6100 },
  { name: '湖北省', value: 5800 }, { name: '广西壮族自治区', value: 5000 }, { name: '云南省', value: 4700 },
  { name: '江西省', value: 4500 }, { name: '辽宁省', value: 4200 }, { name: '福建省', value: 4200 },
  { name: '陕西省', value: 4000 }, { name: '贵州省', value: 3850 }, { name: '山西省', value: 3500 },
  { name: '重庆市', value: 3200 }, { name: '黑龙江省', value: 3100 }, { name: '新疆维吾尔自治区', value: 2600 },
  { name: '甘肃省', value: 2500 }, { name: '上海市', value: 2480 }, { name: '北京市', value: 2180 },
  { name: '内蒙古自治区', value: 2400 }, { name: '吉林省', value: 2350 }, { name: '天津市', value: 1360 },
];

const clusterRadar = {
  legend: { data: ['长三角', '粤港澳', '京津冀', '成渝'], textStyle: { color: '#93a1b5' }, top: 0 },
  radar: { indicator: [{ name: '经济密度', max: 100 }, { name: '研发强度', max: 100 }, { name: '城镇连绵', max: 100 }, { name: '产业协同', max: 100 }, { name: '开放度', max: 100 }], axisName: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [
    { value: [98, 92, 95, 90, 88], name: '长三角', lineStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.1)' } },
    { value: [95, 95, 85, 88, 98], name: '粤港澳', lineStyle: { color: '#22d3ee' } },
    { value: [88, 90, 80, 82, 75], name: '京津冀', lineStyle: { color: '#e8a317' } },
    { value: [72, 70, 65, 70, 60], name: '成渝', lineStyle: { color: '#10b981' } },
  ] }],
};
const renewalChart = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: '#27324a' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'bar', data: [40, 55, 68, 80, 95], barWidth: 26, itemStyle: { color: '#10b981', borderRadius: [3, 3, 0, 0] } }],
};

const CLUSTERS = [
  ['长三角 (YRD)', '以上海为龙头联动江浙皖，全国经济密度最高、城镇连绵最强，制造与现代服务协同领先。GDP 全国占比 ~24%、研发强度 3.2%。'],
  ['粤港澳大湾区', '港澳 + 珠三角，开放度与研发强度领先，金融/科创/制造高度协同。'],
  ['京津冀', '以首都功能疏解为牵引，推动区域协同与产业再布局。'],
  ['成渝双城圈', '西部增长极，承接产业转移与就近城镇化，潜力释放期。'],
];

export default function Page() {
  return (
    <div>
      <PageHeader badge="New Urbanization" title="以人为核心的新型城镇化" subtitle="市民化 · 户籍 · 城市群 · 县域 —— 从规模扩张转向以人为本" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>常住人口城镇化率已突破 66%，但户籍城镇化率仍明显滞后。下一阶段核心，是把已进城的农业转移人口真正变成市民，推动公共服务从「常住」走向「均等」。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="66.16%" label="常住人口城镇化率" accent="#22d3ee" />
        <Stat value="19 城" label="城区千万级特大城市" />
        <Stat value="~80%" label="城市贡献 GDP 占比" accent="#10b981" />
        <Stat value="4 极" label="主要城市群" accent="#c41e3a" />
      </Grid>

      <Card title="各省城镇化（示意 · 可切换指标 · 点省下钻）" className="mb-6">
        <ChinaMap
          metrics={[
            { key: 'rate', label: '城镇化率', valueName: '城镇化率(%)', max: 90, data: URBANIZATION },
            { key: 'pop', label: '常住人口', valueName: '常住人口(万人)', max: 13000, data: POPULATION },
          ]}
          style={{ height: 470 }}
        />
      </Card>

      <Card title="城市群与都市圈格局 · 「3+1」核心" className="mb-6">
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>人口与产业向核心城市群集聚，构成新型城镇化的主体形态与增长极。</p>
        <Grid cols={2}>
          <EChart option={clusterRadar} style={{ height: 280 }} />
          <div className="space-y-2">
            {CLUSTERS.map(([t, d]) => (
              <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="农业转移人口市民化">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>户籍制度改革是市民化的关键闸门。常住与户籍两个城镇化率之间约 <strong style={{ color: 'var(--china-red)' }}>18 个百分点</strong>的落差，对应上亿尚未充分享有城市公共服务的常住人口——这是改革的真正主战场。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #c41e3a', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>城区 300 万以下城市全面落户</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>取消落户限制，推动落户门槛与社保年限松绑。</p></div>
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>公共服务均等化</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>教育、医疗、住房、养老随常住人口配置，与户籍逐步脱钩。</p></div>
          </div>
        </Card>
        <Card title="从增量扩张到存量更新">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>城市发展进入存量提质阶段，「十五五」重心从摊大饼扩张转向城市更新：老旧小区改造、地下管网升级、社区生活圈补短板。</p>
          <EChart option={renewalChart} style={{ height: 160 }} />
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>城市更新重点领域投入（2020–2024 · 示意）</p>
        </Card>
      </Grid>

      <Grid cols={2}>
        <Card title="老旧小区改造"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>水电气管网与适老化更新，重塑社区「1 刻钟生活圈」。</p></Card>
        <Card title="县域城镇化"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>以县城为载体承接就近城镇化，补齐市政与公共服务短板。</p></Card>
      </Grid>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开信息综合整理及示意值，仅供研究参考 · 由 tabs/urban.html 迁移</p>
    </div>
  );
}
