const router = require('express').Router();
const {
  getCurrentUser, updateUser,
} = require('../controllers/user');
const { updateUserValidator } = require('../middlewares/validation');

router.get('/me', getCurrentUser);

router.patch('/me', updateUserValidator, updateUser);

module.exports = router;
