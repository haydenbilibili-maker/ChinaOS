import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, SourceBadge } from '../../../app/ui.jsx';
import {
  ECON_AS_OF, CANARY_SIGNALS, buildEconReport, canaryTally,
} from '../econData.js';
import { buildPanoramaReport } from '../econReport.js';
import SectionDiscipline from '../SectionDiscipline.jsx';
import { BTN, BTN_CYAN, CANARY_LIGHT } from '../econHelpers.jsx';

export default function CanaryTab({ wbData }) {
  const [reportMd, setReportMd] = useState('');
  const [copied, setCopied] = useState(false);
  const tally = useMemo(() => canaryTally(CANARY_SIGNALS || []), []);

  const genReport = () => {
    try { setReportMd(buildPanoramaReport()); }
    catch { setReportMd(buildEconReport({ wb: wbData, asOf: ECON_AS_OF })); }
  };

  const copyReport = () => {
    navigator.clipboard?.writeText(reportMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="econ-section">
      <Card title="金丝雀监测盘 · 转折的早信号">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <p className="text-xs m-0" style={{ color: 'var(--text-tertiary)' }}>
            领先指标是矿井里的金丝雀——它先于官方数据感知冷暖。下列读数为公开数据派生的领先信号示意。
          </p>
          <SourceBadge live={false} asOf={ECON_AS_OF} />
        </div>

        <div className="econ-canary-mood mb-4 flex items-center gap-5 flex-wrap">
          {(['green', 'amber', 'red']).map((k) => (
            <div key={k} className="flex items-center gap-2">
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: CANARY_LIGHT[k].c, display: 'inline-block', boxShadow: `0 0 8px ${CANARY_LIGHT[k].c}88` }} />
              <span className="mono text-lg font-bold" style={{ color: CANARY_LIGHT[k].c }}>{tally?.[k] ?? 0}</span>
              <span className="text-[11px] mono" style={{ color: 'var(--text-tertiary)' }}>{CANARY_LIGHT[k].t}</span>
            </div>
          ))}
          {tally?.mood && (
            <span className="text-sm font-semibold ml-auto" style={{ color: 'var(--text-secondary)' }}>{tally.mood}</span>
          )}
        </div>

        <Grid cols={3} gap="0.75rem" stagger>
          {(CANARY_SIGNALS || []).map((c) => {
            const light = CANARY_LIGHT[c.signal] || CANARY_LIGHT.green;
            return (
              <div key={c.id} className="os-card p-3" style={{ borderLeft: `3px solid ${light.c}` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: light.c, display: 'inline-block', boxShadow: `0 0 6px ${light.c}88` }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.label}</span>
                </div>
                <div className="text-[11px] mono mb-1" style={{ color: 'var(--text-tertiary)' }}>代理变量：{c.proxy}</div>
                <div className="mono text-base font-bold mb-1" style={{ color: light.c }}>{c.reading}</div>
                <p className="text-[11px] leading-relaxed mb-1" style={{ color: 'var(--text-tertiary)' }}>{c.lead}</p>
                {c.source && <div className="text-[10px] mono" style={{ color: 'var(--text-tertiary)' }}>来源：{c.source}</div>}
              </div>
            );
          })}
        </Grid>
        <p className="text-[11px] mono mt-3" style={{ color: 'var(--text-tertiary)' }}>
          // 信号灯仅为领先信号示意，非官方景气判断 —— 公开数据派生 · 非预测
        </p>
      </Card>

      <Card title="信号交叉验证 · 关联深潜">
        <div className="econ-hub-grid">
          <Link to="/modules/signal-panel" className="econ-hub-card" style={{ borderLeft: '3px solid #c41e3a' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>宏观再平衡信号灯 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              A/B/C 十二项信号态势合成——与金丝雀盘同源层交叉验证。
            </p>
          </Link>
          <Link to="/dashboard" className="econ-hub-card" style={{ borderLeft: '3px solid #22d3ee' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>中枢看板 · H1 读数 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              全局宏观速览与 GovernanceVerdict 双仪表合成。
            </p>
          </Link>
          <Link to="/modules/three-forces" className="econ-hub-card" style={{ borderLeft: '3px solid #e8a317' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>三力监测仪 ↗</div>
            <p className="text-[11px] m-0 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              「改没改」与「何时被迫改」配对读数——改革窗口压力。
            </p>
          </Link>
        </div>
      </Card>

      <Card title="经济速读报告 · 一页 Markdown">
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
          汇总实时 GDP/人均、三次产业结构、核心指标研判与金丝雀信号灯，生成确定性速读报告。
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" style={BTN_CYAN} onClick={genReport}>📄 生成经济速读</button>
          {reportMd && (
            <button type="button" style={copied ? { ...BTN, color: '#10b981' } : BTN} onClick={copyReport}>
              {copied ? '已复制 ✓' : '复制 Markdown'}
            </button>
          )}
        </div>
        {reportMd && (
          <pre
            className="text-[11px] leading-relaxed p-4 rounded mt-3 mono overflow-auto"
            style={{
              background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)', maxHeight: 420, whiteSpace: 'pre-wrap',
            }}
          >{reportMd}</pre>
        )}
      </Card>

      <div className="econ-block">
        <Link
          to="/foundation?tab=econ"
          className="os-card p-5 block no-underline"
          style={{ borderLeft: '3px solid #e8a317' }}
        >
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            ⌗ 经济数据底座 · 已迁移 →
          </div>
          <div className="text-xs" style={{ color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
            经济序列的上传 / 解析 / 编辑 / 多序列对比 / 导出 等完整数据管理能力，
            已迁入「数据与系统 · 数据底座」的「经济数据」标签，与全站本地库统一管理。
            <span style={{ color: '#e8a317' }}> 点此前往 →</span>
          </div>
        </Link>
      </div>

      <div className="econ-block"><SectionDiscipline /></div>
    </div>
  );
}
