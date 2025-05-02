const multer = require('multer');
const { maxFiles, maxFileSize } = require('../utils/constants');

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: maxFileSize }
}).array("files", maxFiles);

module.exports = upload;