const express = require('express');
const router = express.Router();

router.route('/').post((req, res) => {
	res.type('text');
	req.on('data', chunk => {
		// Discard the chunk
	});

	req.on('end', () => {
		res.status(200).send('Data Fully Received\n');
	});

	// res.send('ok\n');

});

module.exports = router;

// Upload using curl : 
// curl -X POST -F "file=@<file.ext>" sunamra.in/apps/upload/ -o nul
// N.B. Using `-o nul` is must to show progress.
