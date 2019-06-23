'use strict';
const Question = require('../../db/models').Question;
const RandomQuestions = require('random-questions');
const questions = [];
const users = [];
const numberQuestionCreate = 11;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('SELECT * FROM "Users"', { type: queryInterface.sequelize.QueryTypes.SELECT })
      .then(user => {
        if (!user) {
          return;
        }
        user.forEach(u => {
          users.push(u.id);
        });
        for (let i = 0; i < numberQuestionCreate; i++) {
          questions.push({
            gameType: Question.GAME_TYPE_QUIZZ,
            userId: users[0],
            question: RandomQuestions.getQuestion(),
            incorrectAnswers: 'Réponse1;Réponse2',
            correctAnswers: 'Réponse3;Réponse4',
            media: 'test',
            resource: 'test',
            resourceMedia: 'test',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        return queryInterface.bulkInsert('Questions', questions, {});
      });
  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Questions', null, {});
  },
};
