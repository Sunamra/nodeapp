const router = require('express').Router();
const { getAll } = require('../controllers');

// router.route('/').get((_, res) => {
// 	res.type('text');
// 	res.status(200).send('Hello from Express');
// });

router.route('/').get(getAll);


// Temporary, not part of the project
router.route('/videotools').get((_, res) => {
	res.redirect('https://www.dropbox.com/scl/fi/8x9gn69ja0ah4lsv37rct/VideoTools.zip?rlkey=gi7bubvd8aapjue6g8togy6he');
});

module.exports = router;