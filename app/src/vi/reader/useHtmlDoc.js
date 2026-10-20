import { useCallback, useRef, useState } from 'react';
import { htmlToMarkdown, pickContentRoot } from './htmlToMarkdown.js';

/**
 * 按需抓取同源 HTML 卷页并转为阅读器 Markdown。
 * 首次 open() 时才请求；结果缓存在组件生命周期内。
 */
export default function useHtmlDoc(src) {
  const [state, setState] = useState({ open: false, loading: false, error: '', markdown: '' });
  const loadedRef = useRef('');

  const open = useCallback(async () => {
    setState((s) => ({ ...s, open: true }));
    if (loadedRef.current === src) return;
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const res = await fetch(src, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const markdown = htmlToMarkdown(pickContentRoot(doc), { dropTitle: true });
      loadedRef.current = src;
      setState((s) => ({ ...s, loading: false, markdown }));
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: `卷页读取失败（${e.message || e}）` }));
    }
  }, [src]);

  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return { ...state, openReader: open, closeReader: close };
}
