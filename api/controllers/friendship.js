var mongoose = require("mongoose");
var Friendship = mongoose.model("Friendship");
var User = mongoose.model("User");

module.exports.update = async function (req, res) {
  if (!req.signedUser._id) {
    res.status(401).json({ message: "Non autorisé" });
  } else {
    try {
      const friendship = await Friendship.findOne({ _id: req.body._id });
      if (!friendship) {
        res.status(404).json({ message: "Friendship non trouvé" });
      } else {
        if (req.body.relationship) {
          friendship.relationship = req.body.relationship;
        }

        if (req.body.status) {
          friendship.status = req.body.status;
        }

        await friendship.save();

        Friendship.findById(friendship._id)
          .populate("requester")
          .populate("recipient")
          .exec(function (err, friendship) {
            res.status(200).json(friendship);
          });
      }
    } catch {
      res.status(500).json({ message: "Une erreur est survenue" });
    }
  }
};

module.exports.delete = function (req, res) {
  Friendship.deleteOne({ _id: req.body._id }).exec(function (err) {
    if (err) {
      res.status(500).json({
        message: "Erreur",
      });
    }
    User.findById(req.signedUser._id)
      .populate({
        path: "friendships",
        populate: [{ path: "requester" }, { path: "recipient" }],
      })

      .exec(function (err, user) {
        res.status(200).json(user);
      });
  });
};

module.exports.list = function (req, res) {
  Friendship.find({})
    .populate("requester")
    .populate("recipient")
    .exec(function (err, friendships) {
      res.status(200).json(friendships);
    });
};

module.exports.empty = function (req, res) {
  Friendship.deleteMany({}).exec(function (err) {
    res.status(200).json({
      message: "Vidange terminé",
    });
  });
};
