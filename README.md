# mocha-headless-chrome

[![npm](https://img.shields.io/npm/v/mocha-headless-chrome.svg)](https://www.npmjs.com/package/mocha-headless-chrome)
[![license](https://img.shields.io/npm/l/mocha-headless-chrome.svg)](http://spdx.org/licenses/MIT.html)
[![dependency status](https://img.shields.io/david/direct-adv-interfaces/mocha-headless-chrome.svg)]()
[![dev dependency status](https://img.shields.io/david/dev/direct-adv-interfaces/mocha-headless-chrome.svg)]()

This is the tool which runs client-side [mocha](https://github.com/mochajs/mocha) tests in the command line through headless Chrome ([puppeteer](https://github.com/GoogleChrome/puppeteer) is used).

All mocha reporters are supported (including third-party reporters).

Node 6.4.0+ is supported.

## Getting Started

First you'll need to install `mocha-headless-chrome`:

```
npm i mocha-headless-chrome
```

Then prepare the test page (see [the example](example-page.html)). 

*Note. It is necessary to add the `<meta charset="utf-8">` tag. Otherwise browser may use another encoding and test results will be shown incorrectly.*

Then run `mocha-headless-chrome` CLI and specify your test page path using `-f` parameter.

```
mocha-headless-chrome -f test-page.html
```

## Options

- **-f, --file** - Path to the page which contains tests (required)
- **-r, --reporter [value]** - Mocha reporter name (defaults to "spec")
- **-w, --width <n>** - Viewport width (defaults to 800)
- **-H, --height <n>** - Viewport height (defaults to 600)
- **-t, --timeout <n>** - Timeout in ms (defaults to 60000)
- **-h, --help** - Output usage information
- **-v, --version** - Output the version number
