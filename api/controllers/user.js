var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports.user = function (req, res) {
  if (!req.body.id) {
    res.status(200).json({});
  } else {
    User.findById(req.body.id).exec(function (err, user) {
      res.status(200).json(user);
    });
  }
};

module.exports.users = function (req, res) {
  User.find({}).exec(function (err, users) {
    res.status(200).json(users);
  });
};

module.exports.profile = function (req, res) {
  if (!req.signedUser._id) {
    res.status(401).json({
      message: "Non autorisé",
    });
  } else {
    User.findById(req.signedUser._id).exec(function (err, user) {
      res.status(200).json(user);
    });
  }
};
