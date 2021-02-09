const router = require('express').Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');
const friendRequestRouter = require('./friendRequestRouter');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);
router.use('/friend_requests', friendRequestRouter);

module.exports = router;
