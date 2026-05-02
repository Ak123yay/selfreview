import { Command } from "commander";
import { createRequire } from "module";
import { setLevel, log } from "./log.js";
import { getDiff } from "./git.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as {
  version: string;
  description: string;
};

export interface ReviewOptions {
  base: string;
  severity: "low" | "med" | "high" | "critical";
  securityOnly?: boolean;
  json?: boolean;
  explain?: boolean;
  dryRun?: boolean;
}

export async function run(): Promise<void> {
  const program = new Command();

  program
    .name("selfreview")
    .description(pkg.description)
    .version(pkg.version, "-v, --version", "Print version and exit")
    .option("-q, --quiet", "Suppress status output")
    .option("--verbose", "Show debug output including the prompt");

  program
    .command("review", { isDefault: true })
    .description("Review the diff between HEAD and a base branch")
    .option("-b, --base <branch>", "Base branch to diff against", "main")
    .option("-s, --severity <level>", "Minimum severity: low | med | high | critical", "low")
    .option("--security-only", "Show only security findings")
    .option("--json", "Output raw JSON to stdout")
    .option("--explain", "Generate a PR description draft")
    .option("--dry-run", "Print the prompt without calling the API")
    .action(async (cmdOpts: ReviewOptions) => {
      const globalOpts = program.opts<{ quiet?: boolean; verbose?: boolean }>();
      if (globalOpts.verbose) setLevel("verbose");
      else if (globalOpts.quiet) setLevel("quiet");

      // Step 2 — git wiring
      const diff = getDiff(cmdOpts.base);

      log.info(`Reviewing ${diff.changedFiles.length} file(s) — ${diff.lineCount} lines changed`);
      log.debug(`Repo root: ${diff.repoRoot}`);
      log.debug(`Changed files:\n  ${diff.changedFiles.join("\n  ")}`);

      // Step 3 — LLM call lands here next
      log.info("(Step 3 — NIM call — coming next)");
    });

  await program.parseAsync(process.argv);
}