const Router = require('express');
const router = new Router();
const diskRouter = require('./diskRouter');
const TokenMiddleware = require('../middleware/TokenMiddleware');

router.use('/disk', TokenMiddleware, diskRouter);

module.exports = router;
