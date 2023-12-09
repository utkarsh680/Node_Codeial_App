const express = require('express');

const router = express.Router();

const loginController = require('../controllers/user_controllers');

router.get('/profile', loginController.profile);

module.exports = router;