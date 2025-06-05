const { listAllFiles } = require('../utils');

module.exports = async (_, res) => {
	try {
		res.type('text');
		res.status(200).send(await listAllFiles());
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
}