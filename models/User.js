const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  created_total:{
    type: [String],
  },
  response_total: {
    type:[String],
  },
  resetPasswordToken:{
    type : String
  },
  resetPasswordExpires:{
    type:Date
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
