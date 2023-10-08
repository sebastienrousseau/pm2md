// Copyright © 2022-2023 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

// Import utility functions from local modules
import { createStructureOfMarkdown } from "./util/create";
import { writeFile } from "./util/write"

// Import core Node.js filesystem and path modules
import fs from "fs";
import path from "path";

// Import minimist to parse command line arguments
import minimist from "minimist";

/**
 * Initialize execution.
 */
export function init() {
    // Print banner
    console.log(`
PM2MD

https://pm2md.com/

`);

    /**
    * Parse command line arguments.
    * @type {Object}
    */
    const args = minimist(process.argv.slice(2));

    // Get first argument as the path
    const paths = args._;

    /**
    * Check if a path was passed.
    * @type {boolean}
    */
    const isPathPassed = paths.length > 0;

    // Check if a path was passed
    if (isPathPassed) {
        /**
        * The path to the JSON file.
        * @type {string}
        */
        const jsonFilePath = paths[0];

        // Check if file exists at path
        if (fs.existsSync(jsonFilePath)) {
            // Print message that markdown is being generated
            console.log(`❯ Reading file ${jsonFilePath}\n`);
            console.log("❯ Generating markdown file ...\n");

            try {
                /**
                * The raw data read from the file.
                * @type {Buffer}
                */
                let rawData = fs.readFileSync(jsonFilePath);

                // Parse JSON
                const json = JSON.parse(rawData.toString());

                // Generate markdown from JSON
                let markdown = createStructureOfMarkdown(json);

                // Add footer
                markdown += "____________________________\n";
                markdown += "Powered by: [pm2md](https://pm2md.com)\n";

                // Get filename without extension from path
                const fileNameWithoutExt = path.parse(jsonFilePath).name;

                // Write markdown file
                writeFile(markdown, fileNameWithoutExt);
            } catch (error) {
                console.error("❯ Error reading or parsing the JSON file:", error);
            }
        } else {
            // Print error if invalid path
            console.error("❯ Path is not valid or the file does not exist.");
        }
    } else {
        // Print error if no path
        console.error("❯ Usage: node ./dist/bin/pm2md.js [path_to_json_file]\n");
        console.error("❯ Path of JSON file is required.\n");
    }
}

// Export init function
export default { init };
