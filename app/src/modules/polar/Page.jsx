import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, radarOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const ROUTES = [
  { key: 'suez', label: '苏伊士运河线', accent: '#64748b', distance: 12000, days: 35, desc: '传统亚欧贸易主通道，经马六甲—印度洋—苏伊士。地缘风险集中：海盗、封锁、运河拥堵。' },
  { key: 'nep', label: '北极东北航道', accent: '#22d3ee', distance: 7200, days: 22, desc: '冰上丝绸之路：航程缩短约 40%，燃油成本显著下降，绕过传统海权封锁带——马六甲困境的物理级备份。' },
];

const resourceRadar = radarOpt(['未开发石油', '未开发天然气', '稀土矿产', '极地渔业', '数据光缆', '深海占位'], [85, 92, 78, 65, 95, 88], { name: '战略权重', color: '#22d3ee' });

const icebreakerBar = {
  grid: GRID,
  xAxis: valueY(),
  yAxis: categoryX(['美国', '芬兰', '加拿大', '中国', '俄罗斯']),
  series: [{ type: 'bar', data: [2, 8, 12, 5, 40], barWidth: 14,
    itemStyle: { color: (p) => (p.dataIndex === 3 ? '#c41e3a' : '#334155'), borderRadius: [0, 4, 4, 0] },
    label: { show: true, position: 'right', color: '#93a1b5' } }],
};

export default function Page() {
  const [routeKey, setRouteKey] = useState('nep');
  const route = ROUTES.find((r) => r.key === routeKey) || ROUTES[1];

  const routeCompare = {
    grid: GRID,
    tooltip: { trigger: 'axis' },
    xAxis: categoryX(ROUTES.map((r) => r.label)),
    yAxis: valueY({ name: '航程 (海里)' }),
    series: [{ type: 'bar', data: ROUTES.map((r) => ({
      value: r.distance,
      itemStyle: { color: r.key === routeKey ? r.accent : 'rgba(100,116,139,0.5)', borderRadius: [4, 4, 0, 0] },
    })), barWidth: 56, label: { show: true, position: 'top', formatter: '{c} nm', color: '#93a1b5' } }],
  };

  return (
    <div>
      <PageHeader badge="Polar Strategy · 第三极" title="极地科考 · 航道与资源" subtitle="冰上丝绸之路 · 破冰船 · 南极条约 · 资源主张" />
      <IntroCard>北极航道是摆脱<strong style={{ color: 'var(--text-primary)' }}>马六甲困境</strong>的物理级备份：与俄罗斯协作构建「冰上丝绸之路」，缩短约 40% 航程，使贸易流向绕过传统海权封锁带。极地由此成为太平洋、印度洋之外的海洋战略「第三支柱」。</IntroCard>

      <Grid cols={4} className="mb-6">
        <Stat value="~40%" label="航程缩减比 · 北极 vs 苏伊士" accent="#e8a317" />
        <Stat value={`${route.distance} nm`} label={`${route.label} · 切换`} accent={route.accent} />
        <Stat value="5 + 1" label="极地科考站 · 秦岭站" accent="#22d3ee" />
        <Stat value="4.5 万t" label="雪龙系列破冰集群" accent="#c41e3a" />
      </Grid>

      <Card title="交互 · 航道对比切换 · 航程/天数" className="mb-6">
        <SelectorBar items={ROUTES} activeKey={routeKey} onSelect={setRouteKey} />
        <Grid cols={2}>
          <EChart option={routeCompare} style={{ height: 240 }} />
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${route.accent}` }}>
            <Grid cols={2} className="mb-3">
              <Stat value={route.distance} label="航程 (海里)" accent={route.accent} />
              <Stat value={`~${route.days} 天`} label="典型航时" accent="#64748b" />
            </Grid>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{route.desc}</p>
          </div>
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="极地资源战略权重雷达"><EChart option={resourceRadar} style={{ height: 250 }} /></Card>
        <Card title="全球重型破冰船数量对比"><EChart option={icebreakerBar} style={{ height: 250 }} /></Card>
      </Grid>

      <FrameworkTrio cards={[
        { title: '冰上丝绸之路', subtitle: '东北航道 · 俄协作', body: '北极不是边缘板块，而是全球引力闭环的物理必经之路。东北航道构成规避地缘包围的战略侧翼，是文明体长周期运行的贸易备份通道。', pillars: [['航程 -40%', '7200 vs 12000 海里。'], ['燃油节约', '降低航运碳排与成本。'], ['封锁规避', '绕过马六甲单一节点。']] },
        { title: '资源占位 · 摸石头', subtitle: '亚马尔 · 科考站', body: '北极蕴藏 13% 未开发石油与 30% 天然气。以「近北极国家」身份，通过科考占位与能源企业嵌入（亚马尔 LNG），确保未来资源再分配中的表决权。', pillars: [['科考站 5+1', '秦岭站补齐罗斯海。'], ['南极条约', '和平用途下的合法占位。'], ['雪龙集群', '双向破冰科考能力。']] },
        { title: '升级路径 · 核动力', subtitle: '3 万吨级平台', body: '核动力破冰综合保障平台解决极地漫长航程补能难题，支撑全季节通航、海底光缆保护与深海矿产开采——极地生存的算法上限。', pillars: [['30,000t+', '新一代核动力平台。'], ['YEAR-ROUND', '全季节通航预期。'], ['态势感知', '星地一体监测网。']] },
      ]} />

      <Card title="调研结论 · 定义第三极均势"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>通过构建星地一体极地监测网、建设战略冗余的破冰集群，中国正从「极地参与者」进化为「规则定义者」。在现实主义棋局中，北极是规避地缘包围的战略侧翼，是确保文明体长周期运行的资源备份仓。</p></Card>

      <ModuleFooter moduleId="polar" sourceNote="由 china.html「极地战略」专题迁移升级" />
    </div>
  );
}
