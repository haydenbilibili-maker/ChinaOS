#!/usr/bin/env python3
"""Report talent density coverage; validates enrichTalentList + talentDensity pipeline.

Run from repo root:
  node --experimental-vm-modules scripts/enrichTalentDensity.py
  python3 scripts/enrichTalentDensity.py   # delegates to node
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

NODE_SNIPPET = r"""
import { FIGURE_SEED } from './app/src/lib/db/figureSeed.js';
import { CULTURAL_ELITE_SEED_PKG } from './app/src/lib/db/culturalEliteSeed.js';
import { BUSINESS_ELITE_SEED_PKG } from './app/src/lib/db/businessEliteSeed.js';
import { OVERSEAS_TALENT_SEED_PKG } from './app/src/lib/db/overseasTalentSeed.js';
import { DISSIDENT_SEED_PKG } from './app/src/lib/db/dissidentSeed.js';
import { TAIWAN_POLITICAL_SEED_PKG } from './app/src/lib/db/taiwanPoliticalSeed.js';
import { DIPLOMATIC_CORPS_SEED_PKG } from './app/src/lib/db/diplomaticCorpsSeed.js';
import { ANTI_CORRUPTION_SEED_PKG } from './app/src/lib/db/antiCorruptionSeed.js';
import { applyTalentEnrichment } from './app/src/lib/talent/talentEnrich.js';

const QUEUES = [
  ['figures', FIGURE_SEED],
  ['knowledge', CULTURAL_ELITE_SEED_PKG.rows],
  ['business', BUSINESS_ELITE_SEED_PKG.rows],
  ['overseas', OVERSEAS_TALENT_SEED_PKG.rows],
  ['dissident', DISSIDENT_SEED_PKG.rows],
  ['taiwan', TAIWAN_POLITICAL_SEED_PKG.rows],
  ['diplomatic', DIPLOMATIC_CORPS_SEED_PKG.rows],
  ['anticorruption', ANTI_CORRUPTION_SEED_PKG.rows],
];

function stats(rows, queue) {
  const enriched = rows.map((r) => applyTalentEnrichment(r, { queue }));
  const thin = /扩展条目|扩展种子|示意/i;
  const withBio = enriched.filter((r) => r.bio && r.bio.length > 40 && !thin.test(r.bio)).length;
  const withTimeline = enriched.filter((r) => (r.keyEvents || r.career || []).length >= 2).length;
  const withProv = enriched.filter((r) => r.provenance).length;
  const withTags = enriched.filter((r) => r.tags).length;
  const withVerify = enriched.filter((r) => r.verifyTier).length;
  return { total: rows.length, withBio, withTimeline, withProv, withTags, withVerify };
}

const report = Object.fromEntries(QUEUES.map(([q, rows]) => [q, stats(rows, q)]));
console.log(JSON.stringify(report, null, 2));
"""


def main() -> int:
    proc = subprocess.run(
        ["node", "--input-type=module", "-e", NODE_SNIPPET],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        print(proc.stderr or proc.stdout, file=sys.stderr)
        return proc.returncode
    report = json.loads(proc.stdout)
    total = sum(v["total"] for v in report.values())
    bio = sum(v["withBio"] for v in report.values())
    tl = sum(v["withTimeline"] for v in report.values())
    print(f"// talent density report · {ROOT.name}")
    print(f"// entries: {total} · bio≥40ch: {bio} · timeline≥2: {tl}")
    for q, s in report.items():
        print(
            f"  {q:14} n={s['total']:4}  bio={s['withBio']:4}  timeline={s['withTimeline']:4}  "
            f"prov={s['withProv']:4}  tags={s['withTags']:4}  verify={s['withVerify']:4}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
