const redis = require('redis');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || ''
});

module.exports = session({
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_NAME,
  proxy: process.env.NODE_ENV === 'production',
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.SESSION_TIMEOUT),
    signed: process.env.NODE_ENV === 'production'
  },
  store: new RedisStore({
    client: redisClient
  }),
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
});
