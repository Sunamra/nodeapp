const fs = require('fs/promises'); // Same as `require('fs').promises`
const path = require('path');
const { storeDir } = require('../utils/constants');
const { extractTitleAndContent, formatResponse_All } = require('../utils');

module.exports = async (_, res) => {
	try {
		res.type('text');

		const files = await fs.readdir(storeDir, 'utf-8');

		if (files.length == 0) {
			return res.send('Currently no file exists');
		}

		const separatedData = [];
		for (const file of files) {
			// Read file content
			const data = await fs.readFile(path.join(storeDir, file), 'utf-8');

			// Separate title & content from each file data and store in a array
			separatedData.push(extractTitleAndContent(data, file));
		}

		// Respond formatted data
		res.send(formatResponse_All(separatedData));

	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
};