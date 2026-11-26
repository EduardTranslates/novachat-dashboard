# NovaChat ES/CA — Interactive LQA & LLM Evaluation Dashboard

Live companion web application for the [**NovaChat ES/CA Localization QA Case Study**](https://github.com/EduardTranslates/novachat-es-ca-lqa).

🚀 **Live App:** <https://novachat-es-ca-lqa.vercel.app/>

---

## What's Inside

1. **Executive Overview:** Core empirical finding (*Grounding fixes facts. It doesn't fix language.*), one Flash-Lite baseline vs. five grounded runs across four models (`8 → 0` Critical hallucinations), distinct data collection KPIs, and 3-layer QA detection split.
2. **Live NovaChat Sandbox (`Live AI`):** Side-by-side **Baseline vs. Grounded** comparison powered by Gemini API (explicitly tagged `LIVE · model · ms` or `REPLAY · model` on fallback), 6 one-click ES/CA adversarial traps, and real-time `lqa_checks.py` scanning on every reply.
3. **Live LQA Checker (`Python 3.12 Serverless`):** Runs deterministic Python rules directly in Vercel Serverless (**observed Python rule-execution time: `0.45–1.63 ms` on the documented demo inputs; excludes network and serverless startup**) with **two glossary profiles: Core (6 terms) and Extended (56 terms, including Core)**, batch 20-string parity audit, and optional live AI semantic/grammar review.
4. **MQM Defect Explorer (`28`):** Filterable log of the 28 defects in `defect_log.csv` (`13 UI strings, 8 system messages, 4 AI responses, 3 onboarding`), rationales, recommended fixes, and detection layers.
5. **4-Model Eval Comparator (`72`):** Side-by-side explorer of all 6 runs (1 Flash-Lite baseline + 5 grounded runs across Gemini 3.5 Flash-Lite ×2, Gemini 3.8 Flash, NVIDIA Nemotron 3 Ultra, and Baidu ERNIE 5.5 Flash, evaluated on the same 12 cases) including `QUERY` Product Owner escalations.
6. **LLM Judge Calibration (`20/20`):** Compares replaced regex (`14/20`), broadened access regex (`16/20`), and the calibrated refund-policy LLM judge (`20/20` on the single-reviewer calibration set; applies only to the refund-policy judge, not to the optional live semantic/grammar review).
7. **Trilingual Project Story (`EN | ES | CA`):** Jargon-free, 2-minute transcreated walk-through with collapsible navigation for mobile and desktop.

---

## Four Data Collections with Distinct Purposes

1. **Initial MQM Audit Inventory (`defect_log.csv` — 28 defects):** 13 UI strings, 8 system messages, 4 AI responses, 3 onboarding (includes the 3 Critical AI archetypes `D-002`, `D-005`, `D-006`). The `61% / 14% / 25%` 3-layer split reflects primary detection-layer attribution across these 28 logged defects.
2. **Real-Model Evaluation (`human_review.csv` — 72 answers):** One Flash-Lite baseline (8 Critical hallucinations) and five grounded runs across four models (0 Critical hallucinations), evaluated on the same 12 ES/CA cases. Within-model baseline/grounded comparison is available for Flash-Lite (with two grounded runs at `temperature 0` to check run-to-run consistency); the other three models ran grounded only.
   - **Auto vs. Human Agreement (`70/72` and `64/66`):** `70/72` on FAIL vs. non-FAIL (counting the 6 Auto-PASS / Human-QUERY PO escalations as non-fail); `64/66` on decisive pass/fail verdicts excluding `QUERY`. Both misses were Auto-PASS / Human-FAIL Catalan grammar errors (`se'te cobrarà` → `se't cobrarà` in baseline `EC-006`; `escrivim` → `escriu` in grounded Nemotron `EC-012`).
3. **Judge Calibration (`judge_calibration.jsonl` — 20 answers):** Single-reviewer calibration-set agreement (`20/20`, not an independent held-out set). Applies only to the refund-policy judge (`EC-005`/`EC-006`), not to the optional live semantic/grammar review.
4. **Synthetic UI String Sample (`sample_strings.csv` — 20 strings):** 10 ES/CA UI string pairs used to validate deterministic `lqa_checks.py` rule parity (`14/14` exact match with `qa_report.csv` under the Core profile, `0` false positives on clean rows under Extended).

---

## Tech Stack & Local Setup

* **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS (`Node.js 26.x`)
* **Serverless LQA Backend:** Vercel Python 3.12 Runtime (`api/lqa_check.py`)
* **CI Integrity Testing:** GitHub Actions (`scripts/test_integrity.py` + `raw-data/lqa-checker/test_lqa_checks.py`)

```bash
npm install
npm run dev
```

### Environment Variables (Optional — Live AI Features)

| Variable | Required | Purpose |
| :--- | :---: | :--- |
| `GEMINI_API_KEY` | Optional | Enables live Gemini API replies in the Sandbox and optional Layer 2 AI semantic checks (explicit `REPLAY` fallback if omitted). |

---

## Authorship & AI-Assistance Note

Evaluation architecture, MQM audit, defect rationales, two bilingual ES/CA glossary profiles (Core: 6 terms; Extended: 56 terms, including Core), deterministic Python LQA rules, Promptfoo cases, calibration traps, and 100% of human review (72 answers + 20 calibration labels) were designed, written, and verified by **Eduard Aliod Gil**. AI coding assistance was used to accelerate frontend scaffolding for this Next.js companion web UI.

## License

MIT License — see [`novachat-es-ca-lqa`](https://github.com/EduardTranslates/novachat-es-ca-lqa) for full dataset provenance and third-party model output exclusions.
