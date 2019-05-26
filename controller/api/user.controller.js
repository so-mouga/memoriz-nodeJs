const express = require('express');
const router = express.Router();
const models = require('../../db/models');
const HttpStatus = require('http-status-codes');
const Token = require('../../utils/token/token');
const Password = require('../../utils/password/password');
const UserNotifier = require('../../utils/mailer/notifier/user-notifier');
const UserManager = require('../../manager/user.manager');

/* GET users. */
router.get('/', Token.verifyToken, function(req, res) {
  models.User.findAll({ attributes: { exclude: ['password'] } }).then(user => {
    return res.status(HttpStatus.OK).send(user);
  });
});

/* GET user by id. */
router.get('/:id', Token.verifyToken, function(req, res) {
  const userId = req.params.id;
  models.User.findOne({
    attributes: { exclude: ['password'] },
    where: { id: userId },
  }).then(user => {
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send(`user not found - id : ${userId}`);
    }
    return res.status(HttpStatus.OK).send(user.dataValues);
  });
});

/* POST create user. */
router.post('/', function(req, res) {
  req.body.password = Password.generateHash(req.body.password);
  models.User.create(req.body)
    .then(user => {
      //Token for verify user in mail
      const urlToken = Token.createToken(
        {
          id: user.id,
          userName: user.userName,
          email: user.email,
        },
        '10d',
      );

      //Send a mail to user for validate account
      if (UserNotifier.sendMailValidationUser(user, urlToken) === 'err') {
        return res.status(HttpStatus.BAD_REQUEST);
      }
      return res.status(HttpStatus.CREATED).send(user);
    })
    .catch(error => {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(error.message);
    });
});

/* PUT update user. */
router.put('/:id', Token.verifyToken, function(req, res) {
  const userId = req.params.id;
  models.User.findOne({
    where: { id: userId },
  }).then(user => {
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send(`user not found - id : ${userId}`);
    }
    models.User.update(req.body, {
      returning: true,
      where: { id: userId },
    })
      .then(function([rowsUpdate, [user]]) {
        return res.status(HttpStatus.OK).send(user);
      })
      .catch(e => {
        return res.status(HttpStatus.NOT_ACCEPTABLE).send(e.message);
      });
  });
});

/* Valid user */
router.get('/verify/account', function(req, res) {
  if (Token.tokenIsValid(req.query.token) === false) {
    return res.render('user/token-not-validated');
  }

  const user = Token.tokenIsValid(req.query.token).data;

  models.User.update(
    {
      isValidated: true,
    },
    {
      returning: true,
      where: { id: user.id },
    },
  );

  return res.render('user/account-validated', {
    name: user.userName,
    urlConnexion: `${process.env.CLIENT_URL}/log-in`,
  });
});

module.exports = router;
