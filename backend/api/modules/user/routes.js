const { Router } = require('express');
const userControllers = require('./controllers');
const { localUserAuth } = require('../../passport');

const router = new Router();

router.post('/login', localUserAuth, userControllers.login);
router.post('/signup', userControllers.signUp);

module.exports = router;
