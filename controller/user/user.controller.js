const express    = require('express');
const router     = express.Router();
const models     = require( '../../models');
const HttpStatus = require('http-status-codes');
const Token      = require('../../utils/token/token');

/* GET users. */
router.get('/', function(req, res) {
  models.User.findAll().then(user => {
    return res.status(HttpStatus.OK).send(user)
  })
});

/* GET user by id. */
router.get('/:id', function(req, res) {
  const userId = req.params.id;
  models.User.findOne({
    where: { id: userId }
  }).then(user => {
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send(`user not found - id : ${userId}`);
    }
    return res.status(HttpStatus.OK).send(user.dataValues);
  })
});

/* POST create user. */
router.post('/', function(req, res) {
  models.User.create(req.body).then(user => {
    return res.status(HttpStatus.CREATED).send(user);
  }).catch((error) => {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(error.message);
  });
});

/* PUT update user. */
router.put('/:id', function(req, res) {
  const userId = req.params.id;
  models.User.findOne({
    where: { id: userId }
  }).then(user => {
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send(`user not found - id : ${userId}`);
    }
    models.User.update(
      {
        userName: req.body.userName,
        profileType: req.body.profileType,
        email: req.body.email,
        password: req.body.password,
      },
      {
        returning: true,
        where: {id: userId}
      }
    ).then(function([ rowsUpdate, [user] ]) {
      return res.status(HttpStatus.OK).send(user);
    }).catch((e) => res.status(HttpStatus.NOT_ACCEPTABLE).send(e.message))
  })
});


//PUT THE METHOD VERIFYTOKEN ON ALL ROUTES
router.all('*', Token.verifyToken)

module.exports = router;
