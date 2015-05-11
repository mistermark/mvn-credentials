var mvnCredentials = require('./'),
    request = require('request'),
    util = require('util');

var promise = mvnCredentials.fetch();
promise
    .then(function (credentials){
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
    });

