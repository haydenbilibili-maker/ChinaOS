import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './jieduContent.html?raw';
import { initJiedu } from './jieduInit.js';
import { resolveJieduTab } from '../../lib/jiedu/routing.js';

/** 戒毒与社区康复人员 GY-49 · #jd-app 样式与 localStorage 隔离 */
export default function JieduPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveJieduTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initJiedu(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="jiedu-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
