const router = require('express').Router();
const { getAll, getSingle } = require('../controllers');
const { logRequest } = require('../middleware');

router.route('/').get(logRequest, getAll);
router.route('/:file').get(logRequest, getSingle);


// Temporary, not part of the project
router.route('/videotools').get((_, res) => {
	res.redirect('https://www.dropbox.com/scl/fi/8x9gn69ja0ah4lsv37rct/VideoTools.zip?rlkey=gi7bubvd8aapjue6g8togy6he');
});

module.exports = router;