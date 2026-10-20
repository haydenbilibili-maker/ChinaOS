import { describe, it, expect } from 'vitest';
import { volumeToMarkdown } from './volumeMarkdown.js';
import { VOLUMES } from './volumes.js';

describe('volumeToMarkdown', () => {
  it('renders thesis, frameworks and sections', () => {
    const md = volumeToMarkdown({
      thesis: '论点',
      frameworks: [{ title: '栈', subtitle: '副', body: '框架正文', pillars: [['L0', '地理']] }],
      sections: [{ title: '一', lead: '导语', body: ['甲', '乙'], cards: [{ title: '卡', body: '内容' }] }],
    });
    expect(md).toBe('> 论点\n\n## 框架 · 栈\n\n*副*\n\n框架正文\n\n- **L0**　地理\n\n## 一\n\n> 导语\n\n甲\n\n乙\n\n**卡**　内容');
  });

  it('every shipped volume produces headed text', () => {
    Object.values(VOLUMES).forEach((v) => {
      const md = volumeToMarkdown(v);
      expect(md.length).toBeGreaterThan(200);
      expect(md).toMatch(/^## /m);
    });
  });
});
