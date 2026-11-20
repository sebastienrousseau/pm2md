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
  ConvertStats,
} from "../ir/types";

const MAX_FOLDER_DEPTH = 32;

export type PostmanDescription =
  | string
  | {
      content?: string;
      type?: string;
    };

export type PostmanKeyValue = {
  key?: string;
  value?: unknown;
  type?: string;
  description?: PostmanDescription;
  disabled?: boolean;
};

export type PostmanAuth = {
  type: string;
  [key: string]: unknown;
};

export type PostmanUrl =
  | string
  | {
      raw?: string;
      host?: string | string[];
      path?: string | string[];
      query?: PostmanKeyValue[];
      variable?: PostmanKeyValue[];
    };

export type PostmanBody = {
  mode?: string;
  raw?: string;
  formdata?: PostmanKeyValue[];
  urlencoded?: PostmanKeyValue[];
  graphql?: {
    query?: string;
    variables?: string;
  };
  file?: {
    src?: string;
  };
  options?: {
    raw?: {
      language?: string;
    };
  };
};

export type PostmanResponse = {
  name?: string;
  status?: string;
  code?: number | string;
  body?: string;
  header?: PostmanKeyValue[];
};

export type PostmanRequest = {
  description?: PostmanDescription;
  method?: string;
  url?: PostmanUrl;
  body?: PostmanBody;
  auth?: PostmanAuth;
  header?: PostmanKeyValue[];
};

export type PostmanItem = {
  name: string;
  description?: PostmanDescription;
  item?: PostmanItem[];
  request?: PostmanRequest;
  response?: PostmanResponse[];
  auth?: PostmanAuth;
};

export type PostmanCollection = {
  info: {
    name: string;
    description?: PostmanDescription;
    schema?: string;
    version?: string;
  };
  item: PostmanItem[];
  auth?: PostmanAuth;
  variable?: PostmanKeyValue[];
};

/**
 * Extract plain string text from a Postman string or Description object.
 */
export function extractPostmanDescription(
  description?: PostmanDescription
): string {
  if (!description) {
    return "";
  }
  if (typeof description === "string") {
    return description;
  }
  return typeof description.content === "string" ? description.content : "";
}

function parseAuth(auth?: PostmanAuth): ApiAuthRequirement[] | undefined {
  if (!auth || !auth.type) {
    return undefined;
  }
  const rawEntries = Array.isArray(auth[auth.type]) ?
    (auth[auth.type] as PostmanKeyValue[]) :
    [];
  return [
    {
      type: auth.type,
      entries: rawEntries.map((entry) => ({
        key: entry.key ?? "",
        value: entry.value !== undefined ? String(entry.value) : "",
        type: entry.type,
      })),
    },
  ];
}

function mapKeyValues(items?: PostmanKeyValue[]): ApiParameter[] {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .filter((entry) => entry && !entry.disabled)
    .map((entry) => ({
      name: entry.key ?? "",
      value: entry.value !== undefined ? String(entry.value) : "",
      type: entry.type,
      description: extractPostmanDescription(entry.description) || undefined,
    }));
}

function parseBody(body?: PostmanBody): ApiRequestBody | undefined {
  if (!body || !body.mode) {
    return undefined;
  }
  if (body.mode === "raw" && body.raw !== undefined) {
    return {
      mode: "raw",
      language: body.options?.raw?.language ?? "json",
      raw: String(body.raw),
    };
  }
  if (body.mode === "formdata" && Array.isArray(body.formdata)) {
    return {
      mode: "formdata",
      fields: mapKeyValues(body.formdata),
    };
  }
  if (body.mode === "urlencoded" && Array.isArray(body.urlencoded)) {
    return {
      mode: "urlencoded",
      fields: mapKeyValues(body.urlencoded).map((field) => ({
        ...field,
        type: field.type ?? "text",
      })),
    };
  }
  if (body.mode === "graphql" && body.graphql) {
    return {
      mode: "graphql",
      graphql: {
        query: body.graphql.query,
        variables: body.graphql.variables,
      },
    };
  }
  if (body.mode === "file" && body.file?.src) {
    return {
      mode: "file",
      fileSrc: body.file.src,
    };
  }
  return undefined;
}

function parseResponses(responses?: PostmanResponse[]): ApiResponse[] {
  if (!Array.isArray(responses)) {
    return [];
  }
  return responses
    .filter((res) => Boolean(res))
    .map((res) => ({
      name: res.name,
      code: res.code,
      status: res.status,
      body: res.body !== undefined ? String(res.body) : undefined,
      language: "json",
      headers: mapKeyValues(res.header),
    }));
}

function parseEndpoint(
  item: PostmanItem,
  tags: string[],
  index: number
): ApiEndpoint {
  const req = item.request;
  let rawUrl = "";
  if (req?.url) {
    rawUrl = typeof req.url === "string" ? req.url : req.url.raw ?? "";
  }

  const urlObj = req?.url && typeof req.url !== "string" ? req.url : undefined;

  return {
    id: `${tags.join("/") || "root"}#${index}`,
    name: item.name ?? "Unnamed",
    method: req?.method ?? "",
    path: rawUrl,
    description: extractPostmanDescription(req?.description) || undefined,
    tags,
    auth: parseAuth(req?.auth),
    headers: mapKeyValues(req?.header),
    pathParams: mapKeyValues(urlObj?.variable),
    queryParams: mapKeyValues(urlObj?.query),
    requestBody: parseBody(req?.body),
    responses: parseResponses(item.response),
  };
}

function parseItems(
  items: PostmanItem[],
  depth: number,
  tags: string[],
  stats: ConvertStats
): { groups: ApiGroup[]; endpoints: ApiEndpoint[] } {
  const groups: ApiGroup[] = [];
  const endpoints: ApiEndpoint[] = [];

  if (!Array.isArray(items)) {
    return { groups, endpoints };
  }

  if (depth > MAX_FOLDER_DEPTH) {
    stats.warnings.push(
      `Maximum folder depth (${MAX_FOLDER_DEPTH}) exceeded; deeper items were skipped.`
    );
    return { groups, endpoints };
  }

  items.forEach((item, index) => {
    if (!item) {
      return;
    }
    if (Array.isArray(item.item)) {
      stats.folders += 1;
      const nextTags = [...tags, item.name ?? "Folder"];
      const children = parseItems(item.item, depth + 1, nextTags, stats);
      groups.push({
        name: item.name ?? "Folder",
        description: extractPostmanDescription(item.description) || undefined,
        auth: parseAuth(item.auth),
        endpoints: children.endpoints,
        groups: children.groups,
      });
    } else {
      stats.endpoints += 1;
      endpoints.push(parseEndpoint(item, tags, index));
    }
  });

  return { groups, endpoints };
}

/**
 * Parse a Postman Collection v2.0/v2.1 object into the canonical `ApiDocument` IR.
 */
export function parsePostmanToIR(collection: PostmanCollection): {
  ir: ApiDocument;
  stats: ConvertStats;
} {
  if (
    !collection ||
    typeof collection !== "object" ||
    !collection.info ||
    !collection.info.name
  ) {
    throw new Error(
      "Invalid Postman collection: missing required 'info.name' field."
    );
  }

  const stats: ConvertStats = {
    folders: 0,
    endpoints: 0,
    redactedSecrets: 0,
    warnings: [],
  };

  const root = parseItems(collection.item ?? [], 1, [], stats);

  const ir: ApiDocument = {
    sourceFormat: "postman-v2",
    title: collection.info.name,
    version: collection.info.version,
    description:
      extractPostmanDescription(collection.info.description) || undefined,
    servers: [],
    securitySchemes: {},
    variables: mapKeyValues(collection.variable).map((v) => ({
      key: v.name,
      value: v.value,
      description: v.description,
    })),
    auth: parseAuth(collection.auth),
    groups: root.groups,
    endpoints: root.endpoints,
  };

  return { ir, stats };
}
