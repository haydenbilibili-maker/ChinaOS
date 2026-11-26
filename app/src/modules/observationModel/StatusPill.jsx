import React from 'react';

const STATUS_COLOR = {
  预警: 'var(--status-negative)',
  被查处: 'var(--status-negative)',
  关注: 'var(--status-caution)',
  正常: 'var(--status-positive)',
  在任: 'var(--status-positive)',
  待评: 'var(--text-tertiary)',
};

/** 状态胶囊：指标状态与人员状态共用 */
export default function StatusPill({ status }) {
  const color = STATUS_COLOR[status] || 'var(--text-tertiary)';
  return <span className="om-pill mono" style={{ color, borderColor: color }}>{status}</span>;
}
