import OpenAI from "openai";
import { SelfReviewError } from "./errors.js";
import type { ReviewResult } from "./types.js";

export const MODEL_ID = "moonshotai/kimi-k2.6";
export const NIM_BASE_URL = "https://integrate.api.nvidia.com/v1";

/** Lazily-initialised NIM client. Throws a clean SelfReviewError if key is missing. */
function getClient(): OpenAI {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new SelfReviewError("NVIDIA_API_KEY is not set.", {
      hint: "Get a free key at https://build.nvidia.com → API Keys, then add it to .env",
    });
  }
  return new OpenAI({ baseURL: NIM_BASE_URL, apiKey });
}

/**
 * Send the diff (and optionally full file contents) to Kimi K2.6 and
 * return structured findings. Implemented in Step 3.
 */
export async function reviewDiff(_diff: string): Promise<ReviewResult> {
  void getClient(); // validate key exists early
  throw new SelfReviewError("reviewDiff not yet implemented — coming in Step 3");
}
