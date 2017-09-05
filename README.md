# mocha-headless-chrome

[![npm](https://img.shields.io/npm/v/mocha-headless-chrome.svg)](https://www.npmjs.com/package/mocha-headless-chrome)
[![license](https://img.shields.io/npm/l/mocha-headless-chrome.svg)](http://spdx.org/licenses/MIT.html)
[![dependency status](https://img.shields.io/david/direct-adv-interfaces/mocha-headless-chrome.svg)]()
[![dev dependency status](https://img.shields.io/david/dev/direct-adv-interfaces/mocha-headless-chrome.svg)]()

This is the tool which runs client-side [mocha](https://github.com/mochajs/mocha) tests in the command line through headless Chrome ([puppeteer](https://github.com/GoogleChrome/puppeteer) is used).

All mocha reporters are supported (including third-party reporters).

Node 6.4.0+ is supported.

## Getting Started

First you need to install [mocha-headless-chrome](https://www.npmjs.com/package/mocha-headless-chrome):

```
npm i mocha-headless-chrome
```

Then prepare the test page (see [the example](example-page.html)). 

*Note. It is necessary to add the **&lt;meta charset="utf-8">** tag. Otherwise browser may use another encoding and test results will be shown incorrectly.*

Then run the CLI and specify your test page path using **-f** parameter.

```
mocha-headless-chrome -f test-page.html
```

## Options

- **-f, --file** - Path to the page which contains tests (required)
- **-r, --reporter** - Mocha reporter name (defaults to "spec")
- **-o, --out** - Path to the file where test result will be saved
- **-a, --args**  Chrome arguments ('--' prefix will be added)
- **-w, --width** - Viewport width
- **-H, --height** - Viewport height
- **-t, --timeout** - Timeout in ms (defaults to 60000)
- **-h, --help** - Output usage information
- **-v, --version** - Output the version number

## Examples

Run test on the "test.html" page:

```
$ mocha-headless-chrome -f test.html
```

Output test results using "nyan" reporter:

```
$ mocha-headless-chrome -f test.html -r nyan
```

Pass the Chrome **--no-sandbox** and **--disable-setuid-sandbox** arguments:

```
$ mocha-headless-chrome -f test.html -a no-sandbox -a disable-setuid-sandbox
```

## Programmatically usage

You can use mocha-headless-chrome programmatically. Just require the *mocha-headless-chrome* node module and pass proper parameters into it. Function result is a Promise.

```js
const runner = require('mocha-headless-chrome');

const options = {
    file: 'test.html',    // test page path 
    reporter: 'dot',      // mocha reporter name 
    width: 800,           // viewport width
    height: 600,          // viewport height
    timeout: 120000,      // timeout in ms
    args: ['no-sandbox']  // chrome arguments
};

runner(options)
    .then(result => {
        let json = JSON.stringify(result);
        console.log(json);
    });
```
 

