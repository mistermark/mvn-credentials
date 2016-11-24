var path = require('path');
var cmd = require('./lib/utils/cmd');
var fs = require('fs');
var Q = require('q');
var osenv = require('osenv');
var extractUser = require('./lib/utils/extractUser');
var extractPassword = require('./lib/utils/extractPassword');
var normaliseSettings = require('./lib/utils/normaliseSettings');
var parseString = require('xml2js').parseString;

var getRepoId = function(repoName, profiles) {
  // For each profile
  for (var i = 0; i < profiles.length; i++) {
    var profile = profiles[i];
    for (var j = 0; j < profile.repositories.length; j++) {
      var repo = profile.repositories[j];
      if (repo.url.indexOf(repoName) > -1) {
        return repo.id;
      }
    }
  }
};

var firstRepoId = function(profiles) {
  var firstProfile = profiles[0];
  if (!firstProfile) {
    return;
  }

  var firstRepo = firstProfile.repositories[0];
  if (!firstRepo) {
    return;
  }

  return firstRepo.id;
};

var getRepoCredentials = function(repoId, servers) {
  for (var i = 0; i < servers.length; i++) {
    if (servers[i].id === repoId) {
      return {
        username: servers[i].username,
        password: servers[i].password
      };
    }
  }
};

exports.fetch = function(repoName) {
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

      var settings = normaliseSettings(xml.settings);
      var repoId = getRepoId(repoName, settings.profiles) || firstRepoId(settings.profiles);

      if (repoId) {
        var credentials = getRepoCredentials(repoId, settings.servers);
        if (credentials) {
          return deferred.resolve(credentials)
        }
      }

      deferred.reject('No credentials found.');
    });
  } else {
    deferred.reject('No maven configuration found.');
  }

  return deferred.promise;
};
