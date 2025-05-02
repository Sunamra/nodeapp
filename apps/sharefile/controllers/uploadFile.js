const fs = require('fs').promises;
const path = require('path');
const { storeDir, maxTotalFiles, maxTotalSize } = require('../utils/constants')
const scheduleFileDeletion = require('../../../common/utils/deleteFile');
const storageStats = require('../utils/storageStats');

/**
 * Saves posted file to disk storage
 */
const uploadFile = async (req, res) => {
	try {

		const { count: storeFileCount, size: storeTotalSize } = storageStats(storeDir);

		if (storeFileCount > maxTotalFiles || storeTotalSize > maxTotalSize) {
			return res.status(507).json({
				message: 'Storage is full',
				success: false
			});
		}


		// Basic error handling
		if (!req.files || !req.files.length) {
			return res.status(400).json({
				message: 'No files uploaded',
				success: false
			});
		}
		let fileOriginalName = "";
		let fileSaveName = "";
		for (const file of req.files) {
			fileOriginalName = `${file.originalname}`;

			/**
			 * 13 digit timestamp + 1 dash = 14 character string
			 * to be removed when fetching file in another function.
			 */
			fileSaveName = `${Date.now()}-${fileOriginalName}`;
			const savePath = path.join(storeDir, fileSaveName);
			await fs.writeFile(savePath, file.buffer);
			scheduleFileDeletion(savePath, 24 * 60 * 60 * 1000);  // Delete after 1 day
		}

		const fileCount = req.files?.length;
		const resMsg =
			fileCount === 1 ?
				`File '${fileOriginalName}' uploaded` :
				`${fileCount} ${fileCount === 1 ? "File" : "Files"} uploaded`;

		res.status(200).json({
			message: resMsg,
			success: true
		});

	} catch (error) {
		res.status(500).json({
			message: `Can't save file : ${error.message || error}`,
			success: false
		});
	}
}

module.exports = uploadFile;