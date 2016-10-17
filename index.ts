#!/usr/bin/env node

import {Config} from "./lib/config";

let applog  = require('debug')('mcsc');
let nconf   = require('nconf');
let fs      = require('fs');

// Provide a title to the process in `ps`
process.title = 'mcsc';

// program
//     .version('0.0.1')
//     .option('-p, --port'     , 'port')
//     .parse(process.argv);
//
console.log(__dirname);
nconf
    .argv(
        {
        "x": {
            alias: 'xx',
            describe: 'Example description for usage generation',
            demand: true,
            type:'number'
            // default: 'some-value'
        },
        "y": {
            alias: 'yy',
            describe: 'Example description for usage generation',
            demand: true,
            // default: 'some-value'
        }},
        "Useage fdsfdsfds")
    .env()
    .file({ file: '~/.mcsc/config.json' })
    .load();

console.log(nconf.version);
nconf.required(['x', 'y']);

applog('Test3');
// applog(nconf);
// applog(nconf.stores.argv);
// console.log('******************');
// console.log(nconf.stores.argv.usage);
console.log('******************');
console.log(nconf.stores.argv.help());
applog(nconf.get("x"));
applog(nconf.get("y"));

nconf.required(['x', 'y']);


// console.log(nconf);
//
// console.log('Helo');
//
// console.log('help: ' + nconf.get('help'));
//
// console.log('dbn: ' + nconf.get('dbn'));
//
// console.log(nconf.env());
//

applog('Test1');
applog('Test2');
applog('Test3');


let te = new Config("ABC");
te.combineWithAbc("XYZ");

