const mongoose = require('mongoose');
const Post = require('./post');

const reactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry'],
      required: true
    },
    reactor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  },
  { timestamps: true }
);
reactionSchema.methods.asJson = async function () {
  return {
    reactor: this.reactor,
    type: this.type,
    post: this.post
  };
};

const Reaction = mongoose.model('Reaction', reactionSchema);
module.exports = Reaction;
