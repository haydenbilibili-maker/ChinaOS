import React from 'react';
import { Card } from '../../app/ui.jsx';
import { ECON_COLORS, BandHead } from './econUI.jsx';
import { DISCIPLINE_RULES } from './econWatch.js';

// ============================================================================
// 数据使用纪律 · DATA DISCIPLINE（SectionDiscipline）
// ----------------------------------------------------------------------------
// 自包含 Section：内部取 DISCIPLINE_RULES（由并行代理产出，编码时可能未落盘）。
// 主线程 Page.jsx import 后 <SectionDiscipline/> 直接落位即可，无 props。
//   · 顶部 BandHead 编号 § 标题区（数据使用纪律 / DATA DISCIPLINE）
//   · DISCIPLINE_RULES 两列网格（移动端 1 列）：每条
//       mark 标记（mono · 朱砂胶囊）+ title（加粗）+ body（faint，<b> 标重点）
//   · 容错：DISCIPLINE_RULES 缺失 / 为空时内置同款四条兜底（春节 / 口径 /
//       交叉 / 裂缝），保证不空白。
// 设计语言：四色语义取自 ECON_COLORS（朱砂主调）。
// 口径：公开统计梳理 · 示意标定 · 非投资建议 · 非预测。
// ============================================================================

const DISCLAIMER = '公开统计梳理 · 示意标定 · 非投资建议 · 非预测';

// —— 兜底四条（DISCIPLINE_RULES 缺失时启用，签名与上游一致：{mark,title,body}）——
// body 内允许出现 <b>…</b> 标重点；渲染层负责解析为加重文本。
const FALLBACK_RULES = [
  {
    mark: '春节',
    title: '错位看春节',
    body: '春节在公历上的<b>移位</b>会扭曲 1–2 月的同比读数，务必<b>合并春节月</b>或看累计值，单月暴涨暴跌多为日历假象。',
  },
  {
    mark: '口径',
    title: '认准口径',
    body: '同一指标常有<b>多套口径</b>（名义 / 实际、当月 / 累计、新口径 / 旧口径）。比较前先<b>对齐口径</b>，跨口径直接相减是常见误读。',
  },
  {
    mark: '交叉',
    title: '交叉验证',
    body: '官方产出易被注水，需用<b>难造假的高频代理</b>（用电、货运、票据贴现）交叉印证；单一指标孤证不立。',
  },
  {
    mark: '裂缝',
    title: '盯住裂缝',
    body: '总量数据掩盖分化，<b>背离与裂缝</b>（名义×实际、体制×市场、总量×私人）才是信息量所在，比平均值更说明问题。',
  },
];

// —— 把含 <b>…</b> 的纪律正文解析为带加重片段的 React 节点 ——
// 不引入 dangerouslySetInnerHTML，安全地按标记切片渲染。
function renderBody(body) {
  if (typeof body !== 'string' || body.length === 0) return null;
  const parts = body.split(/(<b>.*?<\/b>)/g).filter(Boolean);
  return parts.map((seg, i) => {
    const m = /^<b>(.*?)<\/b>$/.exec(seg);
    if (m) {
      return (
        <strong key={i} style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
          {m[1]}
        </strong>
      );
    }
    return <React.Fragment key={i}>{seg}</React.Fragment>;
  });
}

export default function SectionDiscipline() {
  const C = ECON_COLORS || {};
  const cinnabar = C.cinnabar || '#c44e3d';

  const rules = Array.isArray(DISCIPLINE_RULES) && DISCIPLINE_RULES.length
    ? DISCIPLINE_RULES
    : FALLBACK_RULES;

  return (
    <Card className="os-card">
      <BandHead n="§" title="数据使用纪律" en="DATA DISCIPLINE" />

      <p className="text-xs leading-relaxed mt-3 mb-4" style={{ color: 'var(--text-secondary)' }}>
        读数之前先立规矩 —— 错位、口径、交叉、裂缝，四条纪律把
        <span style={{ color: cinnabar }}> 公开统计 </span>
        从噪声里择出来。
      </p>

      {/* 纪律网格 —— 移动端 1 列、桌面 2 列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule, i) => (
          <div key={rule.mark || rule.title || i} className="os-card p-4">
            <div className="flex items-center gap-2 mb-2">
              {rule.mark && (
                <span
                  className="mono text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    color: cinnabar,
                    background: `${cinnabar}1a`,
                    border: `1px solid ${cinnabar}55`,
                  }}
                >
                  {rule.mark}
                </span>
              )}
              <span className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {rule.title}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              {renderBody(rule.body)}
            </p>
          </div>
        ))}
      </div>

      {/* 统一口径小字 */}
      <p className="mt-4 text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>
        {DISCLAIMER}
      </p>
    </Card>
  );
}
