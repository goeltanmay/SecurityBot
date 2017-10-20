var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');

function generateToken(filepath, issuerId) {

  var filepath = 'C:\\Users\\admin\\Downloads\\robocop.2017-10-19.private-key.pem'
  var keyPriv = fs.readFileSync(filepath);

  var payload = {
    iat : Math.round(Date.now()/1000),
    exp : Math.round(Date.now()/1000) + 15,
    iss : issuerId
  };

  // sign with RSA SHA256
  var token = jwt.sign(payload, keyPriv, { algorithm: 'RS256'});
  return token;
}

module.exports = {
  generateToken,
}
