'use strict';

const args = require('args');
const runner = require('./runner');

args.option('file', 'Path to the page which contains tests (required)')
    .option('reporter', 'Mocha reporter name', 'spec')
    .option('timeout', 'Timeout in ms', 60000, parseInt)
    .option('help', 'Output usage information', undefined, Boolean)
    .example('mocha-headless-chrome -f test.html', 'Run test on the "test.html" page')
    .example('mocha-headless-chrome -f test.html -r nyan', 'Output test result using "nyan" reporter');

let cfg = args.parse(process.argv, {
    name: 'mocha-headless-chrome',
    help: false
});

if (cfg.help) {
    args.showHelp();
} else {
    if (!cfg.file) {
        console.error('Test page path is required.');
        args.showHelp();
        process.exit(1);
    }

    runner(cfg);
}
