const express = require('express');
const router = express.Router();
const Sequelize = require('../../db/models').sequelize;
const Tag = require('../../db/models').Tag;
const HttpStatus = require('http-status-codes');
const Token = require('../../utils/token/token');
const Op = Sequelize.Op;

router.all('*', Token.verifyToken);

router.get('/', function(req, res) {
  return Tag.findAll({
    where: {
      name: {
        [Op.like]: `${req.query.name}%`,
      },
    },
  }).then(resu => res.status(HttpStatus.OK).send(resu));
});

module.exports = router;
