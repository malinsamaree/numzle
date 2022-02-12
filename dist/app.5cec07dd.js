// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"src/model/BoardModel.ts":[function(require,module,exports) {
"use strict"; // import { bordSizes } from "./utils/variables";
// import { arrayShuffle } from "./utils/functions";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoardModel = void 0;

var BoardModel = /*#__PURE__*/_createClass(function BoardModel() {
  var _this = this;

  _classCallCheck(this, BoardModel);

  this.width = 3;
  this.height = 3;
  this.tiles = [];
  this.dragableTiles = [];
  this.tilesInSequence = [];
  this.isWon = false;
  this.moves = 0;
  this.initTimestamp = null;
  this.duration = 0; //height and width must be 3 or more

  this.bordSizes = [[3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [3, 4], [4, 3], [4, 5], [5, 4], [5, 6], [6, 5], [6, 7], [7, 6], [7, 8], [8, 7], [8, 9], [9, 8], [9, 10], [10, 9]];

  this.initBoard = function (width, height) {
    _this.width = width;
    _this.height = height;

    if (_this.isSizeValid()) {
      _this.arrayShuffle();

      _this.setDragableTiles();
    }
  };

  this.setDuration = function (seconds) {
    _this.duration = seconds;
  };

  this.isSizeValid = function () {
    var isValid = false;

    _this.bordSizes.forEach(function (size) {
      if (_this.width === size[0] && _this.height === size[1]) {
        isValid = true;
      }
    });

    return isValid;
  };

  this.arrayShuffle = function () {
    var length = _this.width * _this.height;
    _this.tiles = _toConsumableArray(Array(length).keys());

    for (var i = 0; i < length; i++) {
      var randomIndex = Math.round(Math.random() * (length - 1));

      if (randomIndex !== i) {
        var curValue = _this.tiles[i];
        _this.tiles[i] = _this.tiles[randomIndex];
        _this.tiles[randomIndex] = curValue;
      }
    }
  };

  this.gameState = function () {
    if (_this.isWon) return true;
    var won = true;
    _this.tilesInSequence = [];

    for (var i = 0; i < _this.tiles.length - 1; i++) {
      if (_this.tiles[i] === i + 1) {
        _this.tilesInSequence.push(_this.tiles[i]);
      } else {
        won = false;
        break;
      }
    }

    return won;
  };

  this.drag = function (tile) {
    var index = _this.tiles.indexOf(tile);

    if (_this.isWon) return;
    if (!_this.dragableTiles.includes(index)) return;

    var indexOfZero = _this.tiles.indexOf(0);

    _this.tiles[indexOfZero] = _this.tiles[index];
    _this.tiles[index] = 0;

    _this.setDragableTiles();

    _this.isWon = _this.gameState();
    _this.moves++;

    if (!_this.initTimestamp) {
      _this.initTimestamp = new Date();
    }
  };

  this.setDragableTiles = function () {
    var indexOfZero = _this.tiles.indexOf(0);

    var dragableArray = [];
    var sideLeft = [];
    var sideRight = [];

    for (var i = 0; i < _this.height - 2; i++) {
      sideLeft.push((i + 1) * _this.width);
      sideRight.push((i + 2) * _this.width - 1);
    }

    if (indexOfZero === 0) {
      dragableArray.push(1);
      dragableArray.push(_this.width);
    } else if (indexOfZero === _this.width - 1) {
      dragableArray.push(_this.width - 2);
      dragableArray.push(_this.width * 2 - 1);
    } else if (indexOfZero === _this.width * (_this.height - 1)) {
      dragableArray.push(_this.width * (_this.height - 2));
      dragableArray.push(_this.width * (_this.height - 1) + 1);
    } else if (indexOfZero === _this.width * _this.height - 1) {
      dragableArray.push(_this.width * (_this.height - 1) - 1);
      dragableArray.push(_this.width * _this.height - 2);
    } else if (indexOfZero > 0 && indexOfZero < _this.width - 1) {
      dragableArray.push(indexOfZero - 1);
      dragableArray.push(indexOfZero + 1);
      dragableArray.push(indexOfZero + _this.width);
    } else if (indexOfZero > _this.width * (_this.height - 1) && indexOfZero < _this.width * _this.height - 1) {
      dragableArray.push(indexOfZero - 1);
      dragableArray.push(indexOfZero + 1);
      dragableArray.push(indexOfZero - _this.width);
    } else if (sideLeft.includes(indexOfZero)) {
      dragableArray.push(indexOfZero - _this.width);
      dragableArray.push(indexOfZero + _this.width);
      dragableArray.push(indexOfZero + 1);
    } else if (sideRight.includes(indexOfZero)) {
      dragableArray.push(indexOfZero - _this.width);
      dragableArray.push(indexOfZero + _this.width);
      dragableArray.push(indexOfZero - 1);
    } else {
      dragableArray.push(indexOfZero - _this.width);
      dragableArray.push(indexOfZero + _this.width);
      dragableArray.push(indexOfZero - 1);
      dragableArray.push(indexOfZero + 1);
    }

    _this.dragableTiles = dragableArray;
  };

  this.setSize = function (width, height) {
    _this.width = width;
    _this.height = height;
  };

  this.getSize = function () {
    return [_this.width, _this.height];
  };

  this.getBoard = function () {
    return {
      width: _this.width,
      height: _this.height,
      tiles: _this.tiles,
      tilesInSequesnce: _this.tilesInSequence,
      dragableTiles: _this.dragableTiles,
      isWon: _this.isWon,
      moves: _this.moves,
      initTimestamp: _this.initTimestamp
    };
  };

  this.initBoard(3, 3);
});

exports.BoardModel = BoardModel;
},{}],"src/view/HeaderView/HeaderView.ts":[function(require,module,exports) {
"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderView = void 0;

var HeaderView = /*#__PURE__*/_createClass(function HeaderView() {
  var _this = this;

  _classCallCheck(this, HeaderView);

  this.markup = function () {
    return "\n    <div class='header'>\n    <div class=\"logo\">numzle</div>\n    \n    <div class=\"board-selector-link\">\n      <a href=\"#\">boards</a>\n    </div>\n\n    <div class=\"theme-selector-link\">\n      <a href=\"#\">themes</a>\n    </div>\n\n    <div class=\"board-selector hide\">\n      <div class=\"board-selector-inner\">\n        <div class='board-selector-inner-close'>\n          <a href=\"#\">&#9587;</a>\n        </div>\n        <div class='board-selector-inner-boards'>\n          <a href=\"#\" data-type=\"board\" data-width=\"3\" data-height=\"3\">3x3</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"4\" data-height=\"4\">4x4</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"5\" data-height=\"5\">5x5</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"6\" data-height=\"6\">6x6</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"7\" data-height=\"7\">7x7</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"8\" data-height=\"8\">8x8</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"9\" data-height=\"9\">9x9</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"10\" data-height=\"10\">10x10</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"3\" data-height=\"4\">3x4</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"4\" data-height=\"3\">4x3</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"4\" data-height=\"5\">4x5</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"5\" data-height=\"4\">5x4</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"5\" data-height=\"6\">5x6</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"6\" data-height=\"5\">6x5</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"6\" data-height=\"7\">6x7</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"7\" data-height=\"6\">7x6</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"7\" data-height=\"8\">7x8</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"8\" data-height=\"9\">8x9</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"9\" data-height=\"8\">9x8</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"9\" data-height=\"10\">9x10</a>\n          <a href=\"#\" data-type=\"board\" data-width=\"10\" data-height=\"9\">10x9</a>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"theme-selector hide\">\n       <div class=\"theme-selector-inner\">\n        <div class='theme-selector-inner-close'>\n          <a href=\"#\">&#9587;</a>\n        </div>\n        <div class='theme-selector-inner-themes'>\n          <div class=\"theme theme-selector-inner-themes-seasons\" data-type=\"theme\" data-theme=\"theme-classic\"></div>\n          <div class=\"theme theme-selector-inner-themes-aqua\" data-type=\"theme\" data-theme=\"theme-aqua\"></div>\n          <div class=\"theme theme-selector-inner-themes-nature\" data-type=\"theme\" data-theme=\"theme-universe\"></div>\n        </div>\n      </div>\n    </div>\n\n    </div>\n    ";
  };

  this.render = function () {
    var _a;

    (_a = document.querySelector('#root')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', _this.markup());
  };

  this.showBoardSelectorHandler = function () {
    var _a, _b, _c;

    (_a = document.querySelector('.board-selector-link')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
      var _a, _b;

      e.preventDefault();
      ((_a = document.querySelector('.board-selector')) === null || _a === void 0 ? void 0 : _a.classList.contains('hide')) && ((_b = document.querySelector('.board-selector')) === null || _b === void 0 ? void 0 : _b.classList.remove('hide'));
    });
    (_b = document.querySelector('.board-selector-inner-close')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function (e) {
      e.preventDefault();

      _this.hideBoardSelector();
    });
    (_c = document.querySelector('.board-selector')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function (e) {
      e.preventDefault();
      e.target === document.querySelector('.board-selector') && _this.hideBoardSelector();
    });
  };

  this.showThemeSelectorHandler = function () {
    var _a, _b, _c;

    (_a = document.querySelector('.theme-selector-link')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
      var _a, _b;

      e.preventDefault();
      ((_a = document.querySelector('.theme-selector')) === null || _a === void 0 ? void 0 : _a.classList.contains('hide')) && ((_b = document.querySelector('.theme-selector')) === null || _b === void 0 ? void 0 : _b.classList.remove('hide'));
    });
    (_b = document.querySelector('.theme-selector-inner-close')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function (e) {
      e.preventDefault();

      _this.hideThemeSelector();
    });
    (_c = document.querySelector('.theme-selector')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function (e) {
      e.preventDefault();
      e.target === document.querySelector('.theme-selector') && _this.hideThemeSelector();
    });
  };

  this.hideBoardSelector = function () {
    var _a, _b;

    !((_a = document.querySelector('.board-selector')) === null || _a === void 0 ? void 0 : _a.classList.contains('hide')) && ((_b = document.querySelector('.board-selector')) === null || _b === void 0 ? void 0 : _b.classList.add('hide'));
  };

  this.hideThemeSelector = function () {
    var _a, _b;

    !((_a = document.querySelector('.theme-selector')) === null || _a === void 0 ? void 0 : _a.classList.contains('hide')) && ((_b = document.querySelector('.theme-selector')) === null || _b === void 0 ? void 0 : _b.classList.add('hide'));
  };

  this.newBoardHandler = function (onNewBoard) {
    var _a;

    (_a = document.querySelector('.board-selector')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
      var _a, _b, _c;

      e.preventDefault();

      if (e.target instanceof HTMLElement) {
        if (((_a = e.target) === null || _a === void 0 ? void 0 : _a.dataset.type) === 'board') {
          var width = parseInt((_b = e.target.dataset.width) !== null && _b !== void 0 ? _b : '3');
          var height = parseInt((_c = e.target.dataset.height) !== null && _c !== void 0 ? _c : '3');
          onNewBoard(width, height);

          _this.hideBoardSelector();
        }
      }
    });
  };

  this.newThemeHandler = function (onNewTheme) {
    var _a;

    (_a = document.querySelector('.theme-selector')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
      e.preventDefault();

      if (e.target instanceof HTMLElement) {
        if (e.target.dataset.type === 'theme') {
          e.target.dataset.theme && onNewTheme(e.target.dataset.theme);

          _this.hideThemeSelector();
        }
      }
    });
  };
});

exports.HeaderView = HeaderView;
},{}],"src/view/GameView/GameView.ts":[function(require,module,exports) {
"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameView = void 0;

var GameView = /*#__PURE__*/_createClass(function GameView() {
  var _this = this;

  _classCallCheck(this, GameView);

  this.markup = function () {
    return "\n    <div class=\"game\">\n      <div class=\"game-board\"></div>\n      <div class=\"game-stat\"></div>\n    </div>\n    ";
  };

  this.render = function () {
    var _a;

    (_a = document.querySelector('#root')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', _this.markup());
  };
});

exports.GameView = GameView;
},{}],"src/view/BoardView/BoardView.ts":[function(require,module,exports) {
"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoardView = void 0;

var BoardView = /*#__PURE__*/_createClass(function BoardView(boardModel) {
  var _this = this;

  _classCallCheck(this, BoardView);

  this.boardModel = boardModel;
  this.boardStyle = null;
  this.timeInterval = null;

  this.getStyles = function () {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight - 200;
    var limitedDiamention = windowWidth < windowHeight ? windowWidth : windowHeight;

    if (_this.board.width === _this.board.height) {
      _this.boardStyle = "\n        width: ".concat(limitedDiamention, "px;\n        height: ").concat(limitedDiamention, "px;\n        grid-template-columns: repeat(").concat(_this.board.width, ", 1fr);\n      ");
    } else {
      var tileWidth = Math.floor(windowWidth / _this.board.width);
      var tileHeight = Math.floor(windowHeight / _this.board.height);
      var tileLength = tileWidth < tileHeight ? tileWidth : tileHeight;
      _this.boardStyle = "\n      width: ".concat(tileLength * _this.board.width, "px;\n      height: ").concat(tileLength * _this.board.height, "px;\n      grid-template-columns: repeat(").concat(_this.board.width, ", 1fr);\n      ");
    }
  };

  this.markup = function () {
    if (!_this.board.isWon) {
      return "\n        <div class=\"board\">\n          <div class=\"board-inner\" style=\"".concat(_this.boardStyle, "\">\n            \n            ").concat(_this.board.tiles.map(function (tile) {
        var emptyTile = tile === 0 ? true : false;

        var dragableTile = _this.board.dragableTiles.includes(_this.board.tiles.indexOf(tile));

        var stylingClasses = "tile";
        emptyTile && (stylingClasses += " empty-tile");
        dragableTile && (stylingClasses += " dragable-tile");
        return "<div class=\"".concat(stylingClasses, "\" draggable=", false, ">").concat(tile === 0 ? '' : tile, "</div>");
      }).join(''), "\n          </div>\n        </div>\n      ");
    } else {
      console.log('won');
      return "<div>won</div>";
    }
  };

  this.onClickHandler = function (onClick) {
    setTimeout(function () {
      var _a;

      var container = document.querySelector('.board-inner');
      var parentProps = container === null || container === void 0 ? void 0 : container.getBoundingClientRect();
      var emptyTileProps = (_a = document.querySelector('.empty-tile')) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
      var emptyTileTop = emptyTileProps.top - parentProps.top;
      var emptyTileLeft = emptyTileProps.left - parentProps.left;
      var dragableTiles = document.querySelectorAll('.dragable-tile');
      dragableTiles.forEach(function (tile) {
        ['mousedown', 'touchstart'].forEach(function (event) {
          tile.addEventListener(event, function (e) {
            var tile = e.target;
            var tileValue = tile === null || tile === void 0 ? void 0 : tile.innerHTML; // dragableTile

            var childProps = tile.getBoundingClientRect();
            var left = childProps.left - parentProps.left;
            var top = childProps.top - parentProps.top;
            var sideLength = childProps.height;
            var absoluteTile = document.createElement('div');
            absoluteTile.innerHTML = tileValue;
            absoluteTile.setAttribute('class', 'absolute-tile');
            absoluteTile.setAttribute('style', "\n              width: ".concat(sideLength, "px;\n              height: ").concat(sideLength, "px;\n              top: ").concat(top, "px;\n              left: ").concat(left, "px;\n            "));
            container === null || container === void 0 ? void 0 : container.appendChild(absoluteTile);
            tile.style.background = 'transparent';
            tile.innerHTML = '';
            var curLeft = parseFloat(absoluteTile.style.left);
            var stepMoveDistance = (sideLength + 3) / 10;
            var stepMoveHorizontal = emptyTileLeft - curLeft >= 0 ? stepMoveDistance : -stepMoveDistance;
            var curTop = parseFloat(absoluteTile.style.top);
            var stepMoveVertical = emptyTileTop - curTop >= 0 ? stepMoveDistance : -stepMoveDistance;
            var moveInterval = setInterval(function () {
              curLeft += stepMoveHorizontal;
              curTop += stepMoveVertical;

              if (stepMoveHorizontal >= 0 && curLeft < emptyTileLeft) {
                absoluteTile.style.left = curLeft + 'px';
              } else if (stepMoveHorizontal <= 0 && curLeft > emptyTileLeft) {
                absoluteTile.style.left = curLeft + 'px';
              } else if (stepMoveVertical >= 0 && curTop < emptyTileTop) {
                absoluteTile.style.top = curTop + 'px';
              } else if (stepMoveVertical <= 0 && curTop > emptyTileTop) {
                absoluteTile.style.top = curTop + 'px';
              } else {
                clearInterval(moveInterval);

                if (tile instanceof HTMLElement) {
                  onClick(parseInt(tileValue));
                }
              }
            }, 10);
          });
        });
      });
    }, 60);
  };

  this.render = function () {
    var _a;

    var parentElement = document.querySelector('.game-board');

    if (parentElement) {
      parentElement.innerHTML = '';
    }

    parentElement === null || parentElement === void 0 ? void 0 : parentElement.insertAdjacentHTML('beforeend', _this.markup());
    (_a = document.querySelector('.stat-moves-number')) === null || _a === void 0 ? void 0 : _a.innerHTML = _this.board.moves;
  };

  this.board = boardModel.getBoard();
  this.getStyles();
});

exports.BoardView = BoardView;
},{}],"src/view/StatView/StatView.ts":[function(require,module,exports) {
"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatView = void 0;

var StatView = /*#__PURE__*/_createClass(function StatView() {
  var _this = this;

  _classCallCheck(this, StatView);

  this.markup = function () {
    return "\n      <div class=\"stat\">\n        <div class=\"stat-moves\"><span class=\"stat-moves-number\">0</span> </div>\n        <div class=\"stat-clock\">00:00:00</div>\n      </div>\n    ";
  };

  this.render = function () {
    var _a;

    (_a = document.querySelector('.game-stat')) === null || _a === void 0 ? void 0 : _a.innerHTML = _this.markup();
  };

  this.clock = function (onClockTick) {
    var statClock = document.querySelector('.stat-clock');
    var seconds = 0;
    var clockInterval = setInterval(function () {
      seconds++;
      var hours = Math.round(seconds / 3600);
      var remainingSeconds = seconds % 3600;
      var minutes = Math.round(remainingSeconds / 60);
      var stillRemainingSeconds = remainingSeconds % 60;
      var clockString = "".concat(('0' + hours).slice(-2), ":").concat(('0' + minutes).slice(-2), ":").concat(('0' + stillRemainingSeconds).slice(-2));
      statClock === null || statClock === void 0 ? void 0 : statClock.innerHTML = clockString;
      onClockTick(seconds);
    }, 1000);
  };
});

exports.StatView = StatView;
},{}],"src/view/FooterView/FooterView.ts":[function(require,module,exports) {
"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FooterView = void 0;

var FooterView = /*#__PURE__*/_createClass(function FooterView() {
  var _this = this;

  _classCallCheck(this, FooterView);

  this.markup = function () {
    return "\n    <div class=\"footer\">footer</div>\n    ";
  };

  this.render = function () {
    var _a;

    (_a = document.querySelector('#root')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('beforeend', _this.markup());
  };
});

exports.FooterView = FooterView;
},{}],"src/app.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("regenerator-runtime/runtime");

var BoardModel_1 = require("./model/BoardModel");

var HeaderView_1 = require("./view/HeaderView/HeaderView");

var GameView_1 = require("./view/GameView/GameView");

var BoardView_1 = require("./view/BoardView/BoardView");

var StatView_1 = require("./view/StatView/StatView");

var FooterView_1 = require("./view/FooterView/FooterView");

document.addEventListener('DOMContentLoaded', function (event) {
  var board;
  var headerView = new HeaderView_1.HeaderView();
  headerView.render();
  headerView.showBoardSelectorHandler();
  headerView.showThemeSelectorHandler();
  headerView.newBoardHandler(onNewBoard);
  headerView.newThemeHandler(onNewTheme);
  var gameView = new GameView_1.GameView();
  gameView.render();
  var footerView = new FooterView_1.FooterView();
  footerView.render();

  var init = function init() {
    return __awaiter(void 0, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              renderBoard();
              renderStatView();

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
  };

  var renderBoard = function renderBoard() {
    var boardView = new BoardView_1.BoardView(board);
    boardView.render();
    boardView.onClickHandler(onTileClick);
  };

  var renderStatView = function renderStatView() {
    var statView = new StatView_1.StatView();
    statView.render();

    if (board.moves === 1) {
      statView.clock(onClockTick);
    }
  };

  var newGame = function newGame(width, height) {
    board = new BoardModel_1.BoardModel();
    board.initBoard(width, height);
    init();
  };

  function onClockTick(seconds) {
    board.setDuration(seconds);
  }

  function onTileClick(tile) {
    board.drag(tile);
    renderBoard();

    if (board.moves === 1) {
      renderStatView();
      renderBoard();
    }
  }

  function onNewBoard(width, height) {
    newGame(width, height);
  }

  function onNewTheme(theme) {
    var _a;

    var classList = (_a = document.querySelector('#root')) === null || _a === void 0 ? void 0 : _a.classList;

    if (classList) {
      for (var i = classList.length - 1; i >= 0; i--) {
        var className = classList[i];

        if (className.startsWith('theme')) {
          classList.remove(className);
        }
      }
    }

    classList === null || classList === void 0 ? void 0 : classList.add(theme);
  }

  window.addEventListener('resize', function () {
    renderBoard();
  });
  newGame(3, 3);
});
},{"regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","./model/BoardModel":"src/model/BoardModel.ts","./view/HeaderView/HeaderView":"src/view/HeaderView/HeaderView.ts","./view/GameView/GameView":"src/view/GameView/GameView.ts","./view/BoardView/BoardView":"src/view/BoardView/BoardView.ts","./view/StatView/StatView":"src/view/StatView/StatView.ts","./view/FooterView/FooterView":"src/view/FooterView/FooterView.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56163" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/app.ts"], null)
//# sourceMappingURL=/app.5cec07dd.js.map