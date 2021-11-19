const { celebrate, Joi } = require('celebrate');
const { isURL, isEmail, isMongoId } = require('validator');

const joiStringRequired = Joi.string().required();
const joiNumberRequired = Joi.number().required();

const checkUrlValidity = (value) => {
  if (isURL(value)) {
    return value;
  }
  throw new Error('Wrong URL format');
};

const checkEmailValidity = (value) => {
  if (isEmail(value)) {
    return value;
  }
  throw new Error('Wrong Email format');
};

const checkObjectIdValidity = (value) => {
  if (isMongoId(value)) {
    return value;
  }
  throw new Error('Wrong objectId format');
};

const objectIdValidator = celebrate({
  params: Joi.object().keys({
    id: joiStringRequired.custom(checkObjectIdValidity),
  }),
});

const addMovieValidator = celebrate({
  body: Joi.object().keys({
    country: joiStringRequired,
    director: joiStringRequired,
    duration: joiNumberRequired,
    year: joiNumberRequired,
    description: joiStringRequired,
    image: joiStringRequired.custom(checkUrlValidity),
    trailer: joiStringRequired.custom(checkUrlValidity),
    thumbnail: joiStringRequired.custom(checkUrlValidity),
    nameRu: joiStringRequired,
    nameEn: joiStringRequired,
  }),
});

const updateUserValidator = celebrate({
  body: Joi.object().keys({
    email: joiStringRequired.custom(checkEmailValidity),
    name: joiStringRequired.min(2).max(30),
  }),
});

const createUserValidator = celebrate({
  body: Joi.object().keys({
    email: joiStringRequired.custom(checkEmailValidity),
    password: joiStringRequired,
    name: joiStringRequired.min(2).max(30),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: joiStringRequired.custom(checkEmailValidity),
    password: joiStringRequired,
  }),
});

module.exports = {
  addMovieValidator, objectIdValidator, updateUserValidator, createUserValidator, loginValidator,
};
