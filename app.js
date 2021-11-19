// require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { jwtCheck } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user');
const { createUserValidator, loginValidator } = require('./middlewares/validation');
const NotfoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.use('/users', jwtCheck, require('./routes/user'));
app.use('/movies', jwtCheck, require('./routes/movie'));

app.use('/signup', createUserValidator, createUser);
app.use('/signin', loginValidator, login);

app.use('*', jwtCheck, (req, res, next) => {
  next(new NotfoundError('Not found'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Internal Error' : message });
  next();
});

app.listen(PORT);
