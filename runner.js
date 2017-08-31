'use strict';

const path = require('path');
const util = require('util');
const puppeteer = require('puppeteer');

function initMocha(reporter) {

    console.log = (console => {
        const log = console.log.bind(console);
        return (...args) => args.length ? log(...args) : log('');
    })(console);

    window.runMochaHeadlessChrome = function() {
        // var MARK = '#mocha#';
        //
        // function MyReporter(runner) {
        //     Mocha.reporters.Base.call(this, runner);
        //     runner.on('pass', test => console.log(MARK, 'pass', test));
        //     runner.on('fail', (test, err) => console.log(MARK, 'fail', test, err));
        //     runner.on('end', test => console.log(MARK, 'end'));
        // }
        //
        // //mocha.setup({ reporter: MyReporter });

        Mocha.reporters.Base.useColors = true;
        Mocha.process.browser = false;
        Mocha.process.stdout = {
            write: data => console.log('stdout:', data)
        };

        mocha.setup({ reporter: Mocha.reporters[reporter] || Mocha.reporters.spec });
        mocha.run().on('end', () => window.testsCompleted = true);
    };
}

function configureViewport(width, height, page) {
    if (!width && !height) return page;

    let viewport = page.viewport();
    width && (viewport.width = width);
    height && (viewport.height = height);
    
    return page.setViewport(viewport).then(() => page);
}

function handleConsole(...args) {
    // process stdout stub
    let isStdout = args[0] === 'stdout:';
    isStdout && (args = args.slice(1));

    let msg = util.format(...args);
    !isStdout && (msg += '\n');
    process.stdout.write(msg);
}

function onError(err) {
    console.error(err);
    process.exit(1);
}

module.exports = function({ file, reporter, timeout, width, height }) {
    const url = path.resolve(file);
    const options = {
        ignoreHTTPSErrors: true,
        headless: true
    };

    puppeteer
        .launch(options)
        .then(browser => browser.newPage()
            .then(configureViewport.bind(this, width, height))
            .then(page => {
                page.on('console', handleConsole);
                page.on('dialog', dialog => dialog.dismiss());
                page.on('pageerror', err => console.error(err));

                return page.evaluateOnNewDocument(initMocha, reporter)
                    .then(() => page.goto(`file://${url}`))
                    .then(() => page.waitForFunction(() => window.testsCompleted, { timeout: timeout }))
                    .then(() => {
                        process.stdout.write('\n');
                        browser.close();
                    });
            }))
        .catch(onError);
};
