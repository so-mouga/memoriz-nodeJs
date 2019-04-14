'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
    {
      gameType: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      question: DataTypes.STRING,
      incorrectAnswers: {
        type: DataTypes.STRING,
        get() {
          if (undefined !== this.getDataValue('incorrectAnswers')) {
            return this.getDataValue('incorrectAnswers').split(';');
          }
        },
        set(val) {
          this.setDataValue('incorrectAnswers', val.join(';'));
        },
      },
      correctAnswers: {
        type: DataTypes.STRING,
        get() {
          if (undefined !== this.getDataValue('correctAnswers')) {
            return this.getDataValue('correctAnswers').split(';');
          }
        },
        set(val) {
          this.setDataValue('correctAnswers', val.join(';'));
        },
      },
      media: DataTypes.STRING,
      resource: DataTypes.STRING,
      resourceMedia: DataTypes.STRING,
    },
    {},
  );
  Question.associate = function(models) {
    Question.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Question.belongsToMany(models.Tag, {
      through: 'QuestionTag',
      as: 'tags',
      foreignKey: 'questionId',
    });
  };
  return Question;
};
