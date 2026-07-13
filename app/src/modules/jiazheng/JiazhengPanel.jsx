import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './jiazhengContent.html?raw';
import { initJiazheng } from './jiazhengInit.js';
import { resolveJiazhengTab } from '../../lib/jiazheng/routing.js';

/** 家政与照护工人 GY-31 · #jz-app 样式与 localStorage 隔离 */
export default function JiazhengPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveJiazhengTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initJiazheng(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="jiazheng-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
