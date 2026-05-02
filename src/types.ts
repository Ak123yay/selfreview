/**
 * Shared types. Lives in its own module so render, review, and any
 * future consumers (e.g. the Step 10 web UI's API server) can import
 * the schema without pulling in the LLM client.
 */

export type Severity = "low" | "med" | "high" | "critical";

export type Category =
  | "security"
  | "bug"
  | "edge-case"
  | "naming"
  | "consistency"
  | "testing";

export interface Finding {
  /** Path relative to repo root */
  file: string;
  /** Single line, or [start, end] inclusive range */
  line: number | [number, number];
  severity: Severity;
  category: Category;
  /** Reviewer comment in plain prose */
  comment: string;
  /** Optional code snippet showing how to fix */
  suggested_fix?: string;
}

export interface ReviewResult {
  findings: Finding[];
  /** Raw model response, useful for debugging with --verbose */
  raw?: string;
}
