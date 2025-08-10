const router = require('express').Router();
const diskinfo = require("../controllers");

router.route('/details/storage').get(diskinfo);

module.exports = router;

