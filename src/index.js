module.exports = function(source) {
  this.cacheable && this.cacheable();

  var result = {};

  var lines = source.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[ i ];

    var equalSignIndex = line.indexOf('=');
    var key = line.substring(0, equalSignIndex).trim();
    result[key] = line.substring(equalSignIndex + 1).trim();
  }

  return "module.exports = " + JSON.stringify(result) + ";";
};
