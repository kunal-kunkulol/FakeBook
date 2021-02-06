const router = require('express').Router();
const { validateSession } = require('../controllers/authController');
const {
  getCurrentUser,
  profilePicUpdate
} = require('../controllers/usersController');
const upload = require('../config/multerConfig');

router.get('/current_user', validateSession, getCurrentUser);
router.put(
  '/update_profile_picture',
  validateSession,
  upload.single('profilePic'),
  profilePicUpdate
);

module.exports = router;
