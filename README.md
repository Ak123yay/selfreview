# selfreview

> A senior-reviewer pass for your PR before you click "Create pull request."
> Catches code-quality issues **and** security vulnerabilities. Powered by [Kimi K2.6](https://build.nvidia.com/moonshotai/kimi-k2.6) on NVIDIA NIM.

```bash
$ selfreview
[CRITICAL] [SECURITY] src/api/users.ts:88
  Raw user input concatenated into SQL query — classic SQL injection.
  Use parameterized queries instead.

[HIGH]     [SECURITY] src/auth/session.ts:47
  Token comparison uses ==, allowing type coercion AND timing leaks.
  Use crypto.timingSafeEqual.

[MED]      [BUG]      src/api/users.ts:112
  New endpoint doesn't validate `role` against allowed values;
  pattern elsewhere in this file uses `assertRole()` helper.
```

## Install

```bash
npx selfreview --version
```

## Setup

1. Get a free NVIDIA API key at [build.nvidia.com](https://build.nvidia.com)
2. `export NVIDIA_API_KEY=nvapi-...`
3. Run `selfreview` in any git repo

## Usage

```bash
selfreview                          # review HEAD vs main
selfreview --base develop           # review against a different base
selfreview --severity high          # only show high + critical findings
selfreview --security-only          # only show security findings
selfreview --json | jq              # machine-readable output
selfreview --explain                # generate a PR description
selfreview --dry-run                # see the prompt without sending it
```

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | No findings (or none above `--severity` threshold) |
| `1` | Findings present — useful for `--security-only` in CI |
| `2` | Tool failed to run (config, network, etc.) |

## What it catches

Code quality: bugs, edge cases, inconsistencies with the rest of the file, missing tests, unclear naming.

Security: SQL/shell injection, hardcoded secrets, weak crypto, missing auth checks, XSS, IDOR risks, sensitive data in logs.

**Not a SAST replacement.** This is a triage tool for the obvious stuff. Pair it with Semgrep, CodeQL, or Snyk for production.

## License

MIT
