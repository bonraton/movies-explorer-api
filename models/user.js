const mongoose = require('mongoose');
const { isEmail } = require('validator');
const errorMessages = require('../errors/errorMessages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => isEmail(value),
    message: errorMessages.emailValidation,
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

module.exports = mongoose.model('user', userSchema);
