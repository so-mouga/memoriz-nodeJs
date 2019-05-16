'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: DataTypes.DATE,
      profileType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: {
          args: true,
          msg: "L'adresse email est déjà utilisée",
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {},
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Question, {
      foreignKey: 'userId',
      as: 'questions',
    });
    User.hasMany(models.Game, {
      foreignKey: 'userId',
      as: 'games',
    });
  };
  return User;
};
