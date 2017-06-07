const router = require('express').Router();
const IndexCtrl = require( '../controllers/IndexCtrl');

// index
router.get('/', IndexCtrl.indexLoggedAction);

module.exports = router;
