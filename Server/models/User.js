const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default: "https://res.cloudinary.com/deupkqjvg/image/upload/v1676785540/2041304_rgsa66.jpg"
  },
  followers: [{ type: ObjectId, ref: "user" }],
  following: [{ type: ObjectId, ref: "user" }],
});
const User = mongoose.model("user", UserSchema);
//User.createIndexes();
module.exports = User;
