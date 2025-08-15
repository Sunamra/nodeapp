const fs = require('fs');
const path = require('path');

/**
 * Calculates the number of files and the total size (in bytes) of all files in a directory.
 *
 * @param {string} dirPath - Absolute or relative path to the directory.
 * @returns {{ count: number, size: number }} Object containing:
 *   - `count`: Total number of files.
 *   - `size`: Combined size of all files in bytes.
 */
const storageStats = (dirPath) => {
	const files = fs.readdirSync(dirPath, { withFileTypes: true });
	let count = 0, totalSize = 0;

	for (const file of files) {
		if (file.isFile()) {
			const { size } = fs.statSync(path.join(dirPath, file.name));
			totalSize += size;
			count++;
		}
	}

	return { count, size: totalSize };
};

module.exports = storageStats;