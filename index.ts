#!/usr/bin/env node

import {Config} from "./lib/config";

let applog  = require('debug')('mcsc');
let path    = require('path');

// Provide a title to the process in `ps`
let appRoot = path.resolve(__dirname);
process.title = 'mcsc';

// Load Config
let te = new Config(applog,appRoot.toString());
if (te.showHelp)
    Config.showUsage();

console.log(JSON.stringify(te, null, 6));
