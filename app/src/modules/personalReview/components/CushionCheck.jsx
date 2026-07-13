function parseScore(raw) {
  if (raw.trim() === '') return '';
  const n = Number(raw);
  if (!Number.isFinite(n)) return '';
  return Math.max(0, Math.min(100, n));
}

export default function CushionCheck({ layers, onScoreChange }) {
  return (
    <div className="pr-cush">
      {layers.map((layer, i) => (
        <CushionRow
          key={layer.name}
          layer={layer}
          onScoreChange={(score) => onScoreChange(i, score)}
        />
      ))}
    </div>
  );
}

function CushionRow({ layer, onScoreChange }) {
  const width = layer.score === '' ? 0 : Number(layer.score);

  return (
    <div className="pr-crow">
      <div className="pr-cn">
        {layer.name}
        {layer.selfBuilt && <span className="pr-self-built">自砌</span>}
        <small>{layer.q}</small>
      </div>
      <div className="pr-ctrack-wrap">
        <div className="pr-ctrack">
          <div
            className="pr-cfill"
            style={{ width: `${width}%`, background: layer.color }}
          />
        </div>
        <input
          type="number"
          className="pr-score-input"
          min={0}
          max={100}
          placeholder="—"
          value={layer.score === '' ? '' : layer.score}
          onChange={(e) => onScoreChange(parseScore(e.target.value))}
        />
      </div>
      <div
        className="pr-cverd"
        dangerouslySetInnerHTML={{ __html: layer.verdict }}
      />
    </div>
  );
}
