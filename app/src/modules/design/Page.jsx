import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../app/ui.jsx';
import { ModuleFooter } from '../shared/ModuleParadigm.jsx';
import { KEY_INDICATORS, INDICATOR_SPARKLINES, ECON_PERIOD } from '../econdash/econData.js';
import Signal, { SkyLamp } from '../../vi/Signal.jsx';
import Armillary from '../../vi/Armillary.jsx';
import Kpi from '../../vi/Kpi.jsx';
import Seal from '../../vi/Seal.jsx';
import { armillarySvg } from '../../lib/vi/atmosphere.js';
import Reader from '../../vi/reader/Reader.jsx';
import { fetchCorpusBody, getCorpusEntry } from '../../lib/doc/policyCorpus.js';
import './design.css';

// ============================================================================
// VI 2.0「观象」样张页：规范 docs/design/VI-2.0.md 的活体版本。
// 仪表与 KPI 读数取自经济大盘 KEY_INDICATORS（真实数据），信号判定为示例阈值。
// ============================================================================

const ind = (id) => KEY_INDICATORS.find((k) => k.id === id);
const lastDelta = (id) => {
  const s = INDICATOR_SPARKLINES[id];
  return s && s.length > 1 ? Number((s[s.length - 1] - s[s.length - 2]).toFixed(1)) : undefined;
};

const BASE_SWATCHES = [
  ['--vi-bg-0', '底'],
  ['--vi-bg-1', '画布'],
  ['--vi-bg-2', '卡片'],
  ['--vi-bg-3', '浮层'],
  ['--vi-ink-3', '辅助'],
  ['--vi-ink-2', '次文字'],
  ['--vi-ink-1', '主文字'],
];

const BRAND_SWATCHES = [
  ['--vi-cinnabar', '朱砂', '品牌 · 告警'],
  ['--vi-brass', '铜', '刻度 · 关注'],
  ['--vi-celadon', '青瓷', '稳定 · 正向'],
  ['--vi-lapis', '霁蓝', '数据 · 交互'],
  ['--vi-rosewood', '紫檀', '第五类数据'],
];

const DATA_PALETTE = ['--vi-lapis', '--vi-brass', '--vi-celadon', '--vi-cinnabar', '--vi-rosewood', '--vi-stone', '--vi-ochre', '--vi-inkgray'];

const TYPE_SCALE = [
  ['display', 'Display', '观测中国'],
  ['h1', 'H1 页面标题', '前三季度经济运行总体平稳'],
  ['h2', 'H2 区块标题', '通缩与资金活化'],
  ['h3', 'H3 卡片标题', '制造业采购经理指数'],
  ['body', 'Body 界面正文', '九月制造业 PMI 回到荣枯线以上，新订单仍在扩张区间，价格指数受国际大宗商品推动明显抬升。'],
  ['small', 'Small 说明', '数据来源：国家统计局 2026-10-19 发布，口径为可比价实际增速。'],
  ['caption', 'Caption 标签', '截至 2026-10-19 · NBS'],
];

const FIGURE_SCALE = [
  ['figure-xl', '主 KPI', '4.6', '%'],
  ['figure', '次 KPI', '50.1', ''],
];

const MOTION = [
  ['instant', '90ms', '按压、勾选'],
  ['quick', '160ms', '悬停、切换'],
  ['base', '260ms', '展开、浮层'],
  ['slow', '480ms', '入场、路由'],
  ['epic', '900ms', '仪表指针、主视觉'],
];

const ELEVATION = [
  ['E1', '漆面', '普通卡片：渐变底 + 顶部内高光 + 发丝边', 'os-card'],
  ['E2', '铜框', '主卡片与 KPI：铜色渐变边 + 刻度线 + 柔和投影', 'os-card vi-e2 os-stat-card'],
  ['E3', '琉璃', '浮层与命令面板：背景模糊 + 强投影', 'vi-glass'],
];

function Section({ no, title, lead, children }) {
  return (
    <section className="vi-spec-section">
      <header className="vi-spec-section__head">
        <span className="vi-spec-section__no vi-figure">{no}</span>
        <div>
          <h2 className="vi-h2">{title}</h2>
          {lead && <p className="vi-spec-section__lead">{lead}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function Swatch({ token, name, note, large = false }) {
  return (
    <div className={`vi-swatch${large ? ' vi-swatch--lg' : ''}`}>
      <span className="vi-swatch__chip" style={{ background: `var(${token})` }} />
      <span className="vi-swatch__name">{name}</span>
      {note && <span className="vi-swatch__note">{note}</span>}
      <code className="vi-swatch__token">{token}</code>
    </div>
  );
}

const READER_SAMPLE_ID = 'gwr-2026';

function useReaderSample(open) {
  const [state, setState] = useState({ md: '', title: '', meta: [], loading: false, error: '' });
  useEffect(() => {
    if (!open) return undefined;
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    Promise.all([getCorpusEntry(READER_SAMPLE_ID), fetchCorpusBody(READER_SAMPLE_ID)])
      .then(([entry, md]) => alive && setState({ md: md || '', title: entry?.title || '政府工作报告', meta: [entry?.org, entry?.date, entry?.type], loading: false, error: '' }))
      .catch((e) => alive && setState((s) => ({ ...s, loading: false, error: String(e?.message || e) })));
    return () => { alive = false; };
  }, [open]);
  return state;
}

export default function DesignSystemPage() {
  const [motionKey, setMotionKey] = useState(0);
  const [params, setParams] = useSearchParams();
  const readerOpen = params.get('reader') === '1';
  const sample = useReaderSample(readerOpen);
  const setReader = (on) => setParams((prev) => {
    const next = new URLSearchParams(prev);
    if (on) next.set('reader', '1'); else next.delete('reader');
    return next;
  });
  const gdp = ind('gdp_h1');
  const pmi = ind('pmi_mfg');
  const cpi = ind('cpi');
  const m2 = ind('m2');
  const unemp = ind('urban_unemp');

  return (
    <div className="vi-spec">
      <PageHeader badge="Visual Identity · 2.0" title="视觉识别 · 观象" subtitle="China OS 是一台观测中国的精密仪器。本页是 VI 2.0 规范的活体样张：色彩、字体、材质、动效、信号灯与仪表，全部取自生产令牌。" />

      {/* ── 主视觉 ── */}
      <div className="vi-spec-hero os-card vi-e2">
        <div className="vi-spec-hero__orbit" aria-hidden="true" dangerouslySetInnerHTML={{ __html: armillarySvg() }} />
        <div className="vi-spec-hero__copy">
          <div className="vi-spec-hero__mark">
            <Seal size={44} />
            <span className="vi-spec-hero__brand">China OS</span>
          </div>
          <h2 className="vi-display">观象<span className="vi-spec-hero__dot">。</span></h2>
          <p className="vi-spec-hero__lead">
            深 · 准 · 静。用漆的层次、铜的刻度、朱砂的克制，把高密度信息做成一件可以长期使用的器物。
          </p>
          <ul className="vi-spec-hero__keys">
            <li><strong>深</strong><span>有材质、有景深</span></li>
            <li><strong>准</strong><span>精密仪器的刻度感</span></li>
            <li><strong>静</strong><span>一屏只有一个主角</span></li>
          </ul>
        </div>
        <div className="vi-spec-hero__lamp">
          <SkyLamp
            size={240}
            verdict="样例"
            caption="天灯 · 三环三期"
            rings={[
              { label: '短期', level: 'watch' },
              { label: '中期', level: 'alert' },
              { label: '长期', level: 'ok' },
            ]}
          />
        </div>
      </div>

      <Section no="01" title="色彩" lead="暖调基底取代 1.x 的冷蓝灰；品牌色合计不超过一屏面积的 10%，一屏只有一个满色元素。">
        <div className="vi-swatch-ramp">
          {BASE_SWATCHES.map(([t, n]) => <Swatch key={t} token={t} name={n} />)}
        </div>
        <div className="vi-swatch-grid">
          {BRAND_SWATCHES.map(([t, n, note]) => <Swatch key={t} token={t} name={n} note={note} large />)}
        </div>
        <div className="vi-spec-sub">
          <h3 className="vi-h3">数据可视化色板</h3>
          <div className="vi-data-palette">
            {DATA_PALETTE.map((t, i) => (
              <span key={t} className="vi-data-palette__chip" style={{ background: `var(${t})` }}>
                <span className="vi-figure">{i + 1}</span>
              </span>
            ))}
          </div>
          <div className="vi-ramp-row">
            <span className="vi-ramp vi-ramp--seq" />
            <span className="vi-caption">单向 · 玄 → 铜 → 朱砂</span>
          </div>
          <div className="vi-ramp-row">
            <span className="vi-ramp vi-ramp--div" />
            <span className="vi-caption">双向 · 青瓷 ↔ 中性 ↔ 朱砂</span>
          </div>
        </div>
      </Section>

      <Section no="02" title="字体与字号" lead="标题用宋体与 Fraunces 建立编辑部气质；界面用黑体与 Inter；所有数字等宽。字号在 390–1440px 之间连续缩放。">
        <div className="vi-type-specimen">
          {TYPE_SCALE.map(([k, name, sample]) => (
            <div key={k} className="vi-type-row">
              <div className="vi-type-row__meta">
                <span className="vi-type-row__name">{name}</span>
                <code>--vi-fs-{k}</code>
              </div>
              <div className={`vi-type-row__sample vi-type--${k}`}>{sample}</div>
            </div>
          ))}
          {FIGURE_SCALE.map(([k, name, v, u]) => (
            <div key={k} className="vi-type-row">
              <div className="vi-type-row__meta">
                <span className="vi-type-row__name">{name}</span>
                <code>--vi-fs-{k}</code>
              </div>
              <div className={`vi-type-row__sample vi-type--${k} vi-figure`}>
                {v}{u && <span className="vi-unit">{u}</span>}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section no="03" title="材质与层级" lead="五级层级区分主次。把指针移到卡片上，可以看到聚光沿边框游走。">
        <div className="vi-elevation-grid">
          {ELEVATION.map(([lv, name, note, cls]) => (
            <div key={lv} className={`vi-elevation ${cls}`}>
              <span className="vi-elevation__lv vi-figure">{lv}</span>
              <span className="vi-h3">{name}</span>
              <p>{note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section no="04" title="信号灯" lead="颜色、形状、文字三重编码：色弱用户只看形状也能读懂。只有「警」会呼吸。">
        <div className="vi-signal-board os-card">
          {['ok', 'watch', 'alert', 'unknown'].map((lv) => (
            <div key={lv} className="vi-signal-board__col">
              <Signal level={lv} size="l" />
              <div className="vi-signal-board__sizes">
                <Signal level={lv} size="m" />
                <Signal level={lv} size="s" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section no="05" title="仪表" lead={`浑仪仪表：270° 刻度弧、区间色带、铜针。以下读数为 ${ECON_PERIOD.gdp}真实数据，区间阈值为示例。`}>
        <div className="vi-gauge-row">
          {pmi && (
            <div className="os-card vi-gauge-card">
              <Armillary value={pmi.value} min={45} max={55} majorStep={2} label="制造业 PMI" period={ECON_PERIOD.month}
                bands={[{ to: 49, level: 'alert' }, { to: 50, level: 'watch' }, { to: 55, level: 'ok' }]} note="荣枯线 50" />
            </div>
          )}
          {unemp && (
            <div className="os-card vi-gauge-card">
              <Armillary value={unemp.value} min={4} max={7} majorStep={0.5} unit="%" label="城镇调查失业率" period={ECON_PERIOD.month}
                bands={[{ to: 5.5, level: 'ok' }, { to: 6, level: 'watch' }, { to: 7, level: 'alert' }]} note="区间阈值为示例" />
            </div>
          )}
          {cpi && (
            <div className="os-card vi-gauge-card">
              <Armillary value={cpi.value} min={-2} max={4} majorStep={1} unit="%" label="CPI 累计同比" period={ECON_PERIOD.ytd}
                bands={[{ to: 0, level: 'alert' }, { to: 1, level: 'watch' }, { to: 3, level: 'ok' }, { to: 4, level: 'watch' }]} note="区间阈值为示例" />
            </div>
          )}
        </div>
        <div className="vi-kpi-row">
          {gdp && <Kpi label="GDP 实际增速" period={ECON_PERIOD.gdp} value={gdp.value} unit="%" level="watch" spark={INDICATOR_SPARKLINES.gdp_h1} source="NBS 2026-10-19" />}
          {pmi && <Kpi label="制造业 PMI" period={ECON_PERIOD.month} value={pmi.value} delta={lastDelta('pmi_mfg')} level="ok" spark={INDICATOR_SPARKLINES.pmi_mfg} source="NBS 2026-09-30" />}
          {cpi && <Kpi label="CPI" period={ECON_PERIOD.ytd} value={cpi.value} unit="%" delta={lastDelta('cpi')} level="watch" spark={INDICATOR_SPARKLINES.cpi} source="NBS 2026-10-14" />}
          {m2 && <Kpi label="M2 余额同比" period={`${ECON_PERIOD.month}末`} value={m2.value} unit="%" delta={lastDelta('m2')} good="up" level="ok" spark={INDICATOR_SPARKLINES.m2} source="人民银行 2026-10-14" />}
        </div>
      </Section>

      <Section no="06" title="动效" lead="动效解释变化，不制造热闹。只有告警、实时刷新与氛围光会持续运动；系统开启「减弱动效」时全部静止。">
        <div className="vi-motion-grid">
          {MOTION.map(([k, d, use]) => (
            <div key={k} className="vi-motion-token">
              <span className="vi-motion-token__bar" style={{ '--d': d }} />
              <span className="vi-figure vi-motion-token__d">{d}</span>
              <span className="vi-motion-token__k">{k}</span>
              <span className="vi-caption">{use}</span>
            </div>
          ))}
        </div>
        <div className="vi-motion-demo">
          <button type="button" className="os-btn" onClick={() => setMotionKey((n) => n + 1)}>重放墨晕入场</button>
          <div key={motionKey} className="vi-motion-demo__stage os-section-stagger">
            {['墨', '晕', '入', '场'].map((ch) => <span key={ch} className="vi-motion-demo__tile os-card">{ch}</span>)}
          </div>
        </div>
      </Section>

      <Section no="07" title="阅读器" lead="长文统一进入专属阅读器：宋体正文、每行约 36 字、目录与进度、四档字号、玄 / 宣 / 护眼三种主题、专注模式；选中文字即可划线或记笔记，笔记自动进入个人工作台。">
        <div className="vi-reader-teaser os-card vi-e2">
          <div>
            <span className="vi-caption">样例文档</span>
            <p className="vi-reader-teaser__title">2026 年政府工作报告</p>
            <p className="vi-reader-teaser__meta">来自政令文库语料 · 按 + / − 调字号，F 切换专注，Esc 关闭</p>
          </div>
          <button type="button" className="os-btn os-btn-primary" onClick={() => setReader(true)}>打开阅读器</button>
        </div>
      </Section>

      <Section no="08" title="多端" lead="同一套令牌在手机、平板、桌面上换形态而不换语言。">
        <div className="vi-device-grid">
          {[
            ['手机', '< 768', '4 列 · 边距 16–20 · 底部 Dock + 全屏命令面板 · 触控 ≥ 44px'],
            ['平板', '768–1023', '8 列 · 边距 24 · 图标导轨 + 抽屉'],
            ['桌面', '≥ 1024', '12 列 · 边距 32–48 · 侧栏 + 右侧上下文面板'],
          ].map(([n, w, d]) => (
            <div key={n} className="os-card vi-device">
              <span className="vi-h3">{n}</span>
              <span className="vi-figure vi-device__w">{w}</span>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <ModuleFooter moduleId="design" disclaimer="VI 2.0 规范样张 · 仪表阈值为示例" />

      <Reader
        open={readerOpen}
        onClose={() => setReader(false)}
        docId={`policy:${READER_SAMPLE_ID}`}
        title={sample.title}
        badge="政令文库 · 样例"
        meta={sample.meta}
        markdown={sample.md}
        loading={sample.loading}
        error={sample.error}
        sourcePath="/design?reader=1"
      />
    </div>
  );
}
