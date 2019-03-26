const express = require('express');
const router = express.Router();
const models = require('../../db/models');
const HttpStatus = require('http-status-codes');
const Token = require('../../utils/token/token');

router.post('/login', function(req, res) {
  models.User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password,
    },
  }).then(user => {
    if (!user) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    //we will create a token
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Authentication successful!',
      token: Token.createToken({ id: user.id, userName: user.userName }),
    });
  });
});

module.exports = router;
