var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local:{
    username: String,
    password: String
  },
  facebook:{
    id: String,
    token: String,
    email: String,
    name: String
  }
});

//to use this methods implement where the user object is used -- passport.js
userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9)); // genSaltSync adds a random text to the password
}

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);
