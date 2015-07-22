# MVN Credentials

This module gets your Maven credentials from the `~/.m2` folder on your system, if it exists.

[![Build Status](https://travis-ci.org/mistermark/mvn-credentials.svg?branch=master)](https://travis-ci.org/mistermark/mvn-credentials)

## Installation

Install the module in the usual way

```
$ npm install mvn-credentials
```

## Quick Start (tl;dr)

```
$ npm install mvn-credentials request
```

```
var request = require('request');
var mvnCredentials = require('mvn-credentials');

var promise = mvnCredentials.fetch();
promise
  .then(function (credentials) {
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
```


## Usage

First make sure your Node app knows about the module by requiring it

    var mvnCredentials = require('mvn-credentials');

Then in the place you want to use the credentials, for an `http.request` for example,
fill in the details by using the following markup:

    var credentials = repoCredentials.fetch();

`repoCredentials.fetch()` will return a Promise with credentials payload:

```
{
  username: "username",
  password: "password"
}
```

In your `http.request` you can use the credentials in the headers

    var options = {
      hostname: 'http://www.google.com',
      port: '80',
      path: '/upload',
      method: 'POST',
      auth: credentials.username + ':' + credentials.password
    };

    http.request(options, function(res) {
      console.log(res.body);
    });

Or when you're using the `request` module instead:

    request({
        auth: {
          'user': credentials.username,
          'pass': credentials.password
        },
        url: 'www.google.com'
    }, function(err, res, body) {

      if(err) return util.err(err);

      console.log(body);

    });

## Contributors

Mark de Jong <mark@markdejong.com>

## Thanks & Credits

[Gabriele di Stefano](https://github.com/gabrieleds) for inspiring me to do more with NodeJS.

## License

[MIT License](https://github.com/mistermark/mvn-credentials/blob/develop/LICENSE)
