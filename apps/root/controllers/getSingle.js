const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const { storeDir } = require('../utils/constants');
const { listAll, extractTitleAndContent, formatResponse_Single } = require('../utils');

const usage =
	'\n' +
	'%s -> This feature isn\'t implemented yet. :(\n' +
	'Try \'dir\' to list all available contents.\n';

module.exports = async (req, res) => {
	try {
		res.type('text');

		const fileID = req.params?.file || undefined;

		// Feature handling
		if (String(fileID).startsWith(':')) {

			switch (fileID) {
				case ':dir':
					return res.status(200).send(await listAll());

				default:
					return res.status(501).send(util.format(usage, fileID.slice(1)));
			}
		}

		// Return file content
		let fileData;
		try {
			fileData = await fs.readFile(path.join(storeDir, fileID), 'utf-8');
		} catch {
			return res.status(404).send('\nRequested file doesn\'t exist\n');
		}

		res.send(formatResponse_Single(extractTitleAndContent(fileData)));

	} catch (error) {
		res.status(500).send('Internal Server Error');

	}
};