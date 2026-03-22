const fs = require('fs/promises');
const path = require('path');
const constants = require('../utils/constants');
const formatResponse_Single = require('./helpers/formatResponse_Single');
const extractTitleAndContent = require('./helpers/extractTitleAndContent');

module.exports = async (fileID) => {
	let fileData;
	fileData = await fs.readFile(path.join(constants.storeDir, fileID), 'utf-8');

	// File is empty
	if (fileData.length == 0) {
		const err = new Error('File is empty');
		err.code = 'FILE_EMPTY';
		throw err;
	}

	return formatResponse_Single(extractTitleAndContent(fileData));
};