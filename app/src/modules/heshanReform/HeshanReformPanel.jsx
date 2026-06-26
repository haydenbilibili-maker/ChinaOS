import { useEffect, useRef } from 'react';
import contentHtml from './content.html?raw';
import { initHeshanReform } from './reformInit.js';

/** 重构河山 · #hs-reform-app 样式隔离 */
export default function HeshanReformPanel() {
  const rootRef = useRef(null);

  useEffect(() => {
    const cleanup = initHeshanReform(rootRef.current);
    return cleanup;
  }, []);

  return (
    <div className="heshanReform-module-wrap">
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}
