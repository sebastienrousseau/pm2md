// Copyright © 2022-2023 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

// Import types for type checking
import * as types from "../typings/types";
import { jsonResponse } from "../typings/types";

/**
 * Read auth section for a method
 * @param {object} data - Auth data object
 * @returns {string} Markdown string for auth section
 */
export function readAuthorization(data: types.jsonAuth) {
  // Initialize empty markdown string
  let markdown = "";

  // Check if auth data exists
  if (data) {
    // Add Markdown heading for authentication type
    markdown += `### 🔑 Authentication ${data.type}\n`;

    // Add newline for spacing
    markdown += `\n`;

    // Add Markdown table header
    markdown += `|Param|Value|Type|\n`;
    markdown += `|---|---|---|\n`;

    // Loop through bearer tokens
    if (data.bearer) {
      data.bearer.map((auth) => {
        // Add Markdown table row for each token
        markdown += `|${auth.key}|${auth.value}|${auth.type}|\n`;
      });
    }

    // Add newline for spacing
    markdown += `\n`;
    markdown += `\n`;
  }

  return markdown; // Return compiled markdown
}

/**
 * Read request options for a method
 * @param {object} request - Request data object
 * @returns {string} Markdown string for request options
 */
export function readRequestOptions(request: types.jsonRequest): string {
  // Initialize empty markdown string
  let markdown = "";

  // Check if request exists
  if (request) {
    // Loop through headers
    request.header.map((header) => {
      // Add Markdown header section
      markdown += `### Headers\n`;

      // Add newline for spacing
      markdown += `\n`;

      // Add Markdown table rows for each header
      markdown += `|Content-Type|Value|\n`;
      markdown += `|---|---|\n`;
      markdown += `|${header.key}|${header.value}|\n`;

      // Add newline for spacing
      markdown += `\n`;
      markdown += `\n`;
    });
  }

  return markdown; // Return compiled markdown
}

export function readQueryParams(url: types.jsonQuery) {
  // Initialize empty markdown string
  let markdown = "";

  // Check if query params exist
  if (url?.query) {
    // Add Markdown header section
    markdown += `### Query Params\n`;

    // Add newline for spacing
    markdown += `\n`;

    // Add Markdown table header
    markdown += `|Param|value|\n`;
    markdown += `|---|---|\n`;

    url.query.map((query) => {
      // Add Markdown table row for each query param
      markdown += `|${query.key}|${query.value}|\n`;
    });

    // Add newline for spacing
    markdown += `\n`;
    markdown += `\n`;
  }

  return markdown; // Return compiled markdown
}

/**
 * Read body objects for a method
 * @param {object} body - Body data object
 */
export function readFormDataBody(body: types.jsonBody) {
  let markdown = ""; // Initialize empty markdown string

  if (body) {
    if (body.mode === "raw") {
      // Add Markdown header for raw body
      markdown += `### Body (**${body.mode}**)\n`;
      markdown += `\n`;

      // Add code block with raw body
      markdown += `\`\`\`json\n`;
      markdown += `${body.raw}\n`;
      markdown += `\`\`\`\n`;
      markdown += `\n`;
    }

    if (body.mode === "formdata") {
      // Add Markdown header for form data
      markdown += `### Body ${body.mode}\n`;
      markdown += `\n`;

      // Add Markdown table header
      markdown += `|Param|value|Type|\n`;
      markdown += `|---|---|---|\n`;

      body.formdata.map((form) => {
        // Add Markdown table row for each form data field
        markdown += `|${form.key}|${
          form.value !== undefined ? form.value.replace(/\\n/g, "") : ""
        }|${form.type}|\n`;
      });

      markdown += `\n`;
      markdown += `\n`;
    }
  }

  return markdown; // Return compiled markdown
}

/**
 * Read response objects for a method
 * @param {Array} responses - Response data objects
 */
export function readResponse(responses: jsonResponse[]) {
  // Initialize empty markdown string
  let markdown = "";

  if (responses?.length) {
    const response = responses[0];

    // Add Markdown header with response code
    markdown += `### Response: ${response.code}\n`;

    // Add code block with response body
    markdown += `\`\`\`json\n`;
    markdown += `${response.body}\n`;
    markdown += `\`\`\`\n`;

    markdown += `\n`; // Add newline for spacing
  }

  return markdown; // Return compiled markdown
}

/**
 * Read data for a single API method
 * @param {object} method - Method data object
 */
export function readMethods(method: types.jsonReadMethods): string {
  // Initialize empty markdown string
  let markdown = "";

  markdown += `\n`; // Add newline for spacing

  // Add Markdown header with endpoint name
  markdown += `## End-point: ${method.name}\n`;

  if (method?.request?.description) {
    // Add method description
    markdown += `${method.request.description}\n`;
  }

  // Add Markdown header for method
  markdown += `### Method: ${method.request.method}\n`;

  // Add code block with endpoint URL
  markdown += `>\`\`\`\n`;
  markdown += `>${method.request.url.raw}\n`;
  markdown += `>\`\`\`\n`;

  // Add markdown for request options
  markdown += readRequestOptions(method.request);

  // Add markdown for request body
  markdown += readFormDataBody(method.request.body);

  // Add markdown for query parameters
  markdown += readQueryParams(method.request.url);

  // Add markdown for authentication
  markdown += readAuthorization(method.request.auth);

  // Add markdown for response
  markdown += readResponse(method.response);

  markdown += `\n`; // Add newline for spacing

  return markdown; // Return compiled markdown
}

/**
 * Read all data in Postman collection
 * @param {Array} items - Collection items
 * @param {number} folderDeep - Depth of current folder
 */
export function readItems(items: any[], folderDeep = 1) {
  // Initialize empty markdown string
  let markdown = "";

  items.forEach((item) => {
    if (item.item) {
      // Add Markdown header for folder
      markdown += `${"#".repeat(folderDeep)} 📁 Collection: ${item.name} \n`;

      // Recursively process subfolder items
      markdown += readItems(item.item, folderDeep + 1);
    } else {
      // Process individual method data
      markdown += readMethods(item);
    }
  });

  return markdown; // Return compiled markdown
}

export default {
  readAuthorization,
  readRequestOptions,
  readFormDataBody,
  readQueryParams,
  readResponse,
  readMethods,
  readItems,
};
