var path = require('path');
var cmd = require('./lib/utils/cmd');
var fs = require('fs');
var Q = require('q');
var osenv = require('osenv');
var extractUser = require('./lib/utils/extractUser');
var extractPassword = require('./lib/utils/extractPassword');
var parseString = require('xml2js').parseString;

exports.fetch = function() {
  var deferred = Q.defer();
  var m2Path = path.join(osenv.home(), '.m2');
  var settingsXmlPath = path.join(m2Path, 'settings.xml');
  var settingsSecurityXmlPath = path.join(m2Path, 'settings-security.xml');

  var settingsExists = fs.existsSync(settingsXmlPath);
  var secureSettingsExists = fs.existsSync(settingsSecurityXmlPath);

  if (settingsExists && secureSettingsExists) {
    cmd(__dirname + '/lib/settings-decoder/bin/settings-decoder', ['-f', settingsXmlPath, '-s', settingsSecurityXmlPath])
      .then(function (stdout){
          var username = extractUser(stdout[0]);
          var password = extractPassword(stdout[0]);
          deferred.resolve({
              username: username,
              password: password
          });
      })
      .fail(deferred.reject);
  } else if (settingsExists) {
    parseString(fs.readFileSync(settingsXmlPath), {explicitArray: false}, function (err, xml) {
      if (err) {
        deferred.reject(err);
        return;
      }

      if (xml.settings && xml.settings.servers && xml.settings.servers.server[0]) {
        var username = xml.settings.servers.server[0].username;
        var password = xml.settings.servers.server[0].password;

        deferred.resolve({
            username: username,
            password: password
        });
      } else {
        deferred.reject('No credentials found.');
      }
    });
  } else {
    deferred.reject('No maven configuration found.')
  }

  return deferred.promise;
};
