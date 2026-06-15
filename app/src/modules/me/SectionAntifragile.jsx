import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../app/ui.jsx';

// ============================================================================
// ⑰ 反脆弱杠铃 · 在波动里受益还是受损
// ----------------------------------------------------------------------------
// 借塔勒布的三态分类（脆弱 / 强韧 / 反脆弱），把画像要素按「面对波动会怎样」归档：
// 脆弱 = 波动一来就受损（单一红利、固定现金流预期）；强韧 = 波动里不增不减（方法论、
// 迁移力）；反脆弱 = 波动越大越受益（AI 实验、出海试错、创业期权）。再落一句杠铃策略。
// 口径：私享自画像 · 自评示意标定，非预测、非承诺。
// ============================================================================

const STATES = [
  {
    key: 'fragile', tag: '脆弱', color: '#c41e3a',
    head: '波动一来就受损',
    mech: '机理：收益封顶、损失敞开——下行风险远大于上行空间，黑天鹅来时最先碎。',
    items: [
      ['单一出海红利依赖', '战绩绑在 2018–2022 那班车，窗口收口即贬值'],
      ['固定现金流预期', '把生活结构架在稳定工资上，断流时缺缓冲垫'],
      ['单一行业（泛娱乐）暴露', '行业 β 退潮，无第二曲线对冲'],
      ['平台杠杆惯性', '习惯了平台流量与资源，自起盘后边界能力被放大检验'],
    ],
  },
  {
    key: 'robust', tag: '强韧', color: '#e8a317',
    head: '波动里不增不减',
    mech: '机理：对环境变化不敏感，换地域、换行业、换平台都还在——是穿越周期的压舱石。',
    items: [
      ['国际化增长方法论', '跨地域、跨品类复用，不随单一市场存亡'],
      ['跨文化迁移力', '带过五国团队，换语境也能快速重新挂载'],
      ['0-1 冷启动手感', '从 0 搭体系的能力与具体红利无关'],
      ['可转移技能底盘', '增长 / 运营 / P&L，是换赛道也带得走的现金牛'],
    ],
  },
  {
    key: 'antifragile', tag: '反脆弱', color: '#10b981',
    head: '波动越大越受益',
    mech: '机理：上行无封顶、下行有限——小注多次，押对一个就覆盖全部失败成本（凸性）。',
    items: [
      ['AI 实验（Gemini/Flux/Cursor）', '技术越动荡，先行实战者的相对优势越大'],
      ['出海 2.0 试错', '新蓝海里多次小赌，命中一个即非线性回报'],
      ['创业期权', '自负盈亏放弃保底，换来上不封顶的可能性'],
      ['超级个体杠杆', 'AI 把团队压进一个人，规模解绑、上行打开'],
    ],
  },
];

export default function SectionAntifragile() {
  return (
    <Card title="⑰ 反脆弱杠铃 · 在波动里受益还是受损" className="mt-6">
      <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
        同一份画像，按「面对波动会怎样」三态归档：脆弱项会被冲击放大损失，强韧项穿越周期不增不减，反脆弱项则在动荡里反而受益。看清哪些要素在哪一栏，才知道杠铃的两端该怎么配重。
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {STATES.map((s) => (
          <div key={s.key} className="os-card p-4" style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold" style={{ color: s.color }}>{s.tag}</span>
              <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{s.head}</span>
            </div>
            <div className="mt-3 space-y-2">
              {s.items.map(([t, d]) => (
                <div key={t}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{d}</div>
                </div>
              ))}
            </div>
            <div className="text-[11px] mt-3 pt-2 border-t" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)', lineHeight: 1.6 }}>
              {s.mech}
            </div>
          </div>
        ))}
      </div>

      {/* 杠铃策略 */}
      <div className="os-card p-4 mt-5" style={{ borderLeft: '3px solid #8b5cf6' }}>
        <div className="text-xs font-semibold mb-1.5" style={{ color: '#8b5cf6' }}>杠铃策略 · 两端配重、掏空中间</div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <span style={{ color: '#22d3ee' }}>安全端（80–90%）</span>：守住现金流与可转移技能这块压舱石，把脆弱的「固定预期」改造成强韧的「可迁移底盘」，确保任何一次失败都不致命；
          <span style={{ color: '#10b981' }}>冒险端（10–20%）</span>：以 AI 超级个体 / 出海 2.0 做「小注多次」的反脆弱下注，单笔可控、押中即非线性回报。避开中间地带——既无保底又无上限的「温水」选项，才是 35 岁最该砍掉的部分。
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>理论内核 ·</span>
        <Link
          to="/antifragile"
          className="os-card px-3 py-1.5 no-underline inline-flex items-center gap-1.5"
          style={{ borderLeft: '3px solid #10b981' }}
        >
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>认知内核 · 反脆弱性</span>
          <span className="text-[11px]" style={{ color: '#10b981' }}>↗</span>
          <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>塔勒布 · 凸性效应 · 波动获益</span>
        </Link>
      </div>

      <p className="text-xs mt-4" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
        口径：私享自画像 · 本人自述 + 简历公开口径 · 三态归类与配重为自评示意标定 · 非预测、非承诺。
      </p>
    </Card>
  );
}
