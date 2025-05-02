const fs = require('fs');
const path = require('path');
const { storeDir } = require('../utils/constants');

const downloadFile = (req, res) => {
	let filename = "";


	try {
		filename = req?.params?.filename;
		const filePath = path.join(storeDir, filename);

		// Check if file exists first
		fs.access(filePath, fs.constants.F_OK, (accessErr) => {
			if (accessErr) {
				return res.status(404).json({
					message: `File '${filename} not found'`,
					success: false
				});
			}

			// Set headers to trigger download
			res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
			// res.setHeader('Content-Type', 'application/octet-stream');

			// Stream the file in chunks
			const stream = fs.createReadStream(filePath);
			stream.pipe(res);

			stream.on('error', () => {
				res.status(404).json({
					message: `File '${filename} not found'`,
					success: false
				});
			});
		});

	} catch (error) {
		res.status(500).json({
			message: error.message || error,
			success: false
		});
	}
}

module.exports = downloadFile;