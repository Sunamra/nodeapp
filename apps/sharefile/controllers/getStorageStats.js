// This file is different from ../utils/storageStats.js 'cus
// it works as a controller function where storageStats.js is
// a helper function for ./uploadFile.js

const fs = require('fs').promises;
const path = require('path');
const storageStats = require('../utils/storageStats');
const { storeDir, maxFileSize, maxFiles, maxTotalFiles, maxTotalSize } = require('../utils/constants');

module.exports = (_, res) => {
	try {
		const { count, size } = storageStats(storeDir);

		res.json({
			message: 'Storage stats fetched',
			stats: {
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
			},
			success: true
		});

	} catch (error) {
		res.status(500).json({
			message: error.message || 'Unable to calculate storage stats',
			success: false
		});
	}
};
