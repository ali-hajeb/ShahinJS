const { Router } = require('express');
const { jwtAdminAuth } = require('../../passport/index');
const menuController = require('./controllers');

const router = new Router();

router.post('/', jwtAdminAuth, menuController.addMenu);
router.patch('/', jwtAdminAuth, menuController.editMenu);
router.delete('/', jwtAdminAuth, menuController.deleteMenu);
router.get('/', menuController.getMenus);

module.exports = router;
