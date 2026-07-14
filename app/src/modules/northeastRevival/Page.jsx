import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, StatGrid } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { categoryX, valueY, GRID, stackedBarOpt, radarOpt, AXIS, LABEL, LEGEND } from '../shared/chartHelpers.js';
import { useTimelineChartLink } from '../shared/useTimelineChartLink.js';
import {
  AS_OF, PHASES, PROVINCES, INDUSTRIES, VIEW_MODES,
  PROVINCE_DIMS, INDUSTRY_DIMS,
  SHARE_YEARS, SHARE_VALUES, PHASE_SPANS,
  GDP_YEARS, INDUSTRY_STRUCTURE, POP_OUTFLOW, AGING_RATES,
} from './data.js';

// ============================================================================
// 东北振兴 · 老工业基地 / 三省对比 / 全面振兴新突破
// asOf 2026-07-14 · 公开资料示意
// ============================================================================

export default function Page() {
  const [viewMode, setViewMode] = useState('province');
  const [provinceKey, setProvinceKey] = useState('liaoning');
  const [industryKey, setIndustryKey] = useState('auto');
  // 人口-产业负反馈模拟器：产业造血投入 / 人才回流政策力度（0-100）
  const [invest, setInvest] = useState(30);
  const [talent, setTalent] = useState(30);

  // 双变量耦合推演 2026→2045：人口萎缩拖累产业、份额回升吸引回流（示意模型）
  const sim = useMemo(() => {
    const years = [];
    const shares = [];
    const pops = [];
    let share = 5.0;
    let pop = 100;
    for (let y = 2026; y <= 2045; y++) {
      years.push(String(y));
      shares.push(+share.toFixed(2));
      pops.push(+pop.toFixed(1));
      const dShare = -0.06 + invest * 0.0011 + (pop - 100) * 0.002;
      const dPop = -0.85 + talent * 0.011 + (share - 5.0) * 0.35;
      share = Math.max(2, share + dShare);
      pop = Math.max(60, pop + dPop);
    }
    const fs = shares[shares.length - 1];
    const fp = pops[pops.length - 1];
    const verdict = fs >= 5 && fp >= 97
      ? ['负反馈被打破 · 企稳回升', '#10b981']
      : fs >= 4.2 ? ['缓滑 · 守住安全底盘', '#e8a317'] : ['螺旋下行 · 输血依赖加深', '#c41e3a'];
    return { years, shares, pops, fs, fp, verdict };
  }, [invest, talent]);

  const simOpt = useMemo(() => ({
    grid: { left: 44, right: 44, top: 30, bottom: 24 },
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: ['GDP 份额 %', '人口指数(2026=100)'] },
    xAxis: categoryX(sim.years),
    yAxis: [
      valueY({ name: '份额 %', min: 2, max: 7 }),
      { type: 'value', name: '人口指数', min: 60, max: 110, splitLine: { show: false }, axisLabel: { color: LABEL.color, fontSize: 10 } },
    ],
    series: [
      { name: 'GDP 份额 %', type: 'line', smooth: true, symbol: 'none', data: sim.shares, lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.08)' } },
      { name: '人口指数(2026=100)', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'none', data: sim.pops, lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
    ],
  }), [sim]);

  const { activeIdx: phaseIdx, setActiveIdx: setPhaseIdx, active: phase, chartOption: shareTrendOpt } =
    useTimelineChartLink(PHASES, SHARE_YEARS, SHARE_VALUES, PHASE_SPANS, 2);

  const province = PROVINCES.find((x) => x.key === provinceKey) ?? PROVINCES[0];
  const industry = INDUSTRIES.find((x) => x.key === industryKey) ?? INDUSTRIES[0];

  const gdpCompareOpt = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: PROVINCES.map((p) => p.label) },
    xAxis: categoryX(GDP_YEARS),
    yAxis: valueY({ name: '万亿（示意）' }),
    series: PROVINCES.map((p) => ({
      name: p.label,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      data: p.gdpTrend,
      lineStyle: { color: p.accent, width: p.key === provinceKey ? 2.5 : 1.5 },
      itemStyle: { color: p.accent },
      emphasis: { focus: 'series' },
    })),
  }), [provinceKey]);

  const popCompareOpt = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    legend: { ...LEGEND, top: 0, data: PROVINCES.map((p) => p.label) },
    xAxis: categoryX(GDP_YEARS),
    yAxis: valueY({ name: '万人（示意）' }),
    series: PROVINCES.map((p) => ({
      name: p.label,
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: p.popTrend,
      lineStyle: { color: p.accent, width: 2 },
      itemStyle: { color: p.accent },
      areaStyle: { color: `${p.accent}12` },
    })),
  }), []);

  const industryStructureOpt = useMemo(() => stackedBarOpt(INDUSTRY_STRUCTURE), []);

  const outflowOpt = useMemo(() => ({
    grid: { left: 48, right: 16, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis', formatter: (ps) => `${ps[0].name}: ${ps[0].value} 万人/年（示意）` },
    xAxis: categoryX(POP_OUTFLOW.provinces),
    yAxis: valueY({ name: '万人/年' }),
    series: [{
      type: 'bar',
      barWidth: 28,
      data: POP_OUTFLOW.values.map((v, i) => ({
        value: v,
        itemStyle: {
          color: PROVINCES[i]?.accent ?? '#64748b',
          borderRadius: v < 0 ? [0, 0, 3, 3] : [3, 3, 0, 0],
        },
      })),
      label: { show: true, position: 'bottom', color: LABEL.color, fontSize: 10, formatter: '{c}' },
    }],
  }), []);

  const agingOpt = useMemo(() => ({
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(AGING_RATES.provinces),
    yAxis: valueY({ name: '%', max: 28 }),
    series: [{
      type: 'bar',
      barWidth: 24,
      data: AGING_RATES.values.map((v, i) => ({
        value: v,
        itemStyle: { color: AGING_RATES.colors[i], borderRadius: 3 },
      })),
      label: { show: true, position: 'top', color: LABEL.color, fontSize: 10, formatter: '{c}%' },
    }],
  }), []);

  const industryRadarOpt = useMemo(() => {
    const items = viewMode === 'industry' ? INDUSTRIES : PROVINCES;
    const key = viewMode === 'industry' ? industryKey : provinceKey;
    const item = items.find((x) => x.key === key) ?? items[0];
    const dims = viewMode === 'industry' ? INDUSTRY_DIMS : PROVINCE_DIMS;
    return radarOpt(dims, item.scores, { name: item.label, color: item.accent });
  }, [viewMode, industryKey, provinceKey]);

  const activeItem = viewMode === 'industry' ? industry : province;
  const selectorItems = viewMode === 'industry' ? INDUSTRIES : PROVINCES;
  const activeKey = viewMode === 'industry' ? industryKey : provinceKey;
  const onSelect = viewMode === 'industry' ? setIndustryKey : setProvinceKey;

  return (
    <div>
      <PageHeader
        badge="区域战略 · 东北"
        title="东北振兴 · 全面振兴新突破"
        subtitle="老工业基地 · 三省对比 · 制度创新"
      />

      <IntroCard>
        东北是计划经济遗产最重的板块，也是<strong style={{ color: 'var(--text-primary)' }}>「政策无法替代制度」</strong>的样本：
        老工业基地、资源型城市与国企高占比构成历史结构，人口净流出与老龄化叠加形成长期约束。
        2024—2025 政府工作报告与「十五五」布局将东北锚定为维护国家「五大安全」的战略腹地——装备制造、北大仓、能源与冰雪经济构成新增长极。
        数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，公开资料示意。
      </IntroCard>

      <StatGrid className="mb-6">
        <Stat value="~6 万亿" label="三省 GDP 合计（示意）" accent="#64748b" />
        <Stat value="~5%" label="占全国 GDP 比重（2025E）" accent="#c41e3a" />
        <Stat value="-165万" label="三省年净流出（示意）" accent="#e8a317" />
        <Stat value="~1/4" label="粮食调出占全国（北大仓）" accent="#10b981" />
      </StatGrid>

      <Card title="视图切换 · 三省 / 产业 / 政策" className="mb-4">
        <SelectorBar items={VIEW_MODES} activeKey={viewMode} onSelect={setViewMode} />
      </Card>

      {viewMode === 'policy' ? (
        <>
          <Card title="政策演进 · 时间线 ↔ 份额趋势联动" className="mb-6">
            <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
            <div className="os-card p-4 mt-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${phase.accent}` }}>
              <div className="text-[10px] mono uppercase mb-1" style={{ color: phase.accent }}>{phase.period} · {phase.title}</div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{phase.desc}</p>
            </div>
          </Card>
          <Card title="东北占全国 GDP 比重演进（示意 % · 点击阶段高亮区间）" className="mb-6">
            <EChart option={shareTrendOpt} style={{ height: 240 }} />
            <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
              二十年三轮振兴政策维持了财政与社保运转，但未能逆转经济份额持续下滑——从 2003 年约 8.9% 降至 2025E 约 5.0%（示意）。
            </p>
          </Card>
        </>
      ) : (
        <>
          <Card title={`交互 · ${viewMode === 'industry' ? '产业维度' : '三省对比'}`} className="mb-4">
            <SelectorBar items={selectorItems} activeKey={activeKey} onSelect={onSelect} />
          </Card>

          <Grid cols={2} className="mb-6">
            <div className="os-card p-5" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${activeItem.accent}` }}>
              <div className="text-[10px] mono uppercase mb-2" style={{ color: activeItem.accent }}>
                {activeItem.label} · {viewMode === 'industry' ? '产业论点' : '省域论点'}
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{activeItem.thesis}</p>
              <div className="space-y-2 mb-3">
                {activeItem.points.map((pt) => (
                  <div key={pt} style={{ borderLeft: `2px solid ${activeItem.accent}`, paddingLeft: 10 }}>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{pt}</p>
                  </div>
                ))}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <span style={{ color: '#e8a317' }}>政策杠杆 · </span>{activeItem.lever}
              </div>
            </div>
            <Card title={`${activeItem.label} · 五维评估`}>
              <EChart option={industryRadarOpt} style={{ height: 260 }} />
            </Card>
          </Grid>
        </>
      )}

      <Grid cols={2} className="mb-6">
        <Card title="三省 GDP 趋势对比（万亿 · 示意）">
          <EChart option={gdpCompareOpt} style={{ height: 240 }} />
        </Card>
        <Card title="三省人口趋势（万人 · 示意）">
          <EChart option={popCompareOpt} style={{ height: 240 }} />
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="三省产业结构（示意 %）">
          <EChart option={industryStructureOpt} style={{ height: 240 }} />
        </Card>
        <Card title="人口净流出对比（万人/年 · 示意）">
          <EChart option={outflowOpt} style={{ height: 240 }} />
        </Card>
      </Grid>

      <Card title="老龄化率对比（65 岁及以上 · 示意 %）" className="mb-6">
        <EChart option={agingOpt} style={{ height: 200 }} />
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          东北老龄化率显著高于全国均值——生育率低迷、人才外流与国企职工年龄结构老化形成「人口-产业」负反馈循环。
        </p>
      </Card>

      {viewMode !== 'policy' && (
        <Card title="政策演进 · 时间线 ↔ 份额趋势联动" className="mb-6">
          <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
          <EChart option={shareTrendOpt} style={{ height: 220 }} />
        </Card>
      )}

      <Card title="历史与结构 · 约束矩阵" className="mb-6">
        <Grid cols={4}>
          {[
            ['老工业基地', '共和国装备摇篮，机床/电站/汽车等传统优势面临订单转移与智能化升级双重压力。', '#64748b'],
            ['资源型城市', '大庆、阜新、伊春等资源枯竭型城市转型成本高，财政与社保压力集中。', '#f97316'],
            ['国企比重', '三省央企与地方国企占比全国前列，市场化程度与民企活力相对不足。', '#c41e3a'],
            ['人口净流出', '十年累计净流出数百万量级，人才外流削弱创新生态与消费纵深。', '#e8a317'],
          ].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: c }}>{t}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="模拟器 · 人口-产业负反馈能否打破（思想实验 · 非预测）" className="mb-6">
        <Grid cols={2} className="mb-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>产业造血投入（新质生产力/冰雪/农业品牌）</span>
              <span className="mono" style={{ color: '#22d3ee' }}>{invest}</span>
            </div>
            <input type="range" min="0" max="100" value={invest} onChange={(e) => setInvest(Number(e.target.value))} style={{ width: '100%', accentColor: '#22d3ee' }} />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>人才回流政策力度（落户/编制/营商/薪酬）</span>
              <span className="mono" style={{ color: '#e8a317' }}>{talent}</span>
            </div>
            <input type="range" min="0" max="100" value={talent} onChange={(e) => setTalent(Number(e.target.value))} style={{ width: '100%', accentColor: '#e8a317' }} />
          </div>
        </Grid>
        <EChart option={simOpt} style={{ height: 240 }} />
        <div className="flex items-center gap-3 flex-wrap mt-3">
          <span className="text-[11px] mono px-2 py-1 rounded" style={{ background: `${sim.verdict[1]}1a`, color: sim.verdict[1], border: `1px solid ${sim.verdict[1]}55` }}>2045 判定：{sim.verdict[0]}</span>
          <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>份额 {sim.fs}% · 人口指数 {sim.fp}</span>
        </div>
        <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          机制：人口萎缩拖累产业（消费纵深与人才密度），份额回升反向吸引回流——双向耦合即「负反馈循环」。
          单推产业或单推人才都难破局，<strong style={{ color: 'var(--text-secondary)' }}>双高投入才能在 2030 年代中期迎来拐点</strong>。系数为示意标定，非计量预测。
        </p>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="五大安全 · 东北贡献度（示意）">
          <EChart option={radarOpt(['粮食安全', '能源安全', '产业装备', '生态安全', '国防纵深'], [92, 76, 74, 80, 88], { name: '东北贡献度', color: '#10b981' })} style={{ height: 240 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
            北大仓粮食调出约占全国 1/4；大庆油田与煤电基地仍是能源压舱石；装备制造与国防纵深不可迁移——这是「安全极」定位的物理底座。
          </p>
        </Card>
        <Card title="城市分化 · 四核集聚 vs 资源城收缩（人口年变动 % · 示意）">
          <EChart option={{
            grid: { left: 40, right: 16, top: 16, bottom: 24 },
            tooltip: { trigger: 'axis', formatter: (ps) => `${ps[0].name}: ${ps[0].value > 0 ? '+' : ''}${ps[0].value}%/年` },
            xAxis: categoryX(['沈阳', '大连', '长春', '哈尔滨', '阜新', '伊春', '鹤岗', '双鸭山']),
            yAxis: valueY({ name: '%' }),
            series: [{
              type: 'bar', barWidth: 22,
              data: [0.6, 0.8, 0.3, -0.2, -2.4, -2.8, -3.1, -3.6].map((v) => ({
                value: v,
                itemStyle: { color: v >= 0 ? '#10b981' : '#c41e3a', borderRadius: v >= 0 ? [3, 3, 0, 0] : [0, 0, 3, 3] },
              })),
              markLine: { silent: true, symbol: 'none', data: [{ yAxis: 0, lineStyle: { color: AXIS.lineStyle.color }, label: { show: false } }] },
            }],
          }} style={{ height: 240 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
            振兴不是全域回暖而是<strong style={{ color: 'var(--text-secondary)' }}>极化收敛</strong>：人口与产业向沈大长哈四核集聚，资源枯竭城市进入「体面收缩」管理——鹤岗化是边界条件，不是全域宿命。
          </p>
        </Card>
      </Grid>

      <Card title="对口合作 · 制度移植的四条管道" className="mb-6">
        <Grid cols={4}>
          {[
            ['辽宁 ⇄ 江苏', '装备制造嫁接长三角供应链与民企生态，沈阳-苏州工业园复制试验。', '#c41e3a'],
            ['吉林 ⇄ 浙江', '数字经济与民营机制输入，长春-杭州「数字+汽车」嫁接。', '#22d3ee'],
            ['黑龙江 ⇄ 广东', '农业品牌化与市场化运营对接珠三角资本与渠道。', '#e8a317'],
            ['深哈产业园', '「带土移植」样本：深圳规则/团队/薪酬整建制落地哈尔滨——测试制度可否跨纬度存活。', '#10b981'],
          ].map(([t, d, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold mb-1" style={{ color: c }}>{t}</div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
        <p className="text-[11px] mt-3" style={{ color: 'var(--text-tertiary)' }}>
          对口合作的本质是<strong style={{ color: 'var(--text-secondary)' }}>制度移植实验</strong>：政策可以输血，制度只能嫁接——「带土移植」能否成活，是比任何投资数字更关键的先行指标。
        </p>
      </Card>

      <Card title="十五五 · 指标 / 约束 / 路径" className="mb-6">
        <Grid cols={3}>
          <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#22d3ee' }}>核心指标</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              维护粮食、能源、产业、生态、国防「五大安全」；装备制造业智能化升级；冰雪经济与寒地农业品牌化发展；营商环境进入全国第一梯队。
            </p>
          </div>
          <div style={{ borderLeft: '2px solid #e8a317', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#e8a317' }}>关键约束</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              体制机制惯性、人口净流出与低生育率、资源型城市衰退、冬季漫长制约全年产能利用率、对口合作成效不均。
            </p>
          </div>
          <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>推进路径</div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              体制机制创新 → 央企投资与民企培育 → 对口合作（沪浙苏粤等）→ 冰雪/农业/新能源新增长极 → 人才回流与营商环境硬化。
            </p>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        {
          key: 'salt',
          title: '盐铁逻辑',
          subtitle: '安全压舱石',
          body: '东北从经济极重新锚定为安全极——粮食调出、能源供给、装备备份与国防纵深构成国家「五大安全」的物理底座，转移支付与央企投资是维持运转的「盐铁专营」。',
          pillars: [['粮食', '北大仓。'], ['能源', '油田煤电。'], ['装备', '工业备份。']],
        },
        {
          key: 'stone',
          title: '摸石头方法论',
          subtitle: '对口试验',
          body: '自贸区、混改试点与对口合作（辽宁—江苏、吉林—浙江等）——在真实行政与市场摩擦中测试体制机制创新与产业承接的可复制边界。',
          pillars: [['灰度', '自贸试点。'], ['验证', '混改样本。'], ['推广', '对口合作。']],
        },
        {
          key: 'path',
          title: '升级路径',
          subtitle: '振兴到振兴',
          body: '从三轮「振兴」政策的基建输血，转向新质生产力、冰雪经济与现代农业品牌化——不能简单复制东部工业化模板，须在寒地资源禀赋上再造增长引擎。',
          pillars: [['输血', '三轮振兴。'], ['造血', '冰雪农业。'], ['制度', '机制创新。']],
        },
      ]} />

      <Card title="系统结论">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          东北振兴的深层命题是<strong style={{ color: 'var(--text-primary)' }}>历史结构约束与战略安全价值的再定价</strong>——
          人口净流出与份额下滑是市场化条件下的客观结果，但粮食、能源、装备与国防的不可替代性决定了国家不会放弃这一板块。
          十五五的关键不在重复基建投资，而在体制机制创新、营商环境硬化与对口合作的制度化——让央企投资与民企活力同向发力。
        </p>
      </Card>

      <ModuleFooter moduleId="northeastRevival" sourceNote={`数据截至 ${AS_OF} · 公开资料示意`} />
    </div>
  );
}
