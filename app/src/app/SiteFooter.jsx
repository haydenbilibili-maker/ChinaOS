import React from 'react';
import { AS_OF_BASELINE } from '../lib/config/asOfBaseline.js';

const COPYRIGHT_START = 2024;
const AS_OF = AS_OF_BASELINE;
const HOLDER = 'China2OS · 中国深度调研系列';

export default function SiteFooter() {
  const yearEnd = new Date().getFullYear();
  const yearSpan = yearEnd > COPYRIGHT_START ? `${COPYRIGHT_START}–${yearEnd}` : String(COPYRIGHT_START);

  return (
    <footer className="os-site-footer" role="contentinfo">
      <div className="os-site-footer-inner">
        <div className="os-site-footer-line">
          <span className="os-site-footer-holder">{HOLDER}</span>
          <span className="os-site-footer-sep" aria-hidden="true">·</span>
          <span className="mono os-site-footer-copy">© {yearSpan}</span>
        </div>
        <p className="os-site-footer-disclaimer">
          本站内容仅供研究学习，转载须注明出处；数据与人物信息来自公开资料，不代表任何立场。
        </p>
        <p className="os-site-footer-meta">
          <span>数据时效锚点 <span className="mono">{AS_OF}</span></span>
          <span className="os-site-footer-sep" aria-hidden="true">·</span>
          <span className="os-site-footer-en">Research use only · Public sources</span>
        </p>
      </div>
    </footer>
  );
}
