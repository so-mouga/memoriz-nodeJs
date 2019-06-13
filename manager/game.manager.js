const User = require('./../db/models').User;
const Game = require('./../db/models').Game;
const Question = require('./../db/models').Question;
const Tag = require('./../db/models').Tag;
const Sequelize = require('./../db/models').sequelize;

/**
 * Get Game by id with the relations
 *
 * @param id
 * @returns {Promise<Game>}
 */
module.exports.getGameById = id => {
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
};
