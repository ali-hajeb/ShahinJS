const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const passport = require('../passport');
const helmet = require('helmet');
const schedule = require('node-schedule');
const { isDev, isProd } = require('../utils');
require('../services/scheduleTasks');

module.exports = (app) => {
  if (isProd) {
    app.use(compression());
    app.use(helmet());
  }
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  passport.init(app);
  if (isDev) app.use(morgan('dev'));

  process.on('SIGINT', () => {
    schedule.gracefulShutdown().then(() => process.exit(0));
  });
};
