// Copyright © 2022-2023 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import fs from "fs";
import chalk from "chalk";

/**
 * Create a file with given content
 * @param {string} content - File content
 * @param {string} fileName - File name
*/
export function writeFile(content: string, fileName: string) {

  // Replace spaces in file name with underscores
  fileName = fileName.replaceAll(" ", "_");

  // Append .md extension to file name
  fileName = fileName + ".md";

  // Get folder path by removing file name
  let folder = fileName.replace(/\/(?![^\/]+)?$/, "");

  // Create folder recursively
  writeDirectory(folder);

  // Write content to file
  fs.writeFile(fileName, content, (err) => {

    // Log and throw error if exists
    if (err) {
      console.error(chalk.red(`Error when writing file ${fileName}`));
      console.error(err);
      throw err;
    }

    // Log success message
    console.log(chalk.green(`File was created correctly ${fileName}`));
  });
}

/**
 * Create a directory recursively
 * @param {string} dirpath - Path for directory
*/
export function writeDirectory(dirpath: fs.PathLike) {

  // Log dirname
  console.log(dirpath);

  // Check if directory exists
  if (fs.existsSync(dirpath)) return;

  // Create directory recursively
  fs.mkdirSync(dirpath, {recursive: true});

}

export default {
  writeFile,
  writeDirectory
};
