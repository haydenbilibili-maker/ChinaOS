import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SkyLamp } from '../../vi/Signal.jsx';
import { useSignalStore } from '../signalPanel/useSignalStore.ts';
import { computeRegime, getRegimeMeta } from '../signalPanel/computeRegime.ts';
import { SIGNAL_SECTIONS, SIGNAL_VAL } from '../signalPanel/signals.seed.ts';
import './dashHero2.css';

// ============================================================================
// 中枢看板 · 主视觉 2.0：今天的「态势判词」做主角，天灯三环 = 信号灯三层。
// 信号状态读取信号灯模块的本地覆盖（用户自己的判读），因此首页随个人判断变化。
// ============================================================================

const LEVEL_OF_SCORE = (v) => (v >= 0.67 ? 'ok' : v >= 0.34 ? 'watch' : 'alert');
const REGIME_LEVEL = { offense: 'ok', watch: 'watch', defense: 'alert' };

export default function DashHero2({ moduleCount, entryTotal, asOf }) {
  const { resolve, overrides } = useSignalStore();
  const { score, regime, gate } = useMemo(() => computeRegime(resolve), [resolve]);
  const meta = getRegimeMeta(regime);
  const personalized = Object.keys(overrides || {}).length > 0;

  const rings = useMemo(() => SIGNAL_SECTIONS.slice(0, 3).map((sec) => {
    let n = 0;
    let d = 0;
    sec.signals.forEach((s) => { n += SIGNAL_VAL[resolve(s.id, s.status)] * s.w; d += s.w; });
    return { label: `${sec.tier} · ${sec.title.replace('信号', '')}`, level: LEVEL_OF_SCORE(d ? n / d : 0) };
  }), [resolve]);

  const today = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });

  return (
    <section className={`dash-hero2 dash-hero2--${REGIME_LEVEL[regime]}`} aria-label="今日态势">
      <div className="dash-hero2__copy">
        <p className="dash-hero2__eyebrow">
          <span className="dash-hero2__seal" aria-hidden="true" />
          中枢看板 · {today}
        </p>
        <h1 className="dash-hero2__title">
          <span className="dash-hero2__word">{meta.word}</span>
          <span className="dash-hero2__suffix">态势</span>
        </h1>
        <p className="dash-hero2__sub">{meta.sub}</p>
        <dl className="dash-hero2__meta">
          <div><dt>综合得分</dt><dd className="vi-figure">{score}<span className="vi-unit">/100</span></dd></div>
          <div><dt>确诊闸门</dt><dd>{gate ? '已开启' : '未开启'}</dd></div>
          <div><dt>判读口径</dt><dd>{personalized ? '含我的覆盖' : '系统默认'}</dd></div>
        </dl>
        <div className="dash-hero2__actions">
          <Link to="/modules/signal-panel" className="os-btn os-btn-primary">调整信号判读 <ArrowUpRight size={15} /></Link>
          <Link to="/shenzhou-live" className="os-btn">打开神州活图</Link>
        </div>
        <p className="dash-hero2__foot">
          <span className="vi-figure">{moduleCount}</span> 个专题 · <span className="vi-figure">{Number(entryTotal).toLocaleString('en-US')}</span> 条结构化数据 · 基准日 <span className="vi-figure">{asOf}</span>
        </p>
      </div>
      <div className="dash-hero2__lamp">
        <SkyLamp size={280} verdict={meta.word} caption={`信号得分 ${score}`} rings={rings} />
      </div>
    </section>
  );
}
