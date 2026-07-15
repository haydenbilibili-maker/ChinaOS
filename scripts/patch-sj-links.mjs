#!/usr/bin/env node
/**
 * Migrate case-volume iframe links: ./SJ-XX.html → /modules/shijian/sj-XX
 * Scope: SJ-05+ case/synthesis volumes (footer, chips, xref, rail).
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/public/shijian');

function toRoute(href) {
  const m = href.match(/\.\/SJ-(\d+)\.html(.*)$/i);
  if (!m) return href;
  const num = m[1].padStart(2, '0');
  return `/modules/shijian/sj-${num}${m[2] || ''}`;
}

const files = readdirSync(OUT)
  .filter((f) => /^SJ-(0[5-9]|1[0-9]|[2-5][0-9])\.html$/.test(f))
  .sort();

let total = 0;
for (const name of files) {
  const path = join(OUT, name);
  let html = readFileSync(path, 'utf8');
  const before = html;
  html = html.replace(/href="\.\/SJ-(\d+)\.html([^"]*)"/gi, (_, n, hash) => {
    const num = String(n).padStart(2, '0');
    return `href="/modules/shijian/sj-${num}${hash || ''}"`;
  });
  if (html !== before) {
    writeFileSync(path, html, 'utf8');
    const count = (before.match(/href="\.\/SJ-/gi) || []).length;
    total += count;
    console.log(`${name}: ${count} links migrated`);
  }
}

console.log(`Done: ${total} links across ${files.length} case volumes`);
