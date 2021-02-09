const mongoose = require('mongoose');
const validator = require('validator');
const Comment = require('./comment');
const Reaction = require('./reaction');
const User = require('./user');
const fs = require('fs');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    reactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction'
      }
    ],
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    }
  },
  { timestamps: true }
);

postSchema.pre('remove', async function (next) {
  if (this.imageUrl)
    fs.unlink(__basedir + this.imageUrl, (err) => {
      console.log('Deleting File');
    });
  await Reaction.deleteMany({ post: this._id });
  await Comment.deleteMany({ post: this._id });
  next();
});

postSchema.methods.asJson = async function (onComments = false) {
  let post = {
    content: this.content,
    imageUrl: this.imageUrl
  };
  // let commentIds = this.comments || [];
  // let comments = await Comment.find().where('_id').in(commentIds).exec();

  // let commentsData = []
  // for(let i=0;i<comments.length;i++){
  //   commentsData.push(await comments[i].asJson());
  // }
  // let user = await User.findById(this.user);
  // post['user'] = user.asJson();

  // let reactions = await Reaction.find().where('_id').in(this.reactions).exec();

  return post;
};

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
