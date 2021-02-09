const router = require('express').Router();
const { validateSession } = require('../controllers/authController');

const {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests
} = require('../controllers/friendRequestController');

router
  .route('/')
  .get(validateSession, getFriendRequests)
  .post(validateSession, sendFriendRequest);
router
  .route('/:id')
  .post(validateSession, acceptFriendRequest)
  .delete(validateSession, declineFriendRequest);

module.exports = router;
