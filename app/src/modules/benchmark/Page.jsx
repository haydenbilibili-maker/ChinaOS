import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// 数据来源：china.html「国际对标」专题（WB/IMF 等公开口径示意）
const COUNTRIES = ['中国', '美国', '日本', '德国', '印度'];
const PALETTE = ['#c41e3a', '#22d3ee', '#e8a317', '#10b981', '#93a1b5'];
const AXIS = { axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } };
const SPLIT = { splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } };

const gdpBar = {
  grid: { left: 40, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: COUNTRIES, ...AXIS },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%', color: '#93a1b5' }, ...SPLIT },
  series: [{ type: 'bar', barWidth: 26, data: [5.2, 2.5, 1.0, 0.5, 7.2].map((v, i) => ({ value: v, itemStyle: { color: PALETTE[i], borderRadius: 4 } })), label: { show: true, position: 'top', formatter: '{c}%', color: '#93a1b5', fontSize: 11 } }],
};

const agingDebtBar = {
  legend: { data: ['老龄化率 (65+ %)', '政府债务/GDP (%)'], textStyle: { color: '#93a1b5', fontSize: 11 }, top: 0 },
  grid: { left: 44, right: 16, top: 34, bottom: 24 },
  xAxis: { type: 'category', data: COUNTRIES, ...AXIS },
  yAxis: { type: 'value', axisLabel: { color: '#93a1b5' }, ...SPLIT },
  series: [
    { name: '老龄化率 (65+ %)', type: 'bar', barWidth: 16, data: [14.9, 17.4, 29.1, 22.3, 7.0], itemStyle: { color: '#e8a317', borderRadius: 3 } },
    { name: '政府债务/GDP (%)', type: 'bar', barWidth: 16, data: [77, 123, 264, 66, 82], itemStyle: { color: '#c41e3a', borderRadius: 3 } },
  ],
};

const sysRadar = {
  legend: { data: ['中国', '美国', '印度'], textStyle: { color: '#93a1b5', fontSize: 11 }, top: 0 },
  radar: {
    indicator: [{ name: '增速动能', max: 100 }, { name: '人口年轻度', max: 100 }, { name: '杠杆空间', max: 100 }, { name: '制造份额', max: 100 }],
    radius: '62%', axisName: { color: '#93a1b5' },
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false },
    axisLine: { lineStyle: { color: '#27324a' } },
  },
  series: [{ type: 'radar', data: [
    { value: [72, 60, 70, 95], name: '中国', lineStyle: { color: '#c41e3a' }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } },
    { value: [35, 52, 52, 53], name: '美国', lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
    { value: [100, 90, 68, 10], name: '印度', lineStyle: { color: '#10b981' }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.08)' } },
  ] }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Benchmark · 国际对标" title="中美日德印横比 · 系统基准" subtitle="增速 · 老龄化 · 政府杠杆 · 制造份额" />

      <Card className="mb-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          在 IMF WEO 等框架下，将名义增速、人口结构与广义政府债务放在同一画布上，便于观察「追赶窗口」与「债务天花板」的相对位置。中国以 5.2% 的增速与约 14.9% 的老龄化率，处于「未富先老」与「追赶尚有空间」的交叉点；日本展示了债务天花板的极限形态，印度则示意年轻人口红利期的增长上限（本页数值为公开口径教学示意）。
        </p>
      </Card>

      <Grid cols={4} className="mb-6">
        <Stat value="5 国" label="样本经济体（中/美/日/德/印）" accent="#c41e3a" />
        <Stat value="WB/IMF" label="外源口径" accent="#22d3ee" />
        <Stat value="3 轴" label="增速 / 老龄化 / 债务" accent="#e8a317" />
        <Stat value="2024" label="基准年示意" accent="#10b981" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="GDP 实际增速（% · 2024 示意）"><EChart option={gdpBar} style={{ height: 240 }} /></Card>
        <Card title="老龄化率 vs 广义政府债务/GDP（%）"><EChart option={agingDebtBar} style={{ height: 240 }} /></Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="系统基准雷达 · 中/美/印（归一化示意）"><EChart option={sysRadar} style={{ height: 280 }} /></Card>
        <Card title="三轴解读 · 同一画布上的相对位置">
          <div className="space-y-3">
            {[['增速轴 · 追赶窗口', '#c41e3a', '印度 7.2% > 中国 5.2% > 美国 2.5% > 日本 1.0% > 德国 0.5%；增速差决定追赶或被追赶的方向与时限。'],
              ['老龄化轴 · 时间压力', '#e8a317', '日本 29.1% 与德国 22.3% 已深度老龄化；中国 14.9% 正快速逼近美国 17.4%，而印度仅 7.0%，人口结构是最难逆转的慢变量。'],
              ['杠杆轴 · 政策空间', '#22d3ee', '日本 264% 展示债务天花板的极限；美国 123% 靠美元霸权延展；中国 77%（不含隐性债务）与德国 66% 名义空间相对充裕。']].map(([t, c, d]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="五国画像 · 各自的系统约束" className="mb-6">
        <Grid cols={5}>
          {[['中国', '#c41e3a', '未富先老 + 制造份额全球第一；窗口期内须完成增长动能切换，隐性债务是杠杆轴的暗变量。'],
            ['美国', '#22d3ee', '增速在发达国家中领先，债务 123% 由储备货币地位托底；老龄化温和但移民政策波动大。'],
            ['日本', '#e8a317', '老龄化 29.1% + 债务 264% 的双极限样本；低利率维系的债务结构对加息周期高度敏感。'],
            ['德国', '#10b981', '债务纪律最严（66%）但增速近零；制造业外迁与能源转型叠加，是「健康资产负债表 + 增长失速」的样本。'],
            ['印度', '#93a1b5', '增速与人口结构双优，但制造份额低、基础设施与制度能力是红利兑现的瓶颈。']].map(([t, c, d]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="口径说明" className="mb-6">
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          债务与老龄化定义随统计机构调整；广义政府债务口径各国差异显著（中国数值不含地方隐性债务）。对比前请核对 IMF WEO 与各国统计局的最新修订。
        </p>
      </Card>

      <Card title="系统观察">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          横比的意义不在排名，而在识别约束的类型：日本式约束来自时间（人口与债务都已透支），印度式约束来自能力（制度与基建跟不上人口），中国的约束则是两者赛跑——能否在老龄化曲线追上日德之前，把增长引擎从要素投入切换到全要素生产率。
        </p>
      </Card>

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        综合参考 World Bank、IMF WEO、中国国家统计局等公开数据，数值为教学示意 · 由 china.html「国际对标」专题迁移
      </p>
    </div>
  );
}
