const router = require('express').Router();
const path = require('path');
// const { getAll, getFileList, getFile } = require('../controllers');
// const { logRequest } = require('../middleware');

router.route('/').get((req, res) => {
	if (/chrome|firefox|safari|edge|opera|msie|trident/i.test(req?.headers['user-agent'] || '')) {
		res.sendFile(path.join(__dirname, '../public/index.html'));
	} else {
		res.type('text').send('Hello there!');
	}
});
// router.route('/').get(logRequest, getFileList);
// router.route('/:file').get(logRequest, getFile);

module.exports = router;