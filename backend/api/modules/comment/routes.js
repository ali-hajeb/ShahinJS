const { Router } = require('express');
const { jwtAdminAuth, jwtUserAuth } = require('../../passport/index');
const commentController = require('./controllers');

const router = new Router();

router.post('/', commentController.writeComment);
router.patch('/', commentController.editComment);
router.delete('/', commentController.deleteComment);
router.get('/', commentController.getCommentById);
router.post('/status/', jwtAdminAuth, commentController.changeCommentStatus);
router.get('/user/:id', commentController.getCommentsByUserId);
router.get('/post/:id', commentController.getCommentsByPostId);

module.exports = router;
