var path = require('path'),
    fs = require('fs'),
    osenv = require('osenv'),
    parseString = require('xml2js').parseString;

var fetch = exports.fetch = function(callback) {

  var credentials = {};
  var xmlData = fs.readFileSync(path.join(osenv.home(), '.m2') + '/settings.xml');

  parseString(xmlData, {explicitArray: false}, function (err, xml) {

    var server = (xml.settings.servers.server[0] || xml.settings.servers.server);
    credentials.username = server.username;
    credentials.password = server.password;

  });

  return credentials;

};
