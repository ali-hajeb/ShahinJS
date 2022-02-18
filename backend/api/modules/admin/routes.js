const { Router } = require('express');
const { login, signUp } = require('./controllers');
const { localAdminAuth } = require('../../passport/');
const router = new Router();

router.post('/login', localAdminAuth, login);
router.post('/signup', signUp);

module.exports = router;
