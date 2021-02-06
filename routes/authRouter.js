const router = require('express').Router();
const {
  login,
  logout,
  register,
  beforeAuthValidate
} = require('../controllers/authController');

router.post('/login', beforeAuthValidate, login);
router.post('/logout', logout);
router.post('/register', beforeAuthValidate, register);

module.exports = router;
