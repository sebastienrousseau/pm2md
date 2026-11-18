/* eslint-disable import/no-unresolved */
import {
  escapeTableCell,
  extractDescription,
  formatCodeBlock,
  readAuthorization,
  readFormDataBody,
  readItems,
  readMethods,
  readPathVariables,
  readQueryParams,
  readRequestOptions,
  readResponse,
} from "../../src/util/read";

describe("escapeTableCell", () => {
  test("escapes pipes and collapses newlines", () => {
    expect(escapeTableCell("a | b\nc\r\nd")).toBe("a \\| b<br/>c<br/>d");
    expect(escapeTableCell(undefined)).toBe("");
    expect(escapeTableCell(null)).toBe("");
  });
});

describe("extractDescription", () => {
  test("handles string and Postman Description objects", () => {
    expect(extractDescription("hello")).toBe("hello");
    expect(extractDescription({ content: "from object", type: "text/markdown" })).toBe(
      "from object"
    );
    expect(extractDescription(undefined)).toBe("");
  });
});

describe("formatCodeBlock", () => {
  test("expands fence length when content contains triple backticks", () => {
    const output = formatCodeBlock("const a = ```nested```;", "ts");
    expect(output.startsWith("````ts\n")).toBe(true);
    expect(output.endsWith("\n````\n")).toBe(true);
  });
});

describe("readAuthorization", () => {
  test("renders bearer and apikey auth tables", () => {
    const bearerMd = readAuthorization({
      type: "bearer",
      bearer: [{ key: "token", value: "{{token}}", type: "string" }],
    });
    expect(bearerMd).toContain("### 🔑 Authentication bearer");
    expect(bearerMd).toContain("|token|{{token}}|string|");

    const apiKeyMd = readAuthorization({
      type: "apikey",
      apikey: [{ key: "X-API-Key", value: "secret", type: "string" }],
    });
    expect(apiKeyMd).toContain("### 🔑 Authentication apikey");
    expect(apiKeyMd).toContain("|X-API-Key|secret|string|");
  });

  test("renders noauth cleanly", () => {
    expect(readAuthorization({ type: "noauth" })).toContain(
      "No authentication required."
    );
  });
});

describe("readRequestOptions", () => {
  test("emits a single Headers heading and table for multiple headers", () => {
    const md = readRequestOptions({
      header: [
        { key: "Content-Type", value: "application/json" },
        { key: "Accept", value: "application/json" },
        { key: "X-Disabled", value: "ignored", disabled: true },
      ],
    });
    expect(md.match(/### Headers/g)?.length).toBe(1);
    expect(md).toContain("|Header|Value|");
    expect(md).toContain("|Content-Type|application/json|");
    expect(md).toContain("|Accept|application/json|");
    expect(md).not.toContain("X-Disabled");
  });
});

describe("readQueryParams and readPathVariables", () => {
  test("renders query params and path variables", () => {
    const url = {
      raw: "https://api.example.com/users/:id?active=true",
      query: [{ key: "active", value: "true" }],
      variable: [{ key: "id", value: "42", description: "User ID" }],
    };
    expect(readQueryParams(url)).toContain("|active|true|");
    expect(readPathVariables(url)).toContain("|id|42|User ID|");
  });
});

describe("readFormDataBody", () => {
  test("renders raw, formdata, urlencoded, graphql, and file bodies", () => {
    expect(
      readFormDataBody({
        mode: "raw",
        raw: "<xml/>",
        options: { raw: { language: "xml" } },
      })
    ).toContain("```xml\n<xml/>\n```");

    expect(
      readFormDataBody({
        mode: "formdata",
        formdata: [{ key: "file", value: 123, type: "text" }],
      })
    ).toContain("|file|123|text|");

    expect(
      readFormDataBody({
        mode: "urlencoded",
        urlencoded: [{ key: "grant_type", value: "client_credentials" }],
      })
    ).toContain("|grant_type|client_credentials|text|");

    expect(
      readFormDataBody({
        mode: "graphql",
        graphql: { query: "{ viewer { login } }" },
      })
    ).toContain("```graphql\n{ viewer { login } }\n```");

    expect(
      readFormDataBody({
        mode: "file",
        file: { src: "/tmp/payload.bin" },
      })
    ).toContain("File: `/tmp/payload.bin`");
  });
});

describe("readResponse", () => {
  test("renders all saved response examples", () => {
    const md = readResponse([
      { code: 200, status: "OK", name: "Success", body: "{\"ok\":true}" },
      { code: 404, status: "Not Found", name: "Missing", body: "{\"err\":1}" },
    ]);
    expect(md).toContain("### Response: 200 OK (Success)");
    expect(md).toContain("### Response: 404 Not Found (Missing)");
  });
});

describe("readMethods and readItems", () => {
  test("handles string URLs, object descriptions, and clamps deep folder headings", () => {
    const md = readMethods({
      name: "Get User",
      request: {
        method: "GET",
        url: "https://api.example.com/users",
        description: { content: "Fetch user list" },
      },
      response: [],
    });
    expect(md).toContain("## End-point: Get User");
    expect(md).toContain("Fetch user list");
    expect(md).toContain("https://api.example.com/users");

    let nested = [{ name: "Leaf", request: { method: "GET" } }] as any;
    for (let i = 0; i < 8; i++) {
      nested = [{ name: `Folder ${i}`, item: nested }];
    }
    const nestedMd = readItems(nested);
    expect(nestedMd).not.toContain("####### ");
    expect(nestedMd).toContain("###### 📁 Collection:");
  });
});
