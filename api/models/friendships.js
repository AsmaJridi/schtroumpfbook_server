var mongoose = require("mongoose");

var friendshipSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  relationship: {
    type: String,
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
});

mongoose.model("Friendship", friendshipSchema);
