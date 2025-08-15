const fs = require('fs').promises;
const path = require('path');
const { storeDir, maxTotalFiles, maxTotalSize } = require('../utils/constants');
const scheduleFileDeletion = require('../../../common/utils/deleteFile');
const storageStats = require('../utils/storageStats');
// modified: switched to working with multer diskStorage where req.files[].path exists

/**
 * helper to remove temp files (if they exist)
 */
const cleanupTempFiles = async (files) => { // added
	if (!files || !files.length) return;
	await Promise.all(files.map(async (file) => {
		try {
			const tmpPath = file.path || (file.destination && file.filename && path.join(file.destination, file.filename));
			if (tmpPath) {
				await fs.unlink(tmpPath).catch(() => { }); // swallow unlink errors
			}
		} catch (e) {
			// ignore
		}
	}));
}

/**
 * Saves posted file to disk storage
 */
const uploadFile = async (req, res) => {
	try {

		await fs.mkdir(storeDir, { recursive: true }); // Make the dir in case it was not uploaded by git for being empty

		const { count: storeFileCount, size: storeTotalSize } = storageStats(storeDir);

		// Storage checking
		if (storeFileCount > maxTotalFiles || storeTotalSize > maxTotalSize) {
			// If multer already placed temp files, clean them up
			await cleanupTempFiles(req.files); // added
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
		try { // added: wrap per-request processing so we can cleanup temp files on any failure
			for (const file of req.files) {
				fileOriginalName = `${file.originalname}`;

				/**
				 * 13 digit timestamp + 1 dash = 14 character string
				 * to be removed when fetching file in another function.
				 */
				const fileSaveName = `${Date.now()}-${fileOriginalName}`;
				const fileSavePath = path.join(storeDir, fileSaveName);

				// Move/copy from multer temp location to the final storeDir
				const tmpFilePath = file.path || (file.destination && file.filename && path.join(file.destination, file.filename)); // added

				if (!tmpFilePath) {
					// no tmp path available - error
					throw new Error('Temporary uploaded file not found');
				}

				// Use copy + unlink to be robust across filesystems (rename may fail across devices)
				await fs.copyFile(tmpFilePath, fileSavePath); // added
				await fs.unlink(tmpFilePath).catch(() => { }); // added - remove temp file
				// deleted: await fs.writeFile(fileSavePath, file.buffer);
				scheduleFileDeletion(fileSavePath);
			}
		} catch (processingError) {
			// On any processing error, attempt to cleanup any temp files created by multer
			await cleanupTempFiles(req.files); // added
			throw processingError; // rethrow to be caught by outer catch
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
		// Ensure temp files cleaned up if available
		await cleanupTempFiles(req.files).catch(() => { }); // added (best-effort)
		res.status(500).json({
			message: `Can't save file : ${error.message || error}`,
			success: false
		});
	}
};

module.exports = uploadFile;
