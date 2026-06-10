import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat, CrossLinks } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// 认知内核 · 康波周期（Kondratiev Wave）交互分析工具
// ----------------------------------------------------------------------------
// 康德拉季耶夫长波：约 50—60 年的资本主义经济长期波动（远长于基钦/朱格拉周期）。
// 本工具：嵌套周期对比 + 五波叠加图（春夏秋冬相位）+ 历史长波详情 + 中国定位。
// ============================================================================

// 已识别的五次长波 + 第六波推演（起止为学界常见区间，存争议）
const WAVES = [
  { id: 1, from: 1780, to: 1840, tech: '蒸汽机 · 纺织 · 运河', driver: '机械化', icon: '蒸', color: '#64748b',
    note: '第一次工业革命。蒸汽动力与机器纺织把生产从手工作坊推向工厂，运河网络降低运输成本。', china: '错失：清中叶闭关，与工业革命擦肩。' },
  { id: 2, from: 1840, to: 1890, tech: '铁路 · 钢铁 · 蒸汽船', driver: '运输革命', icon: '铁', color: '#22d3ee',
    note: '铁路狂热与钢铁冶金重塑空间，蒸汽轮船连通全球贸易，资本市场随铁路债券扩张。', china: '错失：洋务运动起步晚、未成体系，沦为半殖民地。' },
  { id: 3, from: 1890, to: 1940, tech: '电气 · 化工 · 内燃机', driver: '电力化', icon: '电', color: '#10b981',
    note: '第二次工业革命。电力、合成化工与内燃机催生新产业，泰勒制大规模生产成型，终于两次大战与大萧条。', china: '错失：内忧外患，工业基础薄弱。' },
  { id: 4, from: 1940, to: 1990, tech: '石油 · 汽车 · 电子', driver: '石化—消费', icon: '油', color: '#e8a317',
    note: '战后黄金时代。石油—汽车—郊区化—家电构成消费社会，半导体在尾声埋下下一波种子，1970s 石油危机为转折。', china: '中段切入：改革开放（1978）末班车，从计划转向市场，承接全球产业转移。' },
  { id: 5, from: 1990, to: 2040, tech: '信息技术 · 互联网 · 半导体', driver: '信息化', icon: 'IT', color: '#c41e3a',
    note: '信息革命。PC—互联网—移动—云重构生产与生活；2000 互联网泡沫(夏)、2008 金融危机(秋)、2015+ 进入萧条(冬)，孕育下一波。', china: '全面追赶：以制造规模 + 应用场景切入，部分环节（5G/电商/移动支付）跻身领跑，但先进半导体/EDA 仍受制。' },
  { id: 6, from: 2040, to: 2090, tech: 'AI · 新能源 · 生物科技', driver: '智能化（推演）', icon: 'AI', color: '#8b5cf6',
    note: '推演中的第六波。AI/具身智能、可控核聚变与新能源、合成生物可能成为新主导技术群；技术种子正在第五波的「冬天」孕育。', china: '力图换道超车：押注 AI/新能源/生物，争取从「追赶者」转为「定义者」——这是科技树与新质生产力的周期逻辑。' },
];

// 四季相位（康波春夏秋冬 · 周期视角下的一般规律，非投资建议）
const SEASONS = [
  ['春 · 回升 Recovery', '#10b981', '新技术扩散、信用复苏、加杠杆。增长动能重启，风险偏好回升。'],
  ['夏 · 繁荣/滞胀 Prosperity', '#e8a317', '增长见顶、通胀抬头、资产泡沫。实物与抗通胀资产相对占优。'],
  ['秋 · 衰退 Recession', '#c41e3a', '信用收缩、泡沫破裂、去杠杆。避险与现金/债券相对占优。'],
  ['冬 · 萧条 Depression', '#64748b', '出清与通缩，旧技术红利耗尽；下一波技术在此孕育，现金为王、布局种子。'],
];

// 嵌套周期对比（年）
const NESTED = {
  grid: { left: 90, right: 40, top: 10, bottom: 24 },
  xAxis: { type: 'value', name: '年', nameTextStyle: { color: '#5b6a82' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  yAxis: { type: 'category', data: ['基钦(库存)', '朱格拉(设备)', '库兹涅茨(建筑)', '康波(长波)'], axisLine: { lineStyle: { color: '#27324a' } } },
  series: [{ type: 'bar', data: [3.5, 9, 20, 55], barWidth: 16,
    itemStyle: { borderRadius: 3, color: (p) => ['#64748b', '#22d3ee', '#e8a317', '#c41e3a'][p.dataIndex] },
    label: { show: true, position: 'right', formatter: '{c} 年', color: '#93a1b5' } }],
};

const NOW_YEAR = 2024;

export default function Page() {
  const [sel, setSel] = useState(5);
  const w = WAVES.find((x) => x.id === sel);

  // 康波长波叠加曲线（约 54 年周期的复合正弦），并对选中波叠加春夏秋冬相位带
  const longWave = useMemo(() => {
    const pts = [];
    for (let y = 1775; y <= 2055; y += 1) pts.push([y, +(Math.sin((2 * Math.PI * (y - 1788)) / 54)).toFixed(3)]);
    const span = (w.to - w.from) / 4;
    const seasonColors = ['rgba(16,185,129,0.10)', 'rgba(232,163,23,0.10)', 'rgba(196,30,58,0.10)', 'rgba(100,116,139,0.12)'];
    const seasonNames = ['春', '夏', '秋', '冬'];
    const areas = seasonNames.map((nm, i) => [
      { xAxis: w.from + span * i, itemStyle: { color: seasonColors[i] }, label: { show: true, formatter: nm, color: '#93a1b5', position: 'insideTop' } },
      { xAxis: w.from + span * (i + 1) },
    ]);
    return {
      grid: { left: 30, right: 16, top: 24, bottom: 28 },
      tooltip: { trigger: 'axis', formatter: (p) => `${p[0].axisValue} 年` },
      xAxis: { type: 'value', min: 1775, max: 2055, interval: 40, axisLabel: { formatter: (v) => String(v), color: '#5b6a82' }, axisLine: { lineStyle: { color: '#27324a' } } },
      yAxis: { type: 'value', min: -1.4, max: 1.4, axisLabel: { show: false }, splitLine: { show: false } },
      series: [{
        type: 'line', smooth: true, symbol: 'none', data: pts,
        lineStyle: { color: '#22d3ee', width: 2 }, areaStyle: { color: 'rgba(34,211,238,0.06)' },
        markArea: { silent: true, data: areas },
        markLine: { silent: true, symbol: 'none', data: [{ xAxis: NOW_YEAR, label: { formatter: '今 ' + NOW_YEAR, color: '#c41e3a', position: 'insideEndTop' }, lineStyle: { color: '#c41e3a', type: 'dashed' } }] },
      }],
    };
  }, [w]);

  return (
    <div>
      <PageHeader badge="Cognition · 理论模型库" title="康波周期 · 康德拉季耶夫长波"
        subtitle="约 50—60 年的经济长波 —— 透过技术革命的潮汐，定位中国「换道超车」的周期坐标" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        康波周期由苏联经济学家<strong style={{ color: 'var(--text-primary)' }}>尼古拉·康德拉季耶夫</strong>于 1920 年代提出：通过研究英法美等国物价、利率、工资、贸易的长期数据，他发现资本主义存在约 50—60 年的长期波动，远长于基钦库存周期（3—4 年）与朱格拉设备周期（8—10 年）。每一轮长波由一组<strong style={{ color: 'var(--text-primary)' }}>主导技术</strong>驱动，经历回升—繁荣—衰退—萧条四季；旧波的「冬天」正是下一波技术种子的孕育期。
      </p></Card>

      <Grid cols={4} className="mb-6">
        <Stat value="50—60 年" label="长波周期" accent="#c41e3a" />
        <Stat value="5 (+1)" label="已识别 / 推演长波" accent="#22d3ee" />
        <Stat value="四季" label="回升·繁荣·衰退·萧条" accent="#e8a317" />
        <Stat value="第5波·冬" label="当前坐标（约 2015–2025）" accent="#8b5cf6" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="周期嵌套 · 四种周期长度对比"><EChart option={NESTED} style={{ height: 220 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>短周期叠加在长波之上：同一时点的景气，是多周期相位的合成。</p>
        </Card>
        <Card title="康波四季 · 相位与一般规律">
          <div className="space-y-2">
            {SEASONS.map(([t, c, d]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <Card title="五次长波叠加图 · 主导技术的潮汐（点下方切换长波，叠加其春夏秋冬）" className="mb-6">
        <div className="flex gap-1 flex-wrap mb-3">
          {WAVES.map((x) => (
            <button key={x.id} onClick={() => setSel(x.id)} className="text-xs px-3 py-1.5 rounded mono"
              style={{ background: x.id === sel ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)', color: x.id === sel ? '#fff' : 'var(--text-secondary)', border: `1px solid ${x.id === sel ? x.color : 'transparent'}`, cursor: 'pointer' }}>
              第{x.id}波 · {x.from}
            </button>
          ))}
        </div>
        <EChart option={longWave} style={{ height: 280 }} />
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title={`第 ${w.id} 波 · ${w.tech}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold mono px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: w.color }}>{w.icon}</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{w.from} – {w.to}</span>
            <span className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{w.driver}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{w.note}</p>
        </Card>
        <Card title={`中国在第 ${w.id} 波的位置`}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{w.china}</p>
          {w.id >= 5 && (
            <div className="mt-3 p-3 rounded" style={{ background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
              <span className="text-[10px] mono uppercase" style={{ color: 'var(--china-red)' }}>周期注脚</span>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>「换道超车」的本质，是在第五波的「冬天」抢占第六波（AI/新能源/生物）的起跑线——这正是<span className="mono" style={{ color: 'var(--cyber-cyan)' }}>科技树 / 新质生产力 / 半导体 / 能源主权</span>各模块的长波坐标。</p>
            </div>
          )}
        </Card>
      </Grid>

      <Card title="当前坐标 · 第五波的萧条期与第六波的孕育" className="mb-6">
        <Grid cols={3}>
          {[['萧条期出清', '信息技术红利边际递减，全球进入去杠杆与低增长；这是康波冬季的典型特征（约 2015–2025）。'],
            ['技术种子孕育', 'AI、可控核聚变、新能源、合成生物在冬天积蓄——历史上下一波的主导技术，总在上一波萧条中成型。'],
            ['大国卡位', '谁能在冬季完成对第六波技术群的布局，谁就可能定义下一个 50 年的繁荣——这是现实主义的长周期博弈。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="作为思想工具 · 康波的用法与边界">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          康波不是占卜，而是一副<strong style={{ color: 'var(--text-primary)' }}>「长焦镜头」</strong>：它提醒我们把今天的政策与产业放到 50 年尺度上看——为什么国家不惜代价押注 AI/半导体/聚变？因为长波的窗口期一旦错过，就是一代人的落后。
        </p>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          边界：长波周期是否客观存在、相位如何划分，学界仍有争议（驱动机制、起止年份、是否被政策熨平均存分歧）。本页为分析框架与思想工具，结合各业务模块的实证数据使用，不构成投资建议。起止年份与相位为学界常见区间的示意标注。
        </p>
      </Card>
      <CrossLinks className="mt-6" links={[
        { to: '/techtree', label: '科技树', note: '第六波（AI/聚变/生物）的主导技术群，正是长波回升期的赌注。' },
        { to: '/semiconductor', label: '半导体', note: '卡脖子环节即长波切换的咽喉——错过窗口就是一代人的落后。' },
        { to: '/energy', label: '能源系统', note: '每轮长波都由一次能源—动力革命点火，本轮看新能源与聚变。' },
      ]} />
    </div>
  );
}
