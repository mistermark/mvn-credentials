var mvnCredentials = require('./'),
    request = require('request'),
    util = require('util');

var promise = mvnCredentials.fetch();
promise
    .then(function (){
        console.log(arguments);
    });
//var credentials = mvnCredentials.fetch();
//request({
//    auth: {
//      'user': credentials.username,
//      'pass': credentials.password
//    },
//    url: 'www.google.com'
//}, function(err, res, body) {
//
//  if(err) return util.error(err);
//
//  console.log(body);
//
//});
