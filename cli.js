'use strict';

const parseArgs = require('minimist');
const runner = require('./runner');

var argv = parseArgs(process.argv.slice(2));

if (!argv.f) throw new Error('File (-f) is required.');

runner(argv.f, argv.r);
