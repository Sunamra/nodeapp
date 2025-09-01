const router = require('express').Router();

const multerUpload = require('../middleware/multer.js');
const uploadFile = require('../controllers/uploadFile.js');
const getFileList = require('../controllers/getFileList.js');
const downloadFile = require('../controllers/downloadFile.js');
const getStorageStats = require('../controllers/getStorageStats.js');

router.route('/api/v1').post((req, _, next) => {
	console.log(req);
	next();
}, multerUpload, uploadFile);
router.route('/api/v1').get(getFileList);
router.route('/api/v1/:filename').get(downloadFile);
router.route('/api/v1/stats/storage').get(getStorageStats);

module.exports = router;