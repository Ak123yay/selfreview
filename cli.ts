import { Command } from "commander";
import { createRequire } from "module";
import { setLevel, log } from "./log.js";

// readonly snapshot of package.json — works in dev (tsx) and after build
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
  quiet?: boolean;
  verbose?: boolean;
}

export async function run(): Promise<void> {
  const program = new Command();

  program
    .name("selfreview")
    .description(pkg.description)
    .version(pkg.version, "-v, --version", "Print version and exit")
    .option("-q, --quiet", "Suppress status output (only show findings/errors)")
    .option("--verbose", "Show debug output including the prompt sent to the model");

  program
    .command("review", { isDefault: true })
    .description("Review the diff between HEAD and a base branch")
    .option("-b, --base <branch>", "Base branch to diff against", "main")
    .option(
      "-s, --severity <level>",
      "Minimum severity to show: low | med | high | critical",
      "low"
    )
    .option("--security-only", "Show only security findings")
    .option("--json", "Output raw JSON to stdout (for piping)")
    .option("--explain", "Generate a PR description draft")
    .option(
      "--dry-run",
      "Print the prompt that would be sent to the model, without calling the API"
    )
    .action(async (cmdOpts: Partial<ReviewOptions>) => {
      const globalOpts = program.opts<{ quiet?: boolean; verbose?: boolean }>();

      // Merge global flags with subcommand options
      if (globalOpts.verbose) setLevel("verbose");
      else if (globalOpts.quiet) setLevel("quiet");

      log.info(`selfreview ${pkg.version}`);
      log.debug(`options: ${JSON.stringify(cmdOpts)}`);

      // Step 2 — git wiring lands here next
      log.info("(Step 2 — git wiring — coming next)");
    });

  await program.parseAsync(process.argv);
}
