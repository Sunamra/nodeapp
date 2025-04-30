const fs = require('fs');

const getFileList = (req, res) => {
	res.status(200).json({
		message: `File Uploaded : ${req.file}`,
		success: true
	});
}

module.exports = getFileList;