const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'first name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: [true, 'user with email already exists'],
      lowercase: true,
      validate: [validator.isEmail, 'invalid email']
    },
    birthDate: {
      type: Date,
      required: [true, 'birth date is required']
    },
    profilePicUrl: {
      type: String,
      required: false,
      default: ''
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other']
    },
    userKey: {
      type: String,
      default: crypto.randomBytes(3 * 4).toString('hex'),
      unique: true
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please provide valid pcconfirm'],
      validate: {
        //this only on .save and create
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password does not match!!!!!'
      }
    }
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ userKey: 1 }, { unique: true });

//Hooks
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//methods
userSchema.methods.comparePassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.asJson = function () {
  return {
    userKey: this.userKey,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    birthDate: this.birthDate,
    gender: this.gender,
    profilePicUrl: this.profilePicUrl
  };
};
const User = mongoose.model('User', userSchema);
module.exports = User;
