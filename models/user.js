const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => isEmail(value),
    message: 'Wrong email format',
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

const rejectInvalidCredentials = () => Promise.reject(new Error('Неправильные почта или пароль'));

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return rejectInvalidCredentials();
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return rejectInvalidCredentials();
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
