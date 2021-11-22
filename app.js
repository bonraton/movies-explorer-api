require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { limiterConfig } = require('./helpers/constants');
const { jwtCheck } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user');
const { createUserValidator, loginValidator } = require('./middlewares/validation');
const NotfoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const { MONGO_SERVER, PORT } = require('./helpers/enviromentConstants');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_SERVER, {
  useNewUrlParser: true,
});

const limiter = rateLimit(limiterConfig);

app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.use('/users', jwtCheck, require('./routes/user'));
app.use('/movies', jwtCheck, require('./routes/movie'));

app.use('/signup', createUserValidator, createUser);
app.use('/signin', loginValidator, login);

app.use('*', jwtCheck, (req, res, next) => {
  next(new NotfoundError('Page not found'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
