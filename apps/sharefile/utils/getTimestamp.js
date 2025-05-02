/**
 * Extracts Unix timestamp from a Unix timestamp added filename
 * @param {String} filename Filename that contains Unix timestamp at start
 * @returns Unix timestamp
 */
const getTimestamp = (filename) => {
	// First 13 characters are timestamps
	const timestamp = filename.slice(0, 13);
	return Number(timestamp);
}

module.exports = getTimestamp;