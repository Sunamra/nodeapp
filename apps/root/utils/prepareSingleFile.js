const fs = require('fs/promises');
const path = require('path');
const { storeDir } = require('../utils/constants');
const formatResponse_Single = require('./helpers/formatResponse_Single');
const extractTitleAndContent = require('./helpers/extractTitleAndContent');

module.exports = async (fileID) => {
	let fileData;
	try {
		fileData = await fs.readFile(path.join(storeDir, fileID), 'utf-8');
	} catch {
		// File doesn't exist
		return null;
	}

	return formatResponse_Single(extractTitleAndContent(fileData));
};