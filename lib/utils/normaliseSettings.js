
var isArray = Array.isArray || require('utils').isArray;

// Ensure settings is in format:
// {
//   profiles: [
//     {
//       id: <string>,
//       repositories: [
//         id: <string>,
//         url: <string>
//         ...
//       ]
//     }
//   ]
//   servers: [
//     {
//       id: <string>,
//       username: <string>,
//       password: <string>
//       ...
//   ]
// }
var normaliseSettings = function(settings) {
  if (!settings) {
    return { profiles: [], servers: []};
  }

  return {
    profiles: normaliseProfiles(settings.profiles),
    servers: normaliseServers(settings.servers)
  };
};

var normaliseProfiles = function(profiles) {
  if (!profiles || !profiles.profile) {
    return [];
  }

  var profiles = isArray(profiles.profile) ? profiles.profile : [ profiles.profile ];
  return profiles.map(function(profile) {
    return {
      id: profile.id,
      repositories: normaliseRepositories(profile.repositories)
    };
  });
};

var normaliseServers = function(servers) {
  if (!servers || !servers.server) {
    return [];
  }

  return isArray(servers.server) ? servers.server : [ servers.server ];
};

var normaliseRepositories = function(repositories) {
  if (!repositories || !repositories.repository) {
    return [];
  }

  return isArray(repositories.repository) ? repositories.repository : [ repositories.repository ];
};

module.exports = normaliseSettings;

