const multer = require('multer');
const os = require('os');
const { storeDir, maxFiles, maxTotalSize } = require('../utils/constants');
const storageStats = require('../utils/storageStats');

const osTempDir = os.tmpdir();

const { size: currentStoreSize } = storageStats(storeDir);

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
	limits: { fileSize: maxTotalSize - currentStoreSize } // Max size of file depends on how much storage is free
}).array('file', maxFiles);
