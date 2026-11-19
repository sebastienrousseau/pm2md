// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import { ConvertResult, RenderOptions } from "./ir/types";
import { parsePostmanToIR, PostmanCollection } from "./parsers/postman";
import { renderMarkdownFromIR } from "./renderers/markdown";

export * from "./ir/types";
export * from "./parsers/postman";
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
