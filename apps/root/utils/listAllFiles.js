const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const constants = require('./constants');
const extractTitleAndContent = require('./helpers/extractTitleAndContent');

module.exports = async () => {
	const files = await fs.readdir(constants.storeDir, 'utf-8');

	let result = '\n';

	// Sort filenames numerically
	files.sort((a, b) => Number(a) - Number(b));

	// Read each file, fetch the title, return filename and
	// file title in `<filename>) <fileTitle>` format
	for (const [_, file] of files.entries()) {
		const fileData = await fs.readFile(path.join(constants.storeDir, file), 'utf-8');
		// Skip blank files
		if (fileData.length == 0) {
			continue;
		}
		const fileTitle = extractTitleAndContent(fileData).title;
		result += `${file.padStart(3)}) ${fileTitle}\n`;
	}

	return result;
};