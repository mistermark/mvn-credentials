var mvnCredentials = require('./');
var request = require('request');

var promise = mvnCredentials.fetch();
promise
  .then(function (credentials) {
    console.log(credentials);

    request({
      auth: {
        'user': credentials.username,
        'pass': credentials.password
      },
      url: 'http://www.google.com'
    }, function (err, res, body) {
      if (err) return console.error(err);

      console.log(body);

    });
  }).fail(function (err) {
    throw new Error(err);
  });

