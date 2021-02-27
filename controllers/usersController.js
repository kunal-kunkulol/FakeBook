const fs = require('fs');
const AppError = require('../utils/appError');

const User = require('../models/user');

exports.getCurrentUser = async function (req, res, next) {
  let userId = req.session.userId;
  const user = await User.findById(userId);
  res.status(200).json({
    user: user.asJson()
  });
};

exports.profilePicUpdate = async function (req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'error occurred while updating profile picture'
      });
    }
    let userId = req.session.userId;
    let user = await User.findById(userId);
    let imagePath = user.profilePicUrl;
    if (imagePath) {
      fs.unlink(`${__basedir}/${imagePath}`, (err) => {
        console.log('File deleted');
      });
    }
    imagePath = req.file.path;
    user = await User.findOneAndUpdate(
      { _id: userId },
      { profilePicUrl: `/images/${req.file.filename}` },
      { new: true }
    );
    return res.status(200).json({
      user: user.asJson()
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};
