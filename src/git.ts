import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { SelfReviewError } from "./errors.js";

export interface DiffResult {
  /** Raw unified diff string */
  raw: string;
  /** Paths of every changed file (relative to repo root) */
  changedFiles: string[];
  /** Approximate line count of the diff */
  lineCount: number;
  /** Absolute path to the repo root */
  repoRoot: string;
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

/**
 * Shell out to git and return the diff between HEAD and `base`.
 * Throws SelfReviewError for every user-fixable failure.
 */
export function getDiff(base: string): DiffResult {
  const repoRoot = getRepoRoot();
  if (!repoRoot) {
    throw new SelfReviewError("Not inside a git repository.", {
      hint: "Run selfreview from within a git repo.",
    });
  }

  // Verify the base branch exists before diffing
  try {
    execSync(`git rev-parse --verify ${base}`, {
      stdio: ["ignore", "ignore", "ignore"],
    });
  } catch {
    throw new SelfReviewError(`Base branch "${base}" not found.`, {
      hint: `Check the branch name or use --base to specify a different one.`,
    });
  }

  // Three-dot diff: compares HEAD against the common ancestor of base,
  // so changes already on base don't show up as noise
  let raw: string;
  try {
    raw = execSync(`git diff ${base}...HEAD`, {
      encoding: "utf8",
      cwd: repoRoot,
      maxBuffer: 50 * 1024 * 1024,
    });
  } catch {
    throw new SelfReviewError(`Failed to run git diff against "${base}".`);
  }

  if (!raw.trim()) {
    throw new SelfReviewError(`No diff found against "${base}".`, {
      hint: "Make sure you have commits on this branch that aren't on the base.",
    });
  }

  // Parse changed file paths from "+++ b/path" headers.
  // Edge cases handled:
  //   - Deleted files: line is "+++ /dev/null" → does not match `b\/`
  //   - Filenames with spaces: git appends `\t<timestamp>` → strip it
  //   - Windows CRLF: trailing `\r` → strip it
  //   - Duplicates from multi-hunk diffs → dedupe via Set
  const changedFiles = [
    ...new Set(
      [...raw.matchAll(/^\+\+\+ b\/(.+)$/gm)]
        .map((m) => (m[1] ?? "").replace(/[\t\r].*$/, "").trim())
        .filter(Boolean)
    ),
  ];

  return {
    raw,
    changedFiles,
    lineCount: raw.split("\n").length,
    repoRoot,
  };
}

/**
 * Read a file from the working tree.
 * We use the filesystem (not git show) because selfreview runs before you push —
 * uncommitted changes should be visible to the reviewer.
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