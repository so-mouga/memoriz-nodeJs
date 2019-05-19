'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Users', 'userName', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('Users', 'profileType', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('Users', 'email', {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      }),
      queryInterface.changeColumn('Users', 'password', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      // queryInterface.renameColumn('Users', 'profilType', 'profileType'),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Users', 'userName', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('Users', 'profileType', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('Users', 'email', {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true,
      }),
      queryInterface.changeColumn('Users', 'password', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      // queryInterface.renameColumn('Users', 'profileType', 'profilType'),
    ]);
  },
};
