#!/usr/bin/env node
/**
 * 中越比较研究 —— 世行 WDI + IMF DataMapper 中越序列抓取（可复现）
 * 输出：app/src/modules/vietnamCompare/seriesGenerated.js（生成文件，勿手改）
 * 用法：node scripts/fetch-vietnam-compare.mjs
 */
import { execFileSync } from 'child_process';
import { writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app/src/modules/vietnamCompare/seriesGenerated.js');
const FROM = 1975;
const TO = 2025;
const ISOS = ['VNM', 'CHN'];

const WB = {
  gdpPcPppKd: 'NY.GDP.PCAP.PP.KD',
  invest: 'NE.GDI.TOTL.ZS',
  exportsGdp: 'NE.EXP.GNFS.ZS',
  tradeGdp: 'NE.TRD.GNFS.ZS',
  fdiIn: 'BX.KLT.DINV.WD.GD.ZS',
  manuf: 'NV.IND.MANF.ZS',
  agriEmp: 'SL.AGR.EMPL.ZS',
  hiTechExp: 'TX.VAL.TECH.MF.ZS',
  rnd: 'GB.XPD.RSDV.GD.ZS',
  tertiary: 'SE.TER.ENRR',
  urban: 'SP.URB.TOTL.IN.ZS',
  pop65: 'SP.POP.65UP.TO.ZS',
  tfr: 'SP.DYN.TFRT.IN',
  wapShare: 'SP.POP.1564.TO.ZS',
  oldDep: 'SP.POP.DPND.OL',
  lifeExp: 'SP.DYN.LE00.IN',
  gini: 'SI.POV.GINI',
  hhCons: 'NE.CON.PRVT.ZS',
  credit: 'FS.AST.PRVT.GD.ZS',
  healthExp: 'SH.XPD.CHEX.GD.ZS',
};

const IMF = {
  gdpGrowth: 'NGDP_RPCH',
  gdpPcUsd: 'NGDPDPC',
  gdpPcPpp: 'PPPPC',
  cpi: 'PCPIPCH',
  govDebt: 'GGXWDG_NGDP',
  ca: 'BCA_NGDPD',
};

const round = (v) => (v == null ? null : Math.round(v * 100) / 100);

// IMF 的 CDN 拒绝 Node 内置 fetch 的 TLS 指纹，统一走 curl。
function getJson(url, tries = 3) {
  for (let i = 0; i < tries; i += 1) {
    try {
      const raw = execFileSync('curl', ['-s', '-f', '-m', '180', url], { maxBuffer: 64 * 1024 * 1024 });
      return JSON.parse(raw.toString('utf8'));
    } catch { /* retry */ }
  }
  throw new Error(`fetch failed: ${url}`);
}

function fetchWb(code) {
  const url = `https://api.worldbank.org/v2/country/${ISOS.join(';')}/indicator/${code}?format=json&date=${FROM}:${TO}&per_page=500`;
  const [, rows = []] = getJson(url);
  const out = Object.fromEntries(ISOS.map((i) => [i, {}]));
  for (const r of rows) {
    if (r.value != null && out[r.countryiso3code]) out[r.countryiso3code][r.date] = round(r.value);
  }
  return out;
}

function fetchImf(code) {
  const d = getJson(`https://www.imf.org/external/datamapper/api/v1/${code}/${ISOS.join('/')}`);
  const v = d?.values?.[code] ?? {};
  const out = Object.fromEntries(ISOS.map((i) => [i, {}]));
  for (const iso of ISOS) {
    for (const [y, val] of Object.entries(v[iso] ?? {})) {
      if (+y >= FROM && +y <= TO && val != null) out[iso][y] = round(val);
    }
  }
  return out;
}

const series = {};
for (const [key, code] of Object.entries(WB)) {
  series[key] = { source: `World Bank WDI · ${code}`, ...fetchWb(code) };
  process.stdout.write(`WB ${key} ok\n`);
}
for (const [key, code] of Object.entries(IMF)) {
  series[key] = { source: `IMF DataMapper · ${code}`, ...fetchImf(code) };
  process.stdout.write(`IMF ${key} ok\n`);
}

const fetchedAt = new Date().toISOString().slice(0, 10);
const body = `// 生成文件 · scripts/fetch-vietnam-compare.mjs · 抓取日 ${fetchedAt}
// 口径：世行 WDI（年度）/ IMF DataMapper（WEO，2025 年及以前含 IMF 估计值）
export const SERIES_FETCHED_AT = '${fetchedAt}';
export const SERIES = ${JSON.stringify(series)};
`;
writeFileSync(OUT, body);
console.log(`wrote ${OUT}`);
