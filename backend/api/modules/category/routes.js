const { Router } = require('express');
const { jwtAdminAuth } = require('../../passport');
const categoryControllers = require('./controllers');

const router = new Router();

router.post('/', jwtAdminAuth, categoryControllers.createCategory);
router.patch('/', jwtAdminAuth, categoryControllers.editCategory);
router.delete('/', jwtAdminAuth, categoryControllers.deleteCategory);
router.get('/', categoryControllers.getCategories);

module.exports = router;
