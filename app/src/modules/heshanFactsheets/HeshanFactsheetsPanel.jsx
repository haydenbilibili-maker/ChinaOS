import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import contentHtml from './content.html?raw';
import { initHeshanFactsheets } from './factsheetsInit.js';
import HeshanFactsheetMap from './HeshanFactsheetMap.jsx';

/** 重构河山 · #hs-factsheets-app 样式隔离 */
export default function HeshanFactsheetsPanel() {
  const shellRef = useRef(null);
  const rootRef = useRef(null);
  const [mapSlot, setMapSlot] = useState(null);

  useEffect(() => {
    const cleanup = initHeshanFactsheets(rootRef.current);
    const slot = rootRef.current?.querySelector('#hs-factsheets-map-slot') || null;
    setMapSlot(slot);
    return cleanup;
  }, []);

  useEffect(() => {
    if (!mapSlot) return undefined;
    const section = mapSlot.querySelector('.heshan-map-section');
    if (!section) return undefined;
    // portal 后补观察入场（init 时 slot 尚空）
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    io.observe(section);
    return () => io.disconnect();
  }, [mapSlot]);

  const handleSelectUnit = useCallback((slug) => {
    const root = rootRef.current;
    if (!root) return;
    const card = root.querySelector(`[data-heshan-unit="${slug}"]`);
    if (!card) return;
    root.querySelectorAll('.fc.is-map-highlight').forEach((el) => el.classList.remove('is-map-highlight'));
    card.classList.add('is-map-highlight');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => card.classList.remove('is-map-highlight'), 2400);
  }, []);

  return (
    <div className="heshanFactsheets-module-wrap">
      <div id="hs-factsheets-shell" ref={shellRef}>
        <div ref={rootRef} dangerouslySetInnerHTML={{ __html: contentHtml }} />
        {mapSlot
          ? createPortal(
              <HeshanFactsheetMap onSelectUnit={handleSelectUnit} />,
              mapSlot,
            )
          : null}
      </div>
    </div>
  );
}
