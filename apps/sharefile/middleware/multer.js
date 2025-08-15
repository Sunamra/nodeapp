const multer = require('multer');
const os = require('os'); // added
const path = require('path'); // added
const { maxFiles, maxFileSize } = require('../utils/constants');

const osTempDir = os.tmpdir(); // added - system temp directory for uploads

// Use diskStorage so files are written to system temp during upload
const storage = multer.diskStorage({ // modified
	destination: (_req, _file, cb) => {
		cb(null, osTempDir); // added
	},
	filename: (_req, file, cb) => {
		// keep a unique temporary name (we'll move/copy to final storeDir later)
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // added
		cb(null, `${uniqueSuffix}-${file.originalname}`); // added
	}
});

const upload = multer({
	storage, // modified (was memoryStorage())
	limits: { fileSize: maxFileSize }
}).array('file', maxFiles);

module.exports = upload;
