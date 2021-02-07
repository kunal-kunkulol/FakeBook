const fs = require('fs');
const AppError = require('../utils/appError');
const User = require('../models/user');
const Post = require('../models/post');
const Reaction = require('../models/reaction');

exports.getPosts = async (req, res, next) => {
  try {
    let query = req.query;
    let page = parseInt(query.page) || 1;
    let per = parseInt(query.per) || 5;
    const skip = (page - 1) * per;

    let currentUser = req.query.currentUser || false;
    let criteria = null;
    if (currentUser) criteria = { user: req.session.userId };

    const posts = await Post.find(criteria)
      .populate('user', 'firstName lastName profilePicUrl')
      .populate({
        path: 'reactions',
        // populate: {
        //   path: 'reactor',
        //   model: 'User',
        //   select: 'firstName lastName'
        // }
        select: 'type'
      })
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'user',
            model: 'User',
            select: 'firstName lastName profilePicUrl'
          },
          {
            path: 'reactions',
            // populate: {
            //   path: 'reactor',
            //   model: 'User',
            //   select: 'firstName lastName'
            // }
            select: 'type'
          }
        ]
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(per);
    res.status(200).json({
      posts: posts
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.createPost = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let content = req.body.content;
    if (content === undefined || content === null) {
      res.status(400).json({
        message: 'Post content is required'
      });
      return;
    }
    content = content.trim();
    if (!content) {
      res.status(400).json({
        message: 'Post content is required'
      });
      return;
    }
    const imageUrl =
      req.file !== undefined && req.file !== null ? req.file.path : '';
    const user = await User.findById(userId);
    const post = await Post.create({
      user: user._id,
      content: content,
      imageUrl: imageUrl
    });

    res.status(200).json({
      message: 'Post created successfully!',
      post: post
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let postId = req.params.id;
    let post = await Post.findById(postId);
    let postImage = req.file;

    if (post === undefined || post === null) {
      if (postImage) fs.unlink(`${__basedir}/${postImage.path}`, () => {});
      res.status(404).json({
        message: 'Not Found'
      });
      return;
    }
    if (post.user.toString() !== userId.toString()) {
      if (postImage) fs.unlink(`${__basedir}/${postImage.path}`, () => {});
      res.status(401).json({
        message: 'Unauthorized Access'
      });
      return;
    }

    let content = req.body.content;
    content = content.trim();
    if (!content) {
      if (postImage) fs.unlink(`${__basedir}/${postImage.path}`, () => {});
      res.status(400).json({
        message: 'Post content is required'
      });
      return;
    }
    if (post.imageUrl) {
      fs.unlink(`${__basedir}/${post.imageUrl}`, (err) => {
        console.log('Post Image deleted');
      });
    }

    post.content = content;
    if (req.file) post.imageUrl = req.file.path;
    else post.imageUrl = '';
    await post.save();
    res.status(200).json({
      post: post
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    let userId = req.session.userId;
    let postId = req.params.id;
    const post = await Post.findById(postId);
    if (post === undefined || post === null) {
      res.status(404).json({
        message: 'Not Found'
      });
      return;
    }
    if (post.user.toString() !== userId.toString()) {
      res.status(401).json({
        message: 'Unauthorized Access'
      });
      return;
    }
    await post.remove();
    res.status(200).json({
      message: 'Post deleted successfully!'
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.reactOnPost = async (req, res, next) => {
  try {
    let userId = req.session.userId;

    let { postId, reactionType } = req.body;
    if (!postId || !reactionType)
      return res.status(400).json({ message: 'invalid Params' });
    let post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'post not found' });

    if (reactionType === 'remove') {
      let reaction = await Reaction.findOne({
        reactor: userId,
        post: post._id
      });
      if (!reaction) return res.status(400).json({ message: 'not Found' });
      await reaction.delete();
      post.reactions.splice(post.reactions.indexOf(reaction._id), 1);
      await post.save();
      res.status(200).json({ message: 'reaction deleted' });
    } else {
      let reaction = await Reaction.findOne({
        reactor: userId,
        post: post._id
      });
      if (reaction) {
        reaction.type = reactionType;
        await reaction.save();
      } else {
        reaction = await Reaction.create({
          type: reactionType,
          reactor: userId,
          post: post._id
        });
        post.reactions.push(reaction._id);
        await post.save();
      }
      res.status(200).json({
        message: 'Reacted Successfully'
      });
    }
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.getSinglePost = async (req, res, next) => {
  try {
    let postId = req.params.id;
    if (!postId) return res.status(404).json({ message: 'post not found' });

    let post = await Post.find({ _id: postId })
      .populate('user', 'firstName lastName profilePicUrl')
      .populate({
        path: 'reactions',
        // populate: {
        //   path: 'reactor',
        //   model: 'User',
        //   select: 'firstName lastName'
        // }
        select: 'type'
      })
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'user',
            model: 'User',
            select: 'firstName lastName profilePicUrl'
          },
          {
            path: 'reactions',
            // populate: {
            //   path: 'reactor',
            //   model: 'User',
            //   select: 'firstName lastName'
            // }
            select: 'type'
          }
        ]
      });
    res.status(200).json({
      post: post
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};
