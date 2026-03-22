const fs = require('fs/promises'); // Same as `require('fs').promises`
const path = require('path');
const constants = require('./constants');
const extractTitleAndContent = require('./helpers/extractTitleAndContent');
const formatResponse_All = require('./helpers/formatResponse_All');

module.exports = async () => {

	const files = await fs.readdir(constants.storeDir, 'utf-8');

	if (files.length == 0) {
		return res.send('Currently no file exists');
	}

	// Sort filenames numerically
	files.sort((a, b) => Number(a) - Number(b));

	const separatedData = [];
	for (const file of files) {
		// Read file content
		const data = await fs.readFile(path.join(constants.storeDir, file), 'utf-8');
		// Skip totally empty files
		if (data.length == 0) {
			continue;
		}
		// Separate title & content from each file data and store in a array
		separatedData.push(extractTitleAndContent(data, file));
	}

	// Final formatted data
	return formatResponse_All(separatedData);
};