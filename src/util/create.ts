// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import * as types from "../typings/types";
import {
  extractDescription,
  readAuthorization,
  readItems,
} from "./read";

/**
 * Create structure of the markdown documentation.
 * @param {object} data - Parsed Postman collection object
 * @returns {string} Compiled markdown documentation
 */
export function createStructureOfMarkdown(
  data: types.PostmanCollection
): string {
  if (!data || typeof data !== "object" || !data.info || !data.info.name) {
    throw new Error(
      "Invalid Postman collection: missing required 'info.name' field."
    );
  }

  const chunks: string[] = [`# Project: ${data.info.name}\n`];

  const description = extractDescription(data.info.description);
  if (description) {
    chunks.push(`${description}\n`);
  }

  if (data.auth) {
    chunks.push(readAuthorization(data.auth));
  }

  if (Array.isArray(data.item)) {
    chunks.push(readItems(data.item));
  }

  return chunks.join("");
}

export default { createStructureOfMarkdown };
