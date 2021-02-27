//Import libs
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const xss = require('xss-clean');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

//Import custom
const session = require('./config/sessionConfig');
const router = require('./routes/index');
const globalErrorHandler = require('./utils/errorhandler');
const { validateSession } = require('./controllers/authController');

//Initialize
const app = express();

//Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(session);
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({
    extended: false,
    limit: '50mb',
    parameterLimit: 100000000
  })
);
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

app.use(
  '/images',
  validateSession,
  express.static(__dirname + '/public/images')
);

global.__basedir = __dirname;

//Routes
app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
  console.log('IN production env');
  app.use(express.static(__dirname + '/client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
  });
}
//
app.use(globalErrorHandler);
module.exports = app;
