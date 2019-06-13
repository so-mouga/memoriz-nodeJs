const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const Token = require('../../utils/token/token');
const User = require('../../db/models').User;
const Game = require('../../db/models').Game;
const Question = require('../../db/models').Question;
const Tag = require('../../db/models').Tag;
const Sequelize = require('../../db/models').sequelize;
const Op = Sequelize.Op;

router.all('*', Token.verifyToken);

/* POST create game. */
router.post('/', function(req, res) {
  return createGame(req.body)
    .then(game => {
      res.status(HttpStatus.OK).send(game);
    })
    .catch(error => res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(error.message));
});

async function createGame(game) {
  const userId = game.userId;
  const gameQuestions = game.questions;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw Error(`user not found - id : ${userId}`);
    }

    const questions = await Question.findAll({ where: { id: game.questions } });
    if (questions.length !== gameQuestions.length) {
      throw Error('question not found in array');
    }

    let gameCreated = await Game.create(game);
    await gameCreated.setQuestions(gameQuestions);

    return getGameById(gameCreated.id);
  } catch (e) {
    throw Error(e);
  }
}

/**
 * Get Game by id with the relations
 *
 * @param id
 * @returns {Promise<Game>}
 */
function getGameById(id) {
  return Game.findOne({
    where: { id: id },
    attributes: {
      exclude: ['userId'],
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'userName'],
      },
      {
        model: Question,
        as: 'questions',
        through: { attributes: [] },
        include: [
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
      },
    ],
  });
}

module.exports = router;
