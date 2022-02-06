var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports.user = function (req, res) {
  if (!req.body.id) {
    res.status(200).json({});
  } else {
    User.findById(req.body.id)
      .populate("friends")
      .exec(function (err, user) {
        res.status(200).json(user);
      });
  }
};

module.exports.addNewFriend = async function (req, res) {
  if (!req.signedUser._id) {
    res.status(401).json({ message: "Non autorisé" });
  } else {
    try {
      const user = await User.findOne({ _id: req.signedUser._id });
      if (!user) {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      } else {
        var newFriend = new User();

        newFriend.name = req.body.name;
        newFriend.email = req.body.email;

        newFriend.setPassword(req.body.password);

        await newFriend.save(async function (err) {
          var friendsList = user.friends;
          friendsList.push(newFriend._id);
          user.friends = friendsList;
          await user.save(async function (err) {
            User.findById(req.signedUser._id)
              .populate("friends")
              .exec(function (err, user) {
                res.status(200).json(user);
              });
          });
        });
      }
    } catch {
      res.status(500).json({ message: "Une erreur est survenue" });
    }
  }
};

module.exports.update = async function (req, res) {
  if (!req.signedUser._id) {
    res.status(401).json({ message: "Non autorisé" });
  } else {
    try {
      const user = await User.findOne({ _id: req.signedUser._id });
      if (!user) {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      } else {
        if (req.body.name) {
          user.name = req.body.name;
        }

        if (req.body.email) {
          user.email = req.body.email;
        }

        if (req.body.role) {
          user.role = req.body.role;
        }

        if (req.body.friends) {
          user.friends = req.body.friends;
        }
        await user.save();

        User.findById(req.signedUser._id)
          .populate("friends")
          .exec(function (err, user) {
            res.status(200).json(user);
          });
      }
    } catch {
      res.status(500).json({ message: "Une erreur est survenue" });
    }
  }
};

module.exports.users = function (req, res) {
  User.find({})
    .populate("friends")
    .exec(function (err, users) {
      res.status(200).json(users);
    });
};

module.exports.profile = function (req, res) {
  if (!req.signedUser._id) {
    res.status(401).json({
      message: "Non autorisé",
    });
  } else {
    User.findById(req.signedUser._id)
      .populate("friends")
      .exec(function (err, user) {
        res.status(200).json(user);
      });
  }
};

module.exports.empty = function (req, res) {
  User.deleteMany({}).exec(function (err) {
    res.status(200).json({
      message: "Vidange terminé",
    });
  });
};
