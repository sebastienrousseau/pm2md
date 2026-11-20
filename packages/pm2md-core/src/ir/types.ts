// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

export type SourceFormat =
  | "postman-v2"
  | "swagger-2"
  | "openapi-3.0"
  | "openapi-3.1";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "TRACE"
  | string;

export interface ApiServer {
  url: string;
  description?: string;
}

export interface ApiVariable {
  key: string;
  value?: string;
  description?: string;
}

export interface ApiParameter {
  name: string;
  value?: string;
  type?: string;
  required?: boolean;
  description?: string;
}

export interface ApiAuthEntry {
  key: string;
  value: string;
  type?: string;
}

export interface ApiAuthRequirement {
  type: string;
  entries: ApiAuthEntry[];
}

export interface ApiSecurityScheme {
  type: string;
  in?: string;
  name?: string;
  scheme?: string;
  bearerFormat?: string;
  description?: string;
}

export interface ApiRequestBody {
  mode: "raw" | "formdata" | "urlencoded" | "graphql" | "file" | string;
  language?: string;
  raw?: string;
  fields?: ApiParameter[];
  graphql?: {
    query?: string;
    variables?: string;
  };
  fileSrc?: string;
}

export interface ApiResponse {
  name?: string;
  code?: number | string;
  status?: string;
  body?: string;
  language?: string;
  headers?: ApiParameter[];
}

export interface ApiEndpoint {
  id: string;
  name: string;
  method: HttpMethod;
  path: string;
  summary?: string;
  description?: string;
  deprecated?: boolean;
  tags: string[];
  auth?: ApiAuthRequirement[];
  headers: ApiParameter[];
  pathParams: ApiParameter[];
  queryParams: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses: ApiResponse[];
}

export interface ApiGroup {
  name: string;
  description?: string;
  auth?: ApiAuthRequirement[];
  endpoints: ApiEndpoint[];
  groups: ApiGroup[];
}

export interface ApiDocument {
  sourceFormat: SourceFormat;
  title: string;
  version?: string;
  description?: string;
  servers: ApiServer[];
  securitySchemes: Record<string, ApiSecurityScheme>;
  variables: ApiVariable[];
  auth?: ApiAuthRequirement[];
  groups: ApiGroup[];
  endpoints: ApiEndpoint[];
}

export interface ConvertStats {
  folders: number;
  endpoints: number;
  redactedSecrets: number;
  warnings: string[];
}

export interface RenderOptions {
  footer?: boolean;
  toc?: boolean;
  redactSecrets?: boolean;
}

export interface ConvertResult {
  markdown: string;
  ir: ApiDocument;
  stats: ConvertStats;
}
