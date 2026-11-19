/* eslint-disable import/no-unresolved */
import {
  convertSpecToLlmsTxt,
  convertSpecToMarkdown,
  dereferenceObject,
  detectSpecFormat,
  parseSpecText,
} from "../src/index";

const SWAGGER_2_JSON = {
  swagger: "2.0",
  info: { title: "Petstore v2", version: "1.0.0", description: "Legacy Swagger" },
  host: "api.petstore.io",
  basePath: "/v2",
  schemes: ["https"],
  securityDefinitions: {
    apiKeyAuth: { type: "apiKey", name: "api_key", in: "header" },
  },
  definitions: {
    Pet: {
      type: "object",
      properties: {
        id: { type: "integer" },
        name: { type: "string", example: "Rex" },
      },
    },
  },
  paths: {
    "/pets/{petId}": {
      get: {
        tags: ["Pets"],
        summary: "Find pet by ID",
        parameters: [
          { name: "petId", in: "path", required: true, type: "integer" },
          { name: "verbose", in: "query", type: "boolean" },
        ],
        security: [{ apiKeyAuth: [] }],
        responses: {
          "200": {
            description: "successful operation",
            schema: { $ref: "#/definitions/Pet" },
          },
        },
      },
    },
  },
};

const OPENAPI_31_YAML = `
openapi: 3.1.0
info:
  title: Orders API
  version: 2.1.0
  description: Order management service
servers:
  - url: https://orders.example.com/v1
    description: Production
tags:
  - name: Orders
    description: Order lifecycle endpoints
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
  schemas:
    Node:
      type: object
      properties:
        id:
          type: string
          format: uuid
        next:
          $ref: "#/components/schemas/Node"
paths:
  /orders:
    post:
      tags:
        - Orders
      summary: Create order
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Node"
      responses:
        "201":
          description: Created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Node"
`;

describe("Swagger 2.0, OpenAPI 3.1 YAML, $ref cycle safety, and llms.txt", () => {
  test("detectSpecFormat identifies swagger-2, openapi-3.1, and postman-v2", () => {
    expect(detectSpecFormat(SWAGGER_2_JSON)).toBe("swagger-2");
    expect(detectSpecFormat(parseSpecText(OPENAPI_31_YAML))).toBe("openapi-3.1");
    expect(detectSpecFormat({ info: { name: "PM" }, item: [] })).toBe("postman-v2");
  });

  test("dereferenceObject handles circular $ref without infinite recursion", () => {
    const parsed = parseSpecText(OPENAPI_31_YAML);
    const resolved = dereferenceObject<Record<string, unknown>>(parsed, parsed);
    expect(resolved).toBeDefined();
  });

  test("convertSpecToMarkdown converts Swagger 2.0 JSON", () => {
    const { markdown, ir, stats } = convertSpecToMarkdown(SWAGGER_2_JSON, {
      footer: false,
    });
    expect(ir.sourceFormat).toBe("swagger-2");
    expect(stats.endpoints).toBe(1);
    expect(markdown).toContain("# Project: Petstore v2");
    expect(markdown).toContain("# 📁 Collection: Pets");
    expect(markdown).toContain("## End-point: Find pet by ID");
    expect(markdown).toContain("https://api.petstore.io/v2/pets/{petId}");
    expect(markdown).toContain("### Path Variables");
    expect(markdown).toContain("### Response: 200 successful operation");
    expect(markdown).toContain("\"name\": \"Rex\"");
  });

  test("convertSpecToMarkdown converts OpenAPI 3.1 YAML with circular schemas", () => {
    const { markdown, ir } = convertSpecToMarkdown(OPENAPI_31_YAML, {
      toc: true,
      footer: false,
    });
    expect(ir.sourceFormat).toBe("openapi-3.1");
    expect(markdown).toContain("# Project: Orders API");
    expect(markdown).toContain("## Table of Contents");
    expect(markdown).toContain("https://orders.example.com/v1/orders");
    expect(markdown).toContain("### Body (**raw**)");
    expect(markdown).toContain("00000000-0000-0000-0000-000000000000");
  });

  test("convertSpecToLlmsTxt emits concise llms.txt and llms-full.txt", () => {
    const indexRes = convertSpecToLlmsTxt(OPENAPI_31_YAML, { full: false });
    expect(indexRes.markdown).toContain("# Orders API");
    expect(indexRes.markdown).toContain("## Base URLs");
    expect(indexRes.markdown).toContain(
      "- `POST https://orders.example.com/v1/orders` (Orders): Create order"
    );

    const fullRes = convertSpecToLlmsTxt(OPENAPI_31_YAML, { full: true });
    expect(fullRes.markdown).toContain(
      "## POST https://orders.example.com/v1/orders"
    );
    expect(fullRes.markdown).toContain("Responses: 201 (Created)");
  });
});
