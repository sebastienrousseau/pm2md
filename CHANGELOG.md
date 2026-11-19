# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.5] - 2026-11-18

### Added

- Converted repository into a `pnpm` workspace monorepo with `@sebastienrousseau/pm2md-core` and `@sebastienrousseau/pm2md` in lockstep `0.0.5` versioning.
- Added canonical `ApiDocument` Intermediate Representation (`packages/pm2md-core/src/ir/types.ts`), `parsePostmanToIR`, and `renderMarkdownFromIR`.
- Added default-on secret redaction (`redactValue`) for sensitive auth/header values while preserving `{{variable}}` placeholders (`--no-redact` opt-out).
- Added `--toc` Table of Contents generation in `pm2md` CLI and `renderMarkdownFromIR`.

### Changed

- Refactored `packages/pm2md` CLI and library exports to consume `@sebastienrousseau/pm2md-core`.
- Updated `jest.config.cjs` and root workspace scripts for monorepo builds, linting, and testing.

## [0.0.4] - 2026-11-18

### Added

- Added pure programmatic `convertPostmanToMarkdown` API in `src/index.ts`.
- Added CLI flags (`--output`, `--stdout`, `--no-footer`, `--quiet`, `--version`, `--help`) using built-in `node:util` `parseArgs`.
- Added support for `urlencoded`, `graphql`, and `file` request bodies, path variables (`url.variable`), all Postman auth types, and multiple response examples.
- Added Markdown table-cell escaping (`escapeTableCell`), dynamic code-fence sizing (`formatCodeBlock`), and folder heading depth clamping.

### Changed

- Eliminated all runtime `dependencies` by replacing `minimist` with `node:util` `parseArgs` and moving build/dev tools to `devDependencies`.
- Fixed `readRequestOptions` to emit a single `### Headers` table instead of repeating headings per header.
- Fixed `writeFile` to write relative to the target/input path instead of hardcoding `./dist`, and set non-zero exit codes on CLI errors.
- Updated `@types/node` to `^22.0.0` and aligned `README.md` documentation and license references.

## [0.0.3] - 2026-10-13

### Added

- Added `src/typings/types.ts` type definitions and `src/util/index.ts` re-exports.
- Added comprehensive CI workflow for GitHub Actions testing across Node matrix.
- Added CITATION.cff and SECURITY.md canonical documentation.

### Changed

- Updated dependency security overrides in `pnpm-workspace.yaml` addressing 20 transitive vulnerabilities.
- Modernized build and test scripts in `package.json` removing deprecated tool wrappers.
- Enforced defensive parameter guards in `readMethods` and `writeFile`.

## [0.0.2] - 2023-08-25

### Changed

- Dual-licensed under Apache-2.0 OR MIT.
- Updated documentation and dependencies.

## [0.0.1] - 2022-07-25

### Added

- Initial release of PM2MD Postman to Markdown documentation generator.
