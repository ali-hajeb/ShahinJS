const { Router } = require('express');
const { jwtAdminAuth, jwtUserAuth } = require('../../passport/index');
const commentController = require('./controllers');

const router = new Router();

router.post('/', commentController.writeComment);
router.patch('/', commentController.editComment);
router.delete('/', commentController.deleteComment);
router.get('/', commentController.getComments);
router.post('/status/', jwtAdminAuth, commentController.changeCommentStatus);

module.exports = router;
