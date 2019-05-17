'use strict';
module.exports = (sequelize, DataTypes) => {
  const GameQuestion = sequelize.define(
    'GameQuestion',
    {
      questionId: DataTypes.INTEGER,
      gameId: DataTypes.INTEGER,
    },
    {},
  );
  GameQuestion.associate = function(models) {
    // associations can be defined here
  };
  return GameQuestion;
};
