const fs = require('fs');
const path = require('path');
const { storeDir } = require('../utils/constants');

const downloadFile = (req, res) => {
	let filename = "";


	try {
		filename = req?.params?.filename;
		const filePath = path.join(storeDir, filename);

		// Check if file exists
		fs.stat(filePath, (err, stats) => {
			if (err || !stats.isFile()) {
				return res.status(404).json({
					message: `File '${filename} not found'`,
					success: false
				});
			}

			// Set headers
			res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
			res.setHeader('Content-Type', 'application/octet-stream');
			res.setHeader('Content-Length', stats.size);

			// Flush headers to client ASAP
			res.flushHeaders();

			// Stream the file
			const stream = fs.createReadStream(filePath);
			stream.pipe(res);

			stream.on('error', () => {
				res.status(404).json({
					message: `File '${filename} not found'`,
					success: false
				});
			});
		})

	} catch (error) {
		res.status(500).json({
			message: error.message || error,
			success: false
		});
	}
}

module.exports = downloadFile;