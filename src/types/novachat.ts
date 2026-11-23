export interface EvalAssertion {
  type: string;
  value: string;
  metric?: string;
  config?: Record<string, unknown>;
}

export interface EvalCase {
  case_id: string;
  locale: string;
  question: string;
  description: string;
  intent: string;
  risk: string;
  linked_defects: string[];
  assertions: EvalAssertion[];
}

export interface JudgeVerdict {
  verdict: string;
  reason: string;
  judge_model: string;
  cache_key: string;
}

export interface EvalRow {
  case_id: string;
  locale: string;
  run: string;
  short_label: string;
  vendor: string;
  run_tag: string;
  prompt_type: "baseline" | "grounded";
  model: string;
  answer: string;
  auto_result: "PASS" | "FAIL";
  auto_failed_metrics: string[];
  human_verdict: "PASS" | "FAIL" | "QUERY";
  human_severity: "Critical" | "Major" | "Minor" | null;
  human_notes: string;
  judge: JudgeVerdict | null;
  pass_fail_agree: boolean;
}

export interface RunSummary {
  run: string;
  short_label: string;
  vendor: string;
  run_tag: string;
  prompt_type: "baseline" | "grounded";
  model: string;
  total: number;
  auto_pass: number;
  auto_fail: number;
  human_pass: number;
  human_query: number;
  human_fail: number;
  human_non_fail: number;
  critical_fails: number;
  major_fails: number;
  minor_fails: number;
}

export interface DefectItem {
  id: string;
  locale: string;
  content_type: string;
  string_id: string | null;
  source_or_reference: string;
  target_current: string;
  mqm_category: string;
  severity: "Critical" | "Major" | "Minor";
  explanation: string;
  recommended_fix: string;
  rationale: string;
  auto_check: string;
  detection_layer: "Python UI checker" | "Promptfoo evals" | "Human review";
  linked_cases: string[];
}

export interface CalibrationRow {
  id: string;
  source: string;
  is_trap: boolean;
  case_id: string;
  locale: string;
  human_label: "PASS" | "FAIL";
  legacy_regex: "PASS" | "FAIL";
  current_regex: "PASS" | "FAIL";
  judge: "PASS" | "FAIL";
  suite: "PASS" | "FAIL";
  legacy_regex_agree: boolean;
  current_regex_agree: boolean;
  judge_agree: boolean;
  suite_agree: boolean;
  note: string;
  judge_reason: string;
  answer: string;
}

export interface GlossaryEntry {
  en: string;
  "es-ES": string;
  "ca-ES": string;
  note: string;
  es_match?: string;
  ca_match?: string;
  domain?: string;
}

export interface LqaRules {
  gendered_terms: Record<string, string[]>;
  castilianisms_ca: string[];
  obsolete_diacritics_ca: string[];
  catalan_ui_terms_in_es?: string[];
  allow_identical: string[];
  gendered_address_terms?: Record<string, string[]>;
}

export interface SampleStringRow {
  id: string;
  locale: "es-ES" | "ca-ES" | string;
  context: string;
  max_chars: string;
  source: string;
  target: string;
}

export interface LqaIssue {
  id: string;
  locale: string;
  check: string;
  mqm_category: string;
  severity: "Critical" | "Major" | "Minor";
  message: string;
  target: string;
}

export type LqaProfile = "core" | "extended";

export interface LqaCheckResponse {
  ok: boolean;
  engine: "python-serverless" | "ts-local-fallback";
  profile?: LqaProfile;
  glossary_terms?: number;
  python_version: string;
  elapsed_ms: number;
  strings_checked: number;
  flagged_strings: number;
  clean_strings: number;
  issue_count: number;
  by_severity: {
    Critical: number;
    Major: number;
    Minor: number;
  };
  by_check: Record<string, number>;
  issues: LqaIssue[];
  error?: string;
}

export interface NovaChatData {
  meta: {
    project: string;
    author: string;
    linkedin_url: string;
    repo_url: string;
    dashboard_repo_url: string;
    results_url: string;
    recording_note: string;
    judge_model: string;
  };
  kpis: {
    total_defects: number;
    defects_by_severity: Record<string, number>;
    defects_by_locale: Record<string, number>;
    defects_by_layer: Record<string, number>;
    category_breakdown: { category: string; count: number }[];
    total_answers: number;
    total_cases: number;
    total_runs: number;
    auto_human_agreement: number;
    disagreements_count: number;
    query_count: number;
    grounded_fails_count: number;
    baseline_critical_fails: number;
    grounded_critical_fails: number;
    calibration_total: number;
    calibration_legacy_regex_agree: number;
    calibration_current_regex_agree: number;
    calibration_judge_agree: number;
    calibration_suite_agree: number;
  };
  prompts: {
    grounded: string;
    baseline: string;
  };
  cases: EvalCase[];
  runs_summary: RunSummary[];
  defects: DefectItem[];
  evaluations: EvalRow[];
  calibration: CalibrationRow[];
  lqa_checker: {
    glossary: GlossaryEntry[];
    extended_glossary: GlossaryEntry[];
    rules: LqaRules;
    extended_rules: LqaRules;
    sample_strings: SampleStringRow[];
  };
}

export type TabId =
  | "overview"
  | "story"
  | "sandbox"
  | "checker"
  | "defects"
  | "comparator"
  | "calibration";
export type MatrixPreset =
  | "all"
  | "disagreements"
  | "queries"
  | "grounded_fails"
  | "all_fails";
