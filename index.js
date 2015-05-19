var path = require('path'),
    cmd = require('./lib/utils/cmd'),
    fs = require('fs'),
    Q = require('q'),
    osenv = require('osenv'),
    extractUser = require('./lib/utils/extractUser'),
    extractPassword = require('./lib/utils/extractPassword'),
    parseString = require('xml2js').parseString;

var fetch = exports.fetch = function() {
  var deferred = Q.defer();
  var m2Path = path.join(osenv.home(), '.m2');
  var settingsXmlPath = path.join(m2Path, 'settings.xml');
  var settingsSecurityXmlPath = path.join(m2Path, 'settings-security.xml');

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

  return deferred.promise;
};
