const path = require('path');
const {storeDir} = require('../utils/constants');

const downloadFile = (req, res) => {
	let filename = "";

	try {
		filename = req?.params?.filename;

		res.download(path.join(storeDir, filename), (err) => {
			if (err) {
				res.status(404).json({
					message: `File '${filename} not found'`,
					success: false
				});
			}
		});
	} catch (error) {
		res.status(500).json({
			message: error.message || error,
			success: false
		});
	}
}

module.exports = downloadFile;