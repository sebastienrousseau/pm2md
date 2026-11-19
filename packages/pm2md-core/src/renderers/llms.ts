// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import { ApiDocument, ApiEndpoint, ApiGroup } from "../ir/types";

function collectEndpoints(
  group: ApiGroup,
  out: { group: string; endpoint: ApiEndpoint }[]
): void {
  for (const ep of group.endpoints) {
    out.push({ group: group.name, endpoint: ep });
  }
  for (const child of group.groups) {
    collectEndpoints(child, out);
  }
}

/**
 * Render a concise, token-efficient `llms.txt` index for AI coding agents.
 */
export function renderLlmsTxt(doc: ApiDocument): string {
  const lines: string[] = [`# ${doc.title}`];

  if (doc.version) {
    lines.push("", `Version: ${doc.version}`);
  }
  if (doc.description) {
    lines.push("", `> ${doc.description.replace(/\r?\n/g, "\n> ")}`);
  }

  if (doc.servers.length > 0) {
    lines.push("", "## Base URLs", "");
    for (const server of doc.servers) {
      lines.push(
        server.description ?
          `- \`${server.url}\`: ${server.description}` :
          `- \`${server.url}\``
      );
    }
  }

  const all: { group: string; endpoint: ApiEndpoint }[] = doc.endpoints.map(
    (ep) => ({ group: "General", endpoint: ep })
  );
  for (const group of doc.groups) {
    collectEndpoints(group, all);
  }

  if (all.length > 0) {
    lines.push("", "## Endpoints", "");
    for (const { group, endpoint } of all) {
      const summary = endpoint.summary ?? endpoint.name;
      lines.push(
        `- \`${endpoint.method || "REQUEST"} ${endpoint.path || "/"}\` (${group}): ${summary}`
      );
    }
  }

  lines.push("");
  return lines.join("\n");
}

/**
 * Render a compact, agent-optimized `llms-full.txt` Markdown document.
 */
export function renderLlmsFullTxt(doc: ApiDocument): string {
  const lines: string[] = [`# ${doc.title}`];
  if (doc.version) {
    lines.push(`Version: ${doc.version}`);
  }
  if (doc.description) {
    lines.push("", doc.description);
  }

  const renderEp = (ep: ApiEndpoint) => {
    lines.push(
      "",
      `## ${ep.method || "REQUEST"} ${ep.path || ep.name}`,
      `Name: ${ep.name}`
    );
    if (ep.description) {
      lines.push(ep.description);
    }
    if (ep.pathParams.length > 0) {
      lines.push(
        `Path Params: ${ep.pathParams.map((p) => `${p.name} (${p.type ?? "string"})`).join(", ")}`
      );
    }
    if (ep.queryParams.length > 0) {
      lines.push(
        `Query Params: ${ep.queryParams.map((q) => `${q.name}${q.required ? "*" : ""}`).join(", ")}`
      );
    }
    if (ep.requestBody?.raw) {
      lines.push("Request Body:", "```json", ep.requestBody.raw, "```");
    }
    if (ep.responses.length > 0) {
      const codes = ep.responses
        .map((r) => `${r.code ?? "200"}${r.status ? ` (${r.status})` : ""}`)
        .join(", ");
      lines.push(`Responses: ${codes}`);
    }
  };

  for (const ep of doc.endpoints) {
    renderEp(ep);
  }

  const walkGroup = (group: ApiGroup) => {
    for (const ep of group.endpoints) {
      renderEp(ep);
    }
    for (const child of group.groups) {
      walkGroup(child);
    }
  };

  for (const group of doc.groups) {
    walkGroup(group);
  }

  lines.push("");
  return lines.join("\n");
}
