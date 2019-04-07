const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const Token = require('../../utils/token/token');
const Tag = require('../../db/models').Tag;
const Question = require('../../db/models').Question;
const User = require('../../db/models').User;
const sequelize = require('../../db/models').sequelize;

router.all('*', Token.verifyToken);

// todo add query params and pagination
router.get('/', function(req, res) {
  Question.findAll({
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
        model: Tag,
        as: 'tags',
        attributes: ['id', 'name'],
        through: { attributes: [] },
      },
    ],
  })
    .then(question => {
      return res.status(HttpStatus.OK).send(question);
    })
    .catch(error => {
      res.status(HttpStatus.BAD_REQUEST).send(error);
    });
});

router.get('/:id', (req, res) => {
  const questionId = req.params.id;
  getQuestionById(questionId).then(question => {
    if (!question) {
      return res.status(HttpStatus.NOT_FOUND).send(`Question not found - id : ${questionId}`);
    }
    return res.status(HttpStatus.OK).send(question);
  });
});

router.post('/', function(req, res) {
  const data = req.body;
  if (typeof data.tags === 'undefined' || data.tags.length === 0) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send('fields [tags] missing');
  }
  //todo create a sequelize.transaction
  return User.findByPk(data.userId).then(user => {
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send(`user not found - id : ${data.userId}`);
    }

    let idTagsFindOrCreate = [];
    let promisesTags = findOrCreateTagsByName(data.tags);
    Promise.all(promisesTags)
      .then(function(tags) {
        tags.forEach(tag => {
          // set array of tag id to update questionTags
          idTagsFindOrCreate.push(tag[0].id);
        });
        return createQuestion(data, idTagsFindOrCreate)
          .then(resu => res.status(HttpStatus.CREATED).send(resu))
          .catch(error => res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(error.message));
      })
      .catch(error => {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      });
  });
});

router.delete('/:id', (req, res) => {
  return Question.findByPk(req.params.id)
    .then(question => {
      if (!question) {
        return res.status(HttpStatus.NOT_FOUND).send('Question not found');
      }
      return question
        .destroy()
        .then(() => res.status(HttpStatus.NO_CONTENT).send())
        .catch(error => res.status(HttpStatus.BAD_REQUEST).send(error));
    })
    .catch(error => res.status(HttpStatus.BAD_REQUEST).send(error));
});

router.put('/:id', function(req, res) {
  const questionId = req.params.id;
  const data = req.body;

  Question.findByPk(questionId)
    .then(question => {
      if (!question) {
        return res.status(HttpStatus.NOT_FOUND).send('Question not found');
      }

      let idTagsFindOrCreate = [];
      let promisesTags = findOrCreateTagsByName(data.tags);

      Promise.all(promisesTags)
        .then(tags => {
          tags.forEach(tag => {
            // set array of tag id to update questionTags
            idTagsFindOrCreate.push(tag[0].id);
          });

          updateQuestionAndTags(question, data, idTagsFindOrCreate)
            .then(question => res.status(HttpStatus.OK).send(question))
            .catch(error => res.status(HttpStatus.BAD_REQUEST).send(error.message));
        })
        .catch(error => {
          return res.status(HttpStatus.BAD_REQUEST).send(error.message);
        });
    })
    .catch(error => res.status(HttpStatus.BAD_REQUEST).send(error));
});

/**
 * function async in order to create question and return the new question with association
 *
 * @param data
 * @param tags
 * @returns {Promise<void>}
 */
async function createQuestion(data, tags) {
  let question = await Question.create(data);
  await question.setTags(tags);
  return getQuestionById(question.id);
}

/**
 * function async in order to update question and return the new question with association
 *
 * @param question
 * @param data
 * @param tags
 * @returns {Promise<*>}
 */
async function updateQuestionAndTags(question, data, tags) {
  try {
    await question.update(data);
    await question.setTags(tags);
    return getQuestionById(question.id);
  } catch (error) {
    return error;
  }
}

/**
 * Find or create array of tags and return an array of promise
 * @see https://stackoverflow.com/questions/40398376/how-to-add-promise-all-in-node-js-sequelize-findorcreate-in-loop/40400437
 *
 * @param tags
 * @returns {Promise<Model>[]}
 */
function findOrCreateTagsByName(tags) {
  return tags.map(function(name) {
    return Tag.findOrCreate({ where: { name: name.replace(/\s/g, '') } });
  });
}

/**
 * Get Question by id with the relations
 *
 * @param id
 * @returns {Promise<Model>}
 */
function getQuestionById(id) {
  return Question.findOne({
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
        model: Tag,
        as: 'tags',
        attributes: ['id', 'name'],
        through: { attributes: [] }, // don't return association user of tag
      },
    ],
  });
}

module.exports = router;
