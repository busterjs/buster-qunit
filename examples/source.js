(function($) {

$.widget('the.example', {

    options: {
        label: 'Hello World!'
    },

    _create: function() {
        var self = this;
        // save the old text
        this.oldText = this.element.text();
        this.element.text(this.options.label);
    },

    destroy: function() {
        this.element.text(this.oldText);
        $.Widget.prototype.destroy.call(this);
    }

});

$.widget('the.async', {

    options: {
        label: 'Hello World!'
    },

    _create: function() {
        var self = this;
        this.timer = setTimeout(function () {
            // save the old text
            self.oldText = self.element.text();
            self.element.text(self.options.label);
        }, 1000);
    },

    destroy: function() {
        clearTimeout(this.timer);
        if (this.oldText) {
            this.element.text(this.oldText);
        }
        $.Widget.prototype.destroy.call(this);
    }

});

})(jQuery);
