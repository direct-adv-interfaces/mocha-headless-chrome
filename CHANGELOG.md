# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 5.1.0

- PR [#68](https://github.com/direct-adv-interfaces/mocha-headless-chrome/pull/68): Update [puppeteer](https://www.npmjs.com/package/puppeteer) package to 24.3.0 version. Node.js 17 is no longer supported.

## 4.0.0

- PR [#61](https://github.com/direct-adv-interfaces/mocha-headless-chrome/pull/61): Update [puppeteer](https://www.npmjs.com/package/puppeteer) package to 13.1.3 version. Node.js 10 is no longer supported.

## 3.1.0 - 2020-06-17

### Changed

- PR [#53](https://github.com/direct-adv-interfaces/mocha-headless-chrome/pull/53): Update [puppeteer](https://www.npmjs.com/package/puppeteer) package to 4.0.0 version.

## 3.0.0 - 2020-05-01

### Added

- issue [#39](https://github.com/direct-adv-interfaces/mocha-headless-chrome/issues/39): Added `polling` parameter that can specify puppeteer polling mechanism.

### Changed

- issue [#44](https://github.com/direct-adv-interfaces/mocha-headless-chrome/issues/44): Empty messages are ignored when output to the console.

### Fixed

- PR [#50](https://github.com/direct-adv-interfaces/mocha-headless-chrome/pull/50): Fix the error when console output arguments is not serializable.

### BREAKING CHANGES

- Update [puppeteer](https://www.npmjs.com/package/puppeteer) package to 3.0.2 version. It means that Node versions before 10.18.1 are not supported.

## 2.0.1 - 2018-06-29

### Changed

- Update [args](https://www.npmjs.com/package/args) & [puppeteer](https://www.npmjs.com/package/puppeteer) packages.

### Fixed

- issue [#29](https://github.com/direct-adv-interfaces/mocha-headless-chrome/issues/29): Reporter option is ignored
- issue [#31](https://github.com/direct-adv-interfaces/mocha-headless-chrome/issues/31): `--incognito` option is ignored
