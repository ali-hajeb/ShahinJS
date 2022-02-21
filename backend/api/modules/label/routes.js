const { Router } = require('express');
const { jwtAdminAuth } = require('../../passport');
const labelControllers = require('./controllers');

const router = new Router();

router.post('/', jwtAdminAuth, labelControllers.createLabel);
router.patch('/', jwtAdminAuth, labelControllers.editLabel);
router.delete('/', jwtAdminAuth, labelControllers.deleteLabel);
router.get('/', labelControllers.getLabels);
router.get('/:id', labelControllers.getLabelById);

module.exports = router;
