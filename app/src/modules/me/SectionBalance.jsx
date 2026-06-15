import React, { useMemo } from 'react';
import { Card } from '../../app/ui.jsx';
import EChart from '../../lib/viz/EChart.jsx';

// ============================================================================
// ⑯ 能力资产负债表 · 哪些在增值，哪些在折旧
// ----------------------------------------------------------------------------
// 把一个人的能力栈当作资产负债表来读：左栏是可转移、还在增值的能力（青/绿系），
// 右栏是正在折旧或把自己绑死在某个红利/体系上的负债（朱砂/赭系）。顶部给一个
// 「净值」读数——资产均值减负债均值，再落一句研判。口径：自评示意标定，非预测。
// ============================================================================

const AX = { line: '#27324a', text: '#93a1b5', split: 'rgba(148,163,184,0.1)' };

// —— 资产：可转移 / 还在增值的能力（青/绿系）——
const ASSETS = [
  { name: '国际化增长方法论', value: 90, color: '#22d3ee',
    note: '中国供给 × 全球市场仍是长坡，方法论可跨地域、跨品类复用，越用越厚' },
  { name: '0-1 冷启动闭环', value: 86, color: '#10b981',
    note: 'Kwai / Snack / B站东南亚多次 0→1，从 0 搭体系的肌肉记忆稀缺且通用' },
  { name: '跨文化团队管理', value: 82, color: '#22d3ee',
    note: '带过中/印/菲/泰/越 50+ 跨国团队，全球化与远程协作浪潮下持续增值' },
  { name: 'AIGC 实战（Gemini/Flux/Cursor）', value: 88, color: '#10b981',
    note: '微调 200+ NPC、Cursor 10W+ 行——踩在 AI 超级个体的上升直线上，复利最快' },
  { name: '社区生态构建', value: 78, color: '#22d3ee',
    note: '从内容分发到 UGC 生态的底层手感，迁移到任何「人 + 内容」的产品都成立' },
];

// —— 负债：折旧 / 绑定风险（朱砂 / 赭系）——
const LIABILITIES = [
  { name: '大厂体系依赖', value: 72, color: '#c41e3a',
    note: '过往战绩高度依赖平台流量与资源杠杆，脱离体系后边界能力需重新证明' },
  { name: '出海红利绑定', value: 80, color: '#fb923c',
    note: '十年战绩绑在 2018–2022 那班车上，窗口收口后同样的打法弹性骤降' },
  { name: '年龄议价折旧', value: 68, color: '#e8a317',
    note: '35 岁后社会时钟与议价权同向下行，经验溢价被「中年」标签部分对冲' },
  { name: '单一行业暴露（泛娱乐）', value: 74, color: '#c41e3a',
    note: '十年压在泛娱乐/社交一条赛道，行业 β 退潮时缺第二曲线缓冲' },
  { name: '一线 SOP × 三线土壤错配', value: 70, color: '#fb923c',
    note: '一线与海外攒下的方法论落到东北中等城市水土不服，须打折重学' },
];

const avg = (arr) => Math.round(arr.reduce((s, x) => s + x.value, 0) / arr.length);

// —— 净值条形对比图（资产正向 / 负债负向，发散柱）——
function balanceOption() {
  const names = [...ASSETS.map((a) => a.name), ...LIABILITIES.map((l) => l.name)];
  return {
    grid: { left: 8, right: 24, top: 16, bottom: 8, containLabel: true },
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      formatter: (ps) => {
        const p = ps.find((x) => x.value !== 0) || ps[0];
        const v = Math.abs(p.value);
        const side = p.seriesName === '资产强度' ? '资产' : '折旧/风险';
        return `${p.name}<br/>${side} ${v}`;
      },
    },
    legend: { top: 0, textStyle: { color: AX.text, fontSize: 11 }, data: ['资产强度', '折旧/风险'] },
    xAxis: {
      type: 'value', min: -100, max: 100,
      axisLine: { lineStyle: { color: AX.line } },
      axisLabel: { color: AX.text, formatter: (v) => Math.abs(v) },
      splitLine: { lineStyle: { color: AX.split } },
    },
    yAxis: {
      type: 'category', inverse: true, data: names,
      axisLine: { lineStyle: { color: AX.line } },
      axisLabel: { color: AX.text, fontSize: 10 },
      axisTick: { show: false },
    },
    series: [
      {
        name: '资产强度', type: 'bar', stack: 'bal', barWidth: '52%',
        data: [
          ...ASSETS.map((a) => ({ value: a.value, itemStyle: { color: a.color, borderRadius: [0, 3, 3, 0] } })),
          ...LIABILITIES.map(() => 0),
        ],
      },
      {
        name: '折旧/风险', type: 'bar', stack: 'bal', barWidth: '52%',
        data: [
          ...ASSETS.map(() => 0),
          ...LIABILITIES.map((l) => ({ value: -l.value, itemStyle: { color: l.color, borderRadius: [3, 0, 0, 3] } })),
        ],
      },
    ],
  };
}

function Meter({ name, value, note, color }) {
  return (
    <div className="mb-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</span>
        <span className="text-[11px] mono" style={{ color }}>{value}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <div className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{note}</div>
    </div>
  );
}

export default function SectionBalance() {
  const opt = useMemo(balanceOption, []);
  const assetAvg = useMemo(() => avg(ASSETS), []);
  const liabAvg = useMemo(() => avg(LIABILITIES), []);
  const net = assetAvg - liabAvg;

  return (
    <Card title="⑯ 能力资产负债表 · 哪些在增值，哪些在折旧" className="mt-6">
      {/* 净值读数 */}
      <div className="os-card p-4 mb-5" style={{ borderLeft: '3px solid #22d3ee' }}>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <div>
            <span className="text-2xl font-semibold mono" style={{ color: net >= 0 ? '#10b981' : '#c41e3a' }}>
              {net >= 0 ? '+' : ''}{net}
            </span>
            <span className="text-[11px] mono ml-2" style={{ color: 'var(--text-tertiary)' }}>能力净值（资产均值 − 负债均值）</span>
          </div>
          <div className="text-xs mono" style={{ color: 'var(--text-tertiary)' }}>
            资产均值 <span style={{ color: '#22d3ee' }}>{assetAvg}</span>
            <span className="mx-1.5">·</span>
            负债均值 <span style={{ color: '#c41e3a' }}>{liabAvg}</span>
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          研判：资产仍厚于负债，可转移的方法论与 AIGC 实战是结实的底盘；但折旧项（红利绑定、年龄议价、行业暴露）在 35 岁后加速计提——净值为正不等于可以躺平，是该用资产端的复利去对冲折旧端的时间。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
        {/* 左栏 · 资产 */}
        <div>
          <div className="text-[11px] mono mb-3 pb-1.5 border-b" style={{ color: '#22d3ee', borderColor: 'var(--border-subtle)' }}>
            资产 · 可转移 / 增值能力（越高越厚）
          </div>
          {ASSETS.map((a) => <Meter key={a.name} {...a} />)}
        </div>
        {/* 右栏 · 负债 */}
        <div>
          <div className="text-[11px] mono mb-3 pb-1.5 border-b" style={{ color: '#c41e3a', borderColor: 'var(--border-subtle)' }}>
            负债 · 折旧 / 绑定风险（越高越重）
          </div>
          {LIABILITIES.map((l) => <Meter key={l.name} {...l} />)}
        </div>
      </div>

      {/* 发散柱状对比 */}
      <div className="mt-4">
        <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>资产 ↔ 负债 · 发散对照（左负债 / 右资产，示意）</div>
        <EChart option={opt} style={{ height: 360 }} />
      </div>

      <p className="text-xs mt-4" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
        口径：私享自画像 · 本人自述 + 简历公开口径 · 资产/负债强度为自评示意标定 · 非预测、非承诺。
      </p>
    </Card>
  );
}
