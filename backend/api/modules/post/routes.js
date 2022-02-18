const { Router } = require('express');
const { jwtAdminAuth, jwtUserAuth } = require('../../passport');
const postControllers = require('./controllers');

const router = new Router();

router.post('/', jwtAdminAuth, postControllers.addPost);
router.patch('/', jwtAdminAuth, postControllers.editPost);
router.delete('/', jwtAdminAuth, postControllers.deletePost);
router.get('/', postControllers.getPosts);
router.get('/:id', postControllers.getPostById);
// router.get('/:slug', postControllers.getPostBySlug);
router.post('/like', jwtUserAuth, postControllers.like);
router.post('/share', jwtUserAuth, postControllers.share);
router.post('/comment', jwtUserAuth, postControllers.comment);
module.exports = router;
