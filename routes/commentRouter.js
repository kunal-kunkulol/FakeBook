const router = require('express').Router();
const { validateSession } = require('../controllers/authController');
const {
  postComment,
  updateComment,
  deleteComment,
  reactOnComment
} = require('../controllers/commentsController');

router.post('/react_on_comment', validateSession, reactOnComment);
router
  .route('/:id')
  .put(validateSession, updateComment)
  .delete(validateSession, deleteComment);
router.post('/', validateSession, postComment);

module.exports = router;
