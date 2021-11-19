const mongoose = require('mongoose');
const validator = require('validator');

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
    message: 'Wrong URL format',
  },
  trailer: {
    type: String,
    required: true,
    validate: (value) => validator.isURL(value),
    message: 'Wrong URL format',
  },
  thumbnail: {
    type: String,
    required: true,
    validate: (value) => validator.isURL(value),
    message: 'Wrong URL format',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // movieId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  // },
  nameRu: {
    type: String,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
