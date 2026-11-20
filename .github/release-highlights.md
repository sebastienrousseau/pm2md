<!-- SPDX-License-Identifier: Apache-2.0 OR MIT -->
## 0.0.4

* **Workspace monorepo and canonical IR**: split `pm2md` into `@sebastienrousseau/pm2md-core` and `@sebastienrousseau/pm2md` at one lockstep version (`0.0.4`), unified around the `ApiDocument` Intermediate Representation (`parsePostmanToIR`, `parseOpenApiToIR`, `renderMarkdownFromIR`).
* **Swagger 2.0, OpenAPI 3.0/3.1, and YAML support**: added JSON and YAML parsing (`yaml`), cycle-safe local `$ref` resolution (`dereferenceObject`), format auto-detection (`--format`), and schema example synthesis.
* **Agent-ready `llms.txt` output**: added `renderLlmsTxt` and `renderLlmsFullTxt` (`--llms-txt`, `--llms-full`) for concise, token-efficient API indexing.
* **Security, escaping, and CLI hardening**: enabled default secret redaction (`--no-redact` opt-out), escaped backslashes and pipes in table cells, added dynamic code-fence sizing, fixed repeated header tables and hardcoded `./dist` writes, and replaced `minimist` with `node:util` `parseArgs`.
