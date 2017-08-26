# mocha-headless-chrome

This is the tool which runs client-side [mocha](https://github.com/mochajs/mocha) tests in the command line through headless Chrome ([puppeteer](https://github.com/GoogleChrome/puppeteer) is used).

*Note: Still under dev. Nothing is really configurable right now.*

## Install

```
npm i mocha-headless-chrome
```

## Run 

Prepare the test page using [the example](example-page.html). Run `window.runMochaHeadlessChrome()` function instead `mocha.run()` [if it is available](example-page.html#L16-L20).

Then run `mocha-headless-chrome` CLI and specify your test page path using `-f` parameter.

Optionally you can specify the reporter name using `-r` parameter. All mocha reporters are supported.  

```
mocha-headless-chrome -f test-page.html -r nyan
```
