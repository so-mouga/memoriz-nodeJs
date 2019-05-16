'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define(
    'Game',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      cover: DataTypes.STRING,
      isPrivate: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER,
    },
    {},
  );
  Game.associate = function(models) {
    Game.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Game.belongsToMany(models.Question, {
      through: 'GameQuestion',
      as: 'questions',
      foreignKey: 'gameId',
    });
  };
  return Game;
};
