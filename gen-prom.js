'use strict';

module.exports = run;

function run(iterator) {
  return new Promise(function (resolve, reject) {
    var error, value, done;

    next();

    function next() {

      while (!done) {
        // Call into generator, forwarding any thrown errors to the callback.
        var evt;
        try {
          if (error) {
            evt = iterator.throw(error);
          } else {
            evt = iterator.next(value);
          }
        } catch (err) {
          return reject(err);
        }

        // Record the result from the generator
        error = null;
        done = evt.done;
        value = evt.value;

        // If it's a promise, wait for it.
        if (typeof value === 'object' &&
            typeof value.then === 'function') {
          return value.then(onResolve).catch(onReject);
        }
      }

      return resolve(value);
    }

    function onReject(err) {
      error = err;
      return next();
    }

    function onResolve(val) {
      value = val;
      return next();
    }
  });
}
