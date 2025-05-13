const fs = require('fs').promises;
const path = require('path');
const { storeDir, maxTotalFiles, maxTotalSize } = require('../utils/constants');
const scheduleFileDeletion = require('../../../common/utils/deleteFile');
const storageStats = require('../utils/storageStats');

/**
 * Saves posted file to disk storage
 */
const uploadFile = async (req, res) => {
	try {

		await fs.mkdir(storeDir, { recursive: true }); // Make the dir in case it was not uploaded by git for being empty

		const { count: storeFileCount, size: storeTotalSize } = storageStats(storeDir);

		// Storage checking
		if (storeFileCount > maxTotalFiles || storeTotalSize > maxTotalSize) {
			return res.status(507).json({
				message: 'Storage is full',
				success: false
			});
		}

		// Basic error handling
		if (!req.files || !req.files.length) {
			return res.status(400).json({
				message: 'No files provided',
				success: false
			});
		}


		let fileOriginalName = '';
		for (const file of req.files) {
			fileOriginalName = `${file.originalname}`;

			/**
			 * 13 digit timestamp + 1 dash = 14 character string
			 * to be removed when fetching file in another function.
			 */
			const fileSaveName = `${Date.now()}-${fileOriginalName}`;
			const fileSavePath = path.join(storeDir, fileSaveName);

			await fs.writeFile(fileSavePath, file.buffer);
			scheduleFileDeletion(fileSavePath);
		}

		const fileCount = req.files?.length;
		const resMsg =
			fileCount === 1 ?
				`File '${fileOriginalName}' uploaded` :
				`${fileCount} ${fileCount === 1 ? 'File' : 'Files'} uploaded`;

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
};

module.exports = uploadFile;