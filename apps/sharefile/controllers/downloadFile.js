const fs = require('fs').promises;
const path = require('path');
const { storeDir, tempStore } = require('../utils/constants');
const scheduleDirDeletion = require('../utils/deleteDir');
const getFilename = require('../utils/getFilename');

/**
 * Check file existence
 */
const fileExists = async (path) => {
	try {
		await fs.access(path);
		return true;
	} catch {
		return false;
	}
};

/**
 * When a file is requested, the file is copied from
 * 'sharefile/storage' to public storage 'sharefile/public/tempStore'
 * and the link of the file is returned.
 * The public storage folder will be deleted after some time.
 */
const downloadFile = async (req, res) => {

	try {
		// Basic error checkings
		// If hosts are different, prevent download
		const ref = req.headers.origin || req.headers.referer;
		if (ref) {
			let clientHost;
			try {
				clientHost = new URL(ref).host;      // e.g. "localhost:3000"
			} catch (e) {
				// malformed URL – you can decide to reject or ignore
				const err = new Error(`Invalid Origin/Referer header: ${ref}`);
				err.code = 400;
				throw err;
			}

			const serverHost = req.get('host');    // e.g. "localhost:3001"

			if (clientHost !== serverHost) {
				const err = new Error(`Client (${clientHost}) does not match Server (${serverHost})`);
				err.code = 403;
				throw err;
			}
		} else {
			const err = new Error(`No Origin/Referer header provided ${(req.headers).toString()}`);
			err.code = 400;
			throw err;
		}

		const filename = req?.params?.filename || null;

		if (!filename) {
			const error = new Error('No filename provided in request');
			error.code = 400;
			throw error;
		}

		const filePath = path.join(storeDir, filename);

		if (!await fileExists(filePath)) {
			const error = new Error(`File '${filename}' doesn't exist`);
			error.code = 404;
			throw error;
		}

		// Main logic starts
		await fs.mkdir(tempStore, { recursive: true });
		await fs.copyFile(filePath, path.join(tempStore, filename));

		const deleteAfter = 10 * 60 * 1000;

		scheduleDirDeletion(tempStore, deleteAfter); // Delete after 10 minutes

		res.status(200).json({
			message: 'File ready for download',
			filename: getFilename(filename),
			expires: (new Date(Date.now() + deleteAfter)).toLocaleTimeString(),
			success: true
		});

	} catch (error) {
		res.status(error.code || 500).json({
			message: error.message,
			success: false
		});
	}
};

module.exports = downloadFile;