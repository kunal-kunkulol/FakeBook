const router = require('express').Router();
const { validateSession } = require('../controllers/authController');
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  reactOnPost,
  getSinglePost
} = require('../controllers/postsController');
const upload = require('../config/multerConfig');

router
  .route('/')
  .get(validateSession, getPosts)
  .post(validateSession, upload.single('image'), createPost);

router
  .route('/:id')
  .get(validateSession, getSinglePost)
  .put(validateSession, upload.single('image'), updatePost)
  .delete(validateSession, deletePost);

router.post('/react_on_post', validateSession, reactOnPost);
module.exports = router;
