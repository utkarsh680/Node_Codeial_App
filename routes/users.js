const express = require('express');
const router = express.Router();

const passport = require('passport');
const usersController = require('../controllers/user_controller')

router.get('/profile',passport.checkAuthentication, usersController.profile)

router.get('/sign-up', usersController.signUp)

router.get('/sign-in', usersController.signIn)

router.post('/create', usersController.create)

router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));
router.get('/oauth2callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

// github authentication
router.get('/auth/github', passport.authenticate('github', { scope: ['profile', 'email'] }));
router.get('/auth/github/callback', passport.authenticate(
    'github',
    { failureRedirect: '/' },
), usersController.createSession);
// user passport as a middleware ot aunthenticate
router.post('/create-session',
passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'}
), usersController.createSession)

router.get('/sign-out', usersController.destroySession);


module.exports = router;