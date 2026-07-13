import { useState } from 'react';

export default function DriversPanel({ drivers }) {
  const [openId, setOpenId] = useState('driver1');

  return (
    <div className="pr-panel">
      <div className="pr-panel-ey">三个结构性驱动力</div>
      <p style={{ fontSize: 13, color: 'var(--pr-text-dim)', margin: '0 0 12px' }}>
        权限半径单调收缩的制度解释——非人事优劣，而是结构变迁。
      </p>
      {drivers.map((d) => {
        const open = openId === d.id;
        return (
          <div key={d.id} className="pr-driver">
            <button
              type="button"
              className="pr-driver-btn"
              onClick={() => setOpenId(open ? null : d.id)}
              aria-expanded={open}
            >
              <span>
                <strong>{d.title}</strong>
                <div className="pr-driver-summary">{d.summary}</div>
              </span>
              <span style={{ color: 'var(--pr-brass)' }}>{open ? '−' : '+'}</span>
            </button>
            {open && (
              <div className="pr-driver-body">{d.mechanism}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
