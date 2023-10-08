#!/usr/bin/env node

/**
 * The main entry point for the PM2MD command-line tool.
 *
 * @module pm2md-cli
 * @see module:index
 */

// Copyright © 2022-2023 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

// Enable strict mode as before

// Import init function from local index module
import { init } from "../index";

/**
 * Initialize and start the execution of the PM2MD tool.
 *
 * @function
 * @async
 * @see module:index.init
 */
init();
