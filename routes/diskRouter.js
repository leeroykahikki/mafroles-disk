const Router = require('express');
const router = new Router();
const diskController = require('../controllers/diskController');

router.get('/tournaments', diskController.getTournaments);
router.get('/players', diskController.getPlayers);
router.get('/default', diskController.getDefaultImages);

module.exports = router;
