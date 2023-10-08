// Copyright © 2022-2023 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

// Import types for type checking
import * as types from "../typings/types";

// Import readItems utility function
import { readItems } from "./read";

/**
 * Create structure of the markdown documentation
 * @param {object} data - json of the document to be converted
 * @type {string} jsonDocument - structure of the markdown documentation
 * @return {string} markdown - markdown structure of the documentation
 */
export function createStructureOfMarkdown(data: types.jsonDocument): string {
  // Initialize markdown string
  let markdown = "";

  // Add title from data
  markdown += `# Project: ${data.info.name}\n`;

  // Add description if present
  markdown +=
    data.info.description !== undefined
      ? `${data.info.description || ""}\n`
      : ``;

  // Add generated items
  markdown += readItems(data.item);

  // Return compiled markdown
  return markdown;
}

// Export function
export default { createStructureOfMarkdown };
