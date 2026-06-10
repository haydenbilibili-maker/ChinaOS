import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const routeCompare = {
  grid: { left: 60, right: 20, top: 36, bottom: 28 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['苏伊士运河线', '北极东北航道'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', name: '航程 (海里)', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  series: [{ type: 'bar', data: [12000, 7200], barWidth: 56, itemStyle: { color: (p) => (p.dataIndex === 1 ? '#22d3ee' : '#475569'), borderRadius: [4, 4, 0, 0] }, label: { show: true, position: 'top', formatter: '{c} nm', color: '#93a1b5' } }],
};
const resourceRadar = {
  radar: { indicator: [{ name: '未开发石油 (13%)', max: 100 }, { name: '未开发天然气 (30%)', max: 100 }, { name: '稀土/战略矿产', max: 100 }, { name: '极地渔业资源', max: 100 }, { name: '数据光缆安全', max: 100 }, { name: '深海主权占位', max: 100 }], axisName: { color: '#93a1b5', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, splitArea: { show: false } },
  series: [{ type: 'radar', data: [{ value: [85, 92, 78, 65, 95, 88], name: '中国战略权重', lineStyle: { color: '#22d3ee', width: 2 }, itemStyle: { color: '#22d3ee' }, areaStyle: { color: 'rgba(34,211,238,0.1)' } }] }],
};
const icebreakerBar = {
  grid: { left: 56, right: 40, top: 16, bottom: 24 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'category', data: ['美国', '芬兰', '加拿大', '中国', '俄罗斯'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  series: [{ name: '重型破冰船数量', type: 'bar', data: [2, 8, 12, 5, 40], barWidth: 14, itemStyle: { color: (p) => (p.dataIndex === 3 ? '#c41e3a' : '#334155'), borderRadius: [0, 4, 4, 0] }, label: { show: true, position: 'right', color: '#93a1b5' } }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Polar Strategy · 第三极" title="极地科考 · 航道与资源" subtitle="冰上丝绸之路 · 破冰船 · 南极条约 · 资源主张" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>北极航道（东北航道）是摆脱「马六甲困境」的物理级备份：与俄罗斯协作构建「冰上丝绸之路」，缩短约 40% 航程，不仅降低燃油成本，更使贸易流向绕过传统海权封锁带，实现对欧亚大陆北端的物理穿透。极地由此成为太平洋、印度洋之外的海洋战略「第三支柱」。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="~40%" label="航道距离缩减比（北极 vs 苏伊士）" accent="#e8a317" />
        <Stat value="5 + 1" label="极地科考站数量 · 秦岭站正式运行" accent="#22d3ee" />
        <Stat value="4.5 万t" label="重型破冰船总吨位 ·「雪龙」系列集群" />
        <Stat value="HIGH" label="资源主权覆盖半径 · Arctic-Circle Presence" accent="#c41e3a" />
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="航程对比：苏伊士线 vs 北极东北航道（海里）">
          <EChart option={routeCompare} style={{ height: 250 }} />
          <p className="text-[11px] mt-3 leading-relaxed italic" style={{ color: 'var(--text-tertiary)' }}>"The Arctic is the third pillar of China's maritime sovereignty beyond the Pacific and Indian Oceans."</p>
        </Card>
        <Card title="资源主权：最后的处女地（战略权重雷达）">
          <EChart option={resourceRadar} style={{ height: 250 }} />
          <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>北极蕴藏全球约 13% 的未开发石油与 30% 的天然气。中国以「近北极国家」身份，通过科考占位与能源企业嵌入（如亚马尔 LNG 项目），确保未来资源再分配中的表决权。</p>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="全球破冰船能级与数量对比（2024 · 重型破冰船）"><EChart option={icebreakerBar} style={{ height: 280 }} /></Card>
        <Card title="核动力：极地生存的算法上限">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>中国正加速研发「极地核动力破冰综合保障平台」。核动力不仅解决极地漫长航程的补能难题，更是移动的「能源堡垒」——具备在极端严寒环境下维持常态化主权存在、保护海底光缆安全、支撑深海矿产开采的物理能级。</p>
          <Grid cols={2}>
            <div className="os-card p-4"><div className="text-lg font-bold mono" style={{ color: '#e8a317' }}>30,000t +</div><div className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>新一代核动力破冰船排水量</div></div>
            <div className="os-card p-4"><div className="text-lg font-bold mono" style={{ color: '#e8a317' }}>YEAR-ROUND</div><div className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>极地航道全季节通航预期</div></div>
          </Grid>
        </Card>
      </Grid>

      <Card title="四大支柱 · 极地战略架构" className="mb-6">
        <Grid cols={4}>
          {[['01 冰上丝绸之路', '#22d3ee', '与俄协作开发东北航道，缩短约 40% 航程，构成规避海权封锁的贸易备份通道。'],
            ['02 极地资源主权', '#e8a317', '科考占位 + 能源企业嵌入（亚马尔 LNG），锁定石油、天然气与战略矿产的再分配席位。'],
            ['03 核动力破冰平台', '#c41e3a', '3 万吨级核动力破冰综合保障平台，支撑全季节通航与常态化极地存在。'],
            ['04 极地态势感知网', '#10b981', '星地一体监测网覆盖航道、冰情与海底光缆，将北极纳入「数字丝路」与「空间主权」联合覆盖区。']].map(([t, c, d]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="南极方向 · 科考站网络与条约框架" className="mb-6">
        <Grid cols={3}>
          {[['5 + 1 站点布局', '长城、中山、昆仑、泰山、秦岭五大南极站加北极黄河站；2024 年秦岭站正式运行，补齐罗斯海区域观测缺口。'],
            ['南极条约约束', '《南极条约》冻结领土主张、限定和平用途；科考存在是条约体系下唯一合法的「占位」方式，站点密度即未来话语权。'],
            ['雪龙集群', '「雪龙」「雪龙 2」构成约 4.5 万吨破冰科考集群，雪龙 2 为全球首艘双向破冰科考船，支撑两极常态化航次。']].map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>

      <Card title="调研结论 · 定义「第三极」均势" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>极地战略不是边缘性的，它是全球引力闭环的物理必经之路。通过构建星地一体的极地监测网、建设具有战略冗余的破冰集群，中国正从「极地参与者」进化为「规则定义者」。在现实主义棋局中，北极是规避地缘包围的战略侧翼，是确保文明体长周期运行的资源备份仓。</p>
        <div className="flex flex-wrap gap-6 text-[10px] mono uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
          <span>// POLAR_SOVEREIGNTY: CLAIMED</span>
          <span>// ICE_SILK_ROAD: SYNCED</span>
          <span>// STATUS: STRATEGIC_ASCENT</span>
        </div>
      </Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>「冰层之下，是主权意志的静默延伸」· 数据为公开信息综合整理与示意值，仅供结构性参考 · 由 china.html「极地战略」专题迁移</p>
    </div>
  );
}
