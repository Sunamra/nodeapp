const multer = require('multer');

const errorHandler = (err, _, res, next) => {
	if (err instanceof multer.MulterError) {
		// Multer-specific errors
		return res.status(400).json({
			message: err.message,
			success: false

		});
	} else if (err) {
		// Other/unexpected errors
		console.error(err);

		return res.status(500).json({
			message: err.message || err || 'Internal Server Error',
			success: false
		});
	}
	next(); // If no error, move on
};

module.exports = errorHandler;
