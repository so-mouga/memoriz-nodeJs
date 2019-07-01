const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
let publicKey;
let privateKey;

exports.createToken = (payload, expiresIn = '30d') => {
  setTokenKey();

  if (typeof payload !== 'object') {
    payload = {};
  }
  if (payload || typeof payload == 'object') {
    const options = {
      expiresIn: expiresIn,
      algorithm: 'RS256',
    };
    return jwt.sign({ data: payload }, privateKey, options);
  }
  return null;
};

exports.verifyToken = (req, res, next) => {
  setTokenKey();

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

exports.tokenIsValid = token => {
  return jwt.verify(token, publicKey, function(err, decodedToken) {
    if (err || !decodedToken) {
      return false;
    }
    return decodedToken;
  });
};

function setTokenKey() {
  publicKey = Buffer.from(String(process.env.JWT_PUBLIC_KEY), 'base64');
  privateKey = Buffer.from(String(process.env.JWT_PRIVATE_KEY), 'base64');
}

function getToken(req) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token || !token.startsWith('Bearer ')) {
    return null;
  }
  return token.slice(7, token.length);
}
