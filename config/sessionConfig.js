const redis = require('redis');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

module.exports = session({
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_NAME,
  proxy: process.env.NODE_ENV === 'development',
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
    maxAge: parseInt(process.env.SESSION_TIMEOUT)
  },
  store: new RedisStore({
    client: redisClient
  }),
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
});
