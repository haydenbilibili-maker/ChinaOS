import React from 'react';
import { PageHeader } from '../../../app/ui.jsx';
import { ModuleFooter } from '../ModuleParadigm.jsx';

/**
 * GY 切片统一外壳：PageHeader + #xx-app 容器 + ModuleFooter
 * 试点模块以 qingnian 为模板，后续 GY 人群切片可复用。
 */
export default function GySliceShell({
  badge,
  title,
  subtitle,
  appId,
  moduleId,
  children,
  className = '',
  footerProps,
  noAccent = false,
}) {
  return (
    <div className={`gy-slice-shell ${className}`.trim()}>
      <PageHeader badge={badge} title={title} subtitle={subtitle} noAccent={noAccent} />
      <div id={appId} className="gy-slice-app">
        {children}
      </div>
      {moduleId && <ModuleFooter moduleId={moduleId} {...footerProps} />}
    </div>
  );
}
