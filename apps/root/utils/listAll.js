const fs = require('fs/promises');
const path = require('path');
const { storeDir } = require('./constants');
const extractTitleAndContent = require('./extractTitleAndContent');

module.exports = async () => {
	const files = await fs.readdir(storeDir, 'utf-8');

	let result = '\n';

	for await (const [index, file] of files.entries()) {
		const fileData = await fs.readFile(path.join(storeDir, file), 'utf-8');
		const fileTitle = extractTitleAndContent(fileData).title;
		result += `${index + 1}) ${fileTitle}\n`;
	}

	return result;
};