'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      gameType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      question: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      incorrectAnswers: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      correctAnswers: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      media: {
        type: Sequelize.STRING,
      },
      resource: {
        type: Sequelize.STRING,
      },
      resourceMedia: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Questions');
  },
};
