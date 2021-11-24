const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../helpers/enviromentConstants');
const { UnauthorizedError } = require('../errors/errorClasses');
const errorMessages = require('../errors/errorMessages');

const jwtCheck = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(errorMessages.unauthorized);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError(errorMessages.unauthorized);
  }

  req.user = payload;
  next();
};

module.exports = { jwtCheck };
