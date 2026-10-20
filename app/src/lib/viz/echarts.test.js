import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// 守门：源码里出现的 ECharts 系列类型必须都在按需入口里注册，否则生产环境静默不渲染。
const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ALL_SERIES = ['line', 'bar', 'pie', 'scatter', 'effectScatter', 'radar', 'map', 'tree', 'treemap', 'graph', 'gauge', 'funnel', 'parallel', 'sankey', 'boxplot', 'candlestick', 'heatmap', 'lines', 'pictorialBar', 'themeRiver', 'sunburst', 'custom'];
const RE = new RegExp(`series[\\s\\S]{0,4000}?type:\\s*['"](${ALL_SERIES.join('|')})['"]`, 'g');
const TYPE_RE = new RegExp(`type:\\s*['"](${ALL_SERIES.join('|')})['"]`, 'g');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|tsx?)$/.test(name) && !/\.test\./.test(name)) out.push(p);
  }
  return out;
}

describe('echarts on-demand registry', () => {
  it('registers every series type used in source', () => {
    const entry = readFileSync(join(SRC, 'lib/viz/echarts.js'), 'utf8');
    const registered = new Set([...entry.match(/REGISTERED_SERIES = \[([\s\S]*?)\]/)[1].matchAll(/'([A-Za-z]+)'/g)].map((m) => m[1]));
    const used = new Set();
    for (const f of walk(SRC)) {
      const s = readFileSync(f, 'utf8');
      if (!RE.test(s)) continue;
      RE.lastIndex = 0;
      for (const m of s.matchAll(TYPE_RE)) used.add(m[1]);
    }
    // 'line' 也会作为 axisPointer / splitLine 的 type 出现，已注册，不影响判断
    const missing = [...used].filter((t) => !registered.has(t));
    expect(missing).toEqual([]);
  });

  it('nothing imports the full echarts bundle', () => {
    const offenders = walk(SRC).filter((f) => {
      const s = readFileSync(f, 'utf8');
      return /from 'echarts'|import\('echarts'\)\.then/.test(s);
    });
    expect(offenders).toEqual([]);
  });
});
