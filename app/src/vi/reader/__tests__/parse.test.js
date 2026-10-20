import { describe, expect, it } from 'vitest';
import { buildToc, parseBlocks, readingMinutes, stripFrontmatter, trimLeadingTitle } from '../parse.js';

const MD = `---
docId: x
---

# 标题

> 2018-03 · 国务院

## 一、总体要求

第一段
接续一行。

- 甲
- 乙

1. 一
2. 二

### 细目

> 引文

---

\`\`\`
code
\`\`\`
`;

describe('reader parse', () => {
  it('strips frontmatter', () => {
    expect(stripFrontmatter(MD).startsWith('# 标题')).toBe(true);
  });

  it('parses block types in order with stable ids', () => {
    const b = parseBlocks(MD);
    expect(b.map((x) => x.type)).toEqual(['h1', 'quote', 'h2', 'p', 'ul', 'ol', 'h3', 'quote', 'hr', 'code']);
    expect(b.map((x) => x.id)).toEqual(b.map((_, i) => `b${i}`));
    expect(b[3].text).toBe('第一段接续一行。');
    expect(b[4].items).toEqual(['甲', '乙']);
  });

  it('builds a toc from h2/h3 and trims the duplicated head', () => {
    const b = parseBlocks(MD);
    expect(buildToc(b).map((t) => [t.level, t.text])).toEqual([[2, '一、总体要求'], [3, '细目']]);
    expect(trimLeadingTitle(b)[0].type).toBe('h2');
  });

  it('estimates at least one minute', () => {
    expect(readingMinutes(10)).toBe(1);
    expect(readingMinutes(4500)).toBe(10);
  });
});
