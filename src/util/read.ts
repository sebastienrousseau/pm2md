// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import * as types from "../typings/types";

const MAX_FOLDER_DEPTH = 32;

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
 * Extract plain string text from a Postman string or Description object.
 */
export function extractDescription(
  description?: types.PostmanDescription
): string {
  if (!description) {
    return "";
  }
  if (typeof description === "string") {
    return description;
  }
  return typeof description.content === "string" ? description.content : "";
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

function renderKeyValueTable(
  heading: string,
  columns: [string, string] | [string, string, string],
  rows: string[][]
): string {
  if (rows.length === 0) {
    return "";
  }
  const lines: string[] = [
    heading,
    "",
    `|${columns.join("|")}|`,
    `|${columns.map(() => "---").join("|")}|`,
  ];
  for (const row of rows) {
    lines.push(`|${row.map(escapeTableCell).join("|")}|`);
  }
  lines.push("", "");
  return lines.join("\n");
}

/**
 * Read auth section for a method.
 * @param {object} data - Auth data object
 * @returns {string} Markdown string for auth section
 */
export function readAuthorization(data?: types.PostmanAuth): string {
  if (!data || !data.type) {
    return "";
  }

  const entries = Array.isArray(data[data.type]) ?
    (data[data.type] as types.PostmanKeyValue[]) :
    [];

  if (data.type === "noauth") {
    return `### 🔑 Authentication ${data.type}\n\nNo authentication required.\n\n`;
  }

  const rows = entries.map((entry) => [
    entry.key ?? "",
    entry.value !== undefined ? String(entry.value) : "",
    entry.type ?? "",
  ]);

  if (rows.length === 0) {
    return `### 🔑 Authentication ${data.type}\n\n`;
  }

  return renderKeyValueTable(
    `### 🔑 Authentication ${data.type}`,
    ["Param", "Value", "Type"],
    rows
  );
}

/**
 * Read request headers for a method.
 * @param {object} request - Request data object
 * @returns {string} Markdown string for request headers
 */
export function readRequestOptions(request?: types.jsonRequest): string {
  if (!request || !Array.isArray(request.header) || request.header.length === 0) {
    return "";
  }

  const rows = request.header
    .filter((header) => header && !header.disabled)
    .map((header) => [
      header.key ?? "",
      header.value !== undefined ? String(header.value) : "",
    ]);

  return renderKeyValueTable("### Headers", ["Header", "Value"], rows);
}

/**
 * Read query parameters from a Postman URL object.
 * @param {object} url - URL object
 * @returns {string} Markdown string for query parameters
 */
export function readQueryParams(url?: types.PostmanUrl): string {
  if (!url || typeof url === "string" || !Array.isArray(url.query)) {
    return "";
  }

  const rows = url.query
    .filter((query) => query && !query.disabled)
    .map((query) => [
      query.key ?? "",
      query.value !== undefined ? String(query.value) : "",
    ]);

  return renderKeyValueTable("### Query Params", ["Param", "Value"], rows);
}

/**
 * Read path variables from a Postman URL object.
 * @param {object} url - URL object
 * @returns {string} Markdown string for path variables
 */
export function readPathVariables(url?: types.PostmanUrl): string {
  if (!url || typeof url === "string" || !Array.isArray(url.variable)) {
    return "";
  }

  const rows = url.variable
    .filter((variable) => variable && !variable.disabled)
    .map((variable) => [
      variable.key ?? "",
      variable.value !== undefined ? String(variable.value) : "",
      extractDescription(variable.description),
    ]);

  return renderKeyValueTable(
    "### Path Variables",
    ["Param", "Value", "Description"],
    rows
  );
}

/**
 * Read body objects for a method.
 * @param {object} body - Body data object
 * @returns {string} Markdown string for request body
 */
export function readFormDataBody(body?: types.PostmanBody): string {
  if (!body || !body.mode) {
    return "";
  }

  const lines: string[] = [];

  if (body.mode === "raw" && body.raw !== undefined) {
    const language = body.options?.raw?.language ?? "json";
    lines.push(`### Body (**${body.mode}**)`, "");
    lines.push(formatCodeBlock(String(body.raw), language));
  } else if (body.mode === "formdata" && Array.isArray(body.formdata)) {
    const rows = body.formdata
      .filter((form) => form && !form.disabled)
      .map((form) => [
        form.key ?? "",
        form.value !== undefined ? String(form.value) : "",
        form.type ?? "",
      ]);
    lines.push(
      renderKeyValueTable(
        `### Body ${body.mode}`,
        ["Param", "Value", "Type"],
        rows
      )
    );
  } else if (body.mode === "urlencoded" && Array.isArray(body.urlencoded)) {
    const rows = body.urlencoded
      .filter((field) => field && !field.disabled)
      .map((field) => [
        field.key ?? "",
        field.value !== undefined ? String(field.value) : "",
        field.type ?? "text",
      ]);
    lines.push(
      renderKeyValueTable(
        `### Body ${body.mode}`,
        ["Param", "Value", "Type"],
        rows
      )
    );
  } else if (body.mode === "graphql" && body.graphql) {
    lines.push("### Body (**graphql**)", "");
    if (body.graphql.query) {
      lines.push(formatCodeBlock(body.graphql.query, "graphql"));
    }
    if (body.graphql.variables) {
      lines.push(formatCodeBlock(body.graphql.variables, "json"));
    }
  } else if (body.mode === "file" && body.file?.src) {
    lines.push("### Body (**file**)", "", `File: \`${body.file.src}\``, "");
  }

  return lines.join("\n");
}

/**
 * Read response objects for a method.
 * @param {Array} responses - Response data objects
 * @returns {string} Markdown string for responses
 */
export function readResponse(responses?: types.PostmanResponse[]): string {
  if (!Array.isArray(responses) || responses.length === 0) {
    return "";
  }

  const chunks: string[] = [];
  for (const response of responses) {
    if (!response) {
      continue;
    }
    const statusLabel = [response.code, response.status]
      .filter((part) => part !== undefined && part !== "")
      .join(" ");
    const nameSuffix = response.name ? ` (${response.name})` : "";
    chunks.push(`### Response: ${statusLabel || "Example"}${nameSuffix}\n`);
    if (response.body !== undefined) {
      chunks.push(formatCodeBlock(String(response.body), "json"));
    }
    chunks.push("\n");
  }

  return chunks.join("");
}

/**
 * Read data for a single API method.
 * @param {object} method - Method data object
 * @returns {string} Markdown string for method
 */
export function readMethods(method: types.PostmanItem): string {
  if (!method) {
    return "";
  }

  const chunks: string[] = ["\n", `## End-point: ${method.name ?? "Unnamed"}\n`];

  const description = extractDescription(method.request?.description);
  if (description) {
    chunks.push(`${description}\n`);
  }

  const request = method.request;
  if (request) {
    if (request.method) {
      chunks.push(`### Method: ${request.method}\n`);
    }

    const rawUrl =
      typeof request.url === "string" ? request.url : request.url?.raw;
    if (rawUrl) {
      chunks.push(`> \`\`\`\n> ${rawUrl}\n> \`\`\`\n`);
    }

    chunks.push(readRequestOptions(request));
    chunks.push(readFormDataBody(request.body));
    chunks.push(readPathVariables(request.url));
    chunks.push(readQueryParams(request.url));
    chunks.push(readAuthorization(request.auth));
  }

  if (Array.isArray(method.response) && method.response.length > 0) {
    chunks.push(readResponse(method.response));
  }

  chunks.push("\n");
  return chunks.join("");
}

/**
 * Read all data in a Postman collection.
 * @param {Array} items - Collection items
 * @param {number} folderDeep - Depth of current folder
 * @returns {string} Markdown string for collection items
 */
export function readItems(items: types.PostmanItem[], folderDeep = 1): string {
  if (!Array.isArray(items) || folderDeep > MAX_FOLDER_DEPTH) {
    return "";
  }

  const chunks: string[] = [];
  const headingLevel = "#".repeat(Math.min(Math.max(folderDeep, 1), 6));

  for (const item of items) {
    if (!item) {
      continue;
    }
    if (Array.isArray(item.item)) {
      chunks.push(`${headingLevel} 📁 Collection: ${item.name ?? "Folder"}\n`);
      const folderDesc = extractDescription(item.description);
      if (folderDesc) {
        chunks.push(`${folderDesc}\n`);
      }
      chunks.push(readItems(item.item, folderDeep + 1));
    } else {
      chunks.push(readMethods(item));
    }
  }

  return chunks.join("");
}

export default {
  escapeTableCell,
  extractDescription,
  formatCodeBlock,
  readAuthorization,
  readRequestOptions,
  readFormDataBody,
  readPathVariables,
  readQueryParams,
  readResponse,
  readMethods,
  readItems,
};
