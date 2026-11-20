// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import { ConvertResult, RenderOptions } from "./ir/types";
import { FormatOption, parseToIR } from "./parsers/detect";
import { parsePostmanToIR, PostmanCollection } from "./parsers/postman";
import { renderLlmsFullTxt, renderLlmsTxt } from "./renderers/llms";
import { renderMarkdownFromIR } from "./renderers/markdown";

export * from "./ir/types";
export * from "./parsers/detect";
export * from "./parsers/openapi";
export * from "./parsers/postman";
export * from "./parsers/ref-resolver";
export * from "./renderers/llms";
export * from "./renderers/markdown";
export * from "./security/redact";

/**
 * Convert a Postman collection into Markdown via the canonical `ApiDocument` IR.
 */
export function convertPostmanToMarkdown(
  collection: PostmanCollection,
  options: RenderOptions = {}
): ConvertResult {
  const { ir, stats } = parsePostmanToIR(collection);
  const markdown = renderMarkdownFromIR(ir, options, stats);
  return { markdown, ir, stats };
}

/**
 * Convert any supported API specification (Postman v2.x, Swagger 2.0, OpenAPI 3.x JSON/YAML)
 * into Markdown via the canonical `ApiDocument` IR.
 */
export function convertSpecToMarkdown(
  input: string | Record<string, unknown>,
  options: RenderOptions & { format?: FormatOption } = {}
): ConvertResult {
  const { ir, stats } = parseToIR(input, options.format ?? "auto");
  const markdown = renderMarkdownFromIR(ir, options, stats);
  return { markdown, ir, stats };
}

/**
 * Convert any supported API specification into `llms.txt` or `llms-full.txt` output.
 */
export function convertSpecToLlmsTxt(
  input: string | Record<string, unknown>,
  options: { format?: FormatOption; full?: boolean } = {}
): ConvertResult {
  const { ir, stats } = parseToIR(input, options.format ?? "auto");
  const markdown = options.full ? renderLlmsFullTxt(ir) : renderLlmsTxt(ir);
  return { markdown, ir, stats };
}
