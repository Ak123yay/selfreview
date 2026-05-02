import chalk from "chalk";
import type { Finding, Severity } from "./types.js";

const SEVERITY_ORDER: Severity[] = ["critical", "high", "med", "low"];

/** Sort findings: by severity (critical first), with security bubbling to top within each tier. */
export function sortFindings(findings: Finding[]): Finding[] {
  return [...findings].sort((a, b) => {
    const si = SEVERITY_ORDER.indexOf(a.severity);
    const sj = SEVERITY_ORDER.indexOf(b.severity);
    if (si !== sj) return si - sj;
    if (a.category === "security" && b.category !== "security") return -1;
    if (b.category === "security" && a.category !== "security") return 1;
    return a.file.localeCompare(b.file);
  });
}

/** Render findings to stdout for human reading. Implemented in Step 6. */
export function renderFindings(_findings: Finding[]): void {
  process.stdout.write(chalk.gray("(render not yet implemented — Step 6)\n"));
}

/** Render findings as JSON to stdout (for piping into the Step 10 UI or jq). */
export function renderJson(findings: Finding[]): void {
  process.stdout.write(JSON.stringify({ findings }, null, 2) + "\n");
}
