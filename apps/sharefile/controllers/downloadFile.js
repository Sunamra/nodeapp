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
}

/**
 * When a file is requested, the file is copied from
 * 'sharefile/storage' to public storage 'sharefile/public/tempStore'
 * and the link of the file is returned.
 * The public storage folder will be deleted after some time.
 */
const downloadFile = async (req, res) => {
	let filename = "";
	console.log(req.headers);

	try {
		// If hosts are different, prevent download
		const clientHost = req.headers.origin || req.headers.referer || null;
		const serverHost = `${req.protocol}://${req.get('host')}`;

		console.log(clientHost, serverHost);
		if (clientHost && !clientHost.startsWith(serverHost)) {
			const error = new Error(`Client (${clientHost}) does not match Server (${serverHost})`)
			error.code = 403
			throw error;
		}



		filename = req?.params?.filename || null;

		if (!filename) {
			const error = new Error("No filename provided in request");
			error.code = 400;
			throw error;
		}

		const filePath = path.join(storeDir, filename);

		if (!await fileExists(filePath)) {
			const error = new Error(`File '${filename}' doesn't exist`);
			error.code = 404;
			throw error;
		}

		await fs.mkdir(tempStore, { recursive: true });
		await fs.copyFile(filePath, path.join(tempStore, filename));

		const deleteAfter = 5 * 60 * 1000;

		scheduleDirDeletion(tempStore, deleteAfter); // Delete after 5 minutes

		res.status(200).json({
			message: `File ready for download`,
			filename: getFilename(filename),
			expires: (new Date(Date.now() + deleteAfter)).toLocaleTimeString(),
			success: true
		});

	} catch (error) {
		res.status(error.code || 500).json({
			message: error.message || error,
			success: false
		});
	}
}

module.exports = downloadFile;