import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Stat, StatGrid } from '../../../app/ui.jsx';
import { KEY_INDICATORS } from '../econData.js';

// ============================================================================
// 经济大盘 · 十五五促消费 Tab（摘要速览 · 全文见 /econ-consume-15th）
// 政策真源：国函〔2026〕66 号《扩大消费「十五五」规划》批复（发布 2026-07-13）
// H1 读数：KEY_INDICATORS 同源，不臆造
// ============================================================================

const POLICY_AS_OF = '2026-07-13';
const H1_AS_OF = '2026-07-15';

const SIX = [
  { t: '服务消费提质惠民', d: '养老 · 托育 · 文旅 · 健康置前' },
  { t: '商品消费扩容升级', d: '更新换代与品质升级' },
  { t: '新业态新场景', d: '数字消费 · 首发 · 体验式' },
  { t: '提升消费能力', d: '就业增收 · 社保可持续' },
  { t: '优化消费环境', d: '标准 · 信用 · 基础设施' },
  { t: '完善制度机制', d: '限制清理 · 政策协同 · 监测' },
];

function ki(id) {
  return KEY_INDICATORS.find((k) => k.id === id);
}

export default function Consume15Tab() {
  const retail = ki('retail');
  const fai = ki('fai');

  return (
    <div className="space-y-6">
      <Card title="十五五促消费 · 规划摘要" asSection={false}>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              《扩大消费「十五五」规划》
            </div>
            <p className="text-xs leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
              国务院原则同意并以国函〔2026〕66 号印发批复（发布 {POLICY_AS_OF}）。
              发改委、商务部牵头编制。对应用户所称「十五五促进消费意见」——以本规划为真源。
              批复要求深入实施提振消费专项行动，完善扩大居民消费长效机制。
            </p>
          </div>
          <Link
            to="/econ-consume-15th"
            className="econ-cross-chip shrink-0"
            style={{
              display: 'inline-flex',
              fontSize: 11,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(196,30,58,0.4)',
              color: '#c41e3a',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono, ui-monospace, monospace)',
            }}
          >
            全文解读 ↗
          </Link>
        </div>

        <StatGrid className="mb-4">
          <Stat value="≈60 万亿" label="2030 社零目标" accent="#c41e3a" sub="答记者问 · 左右" />
          <Stat value="50.1 万亿" label="2025 社零基数" accent="#e8a317" sub="突破 50 万亿" />
          <Stat value="6×28" label="重点任务" accent="#22d3ee" sub="六面二十八条" />
          <Stat
            value={retail ? `+${retail.value}%` : '—'}
            label="H1 社零"
            accent="#64748b"
            sub={`服务零售 +5.3% · 截至 ${H1_AS_OF}`}
          />
        </StatGrid>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>一句话：</strong>
          政策要闭合「供强需弱」——H1 社零偏弱（{retail ? `+${retail.value}%` : '—'}）与固投拖累（{fai ? `${fai.value}%` : '—'}）并存；
          规划把扩内需升格为十五五消费纲领，以能力增收 + 服务/商品供给 + 制度长效三轨并进。
        </p>

        <div className="text-[11px] mono mb-2" style={{ color: 'var(--text-tertiary)' }}>六大重点任务面</div>
        <Grid cols={3}>
          {SIX.map((s) => (
            <div key={s.t} className="os-card p-3" style={{ background: 'var(--bg-elevated)' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{s.t}</div>
              <p className="text-[11px] m-0" style={{ color: 'var(--text-tertiary)' }}>{s.d}</p>
            </div>
          ))}
        </Grid>
      </Card>

      <Card title="交叉入口" asSection={false}>
        <div className="flex flex-wrap gap-2">
          <Link to="/econ-consume-15th" className="econ-cross-chip" style={linkChip}>全文解读页 ↗</Link>
          <Link to="/econ-h1-review" className="econ-cross-chip" style={{ ...linkChip, borderColor: 'rgba(232,163,23,0.45)', color: '#e8a317' }}>半年经济解读 ↗</Link>
          <Link to="/consumption" className="econ-cross-chip" style={linkChip}>扩大内需 · 消费率 ↗</Link>
          <Link to="/econ-dashboard?tab=worldbank" className="econ-cross-chip" style={linkChip}>世行经济简报 ↗</Link>
        </div>
        <p className="text-[11px] mt-3 m-0" style={{ color: 'var(--text-tertiary)' }}>
          出处：中国政府网国函〔2026〕66 号 · 发改委/商务部答记者问（新华社 {POLICY_AS_OF}）· H1 读数 NBS {H1_AS_OF}
        </p>
      </Card>
    </div>
  );
}

const linkChip = {
  display: 'inline-flex',
  fontSize: 11,
  padding: '4px 10px',
  borderRadius: 6,
  border: '1px solid rgba(34,211,238,0.35)',
  color: '#22d3ee',
  textDecoration: 'none',
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
};
