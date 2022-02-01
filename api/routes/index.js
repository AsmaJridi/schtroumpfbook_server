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

router.get('/profile', auth, userController.profile);
router.get('/user', auth, userController.user);
router.get('/users', auth, userController.users);

// authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
