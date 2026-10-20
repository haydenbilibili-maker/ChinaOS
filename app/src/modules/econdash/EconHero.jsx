import React from 'react';
import Kpi from '../../vi/Kpi.jsx';
import Armillary from '../../vi/Armillary.jsx';
import Signal from '../../vi/Signal.jsx';
import { ECON_DATA_AS_OF, ECON_PERIOD, GDP_QUARTER, KEY_INDICATORS, indicatorSparkline } from './econData.js';
import { HEADLINE_GAUGES } from './econDeflation.js';

// ============================================================================
// 经济罗盘（VI 2.0 · 经济大盘页首）
// 主读数 GDP + 制造业 PMI 浑仪 + 六枚读数仪 + 四轴研判。
// 读数一律取 KEY_INDICATORS（单一来源）；灯色为本站示意研判，非官方分级。
// ============================================================================

const byId = (id) => KEY_INDICATORS.find((k) => k.id === id);
/** 一位小数、带正负号（负号用全角减号 −） */
const sgn = (v) => (v == null ? '—' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}`);
const val = (id) => sgn(byId(id)?.value);

/** 六枚读数仪：level 为示意研判（见 AXES 注） */
const TILES = [
  { id: 'iva', label: '规上工业', period: ECON_PERIOD.ytd, level: 'ok', src: 'NBS' },
  { id: 'export', label: '出口', period: ECON_PERIOD.ytd, level: 'ok', src: '海关 / NBS' },
  { id: 'retail', label: '社零', period: ECON_PERIOD.ytd, level: 'alert', src: 'NBS' },
  { id: 'fai', label: '固投', period: ECON_PERIOD.ytd, level: 'alert', src: 'NBS' },
  { id: 'ppi', label: 'PPI', period: ECON_PERIOD.month, level: 'watch', src: 'NBS' },
  { id: 'cpi', label: 'CPI', period: ECON_PERIOD.ytd, level: 'watch', src: 'NBS' },
];

const m1m2 = HEADLINE_GAUGES.find((g) => g.id === 'm1m2')?.series?.at(-1);

/** 四轴：一句话读法 */
const AXES = [
  { k: '供给', level: 'ok', text: `工业 ${val('iva')}%、出口 ${val('export')}%，外需与制造撑住总量` },
  { k: '内需', level: 'alert', text: `社零 ${val('retail')}%、固投 ${val('fai')}%，地产仍是最大拖累` },
  { k: '价格', level: 'watch', text: `PPI 回升至 ${val('ppi')}%，以输入性为主；CPI ${val('cpi')}%，仍在 1% 下方` },
  { k: '信用', level: 'watch', text: `社融存量 ${val('afre')}%，M1−M2 ${sgn(m1m2)}pct，活化回落` },
];

const PMI_BANDS = [
  { to: 49, level: 'alert' },
  { to: 50, level: 'watch' },
  { to: 55, level: 'ok' },
];

export default function EconHero() {
  const gdp = byId('gdp_h1');
  const pmi = byId('pmi_mfg');
  return (
    <section className="eh" aria-label="经济罗盘">
      <div className="eh__lead">
        <p className="eh__eyebrow">十五五开局 · {ECON_PERIOD.gdp}读数</p>
        <div className="eh__figure vi-figure">
          {gdp?.value?.toFixed(1)}
          <span className="eh__pct">%</span>
        </div>
        <p className="eh__caption">
          GDP 实际同比 · {GDP_QUARTER.label} <b className="vi-figure">+{GDP_QUARTER.yoy}%</b>、环比 <b className="vi-figure">+{GDP_QUARTER.qoq}%</b>
        </p>
        <ul className="eh__axes">
          {AXES.map((a) => (
            <li key={a.k} className={`eh__axis eh__axis--${a.level}`}>
              <Signal level={a.level} size="s" showLabel={false} />
              <b>{a.k}</b>
              <span>{a.text}</span>
            </li>
          ))}
        </ul>
        <p className="eh__meta">灯色为本站示意研判 · 非官方分级 · 数据截至 {ECON_DATA_AS_OF}</p>
      </div>

      <div className="eh__dial">
        <Armillary
          value={pmi?.value ?? 50}
          min={46}
          max={54}
          bands={PMI_BANDS}
          majorStep={1}
          label="制造业 PMI"
          period={ECON_PERIOD.month}
          digits={1}
          size={220}
          note="50 为荣枯线"
        />
      </div>

      <div className="eh__grid">
        {TILES.map((t) => {
          const k = byId(t.id);
          if (!k) return null;
          return (
            <Kpi
              key={t.id}
              size="s"
              label={t.label}
              period={t.period}
              value={sgn(k.value)}
              unit="%"
              level={t.level}
              spark={indicatorSparkline(t.id)}
              source={t.src}
            />
          );
        })}
      </div>
    </section>
  );
}
