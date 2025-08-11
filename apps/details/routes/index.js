const { exec } = require('child_process');
const path = require('path');


const router = require('express').Router();
const diskinfo = require("../controllers");

router.route('/details/storage').get(diskinfo);

router.route('/details/command').get((_, res) => {
	const parentDir = path.resolve(process.cwd(), '..');

	exec(`ls -AlhR ${parentDir}`, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
		if (error) {
			return res.status(500).send(`Error executing command: ${stderr || error.message}`);
		}
		res.type('text/plain').send(stdout);
	});
});



module.exports = router;