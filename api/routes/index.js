var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'signedUser',
  algorithms: ["HS256"]
});


var userController = require('../controllers/user');
var authController = require('../controllers/authentication');

router.get('/user/profile', auth, userController.profile);
router.get('/user/get', auth, userController.user);
router.get('/user/list', auth, userController.users);
router.post('/user/update', auth, userController.update);

// authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
