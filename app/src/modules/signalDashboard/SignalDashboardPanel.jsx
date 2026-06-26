import { useEffect, useRef } from 'react';
import contentHtml from './signalContent.html?raw';
import { initSignalDashboard } from './signalInit.js';

/** 宏观再平衡信号灯 · #sd-app 样式与 localStorage 隔离 */
export default function SignalDashboardPanel() {
  const rootRef = useRef(null);

  useEffect(() => {
    const cleanup = initSignalDashboard(rootRef.current);
    return cleanup;
  }, []);

  return (
    <div className="signal-dashboard-module-wrap">
      <div
        id="sd-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
