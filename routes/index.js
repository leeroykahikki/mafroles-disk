const Router = require('express');
const router = new Router();
const diskRouter = require('./diskRouter');

router.use('/disk', diskRouter);

module.exports = router;
