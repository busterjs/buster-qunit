
module('the-example', {
/*
    setup: function() {
    },

    teardown: function() {
    }
*/
});


test("Create / destroy", function() {

    $('#the-node').example({
    });

    $('#the-node').example('destroy');

});


test("Changes label", function() {

    $('#the-node').example({
    });
    equal($('#the-node').text(), 'Hello World!');

    $('#the-node').example('destroy');
    equal($('#the-node').text(), 'The Node Text');

});


test("Label option", function() {

    $('#the-node').example({
        label: 'Buster.js is awesome!'
    });
    equal($('#the-node').text(), 'Buster.js is awesome!');

    $('#the-node').example('destroy');
    equal($('#the-node').text(), 'The Node Text');

});



module('the-async', {
/*
    setup: function() {
    },

    teardown: function() {
    }
*/
});


test("Create / destroy", function() {

    $('#the-node').async({
    });

    $('#the-node').async('destroy');

});


test("Changes label", function() {

    expect(2);
    stop();

    $('#the-node').async({
    });

    setTimeout(function () {
        
        equal($('#the-node').text(), 'Hello World!');

        $('#the-node').async('destroy');
        equal($('#the-node').text(), 'The Node Text');

        start();

    }, 2000);

});


test("Label option", function() {

    expect(2);
    stop();

    $('#the-node').async({
        label: 'Buster.js is awesome!'
    });

    setTimeout(function () {
        
        equal($('#the-node').text(), 'Buster.js is awesome!');

        $('#the-node').async('destroy');
        equal($('#the-node').text(), 'The Node Text');
        
        start();

    }, 2000);

});


