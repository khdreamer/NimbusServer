'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    UUID: String,
    highest_score: Array
});

module.exports = mongoose.model('User', User);