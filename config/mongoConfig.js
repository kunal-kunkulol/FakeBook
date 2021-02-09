const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

let mongoDb = '';
if (process.env.NODE_ENV === 'production') mongoDb = process.env.DATABASE_URL;
else mongoDb = process.env.DATABASE_URL_LOCAL;

mongoose
  .connect(mongoDb, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((connection) => {
    console.log('Connection to DB Successful');
  })
  .catch((err) => {
    console.log(err);
  });
