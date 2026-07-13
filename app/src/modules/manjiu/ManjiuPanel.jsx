import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import contentHtml from './manjiuContent.html?raw';
import { initManjiu } from './manjiuInit.js';
import { resolveManjiuTab } from '../../lib/manjiu/routing.js';

/** 慢就业青年/全职儿女/NEET GY-34 · #mj-app 样式与 localStorage 隔离 */
export default function ManjiuPanel() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const deepLink = useMemo(
    () => ({ tab: resolveManjiuTab(searchParams.get('tab') || undefined) }),
    [searchParams],
  );

  useEffect(() => {
    const cleanup = initManjiu(rootRef.current, deepLink);
    return cleanup;
  }, [deepLink]);

  return (
    <div className="manjiu-module-wrap">
      <div
        ref={rootRef}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
