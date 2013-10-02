var crypto = require('crypto'),
    _ = require('underscore');

module.exports.generateId = function() {
    return crypto.createHash('sha1').update(Math.random().toString()).digest('hex').substr(0, 7);
};
