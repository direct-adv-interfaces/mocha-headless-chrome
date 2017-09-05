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

        const run = m.run.bind(m);

        m.run = () => {
            const all = [], pending = [], failures = [], passes = [];

            function error(err) {
                if (!err) return null;

                let res = {};
                Object.getOwnPropertyNames(err).forEach(key => res[key] = err[key]);
                return res;
            }

            function clean(test) {
                return {
                    title: test.title,
                    fullTitle: test.fullTitle(),
                    duration: test.duration,
                    err: error(test.err)
                };
            }
            
            function result() {
                return {
                    result: {
                        stats: {
                            tests: all.length,
                            passes: passes.length,
                            pending: pending.length,
                            failures: failures.length
                        },
                        tests: all.map(clean),
                        pending: pending.map(clean),
                        failures: failures.map(clean),
                        passes: passes.map(clean)
                    },
                    coverage: window.__coverage__
                };
            }

            return run()
                .on('pass', test => { passes.push(test); all.push(test); })
                .on('fail', test => { failures.push(test); all.push(test); })
                .on('pending', test => { pending.push(test); all.push(test); })
                .on('end', () => { window.__mochaResult__ = result(); });
        };
    }

    function shimMochaProcess(M) {
        // Mocha needs a process.stdout.write in order to change the cursor position.
        !M.process && (M.process = {});
        !M.process.stdout && (M.process.stdout = {});

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

module.exports = function ({ file, reporter, timeout, width, height, args }) {
    return new Promise(resolve => {

        // validate options
        if (!file) {
            throw new Error('Test page path is required.');
        }

        args = [].concat(args || []).map(arg => '--' + arg);

        const url = path.resolve(file);

        const options = {
            ignoreHTTPSErrors: true,
            headless: true,
            args
        };

        const result = puppeteer
            .launch(options)
            .then(browser => browser.newPage()
                .then(configureViewport.bind(this, width, height))
                .then(page => {
                    page.on('console', handleConsole);
                    page.on('dialog', dialog => dialog.dismiss());
                    page.on('pageerror', err => console.error(err));

                    return page.evaluateOnNewDocument(initMocha, reporter)
                        .then(() => page.goto(`file://${url}`))
                        .then(() => page.waitForFunction(() => window.__mochaResult__, { timeout: timeout }))
                        .then(() => page.evaluate(() => window.__mochaResult__))
                        .then(obj => {
                            browser.close();
                            return obj;
                        });
                }));

        resolve(result);
    });
};
