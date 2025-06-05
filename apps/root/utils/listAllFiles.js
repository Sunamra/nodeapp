const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const { storeDir } = require('./constants');
const extractTitleAndContent = require('./helpers/extractTitleAndContent');

module.exports = async () => {
	const files = await fs.readdir(storeDir, 'utf-8');

	let result = '\n';

	// Sort filenames numerically
	files.sort((a, b) => Number(a) - Number(b));

	// Read each file, fetch the title, return filename and
	// file title in `<filename>) <fileTitle>` format
	for (const [_, file] of files.entries()) {
		const fileData = await fs.readFile(path.join(storeDir, file), 'utf-8');
		const fileTitle = extractTitleAndContent(fileData).title;
		result += `${file.padStart(3)}) ${fileTitle}\n`;
	}

	return result;
};