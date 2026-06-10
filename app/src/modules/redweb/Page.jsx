import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { categoryX, valueY, GRID, donutOpt } from '../shared/chartHelpers.js';
import { IntroCard, SelectorBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';

const LAYERS = [
  { key: 'political', label: '政治层', accent: '#c41e3a', share: 45, desc: '红二代掌权中、红三代接班/商业化。联姻与政治内婚巩固精英闭环，反腐对山头主义形成持续清洗。' },
  { key: 'capital', label: '资本层', accent: '#e8a317', share: 35, desc: '白手套代持、离岸信托、PE 运作。权力变现经 VIE/BVI 架构切断直接法律联系。' },
  { key: 'military', label: '军工层', accent: '#8b5cf6', share: 20, desc: '军工复合体是最封闭的利益堡垒。军改后对山头主义清洗，影响力更多转化为隐形顾问角色。' },
];

const assetChart = {
  grid: { left: 90, right: 24, top: 16, bottom: 24 },
  xAxis: valueY(),
  yAxis: categoryX(['离岸信托', '不动产包', '代持/壳公司', '私募股权 PE']),
  series: [{ type: 'bar', data: [56, 142, 210, 89], barWidth: 14, itemStyle: { color: '#c41e3a', borderRadius: 3 }, label: { show: true, position: 'right', color: '#93a1b5' } }],
};

const networkDonut = (layer) => donutOpt([
  { value: layer.share, name: layer.label, itemStyle: { color: layer.accent } },
  { value: 100 - layer.share, name: '其他层级', itemStyle: { color: '#64748b' } },
]);

const TRANSFER = [
  ['1. 权力变现', '利用批文、土地审批或牌照获取初始资本。'],
  ['2. 白手套代持', '资金进入特定民营企业或代理人名下，切断直接法律联系。'],
  ['3. 离岸架构', '在 BVI/开曼设壳公司，经 VIE 架构反向控制境内资产。'],
  ['4. 终端清洗', '购买海外不动产、艺术品或设立家族信托。'],
];

export default function Page() {
  const [layerKey, setLayerKey] = useState('political');
  const layer = LAYERS.find((l) => l.key === layerKey) || LAYERS[0];

  return (
    <div>
      <PageHeader badge="Red Net · 结构分析" title="红网 · 权贵网络的结构逻辑" subtitle="宗族联邦 · 代际转移 · 白手套机制 · 军工复合体 —— 作为结构现象的分析框架" />
      <IntroCard>本模块从政治经济学视角，把「权贵网络」作为一种<strong style={{ color: 'var(--text-primary)' }}>结构现象</strong>来分析：在制度表象之下，存在由血缘、联姻与利益交换编织的精英闭环。反腐对「山头主义」形成持续清洗，但权力—资本的耦合通过<strong style={{ color: 'var(--cyber-cyan)' }}>离岸窗口</strong>与白手套得以延续。<span style={{ color: 'var(--text-tertiary)' }}> 本页仅作机制层面的结构分析，不构建针对具体个人/家族的指认。</span></IntroCard>

      <Grid cols={3} className="mb-6">
        <Stat value="结构现象" label="分析对象" accent="#c41e3a" />
        <Stat value="金融·能源·军工" label="耦合密集领域" />
        <Stat value={`${layer.share}%`} label={`${layer.label}权重 · 切换`} accent={layer.accent} />
      </Grid>

      <Card title="交互 · 网络层级切换 · 结构权重" className="mb-6">
        <SelectorBar items={LAYERS} activeKey={layerKey} onSelect={setLayerKey} />
        <Grid cols={2}>
          <div className="os-card p-4" style={{ background: 'var(--bg-elevated)', borderLeft: `3px solid ${layer.accent}` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{layer.desc}</p>
          </div>
          <EChart option={networkDonut(layer)} style={{ height: 200 }} />
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="代际权力转移状态（模型 · 示意）">
          {[['红二代（掌权中）', 45, '#c41e3a'], ['红三代（接班/商业化）', 35, '#e8a317'], ['边缘化/被清洗', 20, '#64748b']].map(([t, v, c]) => (
            <div key={t} className="mb-3">
              <div className="flex justify-between text-xs mb-1"><span style={{ color: 'var(--text-secondary)' }}>{t}</span><span className="mono" style={{ color: 'var(--text-primary)' }}>{v}%</span></div>
              <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3 }}><div style={{ width: `${v}%`, height: '100%', background: c, borderRadius: 3 }} /></div>
            </div>
          ))}
        </Card>
        <Card title="离岸资产类型分布（聚合估算 · 示意）"><EChart option={assetChart} style={{ height: 220 }} /></Card>
      </Grid>

      <Card title="资本运作路径 · 一般机制" className="mb-6">
        <Grid cols={4}>
          {TRANSFER.map(([t, d]) => (
            <div key={t} style={{ borderLeft: '2px solid var(--china-red)', paddingLeft: 12 }}>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <FrameworkTrio cards={[
        { title: '儒表法里 · 网络逻辑', subtitle: '权力物理学延伸', body: '权贵网络是权力物理学在精英层的投影：血缘与联姻降低交易成本，白手套切断法律追溯链。反腐是周期性的「系统杀毒」，但结构诱因（审批权、信息不对称）仍在。', pillars: [['政治内婚', '联姻巩固保护伞与商业利益闭环。'], ['代际转移', '红三代转向 PE 与离岸资本运作。'], ['山头清洗', '军改与反腐压缩封闭堡垒。']] },
        { title: '离岸窗口 · 资产清洗', subtitle: 'BVI · 信托 · VIE', body: '离岸架构是权力—资本置换的终端模块：境内审批权 → 白手套代持 → 离岸壳公司 → 海外不动产/信托。与港澳离岸模块形成制度接口对照。', pillars: [['VIE 反向控制', '切断直接持股的法律联系。'], ['家族信托', '代际财富隔离与传承。'], ['聚合估算', '本页数值为模型示意，非个案指认。']] },
        { title: '升级路径 · 制度约束', subtitle: '反腐 · 透明 · 数字利维坦', body: '从个案反腐到制度性约束：巡视、审计、数字政务降低审批黑箱。数字利维坦既是监控工具，也可能压缩传统网络的操作空间。', pillars: [['巡视审计', '周期性结构清洗。'], ['数字政府', '审批留痕降低寻租空间。'], ['公开履历', '人才库模块交叉验证节点。']] },
      ]} />

      <Card title="军工复合体 · 「枪杆子」的结构封闭性">
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>军工复合体是权贵网络中最核心、最封闭的利益堡垒。军队改革不仅是架构调整，更是对「山头主义」的清洗——<strong style={{ color: 'var(--text-primary)' }}>公开查处的军老虎案件</strong>标志着军权的重新集中。多数「军二代」已退出军队实权岗位，影响力更多转化为军工企业的商业咨询或隐形顾问角色。</p>
      </Card>

      <ModuleFooter moduleId="redweb" disclaimer="本模块为结构层面的政治经济学分析（OSINT），数值为模型示意，不构成对具体个人的事实指认或决策依据" sourceNote="框架迁自 china.html「红网」专题" />
    </div>
  );
}
