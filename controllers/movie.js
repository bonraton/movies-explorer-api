const Movie = require('../models/movie');

const { BadRequestError, NotFoundError, ForbiddenError } = require('../errors/errorClasses');
const errorMessages = require('../errors/errorMessages');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(errorMessages.notFound);
      }
      if (movie.owner.equals(req.user._id)) {
        movie.deleteOne(movie)
          .then(() => {
            res.send({ data: movie });
          });
      }
      throw new ForbiddenError(errorMessages.forbidden);
    })
    .catch((err) => {
      next(err);
    });
};

const addMovie = (req, res, next) => {
  const {
    country,
    director,
    year,
    duration,
    description,
    trailer,
    image,
    thumbnail,
    MovieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    MovieId,
    owner: req.user._id,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.badRequest));
      } else {
        next(err);
      }
    });
};

module.exports = { getMovies, addMovie, deleteMovie };
