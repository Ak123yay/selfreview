#!/usr/bin/env node
import "dotenv/config";
import { run } from "./cli.js";
import { SelfReviewError, ExitCode } from "./errors.js";
import { log } from "./log.js";

try {
  await run();
} catch (err) {
  if (err instanceof SelfReviewError) {
    log.error(err.message);
    if (err.hint) log.hint(err.hint);
    process.exit(err.exitCode);
  }
  log.error("Unexpected error — please open an issue with the trace below:");
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(ExitCode.Error);
}
