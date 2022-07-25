import * as types from "../types/types";
import { readItems } from "./read";

/**
 * Create structure of the markdown documentation
 * @param {object} data json of the document to be converted
 * @type {string} jsonDocument structure of the markdown documentation
 * @return {string} markdown markdown structure of the documentation
 */
export function createStructureOfMarkdown(data: types.jsonDocument): string {
  let markdown = "";
  markdown += `# Project: ${data.info.name}\n`;
  markdown +=
  data.info.description !== undefined
      ? `${data.info.description || ""}\n`
      : ``;
  markdown += readItems(data.item);

  return markdown;
}
export default { createStructureOfMarkdown };
