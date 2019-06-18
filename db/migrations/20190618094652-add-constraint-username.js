'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TABLE "Users" ADD CONSTRAINT unique_user_name UNIQUE ("username");');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TABLE "Users" DROP CONSTRAINT unique_user_name;');
  },
};
