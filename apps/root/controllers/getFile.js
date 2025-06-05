const util = require('util');
const { prepareSingleFile, prepareAllFiles } = require('../utils');

const usage =
	'\n' +
	'%s -> This feature isn\'t implemented yet.\n' +
	'Try \'all\' to get all available contents.\n';

module.exports = async (req, res) => {
	try {
		res.type('text');

		const fileID = req.params?.file || undefined;

		// Feature handling
		if (fileID && String(fileID).startsWith(':')) {

			switch (fileID) {
				case ':all':
					return res.send(await prepareAllFiles());
				// break;

				default:
					return res.status(501).send(util.format(usage, fileID.slice(1)));
			}
		}

		let preparedContent = await prepareSingleFile(fileID);

		if (preparedContent === null) {
			return res.status(404).send('\nRequested file doesn\'t exist\n');
		}

		res.send(preparedContent);

	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
};