#!/usr/bin/env node

let applog  = require('debug')('mcsc');
let nconf   = require('nconf');
let fs      = require('fs');

// Provide a title to the process in `ps`
process.title = 'mcsc';

applog('Test1');
applog('Test2');
applog('Test3');




// program
//     .version('0.0.1')
//     .option('-p, --port'     , 'port')
//     .parse(process.argv);
//
nconf
    .argv()
    .env()
    .file({ file: '~/.mcsc/config.json' });

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

