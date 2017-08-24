'use strict';

const path = require('path');
const util = require('util');
const puppeteer = require('puppeteer');

const url = path.resolve('example-page.html');

function initMocha() {

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
        Mocha.reporters.Base.symbols.dot = '.';
        Mocha.reporters.Base.symbols.ok = '✓';
        Mocha.reporters.Base.symbols.err = '✖';
        Mocha.reporters.Base.symbols.dot = '․';
        Mocha.reporters.Base.symbols.comma = ',';
        Mocha.reporters.Base.symbols.bang = '!';

        mocha.setup({ reporter: Mocha.reporters.list });
        mocha.run().on('end', () => window.testsCompleted = true);
    };
}


module.exports = async () => {
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true, headless: true });
    const page = await browser.newPage();

    page.on('console', (...args) => {
        //console.log('>>>>>>>>>>>>>>>>>>begin', JSON.stringify(args));

        let isStdout = args[0] === 'stdout:';
        isStdout && (args = args.slice(1));

        let msg = util.format(...args);
        !isStdout && (msg += '\n');
        process.stdout.write(msg);
    });

    page.on('dialog', async dialog => {
        await dialog.dismiss();
    });

    page.on('pageerror', async err => {
        console.error(err);
    });

    // page.on('request', request => {
    //   if (/\.(png|jpg|jpeg|gif|webp)$/i.test(request.url))
    //     request.abort();
    //   else
    //     request.continue();
    // });

    await page.evaluateOnNewDocument(initMocha);

    await page.goto(`file://${url}`);
    await page.waitForFunction(() => window.testsCompleted);

    process.stdout.write('\n');
    browser.close();
};
