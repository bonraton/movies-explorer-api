const router = require('express').Router();
const { getMovies, addMovie, deleteMovie } = require('../controllers/movie');
const { addMovieValidator, objectIdValidator } = require('../middlewares/validation');

router.get('/', getMovies);

router.post('/', addMovieValidator, addMovie);

router.delete('/:id', objectIdValidator, deleteMovie);

module.exports = router;
