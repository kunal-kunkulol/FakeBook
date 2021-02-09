const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    password: {
      type: String,
      required: [true, 'password is required'],
      minlength: 8,
      select: false
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

// Indexes

//Hooks
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   this.passwordConfirm = undefined;
//   next();
// });

//methods
userSchema.methods.comparePassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isFriend = function (userId) {
  return this.friends.indexOf(userId) > -1;
};

userSchema.methods.asJson = function () {
  return {
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
