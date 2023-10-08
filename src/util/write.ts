// Copyright © 2022-2023 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import path from "path";
import fs from "fs";

export function writeFile(content: string, jsonFilePath: string) {
  try {
    // Get file name from path
    const fileName = path.basename(jsonFilePath);

    // Check if fileName is empty
    if (!fileName) {
      console.error("❯ File name is empty!\n");
      return;
    }
    console.log(`❯ File name: ${fileName}\n`);

    // Append .md extension
    const mdFileName = `${path.parse(fileName).name}.md`;

    // Folder to write to
    const outDir = "./dist";

    // Construct full file path
    const filePath = path.join(outDir, mdFileName);

    // Make sure folder exists
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Write Markdown file
    fs.writeFileSync(filePath, content);

    console.log(`❯ Wrote to ${filePath}\n`);
  } catch (error) {
    console.error("❯ An error occurred:", error);
  }
}

export function writeDirectory(dirpath: fs.PathLike) {
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, { recursive: true });
  }
}
