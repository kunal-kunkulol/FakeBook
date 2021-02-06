const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoDb = process.env.DATABASE_URL;

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
