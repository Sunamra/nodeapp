const fs = require('fs/promises'); // Same as `require('fs').promises`
const path = require('path');
const { storeDir } = require('../utils/constants');
const { extractTitleAndContent, formatResponse_All } = require('../utils');

module.exports = async (_, res) => {
	res.type('text');

	try {
		const files = await fs.readdir(storeDir, 'utf-8');

		const separatedData = [];
		for (const file of files) {
			// Read file content
			const data = await fs.readFile(path.join(storeDir, file), 'utf-8');

			// Separate title & content from file data and store in a array
			separatedData.push(extractTitleAndContent(data, file));
		}

		// Send final data
		res.status(200).send(formatResponse_All(separatedData));

	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
};

/**
 * @TODO 
 * 1. Single file fetch
 * 2. Error handling
 * 3. Clean up
 */