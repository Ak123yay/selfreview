/**
 * Exit codes — chosen for CI integration.
 * Inspired by tools like ripgrep / eslint where exit code conveys outcome.
 */
export const ExitCode = {
  /** No findings (or success). Safe to merge. */
  Ok: 0,
  /** Findings present at or above the configured severity threshold. */
  FindingsFound: 1,
  /** Tool failed to run (config, network, parse error, etc.). */
  Error: 2,
} as const;

export type ExitCodeValue = (typeof ExitCode)[keyof typeof ExitCode];

/**
 * User-facing error. Thrown when something the user can fix went wrong
 * (missing key, not in a git repo, bad flag combo). The message is
 * printed cleanly without a stack trace.
 */
export class SelfReviewError extends Error {
  public readonly exitCode: ExitCodeValue;
  /** Optional follow-up hint shown in dim text. */
  public readonly hint?: string;

  constructor(
    message: string,
    options: { exitCode?: ExitCodeValue; hint?: string } = {}
  ) {
    super(message);
    this.name = "SelfReviewError";
    this.exitCode = options.exitCode ?? ExitCode.Error;
    this.hint = options.hint;
  }
}
