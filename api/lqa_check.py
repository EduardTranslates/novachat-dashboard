"""
api/lqa_check.py - Vercel Python Serverless Function wrapping lqa_checks.py.

Endpoints (served at /api/lqa_check on Vercel):
  - GET  /api/lqa_check             -> engine health + metadata
  - GET  /api/lqa_check?mode=batch  -> runs lqa_checks.py on all 20 sample strings
  - POST /api/lqa_check             -> runs lqa_checks.py on a single string or batch

Zero external dependencies (Python standard library only).
"""

import json
import sys
import time
from collections import Counter
from http.server import BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import parse_qs, urlparse

# Ensure sibling helper modules (_lqa_checks.py, _lqa_data.py) are always importable
API_DIR = str(Path(__file__).resolve().parent)
if API_DIR not in sys.path:
    sys.path.insert(0, API_DIR)

from _lqa_checks import run  # noqa: E402
from _lqa_data import GLOSSARY, RULES, SAMPLE_STRINGS  # noqa: E402

CFG = {"rules": RULES, "glossary": GLOSSARY}
VALID_LOCALES = {"es-ES", "ca-ES"}


def build_response(rows: list[dict]) -> dict:
    t0 = time.perf_counter()
    issues = run(rows, CFG)
    elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)

    flagged_ids = {i["id"] for i in issues}
    sev_counts = Counter(i["severity"] for i in issues)
    check_counts = Counter(i["check"] for i in issues)

    return {
        "ok": True,
        "engine": "python-serverless",
        "python_version": sys.version.split()[0],
        "elapsed_ms": elapsed_ms,
        "strings_checked": len(rows),
        "flagged_strings": len(flagged_ids),
        "clean_strings": len(rows) - len(flagged_ids),
        "issue_count": len(issues),
        "by_severity": {
            "Critical": sev_counts.get("Critical", 0),
            "Major": sev_counts.get("Major", 0),
            "Minor": sev_counts.get("Minor", 0),
        },
        "by_check": dict(check_counts.most_common()),
        "issues": issues,
    }


def sanitize_row(raw: dict, idx: int = 1) -> dict:
    locale = str(raw.get("locale", "es-ES")).strip()
    if locale not in VALID_LOCALES:
        raise ValueError(f"Unsupported locale '{locale}'. Expected 'es-ES' or 'ca-ES'.")

    raw_max = raw.get("max_chars", "")
    if raw_max is None or str(raw_max).strip() == "":
        max_chars = ""
    else:
        try:
            max_chars = str(int(raw_max))
        except (TypeError, ValueError) as exc:
            raise ValueError("max_chars must be an integer or empty.") from exc

    return {
        "id": str(raw.get("id") or f"CUSTOM-{idx:03d}")[:40],
        "locale": locale,
        "source": str(raw.get("source", ""))[:2000],
        "target": str(raw.get("target", ""))[:2000],
        "max_chars": max_chars,
    }


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:
        qs = parse_qs(urlparse(self.path).query)
        mode = qs.get("mode", ["health"])[0]
        if mode == "batch":
            self._send_json(200, build_response(SAMPLE_STRINGS))
            return

        self._send_json(
            200,
            {
                "ok": True,
                "engine": "python-serverless",
                "python_version": sys.version.split()[0],
                "checks_count": 8,
                "glossary_terms": len(GLOSSARY),
                "sample_strings": len(SAMPLE_STRINGS),
            },
        )

    def do_POST(self) -> None:
        try:
            content_len = int(self.headers.get("Content-Length", "0"))
            if content_len > 256_000:
                self._send_json(413, {"ok": False, "error": "Payload too large."})
                return

            raw_body = self.rfile.read(content_len) if content_len > 0 else b"{}"
            body = json.loads(raw_body.decode("utf-8"))
        except Exception:
            self._send_json(400, {"ok": False, "error": "Invalid JSON request body."})
            return

        mode = body.get("mode", "single")
        try:
            if mode == "batch":
                incoming_rows = body.get("rows")
                if incoming_rows is None:
                    rows = SAMPLE_STRINGS
                else:
                    if not isinstance(incoming_rows, list) or len(incoming_rows) > 100:
                        raise ValueError("rows must be a list of at most 100 items.")
                    rows = [sanitize_row(r, i + 1) for i, r in enumerate(incoming_rows)]
            else:
                row_obj = body.get("row", body)
                if not isinstance(row_obj, dict):
                    raise ValueError("Expected a string object in 'row'.")
                rows = [sanitize_row(row_obj, 1)]
        except ValueError as err:
            self._send_json(400, {"ok": False, "error": str(err)})
            return

        self._send_json(200, build_response(rows))
