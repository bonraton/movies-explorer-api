const mongoose = require('mongoose');
const validator = require('validator');
const errorMessages = require('../errors/errorMessages');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: (value) => validator.isURL(value),
    message: errorMessages.urlValidation,
  },
  trailer: {
    type: String,
    required: true,
    validate: (value) => validator.isURL(value),
    message: errorMessages.urlValidation,
  },
  thumbnail: {
    type: String,
    required: true,
    validate: (value) => validator.isURL(value),
    message: errorMessages.urlValidation,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
