'use strict';

const path = require('path');
const util = require('util');
const puppeteer = require('puppeteer');

function initMocha(reporter) {

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

        mocha.setup({ reporter: Mocha.reporters[reporter] || Mocha.reporters.dot });
        mocha.run().on('end', () => window.testsCompleted = true);
    };
}


module.exports = async (filePath, reporter) => {
    const url = path.resolve(filePath);
    
    try {

        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            headless: true
        });
        const page = await browser.newPage();

        page.on('console', (...args) => {
            //process.stdout.write('ARGS: ' + JSON.stringify(args));
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

        await page.evaluateOnNewDocument(initMocha, reporter);

        await page.goto(`file://${url}`);
        await page.waitForFunction(() => window.testsCompleted);

        process.stdout.write('\n');
        browser.close();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
