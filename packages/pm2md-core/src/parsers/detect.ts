// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import YAML from "yaml";
import { ApiDocument, ConvertStats, SourceFormat } from "../ir/types";
import { parseOpenApiToIR } from "./openapi";
import { parsePostmanToIR, PostmanCollection } from "./postman";

export type FormatOption = "auto" | "postman" | "swagger" | "openapi";

/**
 * Parse a JSON or YAML specification string into a plain object.
 */
export function parseSpecText(rawText: string): Record<string, unknown> {
  const trimmed = rawText.trim();
  if (!trimmed) {
    throw new Error("Input specification is empty.");
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Specification root must be a JSON object.");
    }
    return parsed as Record<string, unknown>;
  }

  const parsedYaml = YAML.parse(trimmed) as unknown;
  if (
    !parsedYaml ||
    typeof parsedYaml !== "object" ||
    Array.isArray(parsedYaml)
  ) {
    throw new Error("Specification root must be a YAML or JSON object.");
  }
  return parsedYaml as Record<string, unknown>;
}

/**
 * Auto-detect whether a parsed object is Postman v2.x, Swagger 2.0, or OpenAPI 3.x.
 */
export function detectSpecFormat(doc: Record<string, unknown>): SourceFormat {
  if (doc.swagger === "2.0") {
    return "swagger-2";
  }
  if (typeof doc.openapi === "string") {
    return doc.openapi.startsWith("3.1") ? "openapi-3.1" : "openapi-3.0";
  }
  if (
    doc.info &&
    typeof doc.info === "object" &&
    (Array.isArray(doc.item) ||
      typeof (doc.info as Record<string, unknown>).schema === "string")
  ) {
    return "postman-v2";
  }
  throw new Error(
    "Unable to detect specification format. Expected Postman v2.x, Swagger 2.0, or OpenAPI 3.x."
  );
}

/**
 * Parse a specification object (or raw JSON/YAML string) into the canonical `ApiDocument` IR.
 */
export function parseToIR(
  input: string | Record<string, unknown>,
  format: FormatOption = "auto"
): { ir: ApiDocument; stats: ConvertStats } {
  const doc = typeof input === "string" ? parseSpecText(input) : input;

  if (format === "postman") {
    return parsePostmanToIR(doc as unknown as PostmanCollection);
  }
  if (format === "swagger") {
    return parseOpenApiToIR(doc, "swagger-2");
  }
  if (format === "openapi") {
    const detected =
      typeof doc.openapi === "string" && doc.openapi.startsWith("3.1") ?
        "openapi-3.1" :
        "openapi-3.0";
    return parseOpenApiToIR(doc, detected);
  }

  const detected = detectSpecFormat(doc);
  if (detected === "postman-v2") {
    return parsePostmanToIR(doc as unknown as PostmanCollection);
  }
  return parseOpenApiToIR(doc, detected);
}
