var path = require('path');
var cmd = require('./lib/utils/cmd');
var fs = require('fs');
var Q = require('q');
var osenv = require('osenv');
var extractUser = require('./lib/utils/extractUser');
var extractPassword = require('./lib/utils/extractPassword');
var parseString = require('xml2js').parseString;

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

      var repo = {};

      var getRepoId = function(cb) {
        for (var i = 0; i < xml.settings.profiles.profile.repositories.repository.length; i++) {
          if(xml.settings.profiles.profile.repositories.repository[i].url.indexOf(repoName) > -1) {
            if(cb) cb(xml.settings.profiles.profile.repositories.repository[i].id);
          }
        }
      };
      var getRepoCredentials = function(cb){
        for (var i = 0; i < xml.settings.servers.server.length; i++) {
          // console.log(xml.settings.servers.server[i]);
          if(xml.settings.servers.server[i].id === repo.id) {
            if(cb) cb({
              "username": xml.settings.servers.server[i].username,
              "password": xml.settings.servers.server[i].password
            });
          }
        }
      };

      if(xml.settings && xml.settings.profiles && xml.settings.profiles.profile.length > 0) {
        getRepoId(function(res) {
          repo.id = res;
        });
      }
      else if (xml.settings && xml.settings.servers && xml.settings.servers.server.length > 0) {
        getRepoCredentials(function(res) {
          deferred.resolve({
            username: res.username,
            password: res.password
          });
        });
      }
      else {
        deferred.reject('No credentials found.');
      }

    });
  } else {
    deferred.reject('No maven configuration found.');
  }

  return deferred.promise;
};
