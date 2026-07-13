import { calcRunway } from '../../../domain/personal.ts';

function parseInput(raw) {
  if (raw.trim() === '') return '';
  const n = Number(raw);
  return Number.isFinite(n) ? n : '';
}

const FIELDS = [
  { key: 'cash', label: '当前可动用现金（万元）' },
  { key: 'expense', label: '月必需支出（元）' },
  { key: 'divid', label: '门店月分红（元）' },
  { key: 'stress', label: '压力情景：分红剩余比例（%）' },
];

export default function RunwayCalculator({ runway, onChange }) {
  const result = calcRunway(runway);

  return (
    <div className="pr-runway">
      <h3>⚠ 现金安全垫计算器（对应风险 R1）</h3>
      <p className="pr-runway-lead">
        你唯一明确的短板。
        <b>安全垫的意义不是收益，是「在窗口打开时，你有资格等」。</b>
        建议目标 12–18 个月——因为改革窗口开启时通常极其短暂，而你必须有本钱撑到它开。
      </p>
      <div className="pr-rgrid">
        {FIELDS.map((f) => (
          <div className="pr-irow" key={f.key}>
            <label>{f.label}</label>
            <input
              type="number"
              placeholder="—"
              value={runway[f.key] === '' ? '' : runway[f.key]}
              onChange={(e) => onChange({ [f.key]: parseInput(e.target.value) })}
            />
          </div>
        ))}
      </div>
      <div className="pr-rout">
        {result.scenarios.map((s) => (
          <div className="pr-stat" key={s.label}>
            <div className="pr-stat-v" style={{ color: s.color }}>
              {s.display}
            </div>
            <div className="pr-stat-k">{s.label}</div>
          </div>
        ))}
        <div className="pr-stat">
          <div className="pr-stat-v" style={{ color: result.gapColor }}>
            {result.gapDisplay}
          </div>
          <div className="pr-stat-k">距「全停摆撑12月」缺口</div>
        </div>
      </div>
    </div>
  );
}

export { calcRunway };
