const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { options } = require('../helpers/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
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
        throw new NotFoundError('User not found');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new ConflictError('User with this email is already registered');
      }
    })
    .catch(next);
};

// не возвращать пароль

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
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Bad request');
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new ConflictError('User with this email is already registered');
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
        res.send('Incorrect email or password');
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            res.send('Incorrect email or password');
          }
          const token = { token: jwt.sign({ _id: user.id }, 'secret-key', { expiresIn: '7d' }) };
          res.send(token);
        })
        .catch(() => next(new UnauthorizedError('User not found')));
    });
};

module.exports = {
  updateUser, createUser, getCurrentUser, login,
};
