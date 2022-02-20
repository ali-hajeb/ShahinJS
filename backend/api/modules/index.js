const userRoutes = require('./user/routes');
const adminRoutes = require('./admin/routes');
const postRoutes = require('./post/routes');
const categoryRoutes = require('./category/routes');
const labelRoutes = require('./label/routes');

module.exports = (app) => {
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/user', userRoutes);
  app.use('/api/v1/post', postRoutes);
  app.use('/api/v1/category', categoryRoutes);
  app.use('/api/v1/label', labelRoutes);
};
