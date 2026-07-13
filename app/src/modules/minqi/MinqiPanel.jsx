import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './minqiContent.html?raw';
import { initMinqi } from './minqiInit.js';
import { resolveMinqiTab } from '../../lib/minqi/routing.js';

/** 中小民营企业主 GY-42 · #mq-app 样式与 localStorage 隔离 */
export default function MinqiPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveMinqiTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initMinqi(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="minqi-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
