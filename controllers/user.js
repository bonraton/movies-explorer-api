const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { options } = require('../helpers/constants');
const errorMessages = require('../errors/errorMessages');
const errorNames = require('../errors/errorNames');
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require('../errors/errorClasses');

const { JWT_SECRET } = require('../helpers/enviromentConstants');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.notFound);
      }
      res.send({ data: user });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, options)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.notFound);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError(errorMessages.conflict);
      }
      // throw err;
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    email, password: hash, name,
  }))
    .then(() => {
      res.send({
        data: {
          email, name,
        },
      });
    })
    .catch((err) => {
      if (err.name === errorNames.Validation) {
        throw new BadRequestError(errorMessages.badRequest);
      }
      if (err.code === 11000) {
        throw new ConflictError(errorMessages.conflict);
      }
      next(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError(errorMessages.login))
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError(errorMessages.login))
          }
          const token = { token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }) };
          res.send(token);
        })
        .catch(() => next(new UnauthorizedError(errorMessages.login)));
    });
};

module.exports = {
  updateUser, createUser, getCurrentUser, login,
};
