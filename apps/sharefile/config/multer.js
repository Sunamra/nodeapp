const multer = require('multer');


const singleUpload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 256 * 1024 * 1024 }  // 256 MiB maximum
}).single("file");

module.exports = singleUpload;