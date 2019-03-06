let express     = require('express');
let router      = express.Router();
let users       = require('../fixtures/users.mock');
let response    = require('../utils/parse.response');
let userManager = require('../manager/user.manager');
const models    = require( '../models/index');

/* GET users listing. */
router.get('/', function(req, res, next) {
    models.User.findAll().then(user => {
      if(!user){
          res.send(response.error(res, 'users not match'));
          return;
      }
        res.send(user)
    })
});

/* GET users by id. */
router.get('/:id', function(req, res, next) {
  let userId = req.params['id'];
  //let user   = userManager.getById(userId);
    let user = models.User.findOne({
        where: {id: userId}
    }).then(user => {
        if (!user) {
            res.send(response.error(res, 'id: ' + userId + ' not match'));
            return;
        }
        res.send(response.success(user.dataValues));
    })
});

/* POST create user. */
router.post('/', function(req, res, next) {
  let user = req.body;

  let { userName, dateOfBirth, profilType, email, password } = user;  // Destructuration objet

  if (!(email && password)) {
    res.send(response.error(res, 'Field missing'));
    return;
  }
  models.User.create(user).then(user => {
    res.send('user created!');
  });
});

module.exports = router;
