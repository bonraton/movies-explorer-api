require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { limiterConfig } = require('./helpers/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const { MONGO_SERVER, PORT } = require('./helpers/enviromentConstants');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_SERVER, {
  useNewUrlParser: true,
});

const corsOptions = {
  origin: 
  ['https://api.nomoreparties.co/beatfilm-movies',
  'https://moviekirillnaruls.nomoredomains.rocks',
    'http://localhost:4000',
    'http://localhost:3000'],
  methods: ['PUT', 'GET', 'POST', 'PATCH', 'DELETE', 'HEAD'],
  preflightContinue: false,
  optionSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(corsOptions));

const limiter = rateLimit(limiterConfig);

app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
