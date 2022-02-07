var mongoose = require("mongoose");
var User = mongoose.model("User");
var Friendship = mongoose.model("Friendship");

module.exports.user = function (req, res) {
  if (!req.body.id) {
    res.status(200).json({});
  } else {
    User.findById(req.body.id)
      .populate({
        path: "friendships",
        populate: [{ path: "requester" }, { path: "recipient" }],
      })

      .exec(function (err, user) {
        res.status(200).json(user);
      });
  }
};
module.exports.addFriend = async function (req, res) {
  if (!req.signedUser._id) {
    res.status(401).json({ message: "Non autorisé" });
  } else {
    try {
      var friendship = new Friendship();
      friendship.requester = req.signedUser._id;
      friendship.recipient = req.body._id;
      friendship.relationship = req.body.relationship;

      await friendship.save(async function (err) {
        User.findById(req.signedUser._id).exec(async function (err, requester) {
          requester.addFriendship(friendship._id);
          await requester.save(async function (err) {
            User.findById(req.body._id).exec(async function (
              err,
              recipient
            ) {
              if (err) {
                res.status(401).json({ message: "Utilisateur non trouvé" });
              } else {
                recipient.addFriendship(friendship._id);
                await recipient.save(async function (err) {
                  User.findById(req.signedUser._id)
                    .populate({
                      path: "friendships",
                      populate: [{ path: "requester" }, { path: "recipient" }],
                    })

                    .exec(function (err, user) {
                      res.status(200).json(user);
                    });
                });
              }
            });
          });
        });
      });
    } catch {
      res.status(500).json({ message: "Une erreur est survenue" });
    }
  }
};

module.exports.createAndAddFriend = async function (req, res) {
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
          var friendship = new Friendship();
          friendship.requester = req.signedUser._id;
          friendship.recipient = newFriend._id;
          friendship.relationship = req.body.relationship;

          await friendship.save(async function (err) {
            newFriend.addFriendship(friendship._id);
            await newFriend.save(async function (err) {
              User.findById(req.signedUser._id).exec(async function (
                err,
                requester
              ) {
                requester.addFriendship(friendship._id);
                await requester.save(async function (err) {
                  User.findById(req.signedUser._id)
                    .populate({
                      path: "friendships",
                      populate: [{ path: "requester" }, { path: "recipient" }],
                    })

                    .exec(function (err, user) {
                      res.status(200).json(user);
                    });
                });
              });
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

        if (req.body.friendships) {
          user.friendships = req.body.friendships;
        }
        await user.save();

        User.findById(req.signedUser._id)
          .populate({
            path: "friendships",
            populate: [{ path: "requester" }, { path: "recipient" }],
          })

          .exec(function (err, user) {
            res.status(200).json(user);
          });
      }
    } catch {
      res.status(500).json({ message: "Une erreur est survenue" });
    }
  }
};

module.exports.list = function (req, res) {
  User.find({})
    .populate({
      path: "friendships",
      populate: [{ path: "requester" }, { path: "recipient" }],
    })

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
      .populate({
        path: "friendships",
        populate: [{ path: "requester" }, { path: "recipient" }],
      })

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
