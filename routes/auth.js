const router = require('express').Router();
const { createUserValidator, loginValidator } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/user');

router.post('/signup', createUserValidator, createUser);
router.post('/signin', loginValidator, login);

module.exports = router;
