import chalk from "chalk";

/**
 * Logging discipline:
 *   - Status, progress, errors → stderr (this module)
 *   - Findings or JSON output  → stdout (via render module directly)
 *
 * This separation matters: when the Step 10 UI execs `selfreview --json`
 * and pipes stdout into JSON.parse(), any stray status message would
 * break parsing. Keeping them on different streams makes the contract
 * machine-friendly and the output human-friendly at the same time.
 */

export type LogLevel = "quiet" | "normal" | "verbose";

let currentLevel: LogLevel = "normal";

export function setLevel(level: LogLevel): void {
  currentLevel = level;
}

function write(line: string): void {
  process.stderr.write(line + "\n");
}

export const log = {
  info(msg: string): void {
    if (currentLevel === "quiet") return;
    write(chalk.cyan("›") + " " + msg);
  },
  success(msg: string): void {
    if (currentLevel === "quiet") return;
    write(chalk.green("✓") + " " + msg);
  },
  warn(msg: string): void {
    write(chalk.yellow("!") + " " + msg);
  },
  error(msg: string): void {
    write(chalk.red("✗") + " " + msg);
  },
  hint(msg: string): void {
    if (currentLevel === "quiet") return;
    write(chalk.dim("  " + msg));
  },
  debug(msg: string): void {
    if (currentLevel !== "verbose") return;
    write(chalk.dim("  [debug] " + msg));
  },
};
