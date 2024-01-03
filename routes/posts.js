const express = require('express');

const router = express.Router();

const postsController = require('../controllers/post_controller');
const passport = require('passport');

router.post('/create', postsController.create);
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);

module.exports = router;
