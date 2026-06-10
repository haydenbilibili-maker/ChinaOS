import React from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

const marketScale = {
  grid: { left: 44, right: 16, top: 20, bottom: 24 },
  xAxis: { type: 'category', data: ['2016', '2018', '2020', '2022', '2023', '2025E'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  yAxis: { type: 'value', axisLabel: { formatter: '{value} 万亿', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [0.37, 0.53, 0.73, 0.98, 1.27, 1.65], lineStyle: { color: '#c41e3a', width: 2 }, itemStyle: { color: '#c41e3a' }, areaStyle: { color: 'rgba(196,30,58,0.12)' } }],
};
const localizationBar = {
  legend: { bottom: 0, textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  grid: { left: 40, right: 16, top: 16, bottom: 46 },
  xAxis: { type: 'category', data: ['体外诊断', '1.5T MRI', '3.0T MRI', '64排 CT', 'PET-CT', '手术机器人'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5', fontSize: 10, interval: 0 } },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: '#93a1b5' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
  series: [
    { name: '2020 国产化率', type: 'bar', data: [75, 35, 12, 15, 8, 2], barWidth: 12, itemStyle: { color: '#e8a317', borderRadius: 3 } },
    { name: '2024E 国产化率', type: 'bar', data: [92, 68, 42, 45, 35, 18], barWidth: 12, itemStyle: { color: '#10b981', borderRadius: 3 } },
  ],
};
const aiDonut = {
  legend: { orient: 'vertical', right: 8, top: 'middle', textStyle: { color: '#93a1b5', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
  series: [{
    type: 'pie', radius: ['55%', '78%'], center: ['38%', '50%'], label: { show: false },
    data: [
      { value: 35, name: 'AI 影像辅助', itemStyle: { color: '#c41e3a' } },
      { value: 25, name: '病理与检验', itemStyle: { color: '#22d3ee' } },
      { value: 18, name: '手术导航', itemStyle: { color: '#e8a317' } },
      { value: 12, name: '医院信息化', itemStyle: { color: '#10b981' } },
      { value: 10, name: '其他 AI', itemStyle: { color: '#93a1b5' } },
    ],
  }],
};

export default function Page() {
  return (
    <div>
      <PageHeader badge="Med Equipment · 健康中国 2030" title="高端医疗装备 · 进口替代" subtitle="影像设备 · 集采降价 · 国产替代 —— 从「采购清单」到产业安全变量" />
      <Card className="mb-6"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>健康中国 2030 与集采、创新审批绿色通道双轮驱动国产替代与高端突破：影像设备、手术机器人、PET-CT 等高端器械国产化率持续提升，但球管、探测器、超导磁体等核心部件仍存对外依赖。器械竞争力是临床可及性与产业链韧性的交集。</p></Card>
      <Grid cols={4} className="mb-6">
        <Stat value="~1.3 万亿" label="2023 市场规模 (RMB)" accent="#c41e3a" />
        <Stat value="12%+" label="年均复合增速" accent="#22d3ee" />
        <Stat value="~40%" label="影像设备国产化率" accent="#e8a317" />
        <Stat value="#2" label="全球医疗器械市场" accent="#10b981" />
      </Grid>
      <Grid cols={2} className="mb-6">
        <Card title="医疗器械市场规模（万亿元 · 药监局/行业机构）"><EChart option={marketScale} style={{ height: 240 }} /></Card>
        <Card title="高端器械国产化率对比（2020 vs 2024E · %）"><EChart option={localizationBar} style={{ height: 240 }} /></Card>
      </Grid>

      <Card title="影像设备与高端器械 · MRI / CT / PET-CT 三线突破" className="mb-6">
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>MRI、CT、PET-CT 与国产超导、探测器、关键部件突破，是进口替代的主战场。</p>
        <Grid cols={3}>
          {[['磁共振成像 (MRI)', '国产 1.5T 普及、3.0T 放量，头部企业攻关 5.0T 与 9.4T 超高端；超导磁体与线圈自主化推进。', '场强 1.5–9.4T · 国产份额提升', '#c41e3a'],
            ['高端 CT', '从 16 排到 640 排，国产宽体 CT 与能谱 CT 放量；X 射线管、探测器国产替代加速。', '排数 16–640 · 国产份额提升', '#22d3ee'],
            ['PET-CT 与核医学成像', '国产 PET-CT 装机与放射性药物配套跟进；探测器、晶体与多模态融合（PET-MR）为长期攻关方向，与肿瘤早筛、精准诊疗绑定。', '示踪剂自主推进 · 国产装机约 40%', '#10b981']].map(([t, d, m, c]) => (
            <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
              <p className="text-[11px] mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{d}</p>
              <div className="text-[10px] mt-2 mono" style={{ color: c }}>{m}</div>
            </div>
          ))}
        </Grid>
      </Card>

      <Grid cols={2} className="mb-6">
        <Card title="GPS 三巨头对标 · 进口替代的真实坐标">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>GE、Philips、Siemens（GPS）长期占据高端影像装机主导，国产厂商（联影等）以整机性价比 + 集采准入切入，再向核心部件与超高端机型纵深替代。</p>
          <div className="space-y-2">
            {[['整机层', '国产 1.5T/64 排已具竞争力，3.0T 与宽体 CT 进入三级医院；超高端（5.0T、能谱）仍是 GPS 优势区。', '#c41e3a'],
              ['部件层', '球管、探测器、超导磁体国产化率低于整机，是「替代深水区」与卡脖子风险点。', '#e8a317'],
              ['生态层', '装机后服务、临床科研合作与医生培训体系决定长期粘性，GPS 沉淀数十年，国产正在补课。', '#22d3ee']].map(([t, d, c]) => (
              <div key={t} style={{ borderLeft: `2px solid ${c}`, paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{d}</p></div>
            ))}
          </div>
        </Card>
        <Card title="手术机器人 · 腔镜放量与骨科、神外拓展">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>进口多孔腔镜仍占高端份额，国产在获批术式、成本与服务体系上追赶；5G 远程主从手术在示教与应急场景落地，受制于网络时延与责任界定。</p>
          <div className="space-y-2">
            <div style={{ borderLeft: '2px solid #10b981', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>腔镜手术机器人</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>机械臂精度、力反馈与视觉融合决定临床可替代空间；培训与跟台体系是商业化关键变量。</p></div>
            <div style={{ borderLeft: '2px solid #22d3ee', paddingLeft: 10 }}><div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>5G 远程主从手术</div><p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>端到端时延需稳定低于约 10ms 量级方可主从同步；当前多用于指导与部分术式验证。</p></div>
            <div className="text-[10px] mono mt-2" style={{ color: '#93a1b5' }}>精度: 追赶 · 装机: 放量 · 术式: 拓展</div>
          </div>
        </Card>
      </Grid>

      <Grid cols={2} className="mb-6">
        <Card title="医疗 AI 应用结构（示意 · %）"><EChart option={aiDonut} style={{ height: 240 }} /></Card>
        <Card title="数字化 · AI + 影像、病理与医院信息化">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>AI 辅助诊断、结构化病历与 DRG/DIP 联动改变医院运营；三类证审批与真实世界数据（RWE）决定产品生命周期与入院节奏。</p>
          <Grid cols={2}>
            <div className="os-card p-3 text-center"><div className="text-lg font-bold mono" style={{ color: '#22d3ee' }}>&gt;95%</div><div className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>AI 影像示意敏感度（特定病种辅助筛查）</div></div>
            <div className="os-card p-3 text-center"><div className="text-lg font-bold mono" style={{ color: '#e8a317' }}>3,000+ 项</div><div className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>数字疗法与软件在研管线（含非三类）</div></div>
          </Grid>
        </Card>
      </Grid>

      <Card title="战略结论" className="mb-6">
        <Grid cols={3}>
          {[['1 · 国产替代与创新并行', '集采压价与绿色通道并行，高端影像、机器人与 AI 软件构成三条主战线。'],
            ['2 · 支付与入院节奏', 'DRG/DIP 与医院资本开支周期决定设备更新；高值耗材「量价」再平衡是常态约束。'],
            ['3 · 供应链与合规', '核心部件（球管、探测器、磁体）与放射性药物仍存对外依赖，出海需同步适配海外监管与临床证据链。']].map(([t, d]) => (
            <div key={t}><div className="text-sm font-semibold" style={{ color: 'var(--china-red)' }}>{t}</div><p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
          ))}
        </Grid>
      </Card>
      <Card title="制度锚点"><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>健康中国 2030 将医疗装备从「采购清单」提升为公共卫生能力与产业安全变量；器械竞争力是临床可及性与产业链韧性的交集。</p></Card>
      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>数据为行业公开区间与模型示意，具体以药监局、EvaluateMedTech 等披露为准 · 由 china.html「医疗装备」专题迁移</p>
    </div>
  );
}
