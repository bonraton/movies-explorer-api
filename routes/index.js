const router = require('express').Router();
const { jwtCheck } = require('../middlewares/auth');
const { NotFoundError } = require('../errors/errorClasses');
const errorMessages = require('../errors/errorMessages');

router.use(require('./auth'));
router.use(require('./auth'));

router.use('/users', jwtCheck, require('./user'));
router.use('/movies', jwtCheck, require('./movie'));

router.use('*', jwtCheck, (req, res, next) => {
  next(new NotFoundError(errorMessages.notFound));
});

module.exports = router;
