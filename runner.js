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

module.exports = async ({ file, reporter, timeout }) => {
    const url = path.resolve(file);
    const log = [];

    try {
        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            headless: true
        });
        const page = await browser.newPage();

        page.on('console', (...args) => {
            // save console.log arguments
            let json = JSON.stringify(args);
            let del = args[1] === "\u001b[2K";
            let begin = args[1] === "\u001b[0G";
            log.push({ json, del, begin });

            // process stdout stub
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
        await page.waitForFunction(() => window.testsCompleted, { timeout: timeout });

        process.stdout.write('\n');
        browser.close();

        //log.forEach(msg => console.log(`${msg.json} = ${msg.del} == ${msg.begin}`));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
