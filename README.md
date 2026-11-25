# NovaChat ES/CA — Interactive LQA, Python Checker & Live AI Sandbox

[![CI — Data Integrity & Next.js Build](https://github.com/EduardTranslates/novachat-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/EduardTranslates/novachat-dashboard/actions/workflows/ci.yml)
[![Live Demo on Vercel](https://img.shields.io/badge/Live%20Demo-Vercel-0ea5e9?style=flat&logo=vercel)](https://novachat-es-ca-lqa.vercel.app/)
[![Source Case Study](https://img.shields.io/badge/Case%20Study-novachat--es--ca--lqa-6366f1?style=flat&logo=github)](https://github.com/EduardTranslates/novachat-es-ca-lqa)

Interactive web application and live ES/CA localization QA lab built on top of the **[novachat-es-ca-lqa](https://github.com/EduardTranslates/novachat-es-ca-lqa)** synthetic case study.

> **Live app:** [https://novachat-es-ca-lqa.vercel.app/](https://novachat-es-ca-lqa.vercel.app/)

<!-- Optional: drop 2 screenshots into public/screenshots/ and uncomment below
![NovaChat Dashboard Overview](public/screenshots/overview.png)
![Live Python LQA Checker & Baseline vs. Grounded Sandbox](public/screenshots/live-tools.png)
-->

## What You Can Explore

The sticky header supports two-row grouped navigation (collapsible on mobile and desktop for distraction-free reading):

### Row 1 — Start & Live Interactive Tools
1. **Executive Overview:** Core empirical finding (*"Grounding fixes facts. It doesn't fix language."*), 6-run performance across 4 distinct LLMs, 3-layer QA detection architecture, and methodological scope.
2. **Project Story (1-Minute Read · EN / ES / CA):** A jargon-free, chart-free narrative walk-through (*When It Began · How It Works · What Happened · Why It Matters · Who Built This*) transcreated across English, Spanish (`es-ES`), and Catalan (`ca-ES`).
3. **Live NovaChat Sandbox (Phase 3):** Toggle in real time between the ungrounded **Baseline** prompt (`prompt_baseline.yaml`) and the **Grounded** P0 fix (`prompt.yaml`), or run **Compare Both** side by side. Every bot reply is automatically scanned by `lqa_checks.py`. Includes automatic model rotation, rate limiting, and graceful fallback to authentic recorded replays if free-tier quota is exhausted.
4. **Live LQA Checker (Phase 2 — Python Serverless):** Executes the zero-dependency `lqa_checks.py` engine directly on Vercel (`api/lqa_check.py`) with two switchable profiles:
   - **NovaChat Core (6 terms):** Exact parity with `qa_report.csv` (14 issues across 12 defective strings, 0 false positives on 8 clean strings).
   - **Extended SaaS & Support (56 terms):** Curated EN → `es-ES`/`ca-ES` UI and customer-support terminology, expanded Catalan Castilianism lists, and IEC 2016 obsolete diacritics — plus optional **Auto-Translate** and **AI Semantic & Grammar Audit (Layer 2)**.

### Row 2 — Recorded Audit Evidence
5. **MQM Defect Explorer (28 Defects):** Filterable inspector across `es-ES` and `ca-ES`, severity, MQM category, and detection layer, with before/after fixes and deep links to Promptfoo test cases.
6. **4-Model Eval Comparator (72 Recorded Answers):** Side-by-side comparison across all 12 test cases (`EC-001`–`EC-012`) and a filterable 72-answer Audit Matrix isolating the 2 Catalan grammar blind spots, 6 Product Owner `QUERY` escalations, and 7 grounded failures.
7. **LLM Judge Calibration (20 Answers):** Side-by-side comparison of the replaced regex pair (`14/20`), the broadened access regex alone (`16/20`), and the calibrated `gemini-3.5-flash` judge (`20/20`).

## Evaluation & Judge Calibration Method

To evaluate partial-month refund policy compliance (`EC-005` in `es-ES` and `EC-006` in `ca-ES`), the deterministic negation regex was replaced with a versioned LLM-as-a-judge rubric (`gemini-3.5-flash`, temperature 0) calibrated against **20 human-labelled answers**: 6 mock fixtures, 8 real recorded Gemini outputs, and 6 synthetic adversarial traps (`JC-15`–`JC-20`, covering deceptive leading negations, hidden store-credit offers, open support exceptions, and self-contradictions).

- **Replaced pre-judge regex pair:** `14/20` (4 false positives on traps, 2 false negatives on valid wording variants).
- **Current broadened access regex alone:** `16/20` (still passes all 4 deceptive traps).
- **Calibrated LLM judge & production suite:** `20/20` (`0` false positives, `0` false negatives).

> **Honest limitation:** The same bilingual reviewer authored the cases, rubric, and traps. `20/20` validates rubric sanity rather than providing an independent population accuracy benchmark. See [evals/RESULTS.md](https://github.com/EduardTranslates/novachat-es-ca-lqa/blob/main/evals/RESULTS.md) for the full audit trail.

## Environment Variables (Vercel)

All static dashboard views and the **Python Live LQA Checker (Layer 1)** work with **zero API keys**. To activate live custom prompts in the **NovaChat Sandbox** and **AI Layer 2** tools, configure `GEMINI_API_KEY` in **Vercel → Project Settings → Environment Variables**:

| Variable | Required? | Purpose |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional (enables Live AI) | Google AI Studio key for live chatbot replies, EN→ES/CA translation, and Layer 2 semantic LQA audits |
| `GEMINI_CHAT_MODELS` | Optional override | Comma-separated model rotation list (default: `gemini-3.5-flash-lite,gemini-3.8-flash,gemini-3.5-flash,gemini-2.5-flash-lite,gemini-2.5-flash`) |
| `GEMINI_LQA_MODELS` | Optional override | Comma-separated model rotation list for Layer 2 semantic audits (default: `gemini-3.8-flash,gemini-3.5-flash,gemini-3.5-flash-lite,gemini-2.5-flash`) |

## Run Locally & Verify Integrity

Requires **Node.js `26.x`** and **Python `3.10+`**:

```bash
# 1. Regenerate compiled JSON + Python serverless data module & run integrity tests
python scripts/build_data.py
python scripts/test_integrity.py

# 2. Start Next.js development server
npm install
npm run dev
```

To extend the dataset (e.g., add a new MQM defect, eval case, or glossary term), edit the source files under `raw-data/` and re-run `python scripts/build_data.py` followed by `python scripts/test_integrity.py`.

---

*Author: [Eduard Aliod Gil](https://www.linkedin.com/in/eduardtranslates/) — Localization Specialist & AI QA Reviewer (ES / CA / EN)*
