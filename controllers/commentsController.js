const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const Reaction = require('../models/reaction');
const AppError = require('../utils/appError');

exports.postComment = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let { content, postId } = req.body;
    if (!content || !content.trim())
      return res.status(400).json({ message: 'Content is required' });

    let post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
      content: content,
      user: userId,
      post: postId
    });

    post.comments.push(comment._id);
    await post.save();

    res.status(200).json({
      comment: comment
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.reactOnComment = async (req, res, next) => {
  try {
    let userId = req.session.userId;

    let { commentId, reactionType } = req.body;
    if (!commentId || !reactionType)
      return res.status(400).json({ message: 'invalid Params' });

    let comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'comment not found' });

    if (reactionType === 'remove') {
      let reaction = await Reaction.findOne({
        reactor: userId,
        comment: commentId
      });
      if (!reaction) return res.status(400).json({ message: 'not Found' });
      await reaction.delete();
      comment.reactions.splice(comment.reactions.indexOf(reaction._id), 1);
      await comment.save();
      res.status(200).json({ message: 'reaction deleted from comment' });
    } else {
      let reaction = await Reaction.findOne({
        reactor: userId,
        comment: commentId
      });
      if (reaction) {
        reaction.type = reactionType;
        await reaction.save();
      } else {
        reaction = await Reaction.create({
          type: reactionType,
          reactor: userId,
          comment: commentId
        });
        comment.reactions.push(reaction._id);
        await comment.save();
      }
      res.status(200).json({
        message: 'Reacted Successfully on comment'
      });
    }
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let commentId = req.params.id;

    let content = req.body.content;
    if (!content)
      return res.status(400).json({ message: 'Content is required' });

    let comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'not found' });

    if (comment.user.toString() !== userId.toString())
      return res.status(401).json({ message: 'unauthorized access!' });

    comment.content = content;
    comment = await comment.save();
    res.status(200).json({ comment: comment });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let commentId = req.params.id;
    let comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Not Found' });

    if (comment.user.toString() !== userId.toString())
      return res.status(401).json({ message: 'Unauthorized Access' });

    let post = await Post.findById(comment.post);
    post.comments.splice(post.comments.indexOf(comment._id), 1);
    await comment.remove();
    await post.save();
    res.status(200).json({
      message: 'Comment deleted successfully!'
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};
