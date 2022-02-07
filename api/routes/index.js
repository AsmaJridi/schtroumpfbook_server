var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = jwt({
  secret: "MY_SECRET",
  userProperty: "signedUser",
  algorithms: ["HS256"],
});

var userController = require("../controllers/user");
var friendshipController = require("../controllers/friendship");
var authController = require("../controllers/authentication");

router.get("/user/profile", auth, userController.profile);
router.get("/user/get", auth, userController.user);
router.get("/user/list", auth, userController.list);
router.get("/user/empty", auth, userController.empty);
router.post("/user/update", auth, userController.update);
router.post("/user/create-add-friend", auth, userController.createAndAddFriend);
router.post("/user/add-friend", auth, userController.addFriend);

router.get("/friendship/list", auth, friendshipController.list);
router.get("/friendship/empty", auth, friendshipController.empty);
router.post("/friendship/update", auth, friendshipController.update);
router.post("/friendship/delete", auth, friendshipController.delete);

// authentication
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
