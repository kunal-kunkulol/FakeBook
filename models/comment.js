const mongoose = require('mongoose');

const Reaction = require('./reaction');
const User = require('./user');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    reactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction'
      }
    ]
  },
  { timestamps: true }
);

commentSchema.pre('remove', async function (next) {
  await Reaction.deleteMany({ comment: this._id });
  next();
});

commentSchema.methods.asJson = async function () {
  let user = await User.findOne({ _id: this.user });
  return {
    user: user.asJson(),
    content: this.content,
    post: this.post
  };
};

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
