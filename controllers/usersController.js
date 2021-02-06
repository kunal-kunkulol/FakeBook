const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const AppError = require('../utils/appError');

const User = require('../models/user');

exports.getCurrentUser = async function (req, res, next) {
  let userKey = req.session.userKey;
  const user = await User.findOne({ userKey });
  res.status(200).json({
    user: user.asJson()
  });
};

exports.profilePicUpdate = async function (req, res, next) {
  try {
    if (!req.file) {
      console.log(req.body.file);
      return res.status(400).json({
        message: 'error occurred while updating profile picture'
      });
    }
    let userKey = req.session.userKey;
    let user = await User.findOne({ userKey });
    let imagePath = user.profilePicUrl;
    if (imagePath) {
      fs.unlink(`${__basedir}/${imagePath}`, (err) => {
        console.log('File deleted');
      });
    }
    imagePath = req.file.path;
    user = await User.findOneAndUpdate(
      { userKey },
      { profilePicUrl: imagePath },
      { new: true }
    );
    return res.status(200).json({
      user: user.asJson()
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};
