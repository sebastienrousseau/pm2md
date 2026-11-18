// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import fs from "fs";
import path from "path";
import { parseArgs } from "node:util";

import * as types from "./typings/types";
import { createStructureOfMarkdown } from "./util/create";
import { resolveOutputPath, writeFile } from "./util/write";

export interface ConvertOptions {
  footer?: boolean;
}

const FOOTER =
  "____________________________\nPowered by: [pm2md](https://pm2md.com)\n";

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
  console.log(`PM2MD - Postman Collection to Markdown generator

Usage:
  pm2md <collection.json> [options]

Options:
  -o, --output <path>   Write Markdown to a specific file path
      --stdout          Print generated Markdown to stdout instead of a file
      --no-footer       Omit the attribution footer
  -q, --quiet           Suppress progress output
  -v, --version         Print version and exit
  -h, --help            Show this help message and exit
`);
}

/**
 * Convert a parsed Postman collection object into Markdown.
 */
export function convertPostmanToMarkdown(
  collection: types.PostmanCollection,
  options: ConvertOptions = {}
): string {
  let markdown = createStructureOfMarkdown(collection);
  if (options.footer !== false) {
    markdown += FOOTER;
  }
  return markdown;
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
        output: { type: "string", short: "o" },
        stdout: { type: "boolean", default: false },
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

  if (positionals.length === 0) {
    console.error("❯ Usage: pm2md <path_to_json_file> [options]");
    console.error("❯ Path of JSON file is required. Run `pm2md --help` for options.");
    process.exitCode = 1;
    return;
  }

  const jsonFilePath = positionals[0];
  if (!fs.existsSync(jsonFilePath) || !fs.statSync(jsonFilePath).isFile()) {
    console.error(
      `❯ Path is not valid or is not a file: ${jsonFilePath}`
    );
    process.exitCode = 1;
    return;
  }

  const quiet = Boolean(values.quiet) || Boolean(values.stdout);
  if (!quiet) {
    console.log(`\nPM2MD\nhttps://pm2md.com/\n`);
    console.log(`❯ Reading file ${jsonFilePath}`);
    console.log("❯ Generating markdown file ...");
  }

  try {
    const rawData = fs.readFileSync(jsonFilePath, "utf8");
    const json = JSON.parse(rawData) as types.PostmanCollection;
    const markdown = convertPostmanToMarkdown(json, {
      footer: !values["no-footer"],
    });

    if (values.stdout) {
      process.stdout.on("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EPIPE") {
          process.exit(0);
        }
        throw err;
      });
      process.stdout.write(markdown);
      return;
    }

    const targetPath = values.output
      ? values.output
      : resolveOutputPath(jsonFilePath);
    const writtenPath = writeFile(markdown, targetPath);

    if (!quiet) {
      console.log(`❯ Wrote to ${writtenPath}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❯ Error processing ${jsonFilePath}: ${message}`);
    process.exitCode = 1;
  }
}

export * from "./typings/types";
export * from "./util/index";
export default { init, convertPostmanToMarkdown };
