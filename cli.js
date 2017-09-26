'use strict';

const fs = require('fs');
const args = require('args');
const runner = require('./runner');

args.option('file', 'Path to the page which contains tests (required)')
    .option('args', 'Chrome arguments (\'--\' prefix will be added)')
    .option('reporter', 'Mocha reporter name', undefined, String)
    .option('out', 'Path to the file where test result will be saved', undefined, String)
    .option('timeout', 'Timeout in ms (defaults to 60000)', undefined, parseInt)
    .option('help', 'Output usage information', undefined, Boolean)
    .option('width', 'Viewport width', undefined, parseInt)
    .option('height', 'Viewport height', undefined, parseInt)
    .option('executablePath', 'Chrome executable path', undefined, String)
    .example('mocha-headless-chrome -f test.html', 'Run test on the "test.html" page')
    .example('mocha-headless-chrome -f test.html -a no-sandbox -a disable-setuid-sandbox', 'Pass the Chrome arguments')
    .example('mocha-headless-chrome -f test.html -r nyan', 'Output test result using "nyan" reporter');

let cfg = args.parse(process.argv, {
    name: 'mocha-headless-chrome',
    help: false
});

if (cfg.help) {
    args.showHelp();
}

runner(cfg)
    .then(obj => cfg.out && fs.writeFileSync(cfg.out, JSON.stringify(obj)))
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
