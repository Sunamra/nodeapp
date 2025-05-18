const fs = require('fs');
const path = require('path');
const getAllFiles = require('./getAllFiles');
const storeDir = require('../utils/constants');

module.exports = (req, res) => {
	const fileID = req?.params?.id;

	// Handle request for all file access
	if (fileID == ':all') {
		return getAllFiles(storeDir, res, req?.headers['user-agent']);
	}

	// Return JSON for request of a single file
	fs.readFile(path.join(storeDir, fileID), 'utf-8', (err, data) => {

		if (err) {
			return res.status(404).json({
				message: 'File doesn\'t exist',
				success: false
			});
		}

		res.status(200).json({
			data: data,
			success: true
		});
	});
};

