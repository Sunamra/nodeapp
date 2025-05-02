/**
 * Extracts original filename from a Unix timestamp added filename
 * @param {String} filename Filename that contains Unix timestamp at start
 * @returns Original filename
 */
const getFilename = (filename) => {
	// First 13 characters are timestamps, and 1 dash
	const timestamp = filename.slice(14);
	return String(timestamp);
}

module.exports = getFilename;