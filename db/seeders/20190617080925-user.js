'use strict';
const Faker = require('faker');
const User = require('../../db/models').User;
const password = require('../../utils/password/password');
const numberUserCreate = 11;
let users = [];

users.push({
  username: 'memoriz',
  dateOfBirth: new Date(),
  email: 'memoriz@gmail.com',
  password: password.generateHash('memoriz'),
  createdAt: new Date(),
  updatedAt: new Date(),
  profileType: User.PROFILE_TYPE_STUDENT,
  isValidated: true,
});

for (let i = 0; i < numberUserCreate; i++) {
  users.push({
    username: Faker.name.firstName().toLowerCase(),
    dateOfBirth: new Date(),
    email: `memoriz${i}@gmail.com`.toLowerCase(),
    password: password.generateHash('memoriz'),
    createdAt: new Date(),
    updatedAt: new Date(),
    profileType: User.PROFILE_TYPE_TEACHER,
    isValidated: true,
  });
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('Users', users, {});
  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Users', null, {});
  },
};
