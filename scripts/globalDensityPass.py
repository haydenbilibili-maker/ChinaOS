#!/usr/bin/env python3
"""Orchestrate density enrichment pipelines and report coverage.

Run from repo root:
  python3 scripts/globalDensityPass.py
  python3 scripts/globalDensityPass.py --run-enrich   # execute enrich passes
  python3 scripts/globalDensityPass.py --json reports/density-pass.json
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORPUS_THRESHOLD = 2000
GLOSSARY_MIN = 60
TALENT_BIO_MIN = 40


def run_cmd(cmd: list[str], cwd: Path | None = None) -> tuple[int, str, str]:
    proc = subprocess.run(cmd, cwd=cwd or ROOT, capture_output=True, text=True)
    return proc.returncode, proc.stdout, proc.stderr


def corpus_density_report() -> dict:
    legal_dir = ROOT / "app/public/legal-corpus"
    policy_dir = ROOT / "app/public/policy-corpus/policies"
    legal_files = list(legal_dir.rglob("*.md")) if legal_dir.is_dir() else []
    policy_files = list(policy_dir.glob("*.md")) if policy_dir.is_dir() else []
    all_files = legal_files + policy_files
    lengths = []
    thin = []
    for p in all_files:
        n = len(p.read_text(encoding="utf-8"))
        lengths.append(n)
        if n < CORPUS_THRESHOLD:
            thin.append((str(p.relative_to(ROOT)), n))
    avg = sum(lengths) / max(len(lengths), 1)
    return {
        "total": len(all_files),
        "thin_below_threshold": len(thin),
        "avg_chars": round(avg, 1),
        "thin_sample": sorted(thin, key=lambda x: x[1])[:15],
    }


def glossary_density_report() -> dict:
    seed = ROOT / "app/src/lib/db/glossarySeed.js"
    if not seed.is_file():
        return {"error": "glossarySeed.js missing"}
    text = seed.read_text(encoding="utf-8")
    defs = re.findall(r'"definition":\s*"((?:[^"\\]|\\.)*)"', text)
    lengths = [len(d) for d in defs]
    thin = sum(1 for L in lengths if L < GLOSSARY_MIN)
    return {
        "entries": len(defs),
        "thin_below_min": thin,
        "avg_def_len": round(sum(lengths) / max(len(lengths), 1), 1),
        "coverage_pct": round(100 * (len(defs) - thin) / max(len(defs), 1), 1),
    }


def registry_subtitle_report() -> dict:
    reg = ROOT / "app/src/app/registry.js"
    text = reg.read_text(encoding="utf-8")
    subs = re.findall(r"subtitle:\s*'([^']+)'", text)
    thin = [s for s in subs if len(s.split("·")) < 3 or len(s) < 18]
    return {"total": len(subs), "thin_count": len(thin), "thin_sample": thin[:12]}


def talent_density_report() -> dict:
    code, out, err = run_cmd([sys.executable, str(ROOT / "scripts/enrichTalentDensity.py")])
    if code != 0:
        return {"error": err or out}
    lines = [ln for ln in out.splitlines() if ln.strip().startswith(("figures", "knowledge", "business", "overseas", "dissident", "taiwan", "diplomatic", "anticorruption", "// entries"))]
    parsed: dict = {"raw_lines": lines}
    m = re.search(r"entries:\s*(\d+).*bio≥40ch:\s*(\d+).*timeline≥2:\s*(\d+)", out)
    if m:
        total, bio, tl = map(int, m.groups())
        parsed.update({
            "total": total,
            "with_bio": bio,
            "with_timeline": tl,
            "bio_coverage_pct": round(100 * bio / max(total, 1), 1),
            "timeline_coverage_pct": round(100 * tl / max(total, 1), 1),
        })
    return parsed


def run_enrichment() -> dict:
    results: dict = {}
    code, out, err = run_cmd([sys.executable, str(ROOT / "scripts/enrich_corpus_density.py")])
    results["corpus_enrich"] = {"ok": code == 0, "stdout_tail": out.splitlines()[-8:] if out else [], "stderr": err[:500] if err else ""}

    code, out, err = run_cmd([sys.executable, str(ROOT / "scripts/genGlossarySeed.py")])
    results["glossary_regen"] = {"ok": code == 0, "stdout_tail": out.splitlines()[-6:] if out else [], "stderr": err[:500] if err else ""}

    return results


def main() -> int:
    ap = argparse.ArgumentParser(description="Global density pass")
    ap.add_argument("--run-enrich", action="store_true", help="Run corpus + glossary enrich scripts")
    ap.add_argument("--json", type=Path, help="Write JSON report")
    args = ap.parse_args()

    before = {
        "corpus": corpus_density_report(),
        "glossary": glossary_density_report(),
        "registry": registry_subtitle_report(),
        "talent": talent_density_report(),
    }

    enrich_results = None
    if args.run_enrich:
        enrich_results = run_enrichment()
        after = {
            "corpus": corpus_density_report(),
            "glossary": glossary_density_report(),
            "registry": registry_subtitle_report(),
            "talent": talent_density_report(),
        }
    else:
        after = None

    report = {"before": before, "enrich": enrich_results, "after": after}

    print("// global density pass")
    print(f"// corpus: {before['corpus']['total']} files · thin<{CORPUS_THRESHOLD}: {before['corpus']['thin_below_threshold']} · avg {before['corpus']['avg_chars']}ch")
    print(f"// glossary: {before['glossary'].get('entries', 0)} entries · thin<{GLOSSARY_MIN}: {before['glossary'].get('thin_below_min', 0)} · coverage {before['glossary'].get('coverage_pct', 0)}%")
    if "total" in before["talent"]:
        print(f"// talent: {before['talent']['total']} entries · bio {before['talent']['bio_coverage_pct']}% · timeline {before['talent']['timeline_coverage_pct']}%")
    print(f"// registry subtitles thin: {before['registry']['thin_count']}/{before['registry']['total']}")

    if after:
        print("\n## after enrich")
        print(f"// corpus thin: {after['corpus']['thin_below_threshold']} (was {before['corpus']['thin_below_threshold']})")
        print(f"// glossary thin: {after['glossary'].get('thin_below_min', 0)} (was {before['glossary'].get('thin_below_min', 0)})")

    if args.json:
        args.json.parent.mkdir(parents=True, exist_ok=True)
        args.json.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\nWrote {args.json}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
