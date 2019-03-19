const express = require('express');
const router = express.Router();
const models = require('../../models');
const HttpStatus = require('http-status-codes');
const Token = require('../../utils/token/token');

router.get('/login', function (req, res) {
  models.User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  }).then((user) => {
    if (!user) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    //we will create a token
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Authentication successful!',
      token: Token.createToken({user})
    })

  });
});

router.get('/logout', Token.verifyToken, function(req, res) {
  // jwt can't delete token
  // https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6
  return res.status(HttpStatus.OK).json({
    success: true,
    message: 'token delete',
  })
});

module.exports = router;
