const fs = require('fs').promises;
const path = require('path');
const { storeDir } = require('../utils/constants');

/**
 * When a file is requested, the file is copied from
 * 'sharefile/storage' to public storage 'sharefile/public/tempStore'
 * and the link of the file is returned.
 * The public file will be deleted after some time.
 */
const downloadFile = async (req, res) => {
	let filename = "";

	try {
		filename = req?.params?.filename;
		const filePath = path.join(storeDir, filename);



	} catch (error) {
		res.status(500).json({
			message: error.message || error,
			success: false
		});
	}
}

module.exports = downloadFile;