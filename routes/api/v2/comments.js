const express = require('express');

const router = express.Router();

const commentsApi = require('../../../controllers/api/v2/comment_api');

router.get('/', commentsApi.index)

module.exports = router;