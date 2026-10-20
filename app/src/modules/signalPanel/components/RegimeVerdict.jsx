import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ATTRIBUTION_ROUTE, LAYER_META } from '../../../domain/governance.ts';
import { computeRegime, getRegimeMeta } from '../computeRegime.ts';
import { SIGNAL_SECTIONS, SIGNAL_VAL } from '../signals.seed.ts';
import { SkyLamp } from '../../../vi/Signal.jsx';

export const STATUS_TO_LEVEL = { red: 'alert', amber: 'watch', green: 'ok' };
const REGIME_LEVEL = { defense: 'alert', watch: 'watch', offense: 'ok' };
const tierLevel = (v) => (v >= 0.67 ? 'ok' : v >= 0.34 ? 'watch' : 'alert');

export default function RegimeVerdict({ resolve }) {
  const { score, regime, gate } = computeRegime(resolve);
  const meta = getRegimeMeta(regime);

  const rings = useMemo(() => SIGNAL_SECTIONS.slice(0, 3).map((sec) => {
    let n = 0;
    let d = 0;
    sec.signals.forEach((s) => { n += SIGNAL_VAL[resolve(s.id, s.status)] * s.w; d += s.w; });
    return { label: `${sec.tier} · ${sec.title.replace('信号', '')}`, level: tierLevel(d ? n / d : 0) };
  }), [resolve]);

  return (
    <section className={`spv spv--${REGIME_LEVEL[regime]}`} aria-label="当前态势">
      <div className="spv__lamp">
        <SkyLamp size={240} verdict={meta.word} caption={`治本进度 ${score}`} rings={rings} />
      </div>
      <div className="spv__copy">
        <p className="spv__eyebrow">当前态势</p>
        <p className="spv__word">{meta.word}<span>态势</span></p>
        <p className="spv__sub">{meta.sub}</p>

        <div className="spv__scale" role="img" aria-label={`治本进度 ${score} / 100`}>
          <div className="spv__ticks" aria-hidden="true" />
          <div className="spv__zones" aria-hidden="true">
            <span className="spv__zone spv__zone--alert" style={{ width: '38%' }} />
            <span className="spv__zone spv__zone--watch" style={{ width: '22%' }} />
            <span className="spv__zone spv__zone--ok" style={{ width: '40%' }} />
          </div>
          <span className="spv__needle" style={{ left: `${Math.min(100, Math.max(0, score))}%` }}>
            <span className="vi-figure">{score}</span>
          </span>
          <div className="spv__labels">
            <span className={regime === 'defense' ? 'is-on' : ''}>防御 · 治标买时间</span>
            <span className={regime === 'watch' ? 'is-on' : ''}>观察 · 临界</span>
            <span className={regime === 'offense' ? 'is-on' : ''}>进攻 · 治本启动</span>
          </div>
        </div>

        <p className="spv__trigger">
          <b>切换扳机</b>　A1 考核换锚转绿，或 C1 平减指数连续两季转正。确诊闸门：<b className={gate ? 'is-open' : ''}>{gate ? '已开启' : '未开启'}</b>
        </p>
      </div>
    </section>
  );
}

export function SignalAttributionChip({ attribution }) {
  if (!attribution) return null;
  const layerMeta = LAYER_META[attribution.layer];
  return (
    <Link
      to={`${ATTRIBUTION_ROUTE}?issue=${attribution.issueId}`}
      className="sp-attrib-link"
      style={{ '--layer-color': layerMeta.color }}
      onClick={(e) => e.stopPropagation()}
    >
      {layerMeta.shortLabel}层归因 →
    </Link>
  );
}
