import { Link } from 'react-router-dom';
import {
  ATTRIBUTION_ROUTE,
  CUSHION_MONITOR_ROUTE,
  PERSONAL_REVIEW_ROUTE,
  PREMIER_RADIUS_ROUTE,
  SIGNAL_PANEL_ROUTE,
  THREE_FORCES_ROUTE,
  HUANGFEIZHAI_HUB_ROUTE,
} from '../../domain/governance.ts';
import {
  OBSERVATORY_MODULE_COUNT,
  buildObservatoryReading,
} from '../../domain/observatory.ts';
import { useGovernanceLinkage } from '../../lib/governance/useGovernanceLinkage.ts';
import { SEED_ISSUES } from '../attribution/data/issues.seed.ts';
import { CUSHION_LAYERS } from '../cushionMonitor/cushionLayers.seed.ts';
import { chinaCushionAverage } from '../cushionMonitor/computeLayers.ts';
import './observatory.css';

const CORE_FOUR = [
  {
    name: '东北',
    desc: '禀赋不能决定命运。决定命运的是：这块土地上的人，被奖励去做什么。',
  },
  {
    name: '山海关',
    desc: '不是地图炮，是价格表——资本对制度不确定性的风险定价。',
  },
  {
    name: '躺平',
    desc: '不是懒惰，是防御性去杠杆——对一份亏本合同的理性撤资。',
  },
  {
    name: '通缩',
    desc: '被压低二十年的居民消费份额，终于压不住，浮出了水面。',
  },
];

function cushionReadout() {
  const avg = chinaCushionAverage(CUSHION_LAYERS);
  if (avg < 35) return { text: '中国四层皆薄', color: 'var(--red)' };
  if (avg < 65) return { text: '中国垫子偏薄', color: 'var(--amber)' };
  return { text: '中国垫子尚可', color: 'var(--green)' };
}

function personalReadout(regime, proximityScore) {
  if (regime === 'offense') {
    return { text: '窗口已开 · 进攻格', color: 'var(--green)' };
  }
  if (proximityScore >= 62) {
    return { text: '备战格 · 方案就位', color: 'var(--amber)' };
  }
  return { text: '账本在长 · 已在"有为"格', color: 'var(--green)' };
}

export default function ObservatoryHome() {
  const {
    regime,
    regimeScore,
    regimeLabel,
    proximity,
    proximityScore,
    proximityLabel,
    gate,
  } = useGovernanceLinkage();

  const cushion = cushionReadout();
  const personal = personalReadout(regime, proximityScore);

  const reading = buildObservatoryReading({
    regime,
    regimeScore,
    regimeLabel,
    proximity,
    proximityScore,
    proximityLabel,
    c1GateOpen: gate,
    attributionIssueCount: SEED_ISSUES.length,
    cushionSummary: cushion.text,
    cushionColor: cushion.color,
    personalReadout: personal.text,
    personalColor: personal.color,
    routes: {
      threeForces: THREE_FORCES_ROUTE,
      cognition: '/cognition',
      signalPanel: SIGNAL_PANEL_ROUTE,
      attribution: ATTRIBUTION_ROUTE,
      premierRadius: PREMIER_RADIUS_ROUTE,
      cushionMonitor: CUSHION_MONITOR_ROUTE,
      personalReview: PERSONAL_REVIEW_ROUTE,
      huangfeizhai: HUANGFEIZHAI_HUB_ROUTE,
    },
  });

  return (
    <div className="ink-observatory ob-wrap">
      <div className="ob-inner">
        <header className="ob-top">
          <div className="ob-id">
            <span className="ob-mark">ChinaOS</span>
            <h1>
              观象台 <span>Observatory</span>
            </h1>
          </div>
          <div className="ob-stamp">
            读数基准 · <b>{reading.asOf}</b>
            <br />
            模块 · {OBSERVATORY_MODULE_COUNT} · 治理结构 / 周期 / 个人
            <br />
            标尺 · <b>《重构山河》</b>
          </div>
        </header>

        <section className="ob-hero">
          <div className="ob-hero-body">
            <div className="ob-ey">当前判读 · CURRENT READING</div>

            <div className="ob-duo">
              <div className="ob-gauge">
                <div className="ob-g-k">
                  <i style={{ background: reading.signalGauge.color }} />
                  {reading.signalGauge.label}
                </div>
                <div className="ob-g-v">
                  <span className="w" style={{ color: reading.signalGauge.color }}>
                    {reading.signalGauge.word}
                  </span>
                  <span className="n">
                    {reading.signalGauge.score} / 100
                  </span>
                </div>
                <div
                  className="ob-g-d"
                  dangerouslySetInnerHTML={{ __html: reading.signalGauge.description }}
                />
              </div>
              <div className="ob-gauge">
                <div className="ob-g-k">
                  <i style={{ background: reading.forceGauge.color }} />
                  {reading.forceGauge.label}
                </div>
                <div className="ob-g-v">
                  <span className="w" style={{ color: reading.forceGauge.color }}>
                    {reading.forceGauge.word}
                  </span>
                  <span className="n">
                    {reading.forceGauge.score} / 100
                  </span>
                </div>
                <div
                  className="ob-g-d"
                  dangerouslySetInnerHTML={{ __html: reading.forceGauge.description }}
                />
              </div>
            </div>

            <div className="ob-combo">
              <div className="lb">组合判断 · Regime × Proximity</div>
              <div className="verdict">{reading.verdict.headline}</div>
              <p
                className="exp"
                dangerouslySetInnerHTML={{ __html: reading.verdict.explanation }}
              />
            </div>

            <div className="ob-acts">
              {reading.actions.map((act) => (
                <div key={act.index} className="ob-act">
                  <div className="t">
                    <span className="i">{act.index}</span>
                    {act.title}
                  </div>
                  <div className="d" dangerouslySetInnerHTML={{ __html: act.description }} />
                </div>
              ))}
            </div>

            <div className="ob-trig">
              <b>切换扳机</b> · 满足其一即由「防御」转「进攻」：
              ① <b>A1 考核换锚</b>——&quot;居民消费率&quot;进入约束性目标（质变信号）；
              ② <b>C1 平减指数</b>连续两季由负转正并站稳（当前闸门：
              <span style={{ color: reading.trigger.c1Color }}>{reading.trigger.c1Label}</span>）。
            </div>
          </div>
        </section>

        <section className="ob-chain-sec">
          <div className="ob-sec-hd">
            <h2>叙事链 · 世界 → 中国 → 同类 → 我</h2>
            <span className="s">六个模块，一条推理</span>
          </div>
          <p className="ob-sec-lead">
            这不是六个独立看板，是<b>四个依次递进的问题</b>。
            任何一个单独使用都会失真：<b>先看世界处在长波的哪个位置，再看中国为何动不了，
            再看同类躺下时垫着什么，最后才回答——我该怎么办。</b>
          </p>

          <div className="ob-chain">
            {reading.stages.map((stage) => (
              <div key={stage.id} className="ob-stage">
                <div className="ob-st-hd">
                  <span className={`dot ${stage.id === 'self' ? 'is-self' : ''}`}>
                    {stage.index}
                  </span>
                  <span className="nm">
                    {stage.title}
                    <span className="q">{stage.question}</span>
                  </span>
                </div>
                {stage.modules.map((mod) => (
                  <Link
                    key={mod.id}
                    to={mod.route}
                    className={`ob-mod ${mod.highlight ? 'is-highlight' : ''}`}
                  >
                    <div className="mn">{mod.name}</div>
                    <div className="mq">{mod.question}</div>
                    <div className="mr">
                      <i style={{ background: mod.readout.color }} />
                      {mod.readout.text}
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="ob-core">
          <div className="ey">圆心 · 同一道题</div>
          <p className="ob-thesis">
            增长熄火、东北困局、资本却步、青年躺平——四个看似无关的僵局，
            是<b>同一道题的四种抄写</b>：激励结构系统性地奖励&quot;国家多攥着、多投资、多生产&quot;，
            惩罚&quot;把收入还给家庭、转向消费&quot;。而纠偏要求体制做一件违反本能的事——<b>自我缩权</b>。
            故这剂 2007 年就已确诊的药，被反复推迟至今。
          </p>

          <div className="ob-four">
            {CORE_FOUR.map((item) => (
              <div key={item.name} className="ob-fc">
                <div className="n">{item.name}</div>
                <div className="d">{item.desc}</div>
              </div>
            ))}
          </div>

          <p className="ob-kick">
            <b>最清楚病在哪的人，正是最没有权限开那副药的人。</b>
            <br />
            所以这套系统的意义，不是预言窗口何时打开，
            <br />
            而是在窗口关闭的漫长岁月里，<b>把方案准备好</b>。
            <br />
            <br />
            <b>
              因为历史反复证明：改革的窗口开启时通常极其短暂，
              而胜出的从来不是呼吁最响的人，是那些早已把方案写完、只等窗口一开就能推上桌的人。
            </b>
          </p>
        </section>

        <footer className="ob-foot">
          <b>读法</b>　信号灯与三力方向相反：信号灯越绿越好（治本在推进），三力越红&quot;越好&quot;（不改的成本在逼近改的成本）。
          两者并用——<b>信号灯长期无绿灯 + 三力持续升压 = 僵局正在积累代价</b>。
          <br />
          <b>边界</b>　全部基于公开政策文本与制度事实的结构性分析，不含高层&quot;内幕&quot;推测；
          所有读数人工录入、可审计、可争论。非投资建议。
          <br />
          <b>免责</b>　个人仓位与负债决策须结合自身现金流与风险承受力，必要时咨询持牌顾问。
        </footer>
      </div>
    </div>
  );
}
