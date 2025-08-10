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
		// Determine root base ("/" for Linux/Mac, drive letters for Windows)
		let roots;
		if (os.platform() === 'win32') {
			// Get all mounted drives (simplified)
			roots = fs.readdirSync('A:/../').filter(d => /[A-Z]:/.test(d)); // may need adjustment for full drive detection
		} else {
			roots = fs.readdirSync('/', { withFileTypes: true })
				.filter(dirent => dirent.isDirectory())
				.map(dirent => '/' + dirent.name);
			roots.unshift('/'); // Ensure root "/" is included
		}

		// Build result array with each root's size info
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

		const result = {
			roots: rootInfo
		};

		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));
	} catch (err) {
		res.statusCode = 500;
		res.end(JSON.stringify({ error: err.message }));
	}
}
);

module.exports = router;