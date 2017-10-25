var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
const Promise = require('bluebird');

function generateToken(issuerId) {
  return new Promise(function(resolve, reject) {
    var keyPriv = process.env.ROBOCOP_PRIVATE_KEY.replace(/\\n/g, '\n');
    var payload = {
      iat : Math.round(Date.now()/1000),
      exp : Math.round(Date.now()/1000) + 15,
      iss : issuerId
    };

    // sign with RSA SHA256
    var token = jwt.sign(payload, keyPriv, { algorithm: 'RS256'});
    resolve("Bearer " + token);
  });
}

module.exports = {
  generateToken,
}
