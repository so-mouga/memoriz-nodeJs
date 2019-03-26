const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKey = fs.readFileSync('./utils/keys/jwtRS256.key.pub');
const privateKey = fs.readFileSync('./utils/keys/jwtRS256.key');

exports.createToken = details => {
  if (typeof details !== 'object') {
    details = {};
  }
  if (details || typeof details == 'object') {
    const options = {
      expiresIn: '30d', // 30 days validity
      algorithm: 'RS256',
    };
    return jwt.sign({ data: details }, privateKey, options);
  }
  return null;
};

exports.verifyToken = (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: 'need token' });
  }

  jwt.verify(token, publicKey, function(err, decodedToken) {
    if (err || !decodedToken) {
      return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: err.message });
    }
    req.user = decodedToken;
    next();
  });
};

function getToken(req) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token || !token.startsWith('Bearer ')) {
    return null;
  }
  return token.slice(7, token.length);
}
