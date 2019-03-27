'use strict';

var properties = require('properties');

module.exports = function (source) {
  return properties.parse(source);
};
