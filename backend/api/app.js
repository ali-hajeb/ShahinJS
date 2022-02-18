require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const middleware = require('./middleware');
const apiRoutes = require('./modules');

const app = express();
middleware(app);
apiRoutes(app);

module.exports = app;
