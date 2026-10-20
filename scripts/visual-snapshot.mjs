#!/usr/bin/env node
/**
 * 视觉快照：对已启动的预览服务按 路由 × 视口 × 主题 截图。
 *
 *   node scripts/visual-snapshot.mjs --base http://127.0.0.1:4173 --out snapshots
 *   ROUTES=dashboard,econ node scripts/visual-snapshot.mjs …   # 只截部分路由
 *
 * 路由清单：scripts/visual-routes.json。输出 <out>/<viewport>/<theme>/<route>.png
 * 与 <out>/manifest.json（含控制台错误，便于发现白屏）。需要 playwright（CI 中临时安装）。
 */
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);
const BASE = (args.base || 'http://127.0.0.1:4173').replace(/\/$/, '');
const OUT = resolve(args.out || join(ROOT, 'snapshots'));
const cfg = JSON.parse(readFileSync(join(ROOT, 'scripts/visual-routes.json'), 'utf8'));
const only = process.env.ROUTES ? new Set(process.env.ROUTES.split(',')) : null;
const routes = cfg.routes.filter((r) => !only || only.has(r.id));

const browser = await chromium.launch();
const manifest = { base: BASE, takenAt: new Date().toISOString(), shots: [] };

for (const vp of cfg.viewports) {
  for (const theme of cfg.themes) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      colorScheme: theme,
      reducedMotion: 'reduce',
    });
    await ctx.addInitScript((t) => {
      try { localStorage.setItem('c2os-theme', t); } catch { /* ignore */ }
    }, theme);
    const page = await ctx.newPage();
    for (const r of routes) {
      const errors = [];
      page.removeAllListeners('console');
      page.removeAllListeners('pageerror');
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
      page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));
      const file = join(OUT, vp.id, theme, `${r.id}.png`);
      mkdirSync(dirname(file), { recursive: true });
      try {
        await page.goto(`${BASE}/#${r.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      } catch {
        /* 外部实时数据可能拖住 networkidle，超时后照常截图 */
      }
      await page.waitForTimeout(r.settleMs ?? 1500);
      if (r.fullPage) {
        // 应用壳把滚动放在 <main> 等内层容器里：展开它们，整页截图才能拍到全部内容
        await page.evaluate(() => {
          for (const el of document.querySelectorAll('body *')) {
            const cs = getComputedStyle(el);
            if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 4) {
              el.style.overflowY = 'visible';
              el.style.height = 'auto';
              el.style.maxHeight = 'none';
            }
          }
          for (const el of document.querySelectorAll('.h-screen, .h-full')) el.style.height = 'auto';
        });
        await page.waitForTimeout(300);
      }
      await page.screenshot({ path: file, fullPage: r.fullPage ?? false });
      manifest.shots.push({ route: r.id, path: r.path, viewport: vp.id, theme, file: file.slice(OUT.length + 1), errors });
      console.log(`${vp.id}/${theme}/${r.id}${errors.length ? `  · ${errors.length} console errors` : ''}`);
    }
    await ctx.close();
  }
}

await browser.close();
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
