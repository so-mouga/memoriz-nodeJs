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
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else if (user) {
      // Check if password matches
      if (user.password !== req.body.password) {
        res.sendStatus(HttpStatus.LOCKED);
      } else {
        //if user is found and the password matched
        //we will create a token
        res.json({
          success: true,
          message: 'You have a token',
          token: Token.createToken({user})
        })
      }
    }
  });
});

router.get('/logout', function(req, res) {
  if(req.session) {
    //delete session object
    res.session.destroy(function (err) {
      if(err){
        return res.sendStatus(HttpStatus.CONFLICT)
      } else {
        return res.redirect('/')
      }
    })
  }
});

module.exports = router;
