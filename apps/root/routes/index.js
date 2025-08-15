const router = require('express').Router();
const { getAll, getFileList, getFile } = require('../controllers');
const { logRequest } = require('../middleware');

router.route('/').get(logRequest, getFileList);
router.route('/:file').get(logRequest, getFile);

module.exports = router;