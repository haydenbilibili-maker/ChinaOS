import {
  CORRUPTION_DENSITY_EQUATION,
  DENSITY_BACKTEST,
  SECTOR_DENSITY,
  densityColor,
} from '../../../domain/anticorruption.ts';

function Rich({ html, className = '', tag: Tag = 'div' }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** 招牌元件 · 部门腐败密度地图 */
export default function CorruptionDensityMap() {
  return (
    <section className="ac-map-wrap os-reveal">
      <div className="ac-ey">招牌元件 · 腐败密度地图</div>
      <div className="ac-map-title">方程不只解释腐败——它预测腐败会长在哪里</div>
      <div className="ac-map-eq">{CORRUPTION_DENSITY_EQUATION}</div>
      <p className="ac-map-lead">
        如果这个方程是真的，<b>那它就应该能预测窝案的聚集地。</b>
        而十八大以来十四年的案卷，正好是它的<b>回测数据集</b>。
        下面按两个因子逐部门打分、排序——<b>然后拿真实的窝案分布去检验它。</b>
      </p>

      <div className="ac-grid-hd">
        <span>部门 / 系统</span>
        <span>租金面（权力支配多少钱）</span>
        <span>监督缺口（外部约束多弱）</span>
        <span style={{ textAlign: 'right' }}>密度</span>
        <span>回测：实际窝案分布</span>
      </div>

      {SECTOR_DENSITY.map((s, i) => (
        <div key={s.name} className="ac-srow">
          <div className="ac-sname">
            <span className="ac-rk">{String(i + 1).padStart(2, '0')}</span>
            <span style={s.epicenter ? { color: 'var(--red)' } : undefined}>{s.name}</span>
            {s.epicenter ? (
              <span className="ac-epicenter-tag">震中</span>
            ) : null}
          </div>
          <div>
            <div className="ac-minitrack">
              <div
                className="ac-minifill"
                style={{ width: `${s.rent}%`, background: densityColor(s.rent) }}
              />
            </div>
            <div className="ac-miniv">
              {s.rent} · {s.rentWhy}
            </div>
          </div>
          <div>
            <div className="ac-minitrack">
              <div
                className="ac-minifill"
                style={{ width: `${s.gap}%`, background: densityColor(s.gap) }}
              />
            </div>
            <div className="ac-miniv">
              {s.gap} · {s.gapWhy}
            </div>
          </div>
          <div className="ac-dens" style={{ color: densityColor(s.density) }}>
            {s.density}
          </div>
          <div className="ac-evid">
            {s.evid}
            {s.note ? (
              <>
                <br />
                <span style={{ color: s.warn ? 'var(--red)' : 'var(--amber)' }}>{s.note}</span>
              </>
            ) : null}
          </div>
        </div>
      ))}

      <div className="ac-backtest">
        <div className="ac-backtest-lb">回测结果 · Backtest</div>
        <div className="ac-backtest-v">{DENSITY_BACKTEST.headline}</div>
        <Rich className="ac-backtest-d" html={DENSITY_BACKTEST.body} tag="p" />
      </div>
    </section>
  );
}
