const router = require('express').Router();
const { getAll, getFileList, getFile } = require('../controllers');
const { logRequest } = require('../middleware');

router.route('/').get(logRequest, getFileList);
router.route('/:file').get(logRequest, getFile);


// Temporary, not part of the project
router.route('/redirect/videotools').get((_, res) => {
	res.redirect('https://www.dropbox.com/scl/fi/8x9gn69ja0ah4lsv37rct/VideoTools.zip?rlkey=gi7bubvd8aapjue6g8togy6he');
});

module.exports = router;