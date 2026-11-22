# NovaChat ES/CA — Interactive LQA & LLM Evaluation Dashboard

Interactive web dashboard presenting the audit findings, four-model evaluation outputs, human bilingual review, and calibrated LLM-as-a-judge results from **[novachat-es-ca-lqa](https://github.com/EduardTranslates/novachat-es-ca-lqa)**.

All data displayed in this dashboard is statically compiled from the recorded files in `raw-data/` (`defect_log.csv`, `eval_cases.jsonl`, `responses.json`, `human_review.csv`, `judge_calibration_results.csv`, `judge_verdicts.json`) — **no API keys or runtime model calls are required**.

## What You Can Explore

1. **Executive Overview:** Core thesis (*"Grounding fixes facts. It doesn't fix language."*), 6-run pass/fail comparison across 4 real LLMs (Gemini 3.5 Flash-Lite, Gemini 3.8 Flash, NVIDIA Nemotron 3 Ultra, Baidu ERNIE 5.5 Flash), and the 3-layer QA detection architecture.
2. **MQM Defect Explorer (28 Defects):** Filterable table/card inspector across `es-ES` and `ca-ES`, severity, MQM category, and detection layer, with before/after fixes and deep links to related Promptfoo cases.
3. **4-Model Eval Comparator (72 Recorded Answers):** Inspect all 12 test cases (`EC-001`–`EC-012`) side by side across baseline and grounded runs, or switch to the Audit Matrix to isolate the 2 Catalan grammar suite blind spots, 6 Product Owner `QUERY` escalations, and 7 grounded failures.
4. **LLM Judge Calibration (20 Answers):** Side-by-side comparison of the replaced pre-judge regex pair (`14/20`), the current broadened access regex alone (`16/20`), and the calibrated `gemini-3.5-flash` judge (`20/20`), including all 6 adversarial traps (`JC-15`–`JC-20`).

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To regenerate `src/data/novachat_data.json` after updating any file in `raw-data/`:

```bash
python scripts/build_data.py
```

*Author: Eduard Aliod Gil — Localization Specialist & AI QA Reviewer (ES/CA/EN)*
