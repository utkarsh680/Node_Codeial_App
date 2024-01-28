const express = require('express');
const homeController = require('../controllers/home_controller')
const router = express.Router();
console.log('router loaded');
const passport = require('passport');

router.get("/", homeController.redirectToHome);
router.get("/home", passport.checkAuthentication, homeController.home);
router.use('/users', require('./users'))
router.use('/posts', require('./posts'))
router.use('/comments', require('./comments'))
router.use('/login', require('./login'))

router.use('/api', require('./api'))


module.exports = router;