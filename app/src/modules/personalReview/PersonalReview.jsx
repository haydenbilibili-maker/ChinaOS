import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CUSHION_MONITOR_ROUTE,
  SIGNAL_PANEL_ROUTE,
  THREE_FORCES_ROUTE,
} from '../../domain/governance.ts';
import DecisionCalculator from './components/DecisionCalculator.jsx';
import DecisionCompass from './components/DecisionCompass.jsx';
import CushionCheck from './components/CushionCheck.jsx';
import RunwayCalculator from './components/RunwayCalculator.jsx';
import RiskPanel from './components/RiskPanel.jsx';
import PersonalVerdict from './components/PersonalVerdict.jsx';
import { usePersonalStore } from './usePersonalStore.ts';
import { useGovernanceLinkage } from '../../lib/governance/useGovernanceLinkage.ts';
import './personal-review.css';

/** 超个体决策复盘系统 · 私享模块 */
export default function PersonalReview() {
  const {
    state,
    updateDecisionField,
    updateCushionScore,
    updateRunway,
    exportJson,
    importJson,
    clearAll,
  } = usePersonalStore();
  const { regimeLabel } = useGovernanceLinkage();
  const fileRef = useRef(null);

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (file) importJson(file);
    e.target.value = '';
  };

  const handleClear = () => {
    if (window.confirm('确认清空全部个人数据？此操作不可撤销。')) clearAll();
  };

  return (
    <div className="ink-observatory pr-wrap">
      <header className="pr-masthead">
        <div className="pr-brand">
          <span className="pr-glyph">复盘</span>
          <h1>
            超个体决策复盘系统 <span>· 私享</span>
          </h1>
        </div>
        <div className="pr-meta">
          标尺 · <b>ChinaOS 宏观框架</b>
          <br />
          模型 · 四层垫子 / 账本测试 / 信号灯态势
          <br />
          当前宏观态势 · <b>{regimeLabel}</b>
          {regimeLabel === '防御' ? '（治标买时间）' : ''}
        </div>
      </header>

      <div className="pr-data-bar">
        <span className="pr-data-note">
          数据仅存本地 · <code>chinaos.personal.v1</code> · 不入库
        </span>
        <div className="pr-data-actions">
          <button type="button" className="pr-btn" onClick={exportJson}>
            导出 JSON
          </button>
          <button
            type="button"
            className="pr-btn"
            onClick={() => fileRef.current?.click()}
          >
            导入 JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={handleImport}
          />
          <button type="button" className="pr-btn pr-btn-danger" onClick={handleClear}>
            清空全部
          </button>
        </div>
      </div>

      <section className="pr-thesis">
        <div className="pr-ey">复盘主判词 · VERDICT</div>
        <h2>
          你不是在复盘一个失误的人生。
          <br />
          你是在复盘一个直觉极准、却一直不敢相信自己走对了的人。
        </h2>
        <p>
          用整套模型量完，结论与直觉相反：
          <b>
            在「通缩 + 存量博弈 + 技术革命」的三重环境下，你在没有任何理论指导的情况下，凭直觉做出了一套接近最优的解。
          </b>
          三条主线——
          <b>封死家庭尾部风险</b>（全款房 + 买断养老金）、
          <b>把可动用资本投进唯一一笔生产性资产</b>（门店）、
          <b>把自己变成一本可迁移可复利的账本</b>（0→1 冷启动 / 出海 / AI 实战）——
          恰好就是信号灯面板在「防御」态势下给出的全部建议：
          <b>封风险、进生产性资产、长账本。</b>
        </p>
      </section>

      <section className="pr-section">
        <div className="pr-s-head">
          <span className="pr-s-no">01</span>
          <h2>三笔关键决策 · 实际收益率</h2>
          <span className="pr-sub">数字可改 · 实时重算</span>
        </div>
        <p className="pr-s-lead">
          起点必须被郑重指出：
          <b>父母是东北下岗工人 → 小商贩 → 承包土地十年，供你上大学；毕业时家庭资产盈亏平衡。</b>
          这意味着<b>零家庭资本启动，且需反哺</b>。下面这三笔，全部是你用十年工资从零砌出来的。
        </p>
        <div className="pr-decks">
          {state.decisions.map((d) => (
            <DecisionCalculator
              key={d.id}
              decision={d}
              onFieldChange={updateDecisionField}
            />
          ))}
        </div>
      </section>

      <section className="pr-section">
        <div className="pr-s-head">
          <span className="pr-s-no">02</span>
          <h2>决策罗盘 · 资产组合结构</h2>
          <span className="pr-sub">可迁移性 × 现金流</span>
        </div>
        <p className="pr-s-lead">
          超个体最该警惕的，是把资本压在
          <b>「不可迁移 且 不产生现金流」</b>的东西上——那是御宅族式的「精美收藏架」。
          看你的组合分布：<b>三笔决策全部落在有现金流的一侧。</b>
        </p>
        <DecisionCompass
          decisions={state.decisions}
          pendingItems={state.pendingItems}
        />
      </section>

      <section className="pr-section">
        <div className="pr-s-head">
          <span className="pr-s-no">03</span>
          <h2>个人四层垫子 · 体检</h2>
          <span className="pr-sub">条越长 = 垫子越厚</span>
        </div>
        <p className="pr-s-lead">
          用中日韩美对照那套「四层垫子」模型，量你自己。
          <b>关键发现：制度垫这一层，是你自己花钱砌的——国家没给的，你自己补上了。</b>
          概念联动 →{' '}
          <Link to={CUSHION_MONITOR_ROUTE}>垫子厚度监测</Link>（国家对照版）
        </p>
        <CushionCheck layers={state.cushions} onScoreChange={updateCushionScore} />
      </section>

      <section className="pr-section">
        <div className="pr-s-head">
          <span className="pr-s-no">04</span>
          <h2>三个真实风险</h2>
          <span className="pr-sub">一个只夸人的复盘工具，没有价值</span>
        </div>
        <RiskPanel />
        <RunwayCalculator runway={state.runway} onChange={updateRunway} />
      </section>

      <PersonalVerdict />

      <section className="pr-final">
        <div className="pr-ey">两代人的同一件事</div>
        <p>
          你父母承包了十年土地，把收入变成了你的大学。
          <br />
          你工作了十年，把工资变成了一套全款的房、一份母亲的养老金、和一间自己的店。
        </p>
        <p>
          <b>这两代人做的是同一件事：在没有任何垫子的地方，用时间和身体，一寸一寸地砌出一张垫子。</b>
          <br />
          区别在于——
          <b>你父母砌的是给你的。而你现在砌的这张，是给你自己在下一个周期里，坐上牌桌用的。</b>
        </p>
      </section>

      <footer className="pr-foot">
        <b>方法</b>　本系统用 ChinaOS 宏观框架（四层垫子 / 账本测试 / 信号灯态势）反向量化个体决策。
        所有计算基于填入参数实时重算，改数字即改结论。
        读数联动 → <Link to={SIGNAL_PANEL_ROUTE}>信号灯</Link> ·{' '}
        <Link to={THREE_FORCES_ROUTE}>三力</Link>
        <br />
        <b>边界</b>　这是结构性分析工具，非投资建议。门店分红、房产估值等均为当前快照，存在经营与市场波动风险；
        具体财务决策请结合自身现金流与风险承受力，必要时咨询持牌顾问。
        <br />
        <b>隐私</b>　个人财务数据仅存浏览器 localStorage，不会写入代码库或种子文件。
      </footer>
    </div>
  );
}
