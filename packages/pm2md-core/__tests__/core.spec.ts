/* eslint-disable import/no-unresolved */
import fs from "fs";
import path from "path";
import {
  convertPostmanToMarkdown,
  escapeTableCell,
  formatCodeBlock,
  parsePostmanToIR,
  redactValue,
  renderMarkdownFromIR,
} from "../src/index";

describe("pm2md-core security & escaping helpers", () => {
  test("redactValue masks sensitive keys unless placeholder or disabled", () => {
    expect(redactValue("Authorization", "Bearer abc123", true)).toEqual({
      value: "[REDACTED]",
      redacted: true,
    });
    expect(redactValue("Authorization", "{{bearer_token}}", true)).toEqual({
      value: "{{bearer_token}}",
      redacted: false,
    });
    expect(redactValue("Authorization", "Bearer abc123", false)).toEqual({
      value: "Bearer abc123",
      redacted: false,
    });
    expect(redactValue("Accept", "application/json", true)).toEqual({
      value: "application/json",
      redacted: false,
    });
  });

  test("escapeTableCell escapes backslashes, pipes, and collapses newlines", () => {
    expect(escapeTableCell("a\\b | c\nd\r\ne")).toBe("a\\\\b \\| c<br/>d<br/>e");
  });

  test("formatCodeBlock dynamically sizes fences around nested backticks", () => {
    const out = formatCodeBlock("const x = ```nested```;", "ts");
    expect(out.startsWith("````ts\n")).toBe(true);
    expect(out.endsWith("\n````\n")).toBe(true);
  });
});

describe("parsePostmanToIR & renderMarkdownFromIR", () => {
  test("parses Postman collection into canonical IR and renders Markdown", () => {
    const { ir, stats } = parsePostmanToIR({
      info: {
        name: "Demo API",
        description: { content: "Object description" },
      },
      auth: {
        type: "bearer",
        bearer: [{ key: "token", value: "live-secret-123", type: "string" }],
      },
      item: [
        {
          name: "Users",
          item: [
            {
              name: "Get User",
              request: {
                method: "GET",
                url: {
                  raw: "https://api.example.com/users/:id?active=true",
                  variable: [{ key: "id", value: "42", description: "User ID" }],
                  query: [{ key: "active", value: "true" }],
                },
                header: [
                  { key: "Accept", value: "application/json" },
                  { key: "X-API-Key", value: "hardcoded-key" },
                ],
              },
              response: [
                { code: 200, status: "OK", name: "Success", body: "{\"id\":42}" },
                { code: 404, status: "Not Found", body: "{\"error\":\"missing\"}" },
              ],
            },
          ],
        },
      ],
    });

    expect(ir.sourceFormat).toBe("postman-v2");
    expect(stats.folders).toBe(1);
    expect(stats.endpoints).toBe(1);

    const md = renderMarkdownFromIR(ir, { toc: true, footer: false }, stats);
    expect(stats.redactedSecrets).toBe(2);
    expect(md).toContain("## Table of Contents");
    expect(md).toContain("# 📁 Collection: Users");
    expect(md).toContain("|Header|Value|");
    expect(md).toContain("|X-API-Key|[REDACTED]|");
    expect(md).toContain("|token|[REDACTED]|string|");
    expect(md).toContain("### Path Variables");
    expect(md).toContain("### Query Params");
    expect(md).toContain("### Response: 200 OK (Success)");
    expect(md).toContain("### Response: 404 Not Found");
  });

  test("preserves secrets when redactSecrets is false", () => {
    const { markdown, stats } = convertPostmanToMarkdown(
      {
        info: { name: "Unredacted" },
        item: [
          {
            name: "Call",
            request: {
              method: "GET",
              header: [{ key: "Authorization", value: "Bearer raw-token" }],
            },
          },
        ],
      },
      { redactSecrets: false, footer: false }
    );

    expect(stats.redactedSecrets).toBe(0);
    expect(markdown).toContain("|Authorization|Bearer raw-token|");
  });

  test("converts Twitter_API_v2.postman_collection.json cleanly", () => {
    const raw = fs.readFileSync(
      path.resolve(__dirname, "../../../__tests__/Twitter_API_v2.postman_collection.json"),
      "utf8"
    );
    const { markdown, stats } = convertPostmanToMarkdown(JSON.parse(raw));
    expect(stats.folders).toBeGreaterThan(5);
    expect(stats.endpoints).toBeGreaterThan(20);
    expect(markdown).toContain("# Project: Twitter API v2");
  });
});
