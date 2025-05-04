const router = require('express').Router();

const multerUpload = require('../middleware/multer.js');
const uploadFile = require('../controllers/uploadFile.js');
const getFileList = require('../controllers/getFileList.js');
const downloadFile = require('../controllers/downloadFile.js');

router.route('/api/v1').post(multerUpload, uploadFile);
router.route('/api/v1').get(getFileList);
router.route('/api/v1/:filename').get(downloadFile);

module.exports = router;