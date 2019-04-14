const bcrypt = require('bcrypt');

/**
 *
 * @param password
 * @returns {*}
 */
exports.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

/**
 *
 * @param userPassword
 * @param hashPassword
 * @returns {*}
 */
exports.comparePassword = (userPassword, hashPassword) => {
  return bcrypt.compareSync(userPassword, hashPassword);
};
