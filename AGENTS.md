<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->

# AGENTS.md

Invariants for AI-assisted contributors working in this repository. A
human contributor reads [CONTRIBUTING.md](.github/CONTRIBUTING.md) and
[DEVELOPMENT.md](docs/DEVELOPMENT.md); an agent reads those too, plus this
list of things that must never drift, because they are the ones an
automated change is most likely to get wrong.

## Versioning

- The version is `0.0.x` and moves **strictly one step at a time** (+0.0.1).
  Never propose a 0.1.0 or 1.0 jump; to achieve `v0.1.0`, the project must have
  progressed through `v0.0.999`.
- Work for the next iteration MUST begin on a branch named `feat/v<next-version>`.
- **Single Active Release PR Invariant**: Across this repository, there MUST be at most ONE active pull request targeting `main`, which MUST be the release iteration branch `feat/v<next-version>`.
- **Branch Funneling Policy**: Any Dependabot PRs, security fixes, documentation updates, or auxiliary topic branches MUST NEVER be merged directly into `main`. They MUST ALWAYS be merged into the active `feat/v<next-version>` branch, and their standalone PRs targeting `main` closed. All iteration work funnels into the single release PR.
- When updating version, `package.json`, `CITATION.cff`, and `CHANGELOG.md` move together.
- Published GitHub releases MUST follow the standard template
  (<https://github.com/sebastienrousseau/passmcp/releases/tag/v0.0.5>),
  titled `<PROJECT_NAME> <VERSION>` with `## Highlights ⭐️`, `## What's Changed`,
  `## Checksums`, and `**Full Changelog**`.

## Commits and signing

- Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, …), imperative
  subject line (maximum 50 chars), body wrapped strictly at 72 chars explaining
  WHAT and WHY.
- Every commit carries a `Signed-off-by` trailer (`format.signoff = true`) and is
  SSH-signed (`commit.gpgsign = true`).
- Never rewrite published history. No `--force`, no `--amend` on pushed commits,
  no rebase of a shared branch.
- Never merge a pull request into `main` without explicit maintainer direction.

## Quality gates and Definition of Done

- Verification gates MUST pass before claiming completion:
  - `pnpm run build` (TypeScript compiles and packages with zero errors)
  - `pnpm run lint` (zero lint warnings/errors)
  - `pnpm run test` (Jest test suite passes)
  - `pnpm audit` (zero unaddressed vulnerabilities)
- State explicitly what command was run and what the result was.
- Every behavior change lands with its test in the same commit.

## Data and licenses

- Dual-licensed under `Apache-2.0 OR MIT`. License headers must remain on every source file.
- Zero em dashes (`—`) anywhere in commit messages, PR descriptions, or release notes.
