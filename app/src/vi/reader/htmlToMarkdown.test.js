import { describe, it, expect } from 'vitest';
import { htmlToMarkdown } from './htmlToMarkdown.js';

// 最小 DOM 节点桩
const T = (text) => ({ nodeType: 3, textContent: text });
function E(tagName, attrs = {}, ...children) {
  const childNodes = children.map((c) => (typeof c === 'string' ? T(c) : c));
  return {
    nodeType: 1,
    tagName: tagName.toUpperCase(),
    childNodes,
    getAttribute: (k) => (k in attrs ? attrs[k] : null),
    get textContent() { return childNodes.map((c) => c.textContent).join(''); },
  };
}

describe('htmlToMarkdown', () => {
  it('converts headings, paragraphs and bold', () => {
    const md = htmlToMarkdown(E('body', {},
      E('h1', {}, '拐点谱系'),
      E('section', {}, E('h2', {}, '一、总论'), E('p', {}, '鼎盛之中', E('strong', {}, '隐性危机'), '已伏。')),
    ));
    expect(md).toBe('# 拐点谱系\n\n## 一、总论\n\n鼎盛之中**隐性危机**已伏。');
  });

  it('skips scripts, buttons and aria-hidden nodes', () => {
    const md = htmlToMarkdown(E('body', {},
      E('script', {}, 'alert(1)'),
      E('button', {}, '切换'),
      E('div', { 'aria-hidden': 'true' }, '装饰'),
      E('p', {}, '正文'),
    ));
    expect(md).toBe('正文');
  });

  it('lists and blockquotes', () => {
    const md = htmlToMarkdown(E('div', {},
      E('ul', {}, E('li', {}, '甲'), E('li', {}, '乙')),
      E('ol', {}, E('li', {}, '一'), E('li', {}, '二')),
      E('blockquote', {}, '史者，鉴也'),
    ));
    expect(md).toBe('- 甲\n- 乙\n\n1. 一\n2. 二\n\n> 史者，鉴也');
  });

  it('flattens tables into labelled list items', () => {
    const md = htmlToMarkdown(E('table', {},
      E('thead', {}, E('tr', {}, E('th', {}, '朝代'), E('th', {}, '拐点'), E('th', {}, '年份'))),
      E('tbody', {}, E('tr', {}, E('td', {}, '唐'), E('td', {}, '安史之乱'), E('td', {}, '755'))),
    ));
    expect(md).toBe('- **唐**　拐点：安史之乱；年份：755');
  });

  it('labels svg figures and treats text-only divs as paragraphs', () => {
    const md = htmlToMarkdown(E('main', {},
      E('svg', { 'aria-label': '三拐点矩阵' }),
      E('div', {}, '纯文本  容器'),
    ));
    expect(md).toBe('> 〔图示〕三拐点矩阵（交互图见原卷）\n\n纯文本 容器');
  });

  it('drops icon-only paragraphs and short interaction hints', () => {
    const md = htmlToMarkdown(E('div', {},
      E('div', {}, '📜'),
      E('p', {}, '点击揭开真相 👇'),
      E('p', {}, '点击任一行展开该案机制与印证规律，并对照各单卷深描的交叉引用说明'),
    ));
    expect(md).toBe('点击任一行展开该案机制与印证规律，并对照各单卷深描的交叉引用说明');
  });
});
