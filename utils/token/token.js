const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey = fs.readFileSync('./utils/keys/jwtRS256.key.pub');
const privateKey = fs.readFileSync('./utils/keys/jwtRS256.key');


exports.createToken = (details) => {
  if (typeof details !== 'object') {
    details = {}
  }
  if (details.user || typeof details.user == 'object') {
    let token = jwt.sign(details.user, privateKey, {algorithm: 'RS256'})

    return token
  }
}

exports.verifyToken = (token) => {
  return new Promise(((resolve, reject) => {
    jwt.verify(token, publicKey, function (err, decodedToken) {
      if (err || !decodedToken) {
        return reject(err)
      }
      resolve(decodedToken)
    });
  }))
}

