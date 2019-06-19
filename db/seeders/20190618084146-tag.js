'use strict';
const Faker = require('faker');
let tags = [];

for (let i = 0; i < 11; i++) {
  tags.push({
    name: Faker.name.title(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('Tags', tags, {});
  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Tags', null, {});
  },
};
