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
        this.$minLatency = $el.find('.min-latency');
        this.$maxLatency = $el.find('.max-latency');
        this.$avgLatency = $el.find('.avg-latency');

        this.socket = io.connect();

        _.bindAll(this, 'onMessage');

        this.socket.on('msg', this.onMessage);
        return this;
    };

    AppView.prototype.__defineGetter__('averageTimeElapsed', function() {
        return this.events.length > 0 ? this.totalTimeElapsed / this.events.length : 0;
    });

    AppView.prototype.__defineGetter__('minLatency', function() {
        var events = this.events;
        return events.length > 0 ? _.chain(_.zip(events.slice(0,-1), events.slice(1)))
                                            .map(function(x) {
                                                return x[1] - x[0];
                                            })
                                            .min()
                                            .value() : 0;
    });

    AppView.prototype.__defineGetter__('maxLatency', function() {
        var events = this.events;
        return events.length > 0 ? _.chain(_.zip(events.slice(0,-1), events.slice(1)))
                                            .map(function(x) {
                                                return x[1] - x[0];
                                            })
                                            .max()
                                            .value() : 0;
    });

    AppView.prototype.__defineGetter__('frameRate', function() {
        var averageTimeElapsed = this.averageTimeElapsed;
        return averageTimeElapsed > 0 ? 1000 / averageTimeElapsed : 0;
    });

    AppView.prototype.onMessage = function(data) {
        var now = new Date().getTime()
        this.events.push(now);

        if (this.events.length > 30) {
            this.events.shift();
        }

        this.totalTimeElapsed = now - this.events[0];

        this.$frameRate.text(this.frameRate.toFixed(2));
        this.$minLatency.text(this.minLatency.toFixed(2));
        this.$maxLatency.text(this.maxLatency.toFixed(2));
        this.$avgLatency.text(this.averageTimeElapsed.toFixed(2));
    };

    // start app

    AppView.prototype.run = function() {
        
    };

    return AppView;
});