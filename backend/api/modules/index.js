const userRoutes = require('./user/routes');
const adminRoutes = require('./admin/routes');
const postRoutes = require('./post/routes');

module.exports = (app) => {
  app.use('/api/v1/user', userRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/post', postRoutes);
};
