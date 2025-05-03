const fs = require('fs');
const { setDirDeleteTimeout, getDirDeleteTimeout } = require('./constants');

/**
 * Deletes a directory (empty or non-empty)
 * @param {string} dirPath - Path to the directory
 * @returns {Promise<void>}
 */
function deleteDirectory(dirPath, delay = 2 * 60 * 60 * 1000) { // Delete dir after 2 hours

	const existingTimeout = getDirDeleteTimeout();

	if (existingTimeout) {
		clearTimeout(existingTimeout);
		setDirDeleteTimeout(undefined);
	}

	const timeout = setTimeout(() => {
		try {
			fs.rmSync(dirPath, { recursive: true, force: true });
			console.log(`${(new Date()).toLocaleString()}  Directory deleted: ${dirPath}`);
		} catch (err) {
			console.error(`${(new Date()).toLocaleString()}  Failed to delete directory ${dirPath}:`, err.message);
		}
	}, delay);

	setDirDeleteTimeout(timeout);
}

module.exports = deleteDirectory;
