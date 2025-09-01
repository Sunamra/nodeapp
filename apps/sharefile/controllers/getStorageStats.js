// This file is different from ../utils/storageStats.js 'cuz
// it works as a controller function where storageStats.js is
// a helper function for ./uploadFile.js

const fs = require('fs').promises;
const path = require('path');
const storageStats = require('../utils/storageStats');
const { storeDir, maxFileSize, maxFiles, maxTotalFiles, maxTotalSize } = require('../utils/constants');

module.exports = async (_, res) => {
	try {

		await fs.mkdir(storeDir, { recursive: true }); // Make the dir in case it was not uploaded by git for being empty

		const { count, size } = storageStats(storeDir);

		res.json({
			message: 'Storage stats fetched',
			stats: ({
				rule: {
					maxFileSize,
					maxFiles,
					maxTotalFiles,
					maxTotalSize
				},
				current: {
					totalFiles: count,
					totalSize: size
				}
			}),
			success: true
		});

	} catch (error) {
		res.status(500).json({
			message: error.message || 'Unable to calculate storage stats',
			success: false
		});
	}
};
