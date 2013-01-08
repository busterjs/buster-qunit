var config  = module.exports;

config.Node = {
    env: 'node',
    tests: [
        'extension-test.js',
        'buster-qunit-test.js'
    ]
};

config.Browser = {
    rootPath: '..',
    env: 'browser',
    libs: [
        'lib/buster-qunit.js'
    ],
    tests: [
        'test/buster-qunit-test.js'
    ]
};