# gen-prom

This is a simple library for consuming promise based APIs using generators to
simulate async/await syntax in much older environments (such as the current LTS
release of nodeJS when this was created.)

## Install

```sh
npm install --save gen-prom
```

## Usage

The only export is a `run(iter) -> Promise` function that expects a generator
iterator instance and returns a promise that will be resolve when the generator
runs to completion or fails on uncaught exception.

```js
'use strict';
let run = require('gen-prom');

// A simple promise-returning async function that works in ES2016
// Waits ms delay before resolving.
// Emulates `async` function that we would be consuming
function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}


// A generator function used to simulate `await` when consuming promises.
function* test() {
  console.log('Counting...');
  for (let i = 0; i < 10; i++) {
    yield sleep(200);
    console.log(i);
  }
  return 42;
}

// Create an iterator from the generator function
let iterator = test();
// Run it through gen-prom to act as promise awaiting async function.
run(iterator).then(function (result) {
  console.log('done!', result);
}).catch(function (err) {
  console.error('error!', err);
});
```

## Supported Environments

This should work on any JS environment that ES6 `Promise` globally and ES6
generator syntax support.  This means nodeJS newer than `0.10.x` and any modern
browser.

Tested on:

- nodeJS v0.11.16 (with `--harmony_generators` flag)
- nodeJS v0.12.18 (with `--harmony_generators` flag)
- ioJS v1.8.4
- ioJS v2.5.0
- ioJS v3.3.1
- nodeJS v4.8.0
- nodeJS v5.12.0
- nodeJS v6.10.0
- nodeJS v7.7.1

Notice that starting with nodeJS v7.7.x there is built-in `async/await` syntax
support that is better than this workaround.

Also tested on:

- Chrome 56.0.2924.87
- Firefox 52.0
- Safari 10.0.3
