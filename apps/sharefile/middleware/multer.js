const multer = require('multer');
const os = require('os');
const { maxFiles, maxFileSize } = require('../utils/constants');

const osTempDir = os.tmpdir();

// Use diskStorage so files are written to system temp during upload
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, osTempDir);
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${uniqueSuffix}-${file.originalname}`);
	}
});

module.exports = multer({
	storage,
	limits: { fileSize: maxFileSize }
}).array('file', maxFiles);
