const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  login: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  dob:{
    type:String,
    require:true
  }
});

module.exports = mongoose.model("users", UserSchema);
