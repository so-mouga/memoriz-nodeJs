'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return Promise.all([queryInterface.renameColumn('Users', 'userName', 'username')]);
  },
  down: function(queryInterface, Sequelize) {
    return Promise.all([queryInterface.renameColumn('Users', 'username', 'userName')]);
  },
};
