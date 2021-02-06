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

global.__basedir = __dirname;

//Routes
app.use('/api', router);

//
app.use(globalErrorHandler);
module.exports = app;
