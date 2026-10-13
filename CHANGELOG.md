# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
