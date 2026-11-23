# NovaChat ES/CA — Interactive LQA & LLM Evaluation Dashboard

Interactive web dashboard and live Python LQA tool presenting the audit findings, four-model evaluation outputs, human bilingual review, calibrated LLM-as-a-judge results, and live ES/CA string checker from **[novachat-es-ca-lqa](https://github.com/EduardTranslates/novachat-es-ca-lqa)**.

## What You Can Explore

1. **Executive Overview:** Core thesis (*"Grounding fixes facts. It doesn't fix language."*), 6-run comparison across 4 distinct LLMs, 3-layer QA architecture, and scope notes.
2. **Project Story (30-Second Read):** A jargon-free, chart-free narrative overview explaining the goal, 3-step method, findings, and practical value for non-technical localization and hiring teams.
3. **MQM Defect Explorer (28 Defects):** Filterable inspector across `es-ES` and `ca-ES`, severity, MQM category, and detection layer, with before/after fixes and deep links to related Promptfoo cases.
4. **4-Model Eval Comparator (72 Recorded Answers):** Inspect all 12 test cases (`EC-001`–`EC-012`) side by side across all 6 runs, or switch to the Audit Matrix to isolate the 2 Catalan grammar suite blind spots, 6 Product Owner `QUERY` escalations, and 7 grounded failures.
5. **LLM Judge Calibration (20 Answers):** Side-by-side comparison of the replaced pre-judge regex pair (`14/20`), the current broadened access regex alone (`16/20`), and the calibrated `gemini-3.5-flash` judge (`20/20`), including all 6 adversarial traps (`JC-15`–`JC-20`).
6. **Live LQA Checker (Python Serverless Function):** Runs the zero-dependency `lqa_checks.py` engine directly on Vercel (`api/lqa_check.py`) to test single ES/CA UI strings or audit the full 20-string `sample_strings.csv` batch in real time.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). *(In plain `npm run dev`, the Live LQA Checker seamlessly falls back to a Unicode-aware TypeScript mirror; run `vercel dev` or deploy on Vercel to execute `api/lqa_check.py` directly in Python).*

To regenerate `src/data/novachat_data.json` and `api/_lqa_data.py` after updating files in `raw-data/`:

```bash
python scripts/build_data.py
```

## Next Planned Iteration

- **Phase 3:** Live NovaChat chatbot sandbox built with the Vercel AI SDK allowing visitors to toggle between ungrounded baseline and grounded prompts in real time.

---

*Author: Eduard Aliod Gil — Localization Specialist & AI QA Reviewer (ES/CA/EN)*
