const router = require('express').Router();

router.route('/').get((_, res) => {
	res.type('text');
	res.status(200).send('Hello from Express');
});

router.route('/videotools').get((_, res) => {
	res.redirect('https://www.dropbox.com/scl/fi/8x9gn69ja0ah4lsv37rct/VideoTools.zip?rlkey=gi7bubvd8aapjue6g8togy6he');
});

module.exports = router;