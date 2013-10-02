define([
    'jquery',
    'lib/underscore',
    'lib/socket.io'
], function($, _, io) {

    var AppView = function($el) {
        this.$el = $el;
        this.events = [];
        this.totalTimeElapsed = 0;
        this.$frameRate = $el.find('.frame-rate');

        this.socket = io.connect();

        _.bindAll(this, 'onMessage');

        this.socket.on('msg', this.onMessage);
        return this;
    };

    AppView.prototype.__defineGetter__('averageTimeElapsed', function() {
        return this.events.length > 0 ? this.totalTimeElapsed / this.events.length : 0;
    });

    AppView.prototype.__defineGetter__('frameRate', function() {
        var averageTimeElapsed = this.averageTimeElapsed;
        return averageTimeElapsed > 0 ? 1000 / averageTimeElapsed : 0;
    });

    AppView.prototype.onMessage = function(data) {
        this.events.push(data.timestamp);

        if (this.events.length > 300) {
            this.events.shift();
        }

        this.totalTimeElapsed = data.timestamp - this.events[0];

        this.$frameRate.text(this.frameRate.toFixed(2));
    };

    // start app

    AppView.prototype.run = function() {
        
    };

    return AppView;
});