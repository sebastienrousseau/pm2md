// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import fs from "fs";
import path from "path";
import { parseArgs } from "node:util";
import {
  convertPostmanToMarkdown,
  convertSpecToLlmsTxt,
  convertSpecToMarkdown,
  FormatOption,
  RenderOptions,
} from "@sebastienrousseau/pm2md-core";
import { resolveOutputPath, writeFile } from "./util/write";

export * from "@sebastienrousseau/pm2md-core";
export * from "./util/write";

function readPackageVersion(): string {
  try {
    const pkgPath = path.resolve(__dirname, "..", "package.json");
    const fallbackPath = path.resolve(__dirname, "..", "..", "package.json");
    const target = fs.existsSync(pkgPath) ? pkgPath : fallbackPath;
    if (fs.existsSync(target)) {
      const pkg = JSON.parse(fs.readFileSync(target, "utf8")) as {
        version?: string;
      };
      if (pkg.version) {
        return pkg.version;
      }
    }
  } catch {
    // Ignore version lookup failures
  }
  return "0.0.4";
}

function printHelp(): void {
  console.log(`PM2MD - API Specification to Markdown & llms.txt generator

Usage:
  pm2md <spec.(json|yaml|yml)> [options]

Options:
  -f, --format <type>   Input format: auto, postman, swagger, openapi (default: auto)
  -o, --output <path>   Write output to a specific file path
      --stdout          Print generated output to stdout instead of a file
      --toc             Include a Table of Contents
      --llms-txt        Emit token-efficient llms.txt index
      --llms-full       Emit compact agent-ready llms-full.txt Markdown
      --no-redact       Do not redact sensitive auth/header values
      --no-footer       Omit the attribution footer
  -q, --quiet           Suppress progress output
  -v, --version         Print version and exit
  -h, --help            Show this help message and exit
`);
}

function isValidFormat(value: string): value is FormatOption {
  return ["auto", "postman", "swagger", "openapi"].includes(value);
}

/**
 * Initialize and execute the PM2MD CLI.
 */
export function init(argv: string[] = process.argv.slice(2)): void {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        format: { type: "string", short: "f", default: "auto" },
        output: { type: "string", short: "o" },
        stdout: { type: "boolean", default: false },
        toc: { type: "boolean", default: false },
        "llms-txt": { type: "boolean", default: false },
        "llms-full": { type: "boolean", default: false },
        "no-redact": { type: "boolean", default: false },
        "no-footer": { type: "boolean", default: false },
        quiet: { type: "boolean", short: "q", default: false },
        version: { type: "boolean", short: "v", default: false },
        help: { type: "boolean", short: "h", default: false },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❯ Invalid arguments: ${message}`);
    process.exitCode = 1;
    return;
  }

  const { values, positionals } = parsed;

  if (values.help) {
    printHelp();
    return;
  }

  if (values.version) {
    console.log(readPackageVersion());
    return;
  }

  const formatRaw = String(values.format ?? "auto");
  if (!isValidFormat(formatRaw)) {
    console.error(
      `❯ Invalid --format value "${formatRaw}". Expected: auto, postman, swagger, openapi.`
    );
    process.exitCode = 1;
    return;
  }

  if (positionals.length === 0) {
    console.error("❯ Usage: pm2md <path_to_spec_file> [options]");
    console.error(
      "❯ Path of JSON or YAML file is required. Run `pm2md --help` for options."
    );
    process.exitCode = 1;
    return;
  }

  const specFilePath = positionals[0];
  if (!fs.existsSync(specFilePath) || !fs.statSync(specFilePath).isFile()) {
    console.error(`❯ Path is not valid or is not a file: ${specFilePath}`);
    process.exitCode = 1;
    return;
  }

  const quiet = Boolean(values.quiet) || Boolean(values.stdout);
  if (!quiet) {
    console.log("\nPM2MD\nhttps://pm2md.com/\n");
    console.log(`❯ Reading file ${specFilePath}`);
    console.log("❯ Generating documentation ...");
  }

  try {
    const rawData = fs.readFileSync(specFilePath, "utf8");
    const isLlms = Boolean(values["llms-txt"]) || Boolean(values["llms-full"]);

    const result = isLlms ?
      convertSpecToLlmsTxt(rawData, {
        format: formatRaw,
        full: Boolean(values["llms-full"]),
      }) :
      convertSpecToMarkdown(rawData, {
        format: formatRaw,
        footer: !values["no-footer"],
        toc: Boolean(values.toc),
        redactSecrets: !values["no-redact"],
      } as RenderOptions & { format: FormatOption });

    if (values.stdout) {
      process.stdout.on("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EPIPE") {
          process.exit(0);
        }
        throw err;
      });
      process.stdout.write(result.markdown);
      return;
    }

    const targetPath = values.output ?
      values.output :
      resolveOutputPath(specFilePath);
    const writtenPath = writeFile(result.markdown, targetPath);

    if (!quiet) {
      console.log(
        `❯ Wrote to ${writtenPath} (${result.ir.sourceFormat}, ${result.stats.endpoints} endpoints, ${result.stats.redactedSecrets} secrets redacted)`
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❯ Error processing ${specFilePath}: ${message}`);
    process.exitCode = 1;
  }
}

export default {
  init,
  convertPostmanToMarkdown,
  convertSpecToMarkdown,
  convertSpecToLlmsTxt,
};
