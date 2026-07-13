import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './jipinContent.html?raw';
import { initJipin } from './jipinInit.js';
import { resolveJipinTab } from '../../lib/jipin/routing.js';

/** 城市极贫与救助对象 GY-43 · #jp-app 样式与 localStorage 隔离 */
export default function JipinPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveJipinTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initJipin(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="jipin-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
