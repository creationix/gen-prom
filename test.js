'use strict';
var run = require('./gen-prom');

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
  for (var i = 0; i < 10; i++) {
    yield sleep(200);
    console.log(i);
  }
  return 42;
}

// Create an iterator from the generator function
var iterator = test();
// Run it through gen-prom to act as promise awaiting async function.
run(iterator).then(function (result) {
  console.log('done!', result);
}).catch(function (err) {
  console.error('error!', err);
});
