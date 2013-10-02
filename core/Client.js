var util = require('../util'),
    _ = require('underscore');

var Client = module.exports = function(socket) {
    this.id = util.generateId();
    this.socket = socket;
    this.frameRate = 30;

    _.bindAll(this, 'pulse');

    this.pulse();
};

Client.prototype.pulse = function() {
    this.socket.emit('msg', { timestamp: new Date().getTime() });

    setTimeout(this.pulse, 1000 / this.frameRate);
};
