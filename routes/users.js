let express     = require('express');
let router      = express.Router();
let users       = require('../fixtures/users.mock');
let response    = require('../utils/parse.response');
let userManager = require('../manager/user.manager');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(response.success(users));
});

/* GET users by id. */
router.get('/:id', function(req, res, next) {
  let userId = req.params['id'];
  let user   = userManager.getById(userId);

  if (!user) {
    res.send(response.error(res, 'id: ' + userId + ' not match'));
    return;
  }

  res.send(response.success(user));
});

/* POST create user. */
router.post('/', function(req, res, next) {
  let user = req.body;
  let { firstName, lastName } = user; // Destructuration objet

  if (!(lastName && firstName)) {
    res.send(response.error(res, 'Field missing'));
  }

  userManager.createUser(user);
  res.send(response.success(user));
});

module.exports = router;
