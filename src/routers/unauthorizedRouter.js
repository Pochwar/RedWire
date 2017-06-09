var router = require('express').Router();
const UnauthorizedCtrl = require( '../controllers/UnauthorizedCtrl');

// index
router.get('/', UnauthorizedCtrl.indexAction);

module.exports = router;
