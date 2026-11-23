"""
test_integrity.py - Automated data & LQA engine integrity checks for CI.

Run from repository root:
    python scripts/test_integrity.py
"""

import csv
import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "src" / "data" / "novachat_data.json"
QA_REPORT_PATH = ROOT / "raw-data" / "lqa-checker" / "qa_report.csv"


def load_api_module():
    spec = importlib.util.spec_from_file_location("lqa_check", ROOT / "api" / "lqa_check.py")
    assert spec and spec.loader
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def test_compiled_json():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    kpis = data["kpis"]

    # 1. MQM Defects (28)
    assert len(data["defects"]) == 28, f"Expected 28 defects, got {len(data['defects'])}"
    assert kpis["total_defects"] == 28
    assert kpis["defects_by_locale"] == {"es-ES": 15, "ca-ES": 13}
    assert kpis["defects_by_severity"] == {"Critical": 3, "Major": 11, "Minor": 14}
    assert kpis["defects_by_layer"] == {
        "Python UI checker": 17,
        "Promptfoo evals": 4,
        "Human review": 7,
    }

    # 2. Eval cases (12) & Recorded Evaluations (72)
    assert len(data["cases"]) == 12
    assert len(data["runs_summary"]) == 6
    assert len(data["evaluations"]) == 72
    assert all(e["answer"].strip() for e in data["evaluations"]), "Found empty recorded answer"
    assert kpis["auto_human_agreement"] == 70
    assert kpis["disagreements_count"] == 2
    assert kpis["query_count"] == 6
    assert kpis["baseline_critical_fails"] == 8
    assert kpis["grounded_critical_fails"] == 0

    # Verify every EC-001..EC-012 has all 6 runs
    for c in data["cases"]:
        cid = c["case_id"]
        matching = [e for e in data["evaluations"] if e["case_id"] == cid]
        assert len(matching) == 6, f"{cid} has {len(matching)} runs, expected 6"

    # 3. Judge Calibration (20)
    assert len(data["calibration"]) == 20
    assert kpis["calibration_legacy_regex_agree"] == 14
    assert kpis["calibration_current_regex_agree"] == 16
    assert kpis["calibration_judge_agree"] == 20
    assert kpis["calibration_suite_agree"] == 20

    # 4. System Prompts
    assert "Ajustes > Suscripción" in data["prompts"]["grounded"]
    assert "Configuració > Subscripció" in data["prompts"]["grounded"]
    assert "Ajustes > Suscripción" not in data["prompts"]["baseline"]

    # 5. LQA Checker Data
    assert len(data["lqa_checker"]["glossary"]) == 6
    assert len(data["lqa_checker"]["extended_glossary"]) >= 50
    assert len(data["lqa_checker"]["sample_strings"]) == 20
    print("PASS test_compiled_json")


def test_python_serverless_core_parity():
    mod = load_api_module()
    res = mod.build_response(mod.SAMPLE_STRINGS, profile="core")

    with QA_REPORT_PATH.open(encoding="utf-8", newline="") as f:
        expected = list(csv.DictReader(f))

    assert res["strings_checked"] == 20
    assert res["flagged_strings"] == 12
    assert res["clean_strings"] == 8
    assert res["issue_count"] == 14
    assert res["by_severity"] == {"Critical": 0, "Major": 7, "Minor": 7}
    assert res["issues"] == expected, "Core serverless output diverged from qa_report.csv"
    print("PASS test_python_serverless_core_parity (14/14 exact match with qa_report.csv)")


def test_python_serverless_extended_profile():
    mod = load_api_module()

    # Check clean sample strings stay 100% clean (0 false positives) even in extended mode!
    core_res = mod.build_response(mod.SAMPLE_STRINGS, profile="core")
    flagged_core_ids = {i["id"] for i in core_res["issues"]}
    clean_rows = [r for r in mod.SAMPLE_STRINGS if r["id"] not in flagged_core_ids]
    assert len(clean_rows) == 8

    ext_clean = mod.build_response(clean_rows, profile="extended")
    assert ext_clean["issue_count"] == 0, f"False positives on clean strings in extended mode: {ext_clean['issues']}"

    # Verify extended glossary + Castilianisms + IEC 2016 accents trigger properly
    probe = [
        {
            "id": "EXT-1",
            "locale": "ca-ES",
            "source": "Download the file and reset your password.",
            "target": "Adéu! Pots descargar el archivo i canviar la contraseña.",
            "max_chars": "120",
        }
    ]
    ext_res = mod.build_response(probe, profile="extended")
    checks = {i["check"] for i in ext_res["issues"]}
    assert "castilianism" in checks
    assert "obsolete_diacritic" in checks
    assert "glossary" in checks
    print("PASS test_python_serverless_extended_profile (0 FP on clean rows, extended rules active)")


if __name__ == "__main__":
    test_compiled_json()
    test_python_serverless_core_parity()
    test_python_serverless_extended_profile()
    print("\nALL INTEGRITY CHECKS PASSED.")
