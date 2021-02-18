const User = require('../models/user');
const AppError = require('../utils/appError');

exports.beforeAuthValidate = async function beforeAuthValidate(req, res, next) {
  let userId = req.session.userId;
  const user = await User.findById(userId);
  if (userId && user) {
    res.format({
      // html: function () {
      //   res.status(302).redirect('/timeline');
      // },
      // js: function () {
      //   res.type('js');
      //   res.send(`window.location.path=/timeline`);
      //   return;
      // },
      json: function () {
        res.status(302).send({
          message: 'User already logged in!',
          'X-Ajax-Redirect-Url': '/timeline'
        });
        return;
      }
    });
    return;
  }
  next();
};

exports.register = async function register(req, res, next) {
  const { email, firstName, lastName, password, gender, birthDate } = req.body;
  if (!email || !firstName || !lastName || !password || !gender || !birthDate) {
    res.status(400).json({
      message: 'Invalid params!'
    });
    return;
  }
  let userBirthDate = new Date(birthDate);
  const user = await User.findOne({ email });
  if (user) {
    res.status(400).json({
      message: 'User with email already exists'
    });
    return;
  }
  try {
    const newUser = await User.create({
      email,
      firstName,
      lastName,
      gender,
      birthDate: userBirthDate,
      password
    });
    req.session.userId = newUser._id;
    res.status(201).json({
      user: newUser.asJson(),
      message: 'User created successfully'
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.login = async function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      message: 'Please provide valid details'
    });
    return;
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.comparePassword(user.password, password)) {
    res.status(401).json({
      message: 'Invalid login attempt! Email/Password is incorrect'
    });
    return;
  }
  req.session.userId = user._id;
  res.status(201).json({
    user: user.asJson(),
    message: 'User logged in successfully'
  });
};

exports.logout = async function logout(req, res, next) {
  let userId = req.session.userId;
  if (!userId) {
    res.status(404).json({
      message: 'User not found!'
    });
    return;
  }
  req.session.destroy();
  res.status(200).json({
    message: 'User has logged out successfully!'
  });
};

exports.validateSession = async function validateSession(req, res, next) {
  let userId = req.session.userId;
  if (!userId) {
    res.status(401).json({
      message: 'Invalid session! Please login again'
    });
    return;
  }
  const user = await User.findById(userId);
  if (!user) {
    delete req.session;
    res.status(401).json({
      message: 'Invalid session! Please login again'
    });
    return;
  }
  next();
};
