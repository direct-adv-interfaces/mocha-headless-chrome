# mocha-headless-chrome

This is the tool which runs client-side [mocha](https://github.com/mochajs/mocha) tests in the command line through headless Chrome ([puppeteer](https://github.com/GoogleChrome/puppeteer) is used).

All mocha reporters are supported (including third-party reporters).

Node 6.4.0+ is supported.

## Getting Started

First you'll need to install `mocha-headless-chrome`:

```
npm i mocha-headless-chrome
```

Then prepare the test page (see [the example](example-page.html)). 

- Add the `<meta charset="utf-8">` meta tag. Otherwise browser may use another encoding and test results will be shown incorrectly.
- Include mocha js & styles into the page. Also add the container for mocha info `<div id="mocha"></div>`.
- Include your testable code and tests. 
- Use `window.runMochaHeadlessChrome()` function instead `mocha.run()` [if it is available](example-page.html#L16-L20).

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
