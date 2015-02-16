var mvnCredentials = require('mvn-credentials'),
    request = require('request'),
    util = require('util');

var credentials = mvnCredentials.fetch();

request({
    auth: {
      'user': credentials.username,
      'pass': credentials.password
    },
    url: 'www.google.com'
}, function(err, res, body) {

  if(err) return util.error(err);

  console.log(body);

});
