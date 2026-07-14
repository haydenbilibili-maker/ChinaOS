import React, { useState, useMemo } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { donutOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import {
  AS_OF, DOMAINS, PHASES, getDomain,
  PLATFORM_SPLIT, GIG_PLATFORMS, GIG_SHARE,
  CHARTS, buildGiantWebRadar, buildSovereigntyRadar,
  buildFeedbackSankey, buildPlatformRegRadar,
} from './data.js';

// ============================================================================
// 数字巨网 · 网络塑造的数字中国
// 网络经济 / 网络世界 / 网络传媒 / 社交舆情 / 数字治理
// asOf 2026-07-14 · 公开资料示意
// ============================================================================

function DomainThesis({ domain }) {
  return (
    <div className="os-card p-5 mb-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${domain.accent}` }}>
      <div className="text-[10px] mono uppercase mb-2" style={{ color: domain.accent }}>核心论点 · {domain.label}</div>
      <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{domain.thesis}</p>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
        <span style={{ color: domain.accent }}>张力变量：</span>{domain.tension}
      </p>
    </div>
  );
}

export default function Page() {
  const [domainKey, setDomainKey] = useState('econ');
  const [phaseIdx, setPhaseIdx] = useState(4);
  const domain = getDomain(domainKey);

  const giantRadar = useMemo(() => buildGiantWebRadar(), []);
  const sovereigntyRadar = useMemo(() => buildSovereigntyRadar(), []);
  const feedbackSankey = useMemo(() => buildFeedbackSankey(), []);
  const platformRegRadar = useMemo(() => buildPlatformRegRadar(), []);
  const platformDonut = useMemo(() => donutOpt(PLATFORM_SPLIT), []);
  const gigDonut = useMemo(() => donutOpt(
    GIG_PLATFORMS.map((name, i) => ({
      value: GIG_SHARE[i],
      name,
      itemStyle: { color: ['#c41e3a', '#e8a317', '#22d3ee', '#f472b6', '#8b5cf6', '#10b981'][i] },
    })),
  ), []);

  const frameworkCards = [
    {
      key: 'salt',
      title: '盐铁逻辑',
      subtitle: '平台命脉 · 数据专营',
      accent: 'var(--fire-gold)',
      border: 'var(--fire-gold)',
      body: '超级平台掌握交易、支付、信用与流量分配——数字时代的盐铁专营。国家以牌照、合规与特殊管理股回收关键节点控制权。',
      pillars: [['平台垄断', '双边市场锁定'], ['数据专营', '三权分置'], ['算法调控', '推荐即权力']],
    },
    {
      key: 'stone',
      title: '摸石头方法论',
      subtitle: '试点 · 灰度 · 迭代',
      accent: 'var(--cyber-cyan)',
      border: 'var(--cyber-cyan)',
      body: '数字经济政策沿「鼓励创新 → 发现问题 → 集中整改 → 常态化监管」螺旋上升：蚂蚁 IPO、反垄断罚单、数据安全审查均为摸石头代价。',
      pillars: [['绿灯案例', '整改验收'], ['自贸区试点', '数据出境'], ['算法备案', '沙盒测试']],
    },
    {
      key: 'path',
      title: '升级路径',
      subtitle: '消费互联网 → 产业数字化',
      accent: 'var(--china-red)',
      border: 'var(--china-red)',
      body: '增长引擎从流量收割切换至数实融合与 AI 赋能：东数西算承接算力，数据要素入表打开资产通道，大模型重估平台价值。',
      pillars: [['智算基建', '算力主权'], ['数据要素', '第五要素'], ['AI 2.0', '规则竞争']],
    },
  ];

  return (
    <div>
      <PageHeader
        badge="Digital Web · 巨网透视"
        title="数字巨网 · 网络塑造的数字中国"
        subtitle="网络经济 · 网络世界 · 网络传媒 · 社交舆情 · 数字治理"
      />

      <IntroCard>
        中国互联网已不仅是技术基础设施，而是重塑经济组织、信息流动、舆论场与治理接口的<strong style={{ color: 'var(--text-primary)' }}>巨型耦合系统</strong>。
        本模块从<strong style={{ color: 'var(--cyber-cyan)' }}>网络经济、网络世界、网络传媒、社交舆情、数字治理</strong>五维切入，
        解析平台权力、语义防火墙、算法分发与<strong style={{ color: 'var(--text-primary)' }}>赛博反馈</strong>如何深度刻画当代数字中国。
        数据截至 <span className="mono" style={{ color: 'var(--cyber-cyan)' }}>{AS_OF}</span>，均为公开资料示意，非官方统计。
      </IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="5 维" label="研究切面" accent="#c41e3a" />
        <Stat value="11 亿+" label="网民规模 · 全球最大" accent="#22d3ee" />
        <Stat value="57.8 万亿" label="数字经济规模(2024)" accent="#e8a317" />
        <Stat value={AS_OF} label="数据截至" accent="#8b5cf6" />
      </Grid>

      <Card title="全局雷达 · 数字巨网六维画像（示意）" className="mb-6">
        <Grid cols={2}>
          <EChart option={giantRadar} style={{ height: 300 }} />
          <div className="os-card p-4 flex flex-col justify-center" style={{ background: 'var(--bg-elevated)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>结构解读</div>
            <ul className="space-y-2 text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              <li><span style={{ color: '#c41e3a' }}>·</span> 网络世界与网络经济数据体量领先，但传媒/舆情/治理的「规则层」权重快速上升。</li>
              <li><span style={{ color: '#22d3ee' }}>·</span> 2018→2024 六维全面提升，算力底座与数字治理是增速最快的两条曲线。</li>
              <li><span style={{ color: '#e8a317' }}>·</span> 与全球均值相比，中国在接入规模与治理强度上显著偏离，平台全球化仍是短板。</li>
            </ul>
          </div>
        </Grid>
      </Card>

      <FrameworkTrio cards={frameworkCards} />

      <Card title="演进时间线 · 数字巨网五阶段" className="mb-6">
        <TimelineBar stages={PHASES} activeIdx={phaseIdx} onSelect={setPhaseIdx} />
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          从接入普及到 AI 巨网 2.0：每一阶段都在重新定义「网络」的边界——从信息通道，到经济操作系统，再到国家治理接口。
        </p>
      </Card>

      <Card title="切面切换 · 五维深度透视" className="mb-6">
        <SelectorBar items={DOMAINS} activeKey={domainKey} onSelect={setDomainKey} getLabel={(i) => i.label} />
        <Grid cols={3} className="mb-4">
          {domain.metricCards.map((m) => (
            <Stat key={m.label} value={m.value} label={m.label} accent={domain.accent} />
          ))}
        </Grid>
        <DomainThesis domain={domain} />
      </Card>

      {/* 网络经济 */}
      <Card title="一、网络经济 · 平台、电商与零工蓄水池" className="mb-6">
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>数字经济规模与 GDP 占比</div>
            <EChart option={CHARTS.deScaleTrend()} style={{ height: 240 }} />
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>平台收入结构（示意 %）</div>
            <EChart option={platformDonut} style={{ height: 240 }} />
          </div>
        </Grid>
        <Grid cols={2} className="mt-4">
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>零工经济劳动者规模</div>
            <EChart option={CHARTS.gigEconomy()} style={{ height: 220 }} />
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>零工业态分布（示意 %）</div>
            <EChart option={gigDonut} style={{ height: 220 }} />
          </div>
        </Grid>
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          电商全球第一、平台市值波动剧烈；数据作为第五要素入表后，平台竞争从 GMV 转向「数据 × 算力 × 合规」的系统对抗。
        </p>
      </Card>

      {/* 网络世界 */}
      <Card title="二、网络世界 · 接入普及与网络空间主权" className="mb-6">
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>网民规模 · 普及率 · 户均带宽</div>
            <EChart option={CHARTS.netPenetration()} style={{ height: 260 }} />
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>数字基建对比（2020 vs 2024）</div>
            <EChart option={CHARTS.infraCompare()} style={{ height: 260 }} />
          </div>
        </Grid>
        <div className="mt-4">
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>网络空间主权 · 中美欧对比雷达（示意）</div>
          <EChart option={sovereigntyRadar} style={{ height: 280 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
            语义防火墙不是单一技术，而是接入管控、内容审查、数据本地化、算法可解释、跨境流动与平台合规的叠加工程。
          </p>
        </div>
      </Card>

      {/* 网络传媒 */}
      <Card title="三、网络传媒 · 算法分发与融媒双轨" className="mb-6">
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>渠道注意力 vs 广告收入（%）</div>
            <EChart option={CHARTS.mediaAttention()} style={{ height: 260 }} />
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>短视频用户与日均时长</div>
            <EChart option={CHARTS.shortVideoTrend()} style={{ height: 260 }} />
          </div>
        </Grid>
        <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
          短视频吞噬三分之一注意力带宽；主流媒体融媒转型与商业平台「特殊管理股」构成双轨传播——议程在上游，流量在平台。
        </p>
      </Card>

      {/* 社交舆情 */}
      <Card title="四、社交舆情 · 赛博反馈与危机传播" className="mb-6">
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>舆情情感结构走势（%）</div>
            <EChart option={CHARTS.sentimentCycle()} style={{ height: 240 }} />
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>典型危机传播曲线 · 声量指数</div>
            <EChart option={CHARTS.crisisPropagation()} style={{ height: 240 }} />
          </div>
        </Grid>
        <div className="mt-4">
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>赛博反馈回路 · Sankey（示意）</div>
          <EChart option={feedbackSankey} style={{ height: 300 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
            网民表达 → 平台采集 → 舆情系统 → 口径生成 → 算法调控形成闭环；网格反馈把基层信号回流决策内核，小时级响应成为常态。
          </p>
        </div>
      </Card>

      {/* 数字治理 */}
      <Card title="五、数字治理 · 语义防火墙与平台规制" className="mb-6">
        <Grid cols={2}>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>平台监管温度指数（0–100）</div>
            <EChart option={CHARTS.regTemperature()} style={{ height: 240 }} />
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>数字政府能力成熟度（示意）</div>
            <EChart option={CHARTS.govMaturity()} style={{ height: 240 }} />
          </div>
        </Grid>
        <div className="mt-4">
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>平台监管执法强度 · 六维雷达</div>
          <EChart option={platformRegRadar} style={{ height: 260 }} />
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
            健康码证明数字治理的动员极限；社会信用、算法备案与数据分类分级把平台纳入科层接口——效率与权利的平衡仍是未闭合议题。
          </p>
        </div>
      </Card>

      <ModuleFooter
        moduleId="digitalGiantWeb"
        sourceNote={`AS_OF ${AS_OF} · CNNIC/工信部/平台财报/政策文本整理`}
      />
    </div>
  );
}
