const fs = require('fs').promises;
const path = require('path');
const { storeDir } = require('../utils/constants.js')
const getTimestamp = require('../utils/getTimestamp.js')
const getFilename = require('../utils/getFilename.js')


const getFileList = async (_, res) => {
	try {
		fs.mkdir(storeDir, { recursive: true });

		const files = await fs.readdir(storeDir);
		const fileList = [];

		for (const file of files) {
			const fullPath = path.join(storeDir, file);
			const stat = await fs.stat(fullPath);

			if (stat.isFile()) {
				fileList.push({
					name: getFilename(file),
					serverName: file,
					size: stat.size,
					created: getTimestamp(file),
					modified: new Date(stat.mtime).getTime()
				});
				// console.log(file, " file ", new Date(getTimestamp(file)).toLocaleString(), ", mtime ", new Date(new Date(stat.mtime).getTime()).toLocaleString());

			}
		}

		res.status(200).json({
			message: 'Files fetched successfully',
			files: fileList,
			success: true
		});
	} catch (error) {
		res.status(500).json({
			message: `Can't get files : ${error.message || error}`,
			success: false
		});
	}
}

module.exports = getFileList;