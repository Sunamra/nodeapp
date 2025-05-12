const multer = require('multer');
const { maxFiles, maxFileSize } = require('../utils/constants');

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: maxFileSize }
}).array('file', maxFiles);

module.exports = upload;