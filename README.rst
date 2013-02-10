
============
buster-qunit
============

An adapter to enable running QUnit tests from buster.js.

Installation
============

Use the ``npm`` package manager to install this package. Assuming
that you are in the same directory where this README file is
located::

    % sudo npm install -g .


Usage
=====

You will need to create a ``buster.js`` configuration file for
your qunit tests. The ``buster.js`` file in the ``examples``
folder serves as a template.

To set up a QUnit test suite, the extension has to be selected from ``buster.js``::

    config["the.example"] = {
        rootPath: "../",
        environment: "browser",
        extensions: [require('buster-qunit')],     // select extension
        'buster-qunit': {
            html: 'examples/test.html'             // specify your QUnit test html
        }
    };


Roadmap
=======

- loading tests from QUnit html (in progress)

- add async support (start, stop, expect)


Compatibility
=============

A desirable goal would be to run any existing QUnit test transparently from ``buster.js``,
without any need to modify or prepare the QUnit tests.

Right now, some preparation is necessary to make QUnit tests compatible with this adapter.
Once this is done, the tests can be maintained in parallel between QUnit and ``buster.js``.


1. JavaScript resource loading
------------------------------

QUnit tests are run from a browser by visiting an HTML page, and this HTML contains ``<script>`` tags to load
javascript. In buster, there is no such HTML. It is the task of ``buster-qunit`` to determine
which resources are requested by the HTML, and marshall their loading to the test
configuration.

This is how you will run a QUnit test::

    config["the.example"] = {
        rootPath: "../",
        environment: "browser",
        extensions: [require('buster-qunit')],
        'buster-qunit': {
            html: 'examples/test.html'
        }
    };

All the sources, libraries will be mined out of the html you specify above. You do not need
to specify the ``sources``, ``tests`` or ``libs`` attributes from the configuration,
as you would normally for a BusterJS test configuration,
although if they are specified, the referred sources will be included in addition
to the ones defined by the HTML.

There are some restrictions which may be elevated in later versions:

- Only local files with a path relative to this html can be loaded.
  Remote loading is currently not supported. Load your resources manually into
  a local folder, and use them from there, relatively from the test html location.

- Embedded script tags are currently not processed.

- CSS resources are not loaded. In te unlikely case that your test needed this,
  you could use the setup and teardown to load them as needed.

**THIS FEATURE IS IN PROGRESS!**


2. Async not supported
----------------------

``start()``, ``stop()`` and ``expect(n)`` are not implemented. For most cases, you can use sinon.js's mock
timers for the purpose and avoid writing async tests, or, convert your async tests to such tests.

