let users = require('../fixtures/users.mock');

module.exports.createUser = (data) => {
  let user =
    {
      id: new Date().getUTCMilliseconds(),
      ...data // Logique spread apparu en ES6
    };
  users.push(user);

  return user;
};

module.exports.getById = (id) => {
  let user = users.filter(p => p.id == id);

  if (!user.length) {

    return false;
  }

  return user;
};
