#!/usr/bin/env node

import {Controller} from "./lib/controller";

let applog  = require('debug')('mcsc');
let path    = require('path');

// Provide a title to the process in `ps`
let appRoot : string = path.resolve(__dirname);
process.title = 'mcsc';

// Load Config
let controller = new Controller(applog,appRoot);

controller.config.commands.forEach((cmd) => {
    if (cmd.cmd!='start')
        controller.executeCommand(cmd)
    });

controller.config.commands.forEach((cmd) => {
    if (cmd.cmd=='start')
        controller.start(cmd.args)
    });
