import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './danshenContent.html?raw';
import { initDanshen } from './danshenInit.js';
import { resolveDanshenTab } from '../../lib/danshen/routing.js';

/** 单身女性与不婚者 · 主动退出的常态化 GY-19 · #ds-app 样式与 localStorage 隔离 */
export default function DanshenPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveDanshenTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initDanshen(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="danshen-module-wrap">
      <div
        id="ds-app"
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
