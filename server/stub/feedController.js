'use strict';

var fs = require('fs');
var Gravatar = require('../gravatar');
var apiMap   = require('../api')(new Gravatar());

var feedController = function ( req, res, next ) {
    var body = fs.readFileSync(__dirname + '/feedData.json');
    var feed = JSON.parse(body);
    var newFeed = apiMap(feed);

    res.send(newFeed);
};

module.exports = feedController;
