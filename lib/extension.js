
var path = require('path');
var fs = require('fs');
var htmlparser = require("htmlparser");

module.exports = {

    name: 'buster-qunit',

    create: function (options) {
        var instance = Object.create(this);
        instance.options = options;
        return instance;
    },

    configure: function (group) {
        var extConfig = (group.config || {})[this.name] || {};
        function filter(dom, cond) {
            var result = [];
            for (var i=0; i<dom.length; i++) {
                var value = dom[i];
                if (cond(value)) {
                    result[result.length] = value;
                } else if (value.children) {
                    result = result.concat(filter(value.children, cond));
                }
            }
            return result;
        }
        group.on('load:tests', function (resourceSet) {
            
            resourceSet.addFileResource(path.resolve(__dirname, 'buster-qunit.js'), {
                path: '/buster-qunit/buster-qunit.js'
            });
            resourceSet.addFileResource(path.resolve(__dirname, 'buster-qunit-epilogue.js'), {
                path: '/buster-qunit/buster-qunit-epilogue.js'
            });
            resourceSet.prependLoad(['/buster-qunit/buster-qunit.js']);

            if (extConfig.html) {
                
                var htmlPath = path.resolve(group.rootPath, extConfig.html);
                var basePath = path.resolve(htmlPath, '..');
                resourceSet.addFileResource(htmlPath, {
                    path: '/'
                });
                var txt = fs.readFileSync(htmlPath, 'utf8');
     
                var handler = new htmlparser.DefaultHandler(function (err, dom) {
                    if (err) {
                        throw new Error('Parser Error: ' + err);
                    }
                    var scripts = filter(dom, function (value) {
                        return value.type == 'script' && value.name == 'script' &&
                            (value.attribs.type === undefined ||
                                value.attribs.type == 'text/javascript') &&
                            // Filter out qunit. This is a bit rough, but it will work
                            // in 99% of the cases. To support the 1% we will provide some
                            // explicit parameter. XXX TODO
                            (value.attribs.src === undefined ||
                                value.attribs.src.search(/qunit/i) == -1);
                    });
                    for (var i = 0; i < scripts.length; i++) {
                        var script = scripts[i];
                        var src = script.attribs.src;
                        if (src !== undefined) {
                            if (src.indexOf('://') != -1) {
                                throw new Error('Only relative resources are accepted. ' +
                                    'Convert external resources html://, htmls:// to locals.');
                            }
                            var url = path.resolve('/', src);
                            var fullPath = path.resolve(basePath, src);
                            //console.log('loading JS:', url, fullPath);
                            resourceSet.addFileResource(fullPath, {
                                path: url
                            });
                            resourceSet.appendLoad([url]);
                        } else {
                            var content = '';
                            var children = script.children;
                            if (children) {
                                for (var j = 0; j < children.length; j++) {
                                    var child = children[j];
                                    if (child.type == 'text') {
                                        content += child.raw;
                                    }
                                }
                            }
                            //console.log('embedded JS:', content);
                            throw Error('Embedded scripts: TODO, unimplemented'); // XXX TODO
                        }
                    }


                });
                var parser = new htmlparser.Parser(handler);
                parser.parseComplete(txt);
            }
            // Add the epilogue after the last resource needed.
            resourceSet.appendLoad(['/buster-qunit/buster-qunit-epilogue.js']);
        });

    }

};

