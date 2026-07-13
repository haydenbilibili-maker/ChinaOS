import { Link } from 'react-router-dom';
import {
  ATTRIBUTION_ROUTE,
  SIGNAL_PANEL_ROUTE,
  THREE_FORCES_ROUTE,
} from '../../domain/governance.ts';
import { MACRO_HOUSEHOLD_LOANS } from '../../domain/macro-indicators.ts';
import { CUSHION_LAYERS } from './cushionLayers.seed.ts';
import {
  CUSHION_NAMES,
  CUSHION_YEARS,
  countryColor,
  sortCushionBars,
} from './computeLayers.ts';
import './cushion-monitor.css';

function LayerBars({ layer }) {
  const bars = sortCushionBars(layer.vals);

  return (
    <div className="cm-layer">
      <div className="cm-l-hd">
        <span className="cm-l-no">{layer.no}</span>
        <h3>{layer.name}</h3>
        <span className="cm-l-q">{layer.q}</span>
      </div>
      <div className="cm-l-metric">{layer.metric}</div>
      <div className="cm-bars">
        {bars.map(([country, val]) => (
          <div key={country} className="cm-bar-row">
            <span className="cm-bar-lb">
              <i style={{ background: countryColor(country) }} />
              {CUSHION_NAMES[country]}
              <span className="yr">{CUSHION_YEARS[country]}</span>
            </span>
            <span className="cm-bar-track">
              <span
                className="cm-bar-fill"
                style={{
                  width: `${val.s}%`,
                  background: countryColor(country),
                  opacity: country === 'cn' ? 1 : 0.62,
                }}
              />
            </span>
            <span className="cm-bar-val">{val.t}</span>
          </div>
        ))}
      </div>
      <div className="cm-l-verdict" dangerouslySetInnerHTML={{ __html: layer.verdict }} />
    </div>
  );
}

export default function CushionMonitor() {
  return (
    <div className="ink-observatory cm-wrap">
      <header className="cm-masthead">
        <div className="cm-brand">
          <span className="cm-glyph">ChinaOS</span>
          <h1>
            垫子厚度监测 <span>· 中 / 日 / 韩 / 美 四国对照</span>
          </h1>
        </div>
        <div className="cm-meta">
          命题 · <b>&quot;未富先躺&quot;是否成立</b>
          <br />
          方法 · 比较&quot;躺下那一刻&quot;的初始条件
          <br />
          配套 · <Link to={THREE_FORCES_ROUTE}>三力监测仪</Link> /{' '}
          <Link to={SIGNAL_PANEL_ROUTE}>信号灯面板</Link>
        </div>
      </header>

      <div className="cm-method">
        <b>⚠ 方法论：不能拿&quot;今天的中国&quot;比&quot;今天的日本&quot;。</b>
        日本已经躺了三十年，垫子早被消耗和重塑。要比的是<b>同一个时点上的初始条件</b>——
        当&quot;努力—回报&quot;的合同作废、一代人开始退出的那一刻，<b>身下垫着什么</b>。
        <div className="cm-anchors">
          锚点 ⟶ 中国 2025/26（刚躺下） · 日本 1991（泡沫破裂 / 冰河期世代起点） ·
          韩国 1997（IMF 危机 / IMF世代起点） · 美国 1991（Gen X / Slacker 世代起点）
        </div>
      </div>

      <section className="cm-matrix-wrap">
        <div className="cm-m-ey">命运矩阵 · CUSHION × NEW TABLE</div>
        <div className="cm-m-title">决定命运的不是垫子厚度，是垫子 × 牌桌</div>
        <p className="cm-m-lead">
          垫子薄不致命——<b>美国就薄</b>。牌桌不开也不致命——<b>日本就没开</b>。
          致命的是<b>垫子薄 且 牌桌不开</b>：没有资本熬，也没有新游戏可入场。
          这是一个<b>乘积</b>，不是加法。而中国，正站在这个象限的门口。
        </p>

        <div className="cm-matrix">
          <div />
          <div className="cm-colhd">
            新牌桌<b>没开</b>
          </div>
          <div className="cm-colhd">
            新牌桌<b>开了</b>
          </div>

          <div className="cm-rowhd">
            垫子
            <br />
            <b>厚</b>
          </div>
          <div className="cm-cell mid">
            <div className="who">
              <span className="pin" style={{ background: 'var(--jp)' }} />
              日本 · 冰河期世代
            </div>
            <div className="outcome">
              错失第五轮康波主导权，没等到新牌桌。但人均近 <b>3 万美元</b>的厚垫子撑住了——
              低欲望从危机<b>沉淀为均衡</b>，社会围绕它完成商业适配。<b>安然滑落三十年。</b>
            </div>
          </div>
          <div className="cm-cell ok">
            <div className="who">
              <span className="pin" style={{ background: 'var(--kr)' }} />
              韩国 · IMF世代（部分）
            </div>
            <div className="outcome">
              产业升级成功、财阀跻身全球一线。但红利<b>赢家通吃</b>——
              生育率跌破 <b>0.8</b>（全球最低）。<b>赢了产业，输了人。</b>
            </div>
          </div>

          <div className="cm-rowhd">
            垫子
            <br />
            <b>薄</b>
          </div>
          <div className="cm-cell danger">
            <div className="who">
              <span className="pin" style={{ background: 'var(--cn)' }} />
              中国 · 当代青年（风险象限）
            </div>
            <div className="outcome">
              垫子<b>四层皆薄</b>，且背着会自己变重的负债。若 AI 红利迟到、
              或落地为&quot;纯替代&quot;，则<b>既无资本熬，也无新桌可入</b>。<b>这是最危险的组合。</b>
            </div>
          </div>
          <div className="cm-cell ok">
            <div className="who">
              <span className="pin" style={{ background: 'var(--us)' }} />
              美国 · Gen X / Slacker
            </div>
            <div className="outcome">
              垫子同样不厚，但第五轮康波（互联网）在九十年代末打开了一张
              <b>不问出身的新牌桌</b>，且<b>创造新任务多于消灭旧任务</b>。<b>躺平被增量吸收。</b>
            </div>
          </div>
        </div>

        <div className="cm-m-note">
          <b>读法</b> · 中国当前的位置尚未落定——它站在左下与右下之间。
          决定它掉进哪一格的，不是垫子（垫子已成定局），而是<b>第六轮康波的牌桌会不会开、对谁开</b>。
          这正是「<Link to={THREE_FORCES_ROUTE}>三力监测仪</Link>」在盯的东西。
        </div>
      </section>

      <section className="cm-section">
        <div className="cm-s-head">
          <h2>四层垫子 · 逐层拆解</h2>
          <span className="sub">条越长 = 垫子越厚</span>
        </div>
        <div className="cm-legend">
          <span>
            <i style={{ background: 'var(--cn)' }} />
            中国 2025/26
          </span>
          <span>
            <i style={{ background: 'var(--jp)' }} />
            日本 1991
          </span>
          <span>
            <i style={{ background: 'var(--kr)' }} />
            韩国 1997
          </span>
          <span>
            <i style={{ background: 'var(--us)' }} />
            美国 1991
          </span>
        </div>
        {CUSHION_LAYERS.map((layer) => (
          <LayerBars key={layer.no} layer={layer} />
        ))}
      </section>

      <section className="cm-hedge">
        <h2>必须给的对冲：中国也有日本没有的三样东西</h2>
        <p className="lead">
          只讲垫子，这就成了一篇唱衰稿。诚实要求把中国的相对优势也摆足——而且它们是真实的。
        </p>
        <div className="cm-hg">
          <div className="cm-hc">
            <div className="t">追赶空间仍在</div>
            <div className="d">
              城镇化率 65.2%（2022），较日本 1990 年的 77.4% 仍有约 12 个百分点空间；
              每年约 1400 万农村转移人口是真实潜在需求。<b>日本躺下时红利已吃干净，中国还没有。</b>
            </div>
          </div>
          <div className="cm-hc">
            <div className="t">政策工具箱更满</div>
            <div className="d">
              利率仍有下调空间（日本 1991 年政策利率已 6%）；外储 3.1 万亿美元、资本项目未完全开放；
              且<b>国家直接掌控银行体系</b>，理论上能阻止债务通缩的无序崩塌——日本当年没有这个工具。
            </div>
          </div>
          <div className="cm-hc">
            <div className="t">这一轮技术革命没错过</div>
            <div className="d">
              研发强度 2.55%（2022），已接近日本 1990 年的 2.53%。
              <b>日本在互联网革命中错失先机；中国在 AI、新能源、5G 是主要玩家。</b>
              这是中国真正可能不同于日本的地方。
            </div>
          </div>
        </div>
      </section>

      <section className="cm-verdict">
        <div className="ey">终局判断 · VERDICT</div>
        <p>
          <b>&quot;未富先躺&quot;不是修辞，是可验证的事实。</b>四层垫子，中国在每一层都比 1991 年的日本薄：
          国家垫不到日本的一半（1.3 万 vs 2.9 万美元）；家庭垫更薄、更单一、且背着会在通缩中自动变重的负债；
          制度垫更薄、且分&quot;内外两种人&quot;（三亿农民工尚无完整市民权）；时间垫更紧——
          同样的老龄化程度，只有零头的人均收入。
        </p>
        <p>
          但中国<b>不会简单复刻日本</b>：它的路更窄、更险，同时也更可能走出不同的结局——
          因为它还有追赶空间、还有政策工具、还赶上了一轮它没有错过的技术革命。
        </p>
        <div className="kicker">
          中国的年轻人躺下的姿势和日本一样，但<b>地面更硬、背的包更重、时钟走得更快</b>。
          <br />
          日本可以用三十年慢慢滑下去，因为它躺在一张厚垫子上。
          <br />
          <b>中国没有那么多年可以耗。</b>
        </div>
      </section>

      <footer className="cm-foot">
        <b>数据</b>　人均 GDP：日本 1991 约 28,942 美元；中国 2022 约 12,741 美元（约合日本 1983 年水平）。
        老龄化 7%→14%：日本用 24 年（1970–1994），中国仅用 21 年（2001–2021）。
        居民杠杆率：中国 62.3%（2022）vs 日本泡沫期峰值约 70%（1990）。房价较峰值：中国约 -30%（与{' '}
        <Link to={SIGNAL_PANEL_ROUTE}>信号灯 C4</Link> / {MACRO_HOUSEHOLD_LOANS.name} 同源读数）。
        新生儿：中国 2025 年 793 万（1949 年以来最低）。韩国总和生育率已低于 0.8。
        <br />
        <b>边界</b>　各国口径与统计年份不完全可比，条形图为归一化后的<b>相对厚度示意</b>，用于结构比较，非精确数值对照。
        制度垫议题可对照{' '}
        <Link to={`${ATTRIBUTION_ROUTE}?issue=dec-social-security`}>三层归因 · 社保扩面</Link>。
        本模块为结构性分析工具，非投资建议。
      </footer>
    </div>
  );
}
