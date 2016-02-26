var reader = require('./propertiesReader.js');

module.exports = function(source) {
  this.cacheable && this.cacheable();

  var result = reader(source);

  return "module.exports = " + JSON.stringify(result) + ";";
};
