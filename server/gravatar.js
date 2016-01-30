'use strict';

var md5 = require('./utils').md5;

var Gravatar = function () {
    this._gravatars = {};
};

Gravatar.prototype.getByEmail = function (emailAddress) {
    if ( ! (emailAddress in this._gravatars)) {
        this._gravatars[emailAddress] = md5(emailAddress);
    }

    return this._gravatars[emailAddress];
};

module.exports = Gravatar;
