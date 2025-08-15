/**
 * Discard whatever is sent here
 */
module.exports = (req, res) => {
	res.type('text');
	req.on('data', chunk => {
		// Discard the chunk
	});

	req.on('end', () => {
		res.status(200).send('Data Fully Received\n');
	});

	// res.send('ok\n');

};
