import React from 'react';
import { Card } from '../../app/ui.jsx';

// ============================================================================
// ⑳ 个人操作系统 · 跑在什么内核上
// ----------------------------------------------------------------------------
// 自包含组件：把出海十年与回迁创业的轨迹提炼成几条第一人称的决策原则——
// 这是这个进程默认加载的内核。每条都附上「代价」（它的反面 / 反噬），
// 因为没有哪条原则是免费的。卡片网格呈现。
// 口径：私享自画像 · 本人自述 · 自评示意标定 · 非预测非承诺。
// ============================================================================

// —— 个人决策原则（OS 隐喻 · 第一人称 · 每条附其反面/代价）——
const PRINCIPLES = [
  {
    no: 'K01', color: '#22d3ee',
    principle: '增量在边缘——蓝海与出海是我的默认路由',
    gloss: '代价：边缘的红利薄、波动大，一旦窗口关闭，攒下的 SOP 会从资产变成包袱。',
  },
  {
    no: 'K02', color: '#8b5cf6',
    principle: '把次优约束变成独特凭证——东北性、跨地域、非科班都是差异化',
    gloss: '反面：若说服不了自己也说服不了市场，约束就只是约束，不会自动升值为凭证。',
  },
  {
    no: 'K03', color: '#c41e3a',
    principle: '调度权优先于确定性——宁可自负盈亏，也要拿回资源分配权',
    gloss: '代价：交出了打工的稳定现金流，换来的是 35 岁时钟里的不安全感与迷茫。',
  },
  {
    no: 'K04', color: '#10b981',
    principle: '用 AI 把一个人放大成一支团队——Cursor、微调、Agent 都是杠杆',
    gloss: '反面：杠杆放大产出也放大错误，过度依赖会掩盖真实组织能力的缺口。',
  },
  {
    no: 'K05', color: '#e8a317',
    principle: '窗口不可重放，所以我宁可早一步试错',
    gloss: '代价：早一步常常踩空，先发的学费要自己付，且容易被后发者收割。',
  },
  {
    no: 'K06', color: '#fb923c',
    principle: '回迁是逆向下注，不是退守——在低密度盘面上重新定义边界',
    gloss: '反面：若只是怀乡式的撤退，逆向下注就退化成路径收缩，机会成本极高。',
  },
  {
    no: 'K07', color: '#94a3b8',
    principle: '现金流是一切冒险的安全边际——先活下来，才有资格谈愿景',
    gloss: '代价：过度看重安全边际会让人保守，错过只在敢压上全部时才出现的非线性机会。',
  },
  {
    no: 'K08', color: '#10b981',
    principle: '为自己的禀赋曲线而非同辈时钟选择——不跟社会默认计时器对表',
    gloss: '反面：脱离同辈坐标也意味着失去外部校准，容易把自洽误当成正确。',
  },
];

export default function SectionPrinciples() {
  return (
    <Card title="⑳ 个人操作系统 · 跑在什么内核上" className="mt-6">
      <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
        这是这个进程默认加载的内核——八条从十年轨迹里提炼出的决策原则。每条都挂着它的代价，因为没有哪条原则是免费的；调度的本质，就是在这些约束里反复权衡。
      </p>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {PRINCIPLES.map((p) => (
          <div key={p.no} className="os-card p-4 flex flex-col" style={{ borderLeft: `3px solid ${p.color}`, minHeight: 148 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="mono text-xs px-1.5 py-0.5 rounded" style={{ color: p.color, background: 'rgba(148,163,184,0.1)' }}>{p.no}</span>
            </div>
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)', lineHeight: 1.55 }}>
              {p.principle}
            </div>
            <div className="text-[11px] mt-auto pt-2" style={{ color: 'var(--text-tertiary)', lineHeight: 1.65, borderTop: '1px dashed var(--border-subtle)' }}>
              {p.gloss}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] mt-4 pt-3" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)' }}>
        私享自画像 · 本人自述 · 决策原则为自评示意提炼 · 非预测、非承诺。
      </p>
    </Card>
  );
}
