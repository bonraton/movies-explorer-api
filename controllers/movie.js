const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Movie not found');
      }
      if (movie.owner.equals(req.user._id)) {
        return movie.deleteOne(movie)
          .then(() => {
            res.send({ data: movie });
          });
      }
      next(new ForbiddenError('Forbidden Error'));
    })
    .catch(next);
};

const addMovie = (req, res, next) => {
  const {
    country, director, year, duration, description, trailer, image, nameRu, nameEn, thumbnail,
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
    owner: req.user._id,
    nameRu,
    nameEn,
  })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Bad request'));
      } else {
        next(err);
      }
    });
};

module.exports = { getMovies, addMovie, deleteMovie };
