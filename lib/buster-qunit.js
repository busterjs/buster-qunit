
if (typeof module === "object" && typeof require === "function") {
    var buster = require("buster");
}

(function () {

    // --
    // Testcase
    // --

    var qunit = buster.qunit = buster.qunit || {};
  
    qunit.qunitSetUp = function () {
        if (typeof document != 'undefined') {
            // Create the "main" node, if it does not exist.
            // (If no html was specified, it should not be there)
            if (! document.getElementById('main')) {
                document.body.innerHTML = '<div id="main"></div>';
            }
            //buster.log('HEAD:', document.head.innerHTML);
            //buster.log('BODY:', document.body.innerHTML);
        }
        // count asserts
        buster.assertions.count = 0;
    };

    qunit.qunitTearDown = function () {
        if (typeof document != 'undefined') {
            document.body.innerHTML = '';
        }
    };

    qunit.wrapTest = function (inner, proto) {

        function outer() {
            qunit.promise = {
                counter: 0,   // stop decreases, start increases it
                then: function (callback) {
                    this.callbacks = this.callbacks || [];
                    this.callbacks.push(callback);
                },
                count: function(diff) {
                    this.counter += diff;
                    if (this.counter >= 0) {
                        this.resolve();
                    }
                },
                resolve: function () {
                    var callbacks = this.callbacks || [];
                    for (var i = 0, l = callbacks.length; i < l; ++i) {
                        callbacks[i]();
                    }
                    this.callbacks = [];
                }
            };

            // call the embedded test function on the module proto
            inner.call(proto);

            // If the sync test run has finished and the
            // start-balance is not negative, we have a
            // sync test. Simply, do not return the promise
            // in this case.
            if (qunit.promise.counter < 0) {
                return qunit.promise;
            }
        }
        return outer;
    };

    // Can be used by tests to init this module.
    qunit._buster_qunit_init = function () {
        qunit.testCase = {
            setUp: qunit.qunitSetUp,
            tearDown: qunit.qunitTearDown
        };
        qunit.testModule = {};
        qunit.testModuleName = 'nomodule';
        qunit.testModuleProto = {};
        // return for introspection in tests
        return qunit;
    };
    qunit._buster_qunit_init();

    // Will be consumed from the epilogue.
    qunit._buster_qunit_process = function () {
        buster.testCase('qunit', qunit.testCase);
    };

    qunit.module = function (name, proto) {
        // Start a new test case
        qunit.testModule = {};
        qunit.testModuleName = name;
        if (proto === undefined) {
            proto = {};
        }
        qunit.testModuleProto = proto;
        if (proto.setup !== undefined) {
            qunit.testModule.setUp = qunit.wrapTest(proto.setup, proto);
        }
        if (proto.teardown !== undefined) {
            qunit.testModule.tearDown = qunit.wrapTest(proto.teardown, proto);
        }
    };

    qunit.test = function (name, func) {
        // Prohibit some names.
        if (name.toLowerCase() == 'setup' ||
            name.toLowerCase() == 'teardown') {
            name = '_' + name;
        }
        // Add the test to the testcase.
        qunit.testCase[qunit.testModuleName] = qunit.testModule;
        qunit.testModule[name] = qunit.wrapTest(func, qunit.testModuleProto);
    };


    // --
    // Assertions
    // --

    qunit.ok = function (b) {
        buster.assert(b);
    };
    
    qunit.equal = function (a, b) {
        buster.assert(a == b);
    };

    qunit.deepEqual = function (a, b) {
        buster.assert.equals(a, b);
    };

    qunit.raises = function (block, expected, message) {
        buster.assert.exception(block, function (err) {
            return err.message.slice(0, expected.length) == expected;   // startswith
        }, message);
    };

    
    // --
    // Async
    // --

    qunit.start = function () {
        //throw new Error('Not supported');
        qunit.promise.count(+1);
    };

    qunit.stop = function () {
        //throw new Error('Not supported');
        qunit.promise.count(-1);
    };

    qunit.expect = function (n) {
        //throw new Error('Not supported');
    };


    if (typeof module === "object" && typeof require === "function") {
        module.exports = require("./extension");
    }

    if (buster.console) {
        qunit.console = buster.console;
    } else {
        qunit.console = buster.create(buster.eventedLogger);
    }
     
    qunit.QUnit = {config: {}};

    function installGlobals(o) {
        o._buster_qunit_init = qunit._buster_qunit_init; // for tests only
        o._buster_qunit_process = qunit._buster_qunit_process;
        o.module  = qunit.module;
        o.test = qunit.test;
        o.ok  = qunit.ok;
        o.equal = qunit.equal;
        o.deepEqual = qunit.deepEqual;
        o.raises = qunit.raises;
        o.start = qunit.start;
        o.stop  = qunit.stop;
        o.expect = qunit.expect;
        o.QUnit = qunit.QUnit;
    }

    if (typeof global != "undefined") {
        installGlobals(global);
    }

    if (typeof window != "undefined") {
        installGlobals(window);
    }

    buster.testRunner.onCreate(function (runner) {
        runner.on("test:setUp", function () {
            // set default timeout for async tests
            // (I try to put it here in the hope that it can pick up
            // testTimeout, if manually changed for QUnit. But I have not
            // tested this yet to work):
            var verylong = 10000000;
            var defaultTimeout = qunit.QUnit.config.testTimeout || verylong;
            //console.log('default timeout set to', defaultTimeout);
            runner.timeout = defaultTimeout;
            // disable error if no asserts, as QUnit does not require that
            runner.failOnNoAssertions = false;
        });

    });


})();