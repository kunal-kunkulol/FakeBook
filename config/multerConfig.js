const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const AppError = require('../utils/appError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images'),
  filename: (req, file, cb) => {
    const uniqName = `${crypto
      .randomBytes(3 * 4)
      .toString('hex')}${path.extname(file.originalname)}`;
    cb(null, uniqName);
  }
});

module.exports = multer({
  storage,
  limits: {
    fileSize: 10000 * 1000000
  },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new AppError('Only images are allowed', 400), false);
    }
    cb(null, true);
  }
});
