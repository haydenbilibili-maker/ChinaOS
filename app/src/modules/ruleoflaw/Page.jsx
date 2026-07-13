import React, { useState } from 'react';
import { PageHeader, Card, Grid, Stat } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';
import { IntroCard, SelectorBar, TimelineBar, FrameworkTrio, ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { AXIS, LABEL, GRID_LINE, CHART_SERIES_PALETTE } from '../shared/chartHelpers.js';


// ── ① 营商法治 ──────────────────────────────
const dividendTrend = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2018', '2020', '2022', '2024'], ...AXIS, axisLabel: LABEL },
  yAxis: { type: 'value', name: '指数', nameTextStyle: { color: '#5b6a82' }, axisLabel: { color: '#93a1b5' }, ...GRID_LINE },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, data: [60, 72, 84, 95], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.1)' } }],
};
const bankruptcyOpt = {
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  legend: { textStyle: { color: '#93a1b5' }, top: 0, data: ['受理破产案', '重整成功率'] },
  xAxis: { type: 'category', data: ['2019', '2021', '2023', '2025E'], ...AXIS, axisLabel: LABEL },
  yAxis: [
    { type: 'value', name: '万件', nameTextStyle: { color: '#5b6a82' }, axisLabel: { color: '#93a1b5' }, ...GRID_LINE },
    { type: 'value', name: '%', max: 100, nameTextStyle: { color: '#5b6a82' }, axisLabel: { color: '#93a1b5' }, splitLine: { show: false } },
  ],
  series: [
    { name: '受理破产案', type: 'bar', barWidth: 22, data: [1.0, 1.4, 1.9, 2.3], itemStyle: { color: '#8b5cf6', borderRadius: [3, 3, 0, 0] } },
    { name: '重整成功率', type: 'line', yAxisIndex: 1, smooth: true, data: [38, 47, 55, 61], lineStyle: { color: '#e8a317', width: 2 }, itemStyle: { color: '#e8a317' } },
  ],
};

// ── ② 知产护城河 ────────────────────────────
const ipBar = {
  grid: { left: 44, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2018', '2020', '2022', '2024'], ...AXIS, axisLabel: LABEL },
  yAxis: { type: 'value', name: '万元/件', nameTextStyle: { color: '#5b6a82' }, axisLabel: { color: '#93a1b5' }, ...GRID_LINE },
  series: [{ type: 'bar', data: [50, 110, 220, 400], barWidth: 28, itemStyle: { color: '#c41e3a', borderRadius: [3, 3, 0, 0] } }],
};
const patentOpt = {
  grid: { left: 48, right: 16, top: 30, bottom: 24 },
  legend: { textStyle: { color: '#93a1b5' }, top: 0, data: ['发明专利授权', '平均确权周期'] },
  xAxis: { type: 'category', data: ['2018', '2020', '2022', '2024'], ...AXIS, axisLabel: LABEL },
  yAxis: [
    { type: 'value', name: '万件', nameTextStyle: { color: '#5b6a82' }, axisLabel: { color: '#93a1b5' }, ...GRID_LINE },
    { type: 'value', name: '月', max: 24, nameTextStyle: { color: '#5b6a82' }, axisLabel: { color: '#93a1b5' }, splitLine: { show: false } },
  ],
  series: [
    { name: '发明专利授权', type: 'bar', barWidth: 24, data: [43, 53, 80, 92], itemStyle: { color: '#22d3ee', borderRadius: [3, 3, 0, 0] } },
    { name: '平均确权周期', type: 'line', yAxisIndex: 1, smooth: true, data: [22, 20, 16, 13], lineStyle: { color: '#fb923c', width: 2 }, itemStyle: { color: '#fb923c' } },
  ],
};

// ── ③ 智慧法院 ──────────────────────────────
const courtRadar = {
  radar: {
    indicator: [
      { name: '区块链存证', max: 100 }, { name: 'AI 辅助量刑', max: 100 },
      { name: '文书公开', max: 100 }, { name: '在线诉讼', max: 100 },
      { name: '智能送达', max: 100 }, { name: '类案推送', max: 100 },
    ],
    splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } },
    splitArea: { areaStyle: { color: ['rgba(34,211,238,0.04)', 'rgba(34,211,238,0.02)'] } },
    axisLine: { lineStyle: { color: '#27324a' } },
    name: { color: '#93a1b5', fontSize: 11 },
  },
  series: [{ type: 'radar', data: [{ value: [96, 78, 92, 90, 85, 81], name: '智慧法院 4.0', areaStyle: { color: 'rgba(34,211,238,0.18)' }, lineStyle: { color: '#22d3ee' }, itemStyle: { color: '#22d3ee' } }] }],
};
const onlineTrend = {
  grid: { left: 40, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024'], ...AXIS, axisLabel: LABEL },
  yAxis: { type: 'value', name: '%', max: 100, nameTextStyle: { color: '#5b6a82' }, axisLabel: { color: '#93a1b5' }, ...GRID_LINE },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [54, 67, 78, 86, 91], lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' }, areaStyle: { color: 'rgba(16,185,129,0.1)' } }],
};

// ── ④ 涉外法治 ──────────────────────────────
const sovToolkit = {
  grid: { left: 96, right: 24, top: 8, bottom: 24 },
  xAxis: { type: 'value', max: 100, ...AXIS, axisLabel: LABEL, ...GRID_LINE },
  yAxis: { type: 'category', data: ['长臂管辖反制', '数据跨境规则', '反外国制裁法', '阻断办法', 'CICC 商事仲裁'], axisLine: { lineStyle: { color: '#27324a' } }, axisLabel: { color: '#93a1b5' } },
  series: [{ type: 'bar', barWidth: 16, data: [58, 64, 72, 67, 80], itemStyle: { color: '#c41e3a', borderRadius: [0, 3, 3, 0] } }],
};

const TABS = [
  { id: 'biz', label: '① 营商法治' },
  { id: 'ip', label: '② 知产护城河' },
  { id: 'court', label: '③ 智慧法院' },
  { id: 'intl', label: '④ 涉外法治' },
];

function tabStyle(active) {
  return {
    padding: '6px 14px',
    fontSize: 13,
    borderRadius: 6,
    cursor: 'pointer',
    background: active ? 'rgba(196,30,58,0.2)' : 'var(--bg-elevated)',
    color: active ? '#fff' : 'var(--text-secondary)',
    border: active ? '1px solid #c41e3a' : '1px solid var(--border-subtle)',
    transition: 'all 0.15s',
  };
}

export default function Page() {
  const [tab, setTab] = useState('biz');

  return (
    <div>
      <PageHeader badge="Rule of Law · 制度红利" title="法治建设与司法现代化" subtitle="营商环境法治化 · 知识产权护城河 · 智慧法院 · 涉外法治博弈 —— 制度红利替代要素红利" />

      <Grid cols={4} className="mb-6">
        <Stat value="99.5%" label="一审结案率" accent="#10b981" />
        <Stat value="1.4 亿+" label="文书公开份数" accent="#22d3ee" />
        <Stat value="UP TO 5X" label="惩罚性赔偿" accent="#c41e3a" />
        <Stat value="100%" label="智慧法院 4.0 覆盖" accent="#e8a317" />
      </Grid>

      <div className="flex flex-wrap gap-2 mb-6 os-tab-bar">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={tabStyle(tab === t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ① 营商法治 */}
      {tab === 'biz' && (
        <div>
          <Grid cols={2} className="mb-6">
            <Card title="营商环境 · 法治作为第一确定性">
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>通过《民法典》及外商投资法，建立对标国际的营商环境算法。现实主义逻辑：<strong style={{ color: 'var(--text-primary)' }}>制度红利正在替代要素红利</strong>——破除地方保护主义、建立全国统一负面清单，把「权力意志」约束在「法治轨道」内。当土地、人口、廉价资本的边际收益衰减，<strong style={{ color: 'var(--text-primary)' }}>确定性本身成为最稀缺的生产要素</strong>。</p>
              <div className="space-y-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <div>✓ 全国统一大市场 · 破除条块分割与地方保护</div>
                <div>✓ 全国统一市场准入负面清单（持续缩短）</div>
                <div>✓ 企业破产重整与个人破产制度试点</div>
                <div>✓ 民营企业产权与企业家人身财产权司法保护</div>
              </div>
              <div className="mt-3"><EChart option={dividendTrend} style={{ height: 200 }} /></div>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>制度红利转化效率估算指数（示意）。</p>
            </Card>
            <Card title="破产重整 · 市场出清的司法管道">
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>破产不是失败的终点，而是<strong style={{ color: 'var(--text-primary)' }}>低效资源的合法再配置</strong>。专门破产法庭与「执转破」常态化，让僵尸企业有序退出、优质资产快速重生——这是统一大市场新陈代谢的底层管道。</p>
              <EChart option={bankruptcyOpt} style={{ height: 200 }} />
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>受理破产案件量与重整成功率（示意）。</p>
              <Grid cols={2} className="mt-3">
                <Stat value="-9 项" label="负面清单近年净缩减" accent="#10b981" />
                <Stat value="100+" label="专门 / 集中破产法庭" accent="#8b5cf6" />
              </Grid>
            </Card>
          </Grid>
        </div>
      )}

      {/* ② 知产护城河 */}
      {tab === 'ip' && (
        <div>
          <Grid cols={2} className="mb-6">
            <Card title="知识产权护城河 · 赔偿额度指数级上涨">
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>专利诉讼赔偿额度正<strong style={{ color: 'var(--text-primary)' }}>指数级上涨</strong>——惩罚性赔偿最高 5 倍，把「侵权获利」从理性选择变为高风险赌注。这不仅保护创新，更是在「新质生产力」竞赛中构建自主的技术防御疆域。</p>
              <EChart option={ipBar} style={{ height: 200 }} />
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>知产案件平均判赔额（万元/件 · 示意）。</p>
              <Grid cols={2} className="mt-3">
                <Stat value="5X" label="惩罚性赔偿上限倍数" accent="#c41e3a" />
                <Stat value="举证倒置" label="技术秘密侵权规则" accent="#e8a317" />
              </Grid>
            </Card>
            <Card title="确权提速 · 授权量与周期的剪刀差">
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>发明专利授权量持续攀升的同时，<strong style={{ color: 'var(--text-primary)' }}>平均确权周期被压缩近半</strong>。授权「量」上行与确权「时」下行形成剪刀差——意味着创新资产更快进入可主张、可定价、可质押的法律状态。</p>
              <EChart option={patentOpt} style={{ height: 200 }} />
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>发明专利授权量与平均确权周期（示意）。</p>
              <div className="flex flex-wrap gap-2 mt-3">{['专门知产法院', '技术调查官', '行政司法两条线', '海外维权援助'].map((k) => (<span key={k} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{k}</span>))}</div>
            </Card>
          </Grid>
        </div>
      )}

      {/* ③ 智慧法院 */}
      {tab === 'court' && (
        <div>
          <Card title="智慧法院 · 算法正义" className="mb-6">
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>司法现代化包含<strong style={{ color: 'var(--text-primary)' }}>区块链电子存证、AI 辅助量刑参考、裁判文书自动生成与全网公开、在线诉讼全流程</strong>。数字化极大降低司法裁量的随意性（Arbitrary Power），实现海量案件的高效率、标准化处理；当正义可被计算与回溯，司法公信力获得技术背书。</p>
            <Grid cols={4}>
              <Stat value="秒级" label="司法区块链存证时延" accent="#22d3ee" />
              <Stat value="91%" label="在线诉讼业务覆盖率" accent="#10b981" />
              <Stat value="1.4 亿+" label="裁判文书网公开" accent="#e8a317" />
              <Stat value="类案" label="AI 同案同判推送" accent="#8b5cf6" />
            </Grid>
          </Card>
          <Grid cols={2} className="mb-6">
            <Card title="数字化能力图谱 · 智慧法院 4.0">
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>六维数字化能力构成「算法正义」的技术底座——存证、量刑、公开、在线、送达、类案推送，每一维都在把司法过程从「黑箱」推向「可审计」。</p>
              <EChart option={courtRadar} style={{ height: 260 }} />
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>智慧法院能力成熟度评分（示意）。</p>
            </Card>
            <Card title="在线诉讼覆盖率 · 从可选到默认">
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>在线诉讼从疫情期的应急方案，演化为常态化的<strong style={{ color: 'var(--text-primary)' }}>默认入口</strong>。覆盖率逼近天花板，意味着司法服务的<strong style={{ color: 'var(--text-primary)' }}>边际可达成本趋近于零</strong>——这是治理能力的隐性扩容。</p>
              <EChart option={onlineTrend} style={{ height: 200 }} />
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>在线诉讼业务覆盖率（% · 示意）。</p>
              <div className="flex flex-wrap gap-2 mt-3">{['移动微法院', '区块链存证', '智能送达', '电子卷宗'].map((k) => (<span key={k} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{k}</span>))}</div>
            </Card>
          </Grid>
        </div>
      )}

      {/* ④ 涉外法治 */}
      {tab === 'intl' && (
        <div>
          <Card title="涉外法治博弈 · 竞争的新边疆" className="mb-6">
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>通过设立国际商事法庭（CICC）、完善反制裁法律工具包，中国正从全球规则的<strong style={{ color: 'var(--text-primary)' }}>接受者</strong>转变为<strong style={{ color: 'var(--text-primary)' }}>博弈者</strong>。现实主义视角下，法治已成为非对称竞争中的<strong style={{ color: 'var(--text-primary)' }}>合法性屏障</strong>——它把地缘对抗包装进可主张、可仲裁、可反制的规则语言，维护中国企业在全球价值链中的合法主权利益。</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>核心战场是<strong style={{ color: 'var(--text-primary)' }}>长臂管辖博弈与数字主权规则</strong>：当外国以本国法律对中国实体施加域外效力，《反外国制裁法》《阻断办法》与数据出境安全评估，构成对冲性的法律对等火力。</p>
            <div className="flex flex-wrap gap-2">{['国际商事法庭 CICC', '反外国制裁法', '阻断办法', '数据跨境规则', '数字主权', '全球商事仲裁'].map((k) => (<span key={k} className="text-[11px] mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--cyber-cyan)' }}>{k}</span>))}</div>
          </Card>
          <Grid cols={2} className="mb-6">
            <Card title="法律主权工具包 · 反制火力评估">
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>从仲裁规则供给到长臂管辖反制，涉外法治工具箱的<strong style={{ color: 'var(--text-primary)' }}>成熟度梯度</strong>——CICC 商事仲裁能力最强，长臂管辖反制仍在工具化早期，构成下一阶段的制度补强重点。</p>
              <EChart option={sovToolkit} style={{ height: 220 }} />
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>涉外法治工具成熟度评分（示意）。</p>
            </Card>
            <Card title="现实主义读数 · 合法性即筹码">
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>在大国博弈中，<strong style={{ color: 'var(--text-primary)' }}>「合法性」是可交易的战略筹码</strong>。一套被国际认可的规则供给，能降低中国企业出海的合规摩擦、抬高对手单边制裁的政治成本。</p>
              <Grid cols={2}>
                <Stat value="CICC" label="最高法国际商事法庭" accent="#22d3ee" />
                <Stat value="对等反制" label="制裁—反制裁博弈" accent="#c41e3a" />
                <Stat value="域外效力" label="阻断 + 数据出境" accent="#e8a317" />
                <Stat value="规则供给" label="从接受者到博弈者" accent="#8b5cf6" />
              </Grid>
            </Card>
          </Grid>
        </div>
      )}

      <Card title="结语 · 制度红利基础设施">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>法治不仅是公平叙事，更是降低交易成本、稳定长期预期的<strong style={{ color: 'var(--text-primary)' }}>「确定性基础设施」</strong>。营商、知产、智慧法院、涉外四条线索殊途同归：把不可预期的权力意志，转译为可计算、可主张、可回溯的规则。其建设进度，直接决定要素市场化与民营信心修复的深度。</p>
        <div className="flex flex-wrap gap-3 mt-3 text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
          <span>// JUSTICE: TRANSPARENT</span><span>// SYSTEM: REFORMED</span><span>// STATUS: SECURE</span>
        </div>
      </Card>
<FrameworkTrio cards={[
        { key: 'salt', body: '营商法治：产权保护与破产重整。' },
        { key: 'stone', body: '知产护城河：专利确权周期压缩。' },
        { key: 'path', body: '涉外法治：从规则接受者到博弈者。' },
      ]} />
<ModuleFooter moduleId="ruleoflaw" sourceNote="由 china.html「法治政府」专题迁移" />
    </div>
  );
}
