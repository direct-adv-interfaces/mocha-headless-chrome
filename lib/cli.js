'use strict';

const args = require('args');
const {runner} = require('./runner');
const writeFile = require('./write-file');

args.option('file', 'Path to the page which contains tests (required)')
    .option('args', 'Chrome arguments (\'--\' prefix will be added)')
    .option('reporter', 'Mocha reporter name', undefined, String)
    .option('out', 'Path to the file where test result will be saved', undefined, String)
    .option('coverage', 'Path to the file where coverage info will be saved', undefined, String)
    .option('timeout', 'Timeout in ms (defaults to 60000)', undefined, parseInt)
    .option('help', 'Output usage information', undefined, Boolean)
    .option('width', 'Viewport width', undefined, parseInt)
    .option('height', 'Viewport height', undefined, parseInt)
    .option('executablePath', 'Chrome executable path', undefined, String)
    .option(['n', 'incognito'], 'Run test suite in incognito mode', undefined, Boolean)
    .option('visible', 'Show Chrome window', undefined, Boolean)
    .example('mocha-headless-chrome -f test.html', 'Run tests on the "test.html" page')
    .example('mocha-headless-chrome -f http://localhost:8080', 'Run tests on the remote page')
    .example('mocha-headless-chrome -f test.html -a no-sandbox -a disable-setuid-sandbox', 'Pass the Chrome arguments')
    .example('mocha-headless-chrome -f test.html -r nyan', 'Output test result using "nyan" reporter');

let cfg = args.parse(process.argv, {
    name: 'mocha-headless-chrome',
    version: false,
    help: false
});

if (cfg.help) {
    args.showHelp();
}

runner(cfg)
    .then(obj => {
        const getContent = (obj) => obj ? JSON.stringify(obj) : '';

        cfg.out && writeFile(cfg.out, getContent(obj.result));
        cfg.coverage && writeFile(cfg.coverage, getContent(obj.coverage));

        if (obj.result.stats.failures) {
            throw 'Tests fails';
        }
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
