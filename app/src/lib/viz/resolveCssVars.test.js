import { describe, it, expect } from 'vitest';
import { resolveCssVars } from './resolveCssVars.js';

const vars = { '--bg': '#111', '--ink': 'var(--bg)', '--brass-rgb': '212, 162, 90' };
const lookup = (n) => vars[n] || '';

describe('resolveCssVars', () => {
  it('replaces vars, nested vars and fallbacks', () => {
    expect(resolveCssVars('var(--bg)', lookup)).toBe('#111');
    expect(resolveCssVars('var(--ink)', lookup)).toBe('#111');
    expect(resolveCssVars('var(--nope, #fff)', lookup)).toBe('#fff');
    expect(resolveCssVars('rgba(var(--brass-rgb), 0.5)', lookup)).toBe('rgba(212, 162, 90, 0.5)');
  });

  it('keeps references for untouched subtrees', () => {
    const data = [1, 2, 3];
    const opt = { series: [{ data, itemStyle: { borderColor: 'var(--bg)' } }] };
    const out = resolveCssVars(opt, lookup);
    expect(out).not.toBe(opt);
    expect(out.series[0].data).toBe(data);
    expect(out.series[0].itemStyle.borderColor).toBe('#111');
    const plain = { a: [1], b: 'x' };
    expect(resolveCssVars(plain, lookup)).toBe(plain);
  });

  it('leaves functions and class instances alone', () => {
    const fn = () => 'var(--bg)';
    class Grad { constructor() { this.c = 'var(--bg)'; } }
    const g = new Grad();
    const out = resolveCssVars({ formatter: fn, color: g }, lookup);
    expect(out.formatter).toBe(fn);
    expect(out.color).toBe(g);
  });
});
