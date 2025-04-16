const fs = require('fs').promises;
const path = require('path');
const storeDir = require('../utils/constants');
const scheduleFileDeletion = require('./deleteFile');

const saveToFile = async (req, res) => {
	try {
		const textContent = req?.body?.content;

		if (!textContent) {
			return res.status(400).json({
				message: 'Bad request',
				code: null,
				success: false
			});
		}

		// Generate a random filename between 100–999 that doesn't already exist
		let random;
		let i = 0;

		while (i < 999) {
			i++;
			random = Math.floor(Math.random() * 900) + 100;
			const filePath = path.join(storeDir, `${random}`);

			try {
				// Check if the file exists
				await fs.access(filePath);
				// If no error, file exists, so continue looping
			} catch {
				// File does not exist, break loop
				break;
			}
		}

		if (i >= 999) {
			throw new Error("Maximum iteration reached when generating filename");
		}

		const filePath = path.join(storeDir, `${random}`);

		// Write content to file
		await fs.appendFile(filePath, textContent);

		// Schedule it for deletion after 10 minutes
		scheduleFileDeletion(filePath, 10 * 60 * 1000);

		// Respond to client
		res.status(200).json({
			message: 'Posted',
			code: random,
			success: true
		});
	} catch (error) {
		// Handle unexpected errors
		res.status(500).json({
			message: error.message || 'Internal Server Error',
			code: null,
			success: false
		});
	}
};

module.exports = saveToFile;
