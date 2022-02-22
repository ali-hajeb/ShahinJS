const { Router } = require('express');
const commentController = require('./controllers');

const router = new Router();

router.post('/', commentController.writeComment);
router.patch('/', commentController.editComment);
router.delete('/', commentController.deleteComment);
router.get('/', commentController.getCommentById);
router.get('/user/:id', commentController.getCommentsByUserId);
router.get('/post/:id', commentController.getCommentsByPostId);

module.exports = router;
