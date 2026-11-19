// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import {
  ApiAuthRequirement,
  ApiDocument,
  ApiEndpoint,
  ApiGroup,
  ApiParameter,
  ApiRequestBody,
  ApiResponse,
  ApiSecurityScheme,
  ApiServer,
  ConvertStats,
  SourceFormat,
} from "../ir/types";
import { dereferenceObject } from "./ref-resolver";

const HTTP_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
  "trace",
] as const;

type UnknownRecord = Record<string, unknown>;

function asRecord(val: unknown): UnknownRecord | undefined {
  return val && typeof val === "object" && !Array.isArray(val) ?
    (val as UnknownRecord) :
    undefined;
}

function asString(val: unknown): string | undefined {
  return typeof val === "string" ? val : undefined;
}

function synthesizeExample(schema: unknown, depth = 0): unknown {
  if (depth > 8) {
    return {};
  }
  const s = asRecord(schema);
  if (!s) {
    return undefined;
  }
  if (s.$circularRef) {
    return {};
  }
  if (s.example !== undefined) {
    return s.example;
  }
  if (s.default !== undefined) {
    return s.default;
  }
  if (Array.isArray(s.enum) && s.enum.length > 0) {
    return s.enum[0];
  }
  if (Array.isArray(s.allOf) && s.allOf.length > 0) {
    const merged: UnknownRecord = {};
    for (const part of s.allOf) {
      const sample = asRecord(synthesizeExample(part, depth + 1));
      if (sample) {
        Object.assign(merged, sample);
      }
    }
    return merged;
  }
  if (Array.isArray(s.oneOf) && s.oneOf.length > 0) {
    return synthesizeExample(s.oneOf[0], depth + 1);
  }
  if (Array.isArray(s.anyOf) && s.anyOf.length > 0) {
    return synthesizeExample(s.anyOf[0], depth + 1);
  }

  const schemaType = asString(s.type);
  if (schemaType === "object" || s.properties) {
    const props = asRecord(s.properties) ?? {};
    const out: UnknownRecord = {};
    for (const [key, propSchema] of Object.entries(props)) {
      out[key] = synthesizeExample(propSchema, depth + 1);
    }
    return out;
  }
  if (schemaType === "array" || s.items) {
    const itemSample = synthesizeExample(s.items, depth + 1);
    return itemSample !== undefined ? [itemSample] : [];
  }
  if (schemaType === "integer" || schemaType === "number") {
    return 0;
  }
  if (schemaType === "boolean") {
    return true;
  }
  if (schemaType === "string") {
    if (s.format === "date-time") {
      return "2026-01-01T00:00:00Z";
    }
    if (s.format === "date") {
      return "2026-01-01";
    }
    if (s.format === "uuid") {
      return "00000000-0000-0000-0000-000000000000";
    }
    if (s.format === "email") {
      return "user@example.com";
    }
    return "string";
  }
  return {};
}

function extractServers(
  doc: UnknownRecord,
  format: SourceFormat
): ApiServer[] {
  if (format === "swagger-2") {
    const host = asString(doc.host);
    const basePath = asString(doc.basePath) ?? "";
    const schemes = Array.isArray(doc.schemes) ?
      doc.schemes.filter((s): s is string => typeof s === "string") :
      ["https"];
    if (!host) {
      return basePath ? [{ url: basePath }] : [];
    }
    return schemes.map((scheme) => ({
      url: `${scheme}://${host}${basePath}`,
    }));
  }

  if (Array.isArray(doc.servers)) {
    return doc.servers
      .map((entry) => asRecord(entry))
      .filter((entry): entry is UnknownRecord => Boolean(entry?.url))
      .map((entry) => ({
        url: String(entry.url),
        description: asString(entry.description),
      }));
  }

  return [];
}

function extractSecuritySchemes(
  doc: UnknownRecord,
  format: SourceFormat
): Record<string, ApiSecurityScheme> {
  const rawSchemes =
    format === "swagger-2" ?
      asRecord(doc.securityDefinitions) :
      asRecord(asRecord(doc.components)?.securitySchemes);

  if (!rawSchemes) {
    return {};
  }

  const result: Record<string, ApiSecurityScheme> = {};
  for (const [name, value] of Object.entries(rawSchemes)) {
    const scheme = asRecord(value);
    if (!scheme) {
      continue;
    }
    result[name] = {
      type: asString(scheme.type) ?? "unknown",
      in: asString(scheme.in),
      name: asString(scheme.name),
      scheme: asString(scheme.scheme),
      bearerFormat: asString(scheme.bearerFormat),
      description: asString(scheme.description),
    };
  }
  return result;
}

function mapSecurityRequirements(
  rawSecurity: unknown,
  schemes: Record<string, ApiSecurityScheme>
): ApiAuthRequirement[] | undefined {
  if (!Array.isArray(rawSecurity) || rawSecurity.length === 0) {
    return undefined;
  }

  const reqs: ApiAuthRequirement[] = [];
  for (const item of rawSecurity) {
    const rec = asRecord(item);
    if (!rec) {
      continue;
    }
    for (const [schemeName, scopes] of Object.entries(rec)) {
      const def = schemes[schemeName];
      const authType = def?.scheme ?? def?.type ?? schemeName;
      const entries = [];
      if (def?.name) {
        entries.push({
          key: def.name,
          value: `{{${schemeName}}}`,
          type: def.in ?? def.type,
        });
      } else if (Array.isArray(scopes) && scopes.length > 0) {
        entries.push({
          key: "scopes",
          value: scopes.map(String).join(", "),
          type: "oauth2",
        });
      } else {
        entries.push({
          key: schemeName,
          value: `{{${schemeName}}}`,
          type: def?.type ?? "string",
        });
      }
      reqs.push({ type: authType, entries });
    }
  }
  return reqs.length > 0 ? reqs : undefined;
}

function mergeParameters(
  pathParams: unknown,
  opParams: unknown
): UnknownRecord[] {
  const merged = new Map<string, UnknownRecord>();
  const addAll = (list: unknown) => {
    if (!Array.isArray(list)) {
      return;
    }
    for (const item of list) {
      const rec = asRecord(item);
      if (rec && typeof rec.name === "string") {
        const key = `${String(rec.in ?? "")}:${rec.name}`;
        merged.set(key, rec);
      }
    }
  };
  addAll(pathParams);
  addAll(opParams);
  return Array.from(merged.values());
}

function extractRequestBody(
  operation: UnknownRecord,
  params: UnknownRecord[],
  format: SourceFormat
): ApiRequestBody | undefined {
  if (format === "swagger-2") {
    const bodyParam = params.find((p) => p.in === "body");
    if (bodyParam) {
      const sample =
        bodyParam.example !== undefined ?
          bodyParam.example :
          synthesizeExample(bodyParam.schema);
      return {
        mode: "raw",
        language: "json",
        raw: JSON.stringify(sample ?? {}, null, 2),
      };
    }

    const formParams = params.filter((p) => p.in === "formData");
    if (formParams.length > 0) {
      return {
        mode: "formdata",
        fields: formParams.map((p) => ({
          name: String(p.name ?? ""),
          value: p.default !== undefined ? String(p.default) : "",
          type: asString(p.type) ?? "string",
          required: Boolean(p.required),
          description: asString(p.description),
        })),
      };
    }
    return undefined;
  }

  const reqBody = asRecord(operation.requestBody);
  const content = asRecord(reqBody?.content);
  if (!content) {
    return undefined;
  }

  const mediaTypes = Object.keys(content);
  const preferred =
    mediaTypes.find((m) => m.includes("json")) ?? mediaTypes[0];
  if (!preferred) {
    return undefined;
  }

  const mediaObj = asRecord(content[preferred]);
  if (preferred.includes("x-www-form-urlencoded")) {
    const props = asRecord(asRecord(mediaObj?.schema)?.properties) ?? {};
    return {
      mode: "urlencoded",
      fields: Object.entries(props).map(([name, prop]) => ({
        name,
        value: "",
        type: asString(asRecord(prop)?.type) ?? "string",
        description: asString(asRecord(prop)?.description),
      })),
    };
  }

  let sample = mediaObj?.example;
  if (sample === undefined && asRecord(mediaObj?.examples)) {
    const firstKey = Object.keys(asRecord(mediaObj?.examples) ?? {})[0];
    if (firstKey) {
      sample = asRecord(asRecord(mediaObj?.examples)?.[firstKey])?.value;
    }
  }
  if (sample === undefined && mediaObj?.schema) {
    sample = synthesizeExample(mediaObj.schema);
  }

  const language = preferred.includes("xml") ?
    "xml" :
    preferred.includes("json") ?
      "json" :
      "text";

  return {
    mode: "raw",
    language,
    raw:
      typeof sample === "string" ?
        sample :
        JSON.stringify(sample ?? {}, null, 2),
  };
}

function extractResponses(
  rawResponses: unknown,
  format: SourceFormat
): ApiResponse[] {
  const rec = asRecord(rawResponses);
  if (!rec) {
    return [];
  }

  const responses: ApiResponse[] = [];
  for (const [code, val] of Object.entries(rec)) {
    const resObj = asRecord(val);
    if (!resObj) {
      continue;
    }

    let bodyStr: string | undefined;
    let language = "json";

    if (format === "swagger-2") {
      if (resObj.schema) {
        const sample = synthesizeExample(resObj.schema);
        bodyStr = JSON.stringify(sample ?? {}, null, 2);
      }
    } else {
      const content = asRecord(resObj.content);
      if (content) {
        const mediaTypes = Object.keys(content);
        const preferred =
          mediaTypes.find((m) => m.includes("json")) ?? mediaTypes[0];
        if (preferred) {
          const mediaObj = asRecord(content[preferred]);
          let sample = mediaObj?.example;
          if (sample === undefined && mediaObj?.schema) {
            sample = synthesizeExample(mediaObj.schema);
          }
          if (sample !== undefined) {
            bodyStr =
              typeof sample === "string" ?
                sample :
                JSON.stringify(sample, null, 2);
          }
          if (preferred.includes("xml")) {
            language = "xml";
          }
        }
      }
    }

    responses.push({
      code,
      status: asString(resObj.description),
      body: bodyStr,
      language,
    });
  }
  return responses;
}

/**
 * Parse a Swagger 2.0 or OpenAPI 3.0/3.1 document into the canonical `ApiDocument` IR.
 */
export function parseOpenApiToIR(
  rawDoc: Record<string, unknown>,
  formatOverride?: "swagger-2" | "openapi-3.0" | "openapi-3.1"
): { ir: ApiDocument; stats: ConvertStats } {
  const doc = dereferenceObject<UnknownRecord>(rawDoc, rawDoc);
  const info = asRecord(doc.info);

  if (!info || !asString(info.title)) {
    throw new Error(
      "Invalid Swagger/OpenAPI specification: missing required 'info.title' field."
    );
  }

  let sourceFormat: SourceFormat = formatOverride ?? "openapi-3.0";
  if (!formatOverride) {
    if (doc.swagger === "2.0") {
      sourceFormat = "swagger-2";
    } else if (
      typeof doc.openapi === "string" &&
      doc.openapi.startsWith("3.1")
    ) {
      sourceFormat = "openapi-3.1";
    }
  }

  const stats: ConvertStats = {
    folders: 0,
    endpoints: 0,
    redactedSecrets: 0,
    warnings: [],
  };

  const servers = extractServers(doc, sourceFormat);
  const securitySchemes = extractSecuritySchemes(doc, sourceFormat);
  const baseUrl = servers[0]?.url ?? "";

  const tagDescriptions = new Map<string, string>();
  if (Array.isArray(doc.tags)) {
    for (const t of doc.tags) {
      const tagObj = asRecord(t);
      if (tagObj && asString(tagObj.name) && asString(tagObj.description)) {
        tagDescriptions.set(
          String(tagObj.name),
          String(tagObj.description)
        );
      }
    }
  }

  const groupMap = new Map<string, ApiGroup>();
  const untaggedEndpoints: ApiEndpoint[] = [];
  const pathsObj = asRecord(doc.paths) ?? {};

  for (const [pathKey, rawPathItem] of Object.entries(pathsObj)) {
    const pathItem = asRecord(rawPathItem);
    if (!pathItem) {
      continue;
    }

    for (const method of HTTP_METHODS) {
      const operation = asRecord(pathItem[method]);
      if (!operation) {
        continue;
      }

      stats.endpoints += 1;
      const mergedParams = mergeParameters(
        pathItem.parameters,
        operation.parameters
      );

      const toParam = (p: UnknownRecord): ApiParameter => ({
        name: String(p.name ?? ""),
        value:
          p.example !== undefined ?
            String(p.example) :
            p.default !== undefined ?
              String(p.default) :
              "",
        type:
          asString(p.type) ?? asString(asRecord(p.schema)?.type) ?? undefined,
        required: Boolean(p.required),
        description: asString(p.description),
      });

      const headers = mergedParams
        .filter((p) => p.in === "header")
        .map(toParam);
      const pathParams = mergedParams
        .filter((p) => p.in === "path")
        .map(toParam);
      const queryParams = mergedParams
        .filter((p) => p.in === "query")
        .map(toParam);

      const tags = Array.isArray(operation.tags) ?
        operation.tags.filter((t): t is string => typeof t === "string") :
        [];

      const endpoint: ApiEndpoint = {
        id: asString(operation.operationId) ?? `${method.toUpperCase()} ${pathKey}`,
        name:
          asString(operation.summary) ??
          asString(operation.operationId) ??
          `${method.toUpperCase()} ${pathKey}`,
        method: method.toUpperCase(),
        path: baseUrl ? `${baseUrl}${pathKey}` : pathKey,
        summary: asString(operation.summary),
        description: asString(operation.description),
        deprecated: Boolean(operation.deprecated),
        tags,
        auth: mapSecurityRequirements(operation.security, securitySchemes),
        headers,
        pathParams,
        queryParams,
        requestBody: extractRequestBody(operation, mergedParams, sourceFormat),
        responses: extractResponses(operation.responses, sourceFormat),
      };

      if (tags.length === 0) {
        untaggedEndpoints.push(endpoint);
      } else {
        const primaryTag = tags[0];
        let group = groupMap.get(primaryTag);
        if (!group) {
          group = {
            name: primaryTag,
            description: tagDescriptions.get(primaryTag),
            endpoints: [],
            groups: [],
          };
          groupMap.set(primaryTag, group);
          stats.folders += 1;
        }
        group.endpoints.push(endpoint);
      }
    }
  }

  const ir: ApiDocument = {
    sourceFormat,
    title: String(info.title),
    version: asString(info.version),
    description: asString(info.description),
    servers,
    securitySchemes,
    variables: [],
    auth: mapSecurityRequirements(doc.security, securitySchemes),
    groups: Array.from(groupMap.values()),
    endpoints: untaggedEndpoints,
  };

  return { ir, stats };
}
