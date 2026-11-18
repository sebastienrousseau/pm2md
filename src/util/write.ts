// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import fs from "fs";
import path from "path";

/**
 * Resolve the output Markdown file path from a target path.
 * Preserves the target directory and replaces any non-.md extension with .md.
 */
export function resolveOutputPath(targetPath: string): string {
  const parsed = path.parse(targetPath);
  const fileName = parsed.ext === ".md" ? parsed.base : `${parsed.name}.md`;
  return parsed.dir ? path.join(parsed.dir, fileName) : fileName;
}

/**
 * Write generated Markdown content to disk.
 * @param {string} content - Markdown content to write
 * @param {string} targetPath - Destination file path (or base path)
 * @returns {string} The resolved path written
 */
export function writeFile(content: string, targetPath: string): string {
  if (!targetPath || typeof targetPath !== "string" || !targetPath.trim()) {
    throw new TypeError("Output file path must be a non-empty string.");
  }

  const resolvedPath = resolveOutputPath(targetPath.trim());
  const outDir = path.dirname(resolvedPath);

  if (outDir && outDir !== ".") {
    writeDirectory(outDir);
  }

  fs.writeFileSync(resolvedPath, content, "utf8");
  return resolvedPath;
}

/**
 * Ensure a directory exists, creating parent directories recursively if needed.
 * @param {fs.PathLike} dirpath - Directory path to create
 */
export function writeDirectory(dirpath: fs.PathLike): void {
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, { recursive: true });
  }
}
