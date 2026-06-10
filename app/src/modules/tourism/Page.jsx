import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const recoveryLine = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024(E)'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', name: '亿人次', nameTextStyle: { color: '#93a1b5' }, axisLabel: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 7, data: [5.73, 2.23, 2.92, 2.04, 4.91, 5.25], lineStyle: { color: '#e8a317', width: 3 }, itemStyle: { color: '#e8a317' }, areaStyle: { color: 'rgba(232,163,23,0.15)' } }],
};

const ageDonut = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  series: [{
    type: 'pie', radius: ['58%', '78%'], center: ['50%', '44%'], avoidLabelOverlap: true,
    label: { show: false },
    data: [
      { value: 35, name: 'Z 世代 (18–28)', itemStyle: { color: '#e8a317' } },
      { value: 25, name: '中青年 (29–35)', itemStyle: { color: '#22d3ee' } },
      { value: 22, name: '中年 (36–45)', itemStyle: { color: '#c41e3a' } },
      { value: 18, name: '银发 (55+)', itemStyle: { color: '#10b981' } },
    ],
  }],
};

const hotspotBar = {
  grid: { left: 44, right: 16, top: 36, bottom: 24 },
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  xAxis: { type: 'category', data: ['起势月', '爆发月', '峰值月', '回落月'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', name: '指数', nameTextStyle: { color: '#93a1b5' }, axisLabel: { color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '淄博烧烤 (23/3–6月)', type: 'bar', data: [120, 480, 520, 310], barWidth: 12, itemStyle: { color: '#e8a317', borderRadius: 3 } },
    { name: '哈尔滨冰雪 (23/11–24/2月)', type: 'bar', data: [85, 620, 890, 450], barWidth: 12, itemStyle: { color: '#22d3ee', borderRadius: 3 } },
    { name: '天水麻辣烫 (24/1–4月)', type: 'bar', data: [40, 65, 780, 610], barWidth: 12, itemStyle: { color: '#c41e3a', borderRadius: 3 } },
  ],
};

const formats = [
  ['行 · City Walk / 城市微度假', '低客单价、高分享率；依赖公共交通与街区商业更新。', '#e8a317'],
  ['展 · 博物馆热 / 文博预约', '国潮与考古 IP 带动二次消费；承载「文化出口」叙事。', '#22d3ee'],
  ['野 · 露营 / 精致露营 (Glamping)', '周边游与亲子客群；季节性强，对营地标准与环保提出监管需求。', '#10b981'],
  ['演 · 演唱会 / 赛事经济', '票根带动交通、住宿与餐饮；地方政府以审批与安保能力换增量税收。', '#c41e3a'],
];

const hotCities = [
  ['淄博（2023 Q2 烧烤话题）', '#现象级', '搜索指数 3 月 120 → 5 月峰值 520；以「政府全员服务」承接流量，话题退潮后转向长效口碑。', '#e8a317'],
  ['哈尔滨（2023–24 冰雪季）', '#季节性峰值', '客流 11 月 85 → 1 月峰值 890；冰雪大世界 + 「南方小土豆」叙事，季节性极强、需淡季产品续接。', '#22d3ee'],
  ['天水（2024 Q1 麻辣烫）', '#县域出圈', '话题热度 1 月 40 → 3 月 780；县域小城凭单品出圈，考验交通承载与服务供给的快速扩容。', '#c41e3a'],
];

const digiOps = [
  ['数 · 大数据客流预警', '与交通、公安数据联动，节假日提前限流与公交加密。'],
  ['IP · 城市 IP 与二次消费', '从「打卡」到文创与演艺，延长停留时间与 ARPU。'],
  ['乡 · 乡村旅游 + 民宿规范', '与乡村振兴考核衔接，注意环保与土地合规。'],
  ['虚 · 数字藏品与 AR 导览', '提升年轻客群体验；需防范炒作与合规风险。'],
];

const penetration = [['智慧预约 / 分流', 88], ['多语种服务', 76], ['电子支付覆盖（入境客群）', 42]];

export default function Page() {
  return (
    <div>
      <PageHeader badge="Tourism · 文旅消费" title="文旅消费 · 入境游复苏" subtitle="国内大循环 · 免签扩围 · 区域品牌" />

      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>从「口罩冲击」到县域与体验式供给：2023–2024 年国内旅游人次与收入延续修复，短途、高频与「情绪价值」型目的地更易形成社交传播；地方政府以活动 IP 与基础设施配套承接流量，免签扩围则为入境游复苏与区域品牌出海打开窗口。</p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="48.9 亿" label="国内出游人次 (2023)" accent="#e8a317" />
        <Stat value="4.91 万亿" label="国内旅游收入（元 · 2023）" accent="#c41e3a" />
        <Stat value="+120%+" label="2023 同比 2022（示意）" accent="#10b981" />
        <Stat value="5.25 亿" label="2024 出游人次预测 (E)" accent="#22d3ee" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="2019–2024 国内出游人次（亿 · 2024 为预测示意）"><EChart option={recoveryLine} style={{ height: 250 }} /></Card>
        <Card title="出游人群结构占比（% · 示意）"><EChart option={ageDonut} style={{ height: 250 }} /></Card>
      </Grid>

      <Card title="客群结构与新兴业态" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>Z 世代贡献话题与内容；家庭与银发客群更重舒适与安全。业态从观光向体验迁移，催生四类高传播供给。</p>
        <Grid cols={2}>
          {formats.map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="流量型目的地热度对比（搜索/客流指数 · 示意）"><EChart option={hotspotBar} style={{ height: 280 }} /></Card>
        <Card title="流量城市复盘 · 话题—客流—服务承压">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>短视频与社交平台降低信息不对称，「话题—客流—服务承压」链条极短。治理要点：公共服务 + 价格与舆情 + 交通承载。</p>
          <div className="space-y-2">
            {hotCities.map(([t, tag, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t} <span className="mono text-[10px]" style={{ color: c }}>{tag}</span></div>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="目的地数字化渗透（示意 %）">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>预约、支付与客流监测越成熟，越利于平抑峰值与舆情风险；电子支付与多语种服务是入境游体验的两大短板。</p>
          <div className="space-y-3">
            {penetration.map(([t, v]) => (
              <div key={t}>
                <div className="flex justify-between text-[11px] mb-1" style={{ color: 'var(--text-tertiary)' }}><span>{t}</span><span className="mono">{v}%</span></div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(148,163,184,0.15)', overflow: 'hidden' }}>
                  <div style={{ width: `${v}%`, height: '100%', borderRadius: 3, background: '#c41e3a' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="目的地运营工具箱">
          <Grid cols={2}>
            {digiOps.map(([t, d]) => (
              <div key={t}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </Grid>
        </Card>
      </Grid>

      <Card title="系统观察"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>流量是入口而非终点：淄博、哈尔滨与天水证明「出圈」可以速成，但留客取决于公共服务、价格治理与交通承载的长期供给；文旅消费的真正杠杆，在于把一次性话题转化为县域品牌与入境游的可复用基础设施。</p></Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为公开区间与模型示意，与文旅部、统计局终核数据可能不一致 · 由 china.html「文旅」专题迁移</p>
    </div>
  );
}
