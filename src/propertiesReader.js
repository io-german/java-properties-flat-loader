'use strict';

var sync = require('synchronize');
var properties = require('properties');

module.exports = function (source) {
  sync(properties, 'parse');
  return properties.parse(source);
};
