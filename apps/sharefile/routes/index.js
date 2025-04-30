const router = require('express').Router();

const singleUpload = require('../middleware/multer.js')
const uploadFile = require('../controllers/uploadFile.js')
const getFileList = require('../controllers/getFileList.js')

router.route('/api/v1').post(singleUpload, uploadFile);
router.route('/api/v1/:id').get(getFileList);

module.exports = router;