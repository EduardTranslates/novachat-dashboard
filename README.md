# NovaChat ES/CA — Interactive LQA & LLM Evaluation Dashboard

Live companion web application for the [**NovaChat ES/CA Localization QA Case Study**](https://github.com/EduardTranslates/novachat-es-ca-lqa).

🚀 **Live App:** <https://novachat-es-ca-lqa.vercel.app/>

---

## What's Inside

1. **Executive Overview:** Core empirical finding (*Grounding fixes facts. It doesn't fix language.*), paired baseline vs. 5 grounded runs (`8 → 0` Critical hallucinations), separated dataset KPIs, and 3-layer QA detection split.
2. **Live NovaChat Sandbox (`Live AI`):** Side-by-side **Baseline vs. Grounded** comparison powered by Gemini API (with automatic quota fallback), 6 one-click ES/CA adversarial traps, and real-time `lqa_checks.py` scanning on every reply.
3. **Live LQA Checker (`Python 3.12 Serverless`):** Executes zero-dependency Python regression rules directly in Vercel Serverless (`0.45–1.63 ms`) with switchable **Core (6 terms)** and **Extended SaaS & Support (56 terms)** ES/CA glossaries, batch 20-string parity audit, and optional Layer 2 AI semantic/grammar review.
4. **MQM Defect Explorer (`28`):** Filterable log of the 28 initial product audit defects (`es-ES` / `ca-ES`), rationales, recommended fixes, and detection layers.
5. **4-Model Eval Comparator (`72`):** Side-by-side explorer of all 6 runs (1 ungrounded baseline on Flash-Lite + 5 grounded runs across Gemini 3.5 Flash-Lite, Gemini 3.8 Flash, NVIDIA Nemotron 3 Ultra, and Baidu ERNIE 5.5 Flash) including `QUERY` Product Owner escalations.
6. **LLM Judge Calibration (`20/20`):** Compares replaced regex (`14/20`), broadened access regex (`16/20`), and calibrated LLM-as-a-judge (`20/20` on the single-reviewer calibration set) with transparent methodology notes.
7. **Trilingual Project Story (`EN | ES | CA`):** Jargon-free, 1-minute transcreated walk-through with collapsible navigation for mobile and desktop.

---

## Data Universes & Methodological Notes

* **Initial MQM Audit Inventory (28 defects):** Synthetic UI strings, system messages, and 30 initial AI replies per locale (includes the 3 Critical AI archetypes `D-002`, `D-005`, `D-006`). The `61% / 14% / 25%` 3-layer split reflects primary detection-layer attribution across these 28 logged defects.
* **Real-Model Evaluation (72 answers):** 12 ES/CA cases × 6 recorded runs (**1 ungrounded baseline** on Flash-Lite with 8 Critical hallucinations vs. **5 grounded runs** across 4 models with 0 Critical hallucinations).
* **Auto vs. Human Agreement (`70/72`):** Response-level binary pass/fail agreement. Both misses were **Auto PASS / Human FAIL** Catalan grammar errors (`se'te cobrarà` → `se't cobrarà`; `escrivim` → `escriu`). The 6 `QUERY` labels are unverified policy extrapolations escalated to a Product Owner (PO).
* **Judge Calibration (`20/20`):** Agreement on the single-reviewer calibration set (not an independent held-out set).

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
| `GEMINI_API_KEY` | Optional | Enables live Gemini API replies in the Sandbox and Layer 2 AI semantic checks (graceful recorded fallback if omitted). |

---

## Authorship & AI-Assistance Note

Evaluation architecture, MQM audit, defect rationales, bilingual ES/CA glossaries (6 Core + 56 Extended terms), deterministic Python LQA rules, Promptfoo cases, calibration traps, and 100% of human review (72 answers + 20 calibration labels) were designed, written, and verified by **Eduard Aliod Gil**. AI coding assistance was used to accelerate frontend scaffolding for this Next.js companion web UI.

## License

MIT License — see [`novachat-es-ca-lqa`](https://github.com/EduardTranslates/novachat-es-ca-lqa) for full dataset provenance and third-party model output exclusions.
