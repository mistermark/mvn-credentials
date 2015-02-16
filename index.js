var path = require('path'),
    fs = require('fs'),
    osenv = require('osenv'),
    parseString = require('xml2js').parseString;

var fetch = exports.fetch = function(callback) {

  var credentials = {};
  var xmlData = fs.readFileSync(path.join(osenv.home(), '.m2') + '/settings.xml');//, function(err, data) {

  parseString(xmlData, {explicitArray: false}, function (err, xml) {

    credentials.username = xml.settings.servers.server[0].username;
    credentials.password = xml.settings.servers.server[0].password;

  });

  return credentials;

};
