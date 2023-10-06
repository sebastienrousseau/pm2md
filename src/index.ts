// Copyright © 2022-2023 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

// Enable strict mode to catch errors and enforce best practices
'use strict'

// Import utility functions from local modules
import { createStructureOfMarkdown } from './util';
import { writeFile } from './util/write';

// Import core Node.js filesystem module
import fs from 'fs';

// Import minimist to parse command line arguments
import minimist from 'minimist';

// Import chalk to print colored output
import chalk from "chalk";

/**
 * Init execution
*/

// Parse command line arguments
const args = minimist(process.argv.slice(2));

// Log arguments for debugging
console.log(args);

// Get first argument as the path
const path = args._;

// Main function
export function init() {

  // Log the path for debugging
  console.log(path);

  // Check if a path was passed
  if (path.length > 0) {

    // Print message that file is being read
    console.log(chalk.green(`Reading file ${path[0]}`));

    // Check if file exists at path
    if (fs.existsSync(path[0])) {

      // Print message that markdown is being generated
      console.log(chalk.green(`Generating markdown file ...`));

      // Read file contents
      let rawData = fs.readFileSync(path[0]);

      // Parse JSON
      const json = JSON.parse(rawData.toString());

      // Generate markdown from JSON
      let markdown = createStructureOfMarkdown(json);

      // Add footer
      markdown += '____________________________\n';
      markdown += 'Powered By: [pm2md](https://pm2md.com)\n';

      // Get filename from path
      const fileName = path[0].split('.');

      // Write markdown file
      writeFile(markdown, fileName[0]);

    } else {
      // Print error if invalid path
      console.log(chalk.red(`Path is not valid or the file not exist.`));
    }

  } else {
    // Print error if no path
    console.log(chalk.red(`Path of json file is required.`));
  }

}

// Export init function
export default { init }

// Source map reference
//# sourceMappingURL=index.js.map
// Language: typescript
// Path: src/index.ts
