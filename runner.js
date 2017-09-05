'use strict';

const path = require('path');
const util = require('util');
const puppeteer = require('puppeteer');

function initMocha(reporter) {

    console.log = (console => {
        const log = console.log.bind(console);
        return (...args) => args.length ? log(...args) : log('');
    })(console);

    function shimMochaInstance(m) {

        m.setup({ reporter: Mocha.reporters[reporter] || Mocha.reporters.dot });

        let run = m.run.bind(m);
        m.run = () => run().on('end', () => window.testsCompleted = true);
    }

    function shimMochaProcess(M) {
        // Mocha needs a process.stdout.write in order to change the cursor position.
        !M.process && (M.process = {});
        !M.process.stdout && (M.process.stdout = {});

        M.process.browser = false;
        M.process.stdout.write = data => console.log('stdout:', data);
        M.reporters.Base.useColors = true;
    }

    Object.defineProperty(window, 'mocha', {
        get: function() { return undefined },
        set: function(m) {
            shimMochaInstance(m)
            delete window.mocha
            window.mocha = m
        },
        configurable: true
    })

    Object.defineProperty(window, 'Mocha', {
        get: function() { return undefined },
        set: function(m) {
            delete window.Mocha;
            window.Mocha = m;
            shimMochaProcess(m)
        },
        configurable: true
    });
}

function getResult(field) {
    return window[field];
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

module.exports = function ({ file, reporter, timeout, width, height, result, args }) {

    // validate options
    !file && onError('ERROR: Test page path is required.');
    
    args = [].concat(args || []).map(arg => '--' + arg);
    
    const url = path.resolve(file);

    const options = {
        ignoreHTTPSErrors: true,
        headless: true,
        args
    };

    return puppeteer
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
                    .then(() => page.evaluate(getResult, result))
                    .then(obj => {
                        browser.close();
                        return obj;
                    });
            }))
        .catch(onError);
};
