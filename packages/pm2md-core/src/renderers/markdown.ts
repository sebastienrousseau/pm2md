// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import {
  ApiAuthRequirement,
  ApiDocument,
  ApiEndpoint,
  ApiGroup,
  ConvertStats,
  RenderOptions,
} from "../ir/types";
import { redactValue } from "../security/redact";

const FOOTER =
  "____________________________\nPowered by: [pm2md](https://pm2md.com)\n";

/**
 * Escape pipe characters and collapse newlines for safe Markdown table cells.
 */
export function escapeTableCell(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }
  return String(value)
    .replace(/\\n/g, " ")
    .replace(/\r?\n/g, "<br/>")
    .replace(/\|/g, "\\|");
}

/**
 * Wrap content in a fenced code block using a fence longer than any backtick run inside.
 */
export function formatCodeBlock(content: string, language = ""): string {
  const matches = content.match(/`{3,}/g);
  const maxRun = matches ?
    Math.max(...matches.map((match) => match.length)) :
    2;
  const fence = "`".repeat(Math.max(3, maxRun + 1));
  return `${fence}${language}\n${content}\n${fence}\n`;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function renderTable(
  heading: string,
  columns: string[],
  rows: string[][]
): string {
  if (rows.length === 0) {
    return "";
  }
  const lines = [
    heading,
    "",
    `|${columns.join("|")}|`,
    `|${columns.map(() => "---").join("|")}|`,
    ...rows.map((row) => `|${row.map(escapeTableCell).join("|")}|`),
    "",
    "",
  ];
  return lines.join("\n");
}

function renderAuthList(
  authList: ApiAuthRequirement[] | undefined,
  redactSecrets: boolean,
  stats: ConvertStats
): string {
  if (!authList || authList.length === 0) {
    return "";
  }
  const chunks: string[] = [];
  for (const auth of authList) {
    if (auth.type === "noauth") {
      chunks.push(`### 🔑 Authentication ${auth.type}\n\nNo authentication required.\n\n`);
      continue;
    }
    if (auth.entries.length === 0) {
      chunks.push(`### 🔑 Authentication ${auth.type}\n\n`);
      continue;
    }
    const rows = auth.entries.map((entry) => {
      const isSecretField =
        entry.key.toLowerCase() !== "key" &&
        entry.key.toLowerCase() !== "in";
      const result = redactValue(
        entry.key,
        entry.value,
        redactSecrets,
        isSecretField
      );
      if (result.redacted) {
        stats.redactedSecrets += 1;
      }
      return [entry.key, result.value, entry.type ?? ""];
    });
    chunks.push(
      renderTable(
        `### 🔑 Authentication ${auth.type}`,
        ["Param", "Value", "Type"],
        rows
      )
    );
  }
  return chunks.join("");
}

function renderEndpoint(
  endpoint: ApiEndpoint,
  redactSecrets: boolean,
  stats: ConvertStats
): string {
  const chunks: string[] = ["\n", `## End-point: ${endpoint.name}\n`];

  if (endpoint.description) {
    chunks.push(`${endpoint.description}\n`);
  }

  if (endpoint.method) {
    chunks.push(`### Method: ${endpoint.method}\n`);
  }

  if (endpoint.path) {
    chunks.push(`> \`\`\`\n> ${endpoint.path}\n> \`\`\`\n`);
  }

  if (endpoint.headers.length > 0) {
    const headerRows = endpoint.headers.map((header) => {
      const result = redactValue(
        header.name,
        header.value ?? "",
        redactSecrets
      );
      if (result.redacted) {
        stats.redactedSecrets += 1;
      }
      return [header.name, result.value];
    });
    chunks.push(renderTable("### Headers", ["Header", "Value"], headerRows));
  }

  if (endpoint.requestBody) {
    const body = endpoint.requestBody;
    if (body.mode === "raw" && body.raw !== undefined) {
      chunks.push(`### Body (**${body.mode}**)\n\n`);
      chunks.push(formatCodeBlock(body.raw, body.language ?? "json"));
      chunks.push("\n");
    } else if (
      (body.mode === "formdata" || body.mode === "urlencoded") &&
      body.fields
    ) {
      chunks.push(
        renderTable(
          `### Body ${body.mode}`,
          ["Param", "Value", "Type"],
          body.fields.map((f) => [f.name, f.value ?? "", f.type ?? ""])
        )
      );
    } else if (body.mode === "graphql" && body.graphql) {
      chunks.push("### Body (**graphql**)\n\n");
      if (body.graphql.query) {
        chunks.push(formatCodeBlock(body.graphql.query, "graphql"));
      }
      if (body.graphql.variables) {
        chunks.push(formatCodeBlock(body.graphql.variables, "json"));
      }
      chunks.push("\n");
    } else if (body.mode === "file" && body.fileSrc) {
      chunks.push(`### Body (**file**)\n\nFile: \`${body.fileSrc}\`\n\n`);
    }
  }

  if (endpoint.pathParams.length > 0) {
    chunks.push(
      renderTable(
        "### Path Variables",
        ["Param", "Value", "Description"],
        endpoint.pathParams.map((p) => [
          p.name,
          p.value ?? "",
          p.description ?? "",
        ])
      )
    );
  }

  if (endpoint.queryParams.length > 0) {
    chunks.push(
      renderTable(
        "### Query Params",
        ["Param", "Value"],
        endpoint.queryParams.map((q) => [q.name, q.value ?? ""])
      )
    );
  }

  chunks.push(renderAuthList(endpoint.auth, redactSecrets, stats));

  for (const res of endpoint.responses) {
    const statusLabel = [res.code, res.status]
      .filter((part) => part !== undefined && part !== "")
      .join(" ");
    const nameSuffix = res.name ? ` (${res.name})` : "";
    chunks.push(`### Response: ${statusLabel || "Example"}${nameSuffix}\n`);
    if (res.body !== undefined) {
      chunks.push(formatCodeBlock(res.body, res.language ?? "json"));
    }
    chunks.push("\n");
  }

  chunks.push("\n");
  return chunks.join("");
}

function renderGroup(
  group: ApiGroup,
  depth: number,
  redactSecrets: boolean,
  stats: ConvertStats
): string {
  const chunks: string[] = [];
  const heading = "#".repeat(Math.min(Math.max(depth, 1), 6));
  chunks.push(`${heading} 📁 Collection: ${group.name}\n`);

  if (group.description) {
    chunks.push(`${group.description}\n`);
  }

  chunks.push(renderAuthList(group.auth, redactSecrets, stats));

  for (const endpoint of group.endpoints) {
    chunks.push(renderEndpoint(endpoint, redactSecrets, stats));
  }

  for (const childGroup of group.groups) {
    chunks.push(renderGroup(childGroup, depth + 1, redactSecrets, stats));
  }

  return chunks.join("");
}

function buildToc(groups: ApiGroup[], endpoints: ApiEndpoint[], depth = 0): string[] {
  const lines: string[] = [];
  const indent = "  ".repeat(depth);

  for (const endpoint of endpoints) {
    const headingText = `End-point: ${endpoint.name}`;
    lines.push(`${indent}- [${endpoint.name}](#${slugifyHeading(headingText)})`);
  }

  for (const group of groups) {
    const headingText = `📁 Collection: ${group.name}`;
    lines.push(`${indent}- [${group.name}](#${slugifyHeading(headingText)})`);
    lines.push(...buildToc(group.groups, group.endpoints, depth + 1));
  }

  return lines;
}

/**
 * Render a canonical `ApiDocument` IR into CommonMark/GFM Markdown.
 */
export function renderMarkdownFromIR(
  doc: ApiDocument,
  options: RenderOptions = {},
  stats: ConvertStats = {
    folders: 0,
    endpoints: 0,
    redactedSecrets: 0,
    warnings: [],
  }
): string {
  const redactSecrets = options.redactSecrets !== false;
  const chunks: string[] = [`# Project: ${doc.title}\n`];

  if (doc.description) {
    chunks.push(`${doc.description}\n`);
  }

  if (options.toc) {
    const tocLines = buildToc(doc.groups, doc.endpoints);
    if (tocLines.length > 0) {
      chunks.push("\n## Table of Contents\n\n");
      chunks.push(`${tocLines.join("\n")}\n\n`);
    }
  }

  chunks.push(renderAuthList(doc.auth, redactSecrets, stats));

  for (const endpoint of doc.endpoints) {
    chunks.push(renderEndpoint(endpoint, redactSecrets, stats));
  }

  for (const group of doc.groups) {
    chunks.push(renderGroup(group, 1, redactSecrets, stats));
  }

  if (options.footer !== false) {
    chunks.push(FOOTER);
  }

  return chunks.join("");
}
