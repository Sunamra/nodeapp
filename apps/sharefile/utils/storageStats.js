const fs = require('fs');
const path = require('path');

const storageStats = (dirPath) => {
	const files = fs.readdirSync(dirPath, { withFileTypes: true });
	let count = 0, totalSize = 0;

	for (const file of files) {
		if (file.isFile()) {
			const { size } = fs.statSync(path.join(dirPath, file.name));
			totalSize += size;
			count++;
		}
	}

	return { count, size: totalSize };
};

module.exports = storageStats;