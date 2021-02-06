const dotenv = require('dotenv');
dotenv.config('./config.env');

require('./config/mongoConfig');

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('App listening on port ', PORT);
});
