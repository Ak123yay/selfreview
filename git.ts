import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

export interface DiffResult {
  /** Raw unified diff string */
  raw: string;
  /** Paths of every changed file (relative to repo root) */
  changedFiles: string[];
  /** Approximate line count of the diff */
  lineCount: number;
}

/**
 * Shell out to git and return the diff between the working tree and `base`.
 * Throws SelfReviewError if we're not inside a git repo or there's nothing to diff.
 */
export function getDiff(base: string): DiffResult {
  // Step 2 — implemented next; signature is final
  throw new Error(`getDiff not yet implemented (base: ${base})`);
}

/**
 * Read a file from the working tree. We deliberately do NOT use `git show`
 * here — selfreview is meant to run BEFORE you commit, on uncommitted
 * changes. The working tree is what the diff is showing.
 */
export function getFileContent(repoRoot: string, filePath: string): string | null {
  const fullPath = resolve(repoRoot, filePath);
  if (!existsSync(fullPath)) return null;
  try {
    return readFileSync(fullPath, "utf8");
  } catch {
    return null;
  }
}

/** Returns the absolute path to the repo root, or null if not in a git repo. */
export function getRepoRoot(): string | null {
  try {
    return execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}
