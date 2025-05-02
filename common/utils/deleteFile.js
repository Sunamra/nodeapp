const fs = require('fs');

/**
 * Schedule a file deletion
 * @param {string} filePath - The file to delete
 * @param {number} delay - Time in ms after which the file gets deleted. Default time is 3 hours
 * @returns {void}
 */
function scheduleFileDeletion(filePath, delay = 3 * 60 * 60 * 1000) { // 3 hours
	setTimeout(() => {
		fs.unlink(filePath, (err) => {
			if (err) {
				console.error(`Failed to delete ${filePath}:`, err.message);
			} else {
				console.log(`File deleted: ${filePath}`);
			}
		});
	}, delay);
}

module.exports = scheduleFileDeletion;