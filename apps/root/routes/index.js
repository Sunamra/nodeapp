const fs = require('fs');
const os = require('os');
const checkDiskSpace = require('check-disk-space');
const { execSync } = require('child_process');
const router = require('express').Router();
const { getAll, getFileList, getFile } = require('../controllers');
const { logRequest } = require('../middleware');

router.route('/').get(logRequest, getFileList);
router.route('/:file').get(logRequest, getFile);


// Temporary, not part of the project
router.route('/redirect/videotools').get((_, res) => {
	res.redirect('https://www.dropbox.com/scl/fi/8x9gn69ja0ah4lsv37rct/VideoTools.zip?rlkey=gi7bubvd8aapjue6g8togy6he');
});

router.route('/details/storage').get(async (_, res) => {
	try {
		let roots = [];

		if (os.platform() === 'win32') {
			// Detect drives on Windows via wmic
			try {
				const output = execSync('wmic logicaldisk get name', { encoding: 'utf8' });
				roots = output.split(/\r?\n/)
					.map(line => line.trim())
					.filter(line => /^[A-Z]:$/i.test(line));
			} catch { }
		} else {
			// On Linux/macOS, detect mount points from `df`
			try {
				const output = execSync('df --output=target', { encoding: 'utf8' });
				roots = output.split(/\r?\n/)
					.slice(1) // remove header
					.map(line => line.trim())
					.filter(line => line.startsWith('/'));
			} catch { }
		}

		// Remove duplicates
		roots = [...new Set(roots)];

		const rootInfo = [];
		for (const root of roots) {
			try {
				const space = await checkDiskSpace(root);
				rootInfo.push({
					path: root,
					total: space.size,
					free: space.free
				});
			} catch {
				// skip if cannot read disk space for path
			}
		}

		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ roots: rootInfo }));
	} catch (err) {
		res.statusCode = 500;
		res.end(JSON.stringify({ error: err.message }));
	}
}
);

module.exports = router;