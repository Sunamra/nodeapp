const router = require('express').Router();
const path = require('path');
const { getFileList, getFile,changeCurrentStore } = require('../controllers');
// const { logRequest } = require('../middleware');

// router.route('/').get((req, res) => {
// 	if (/chrome|firefox|safari|edge|opera|msie|trident/i.test(req?.headers['user-agent'] || '')) {
// 		res.sendFile(path.join(__dirname, '../public/index.html'));
// 	} else {
// 		res.type('text').send('Hello there!');
// 	}
// });
// router.route('/').get(logRequest, getFileList);
// router.route('/:file').get(logRequest, getFile);


// --------------------------------------------------
//  Added 19-Mar-2026 for MCA 1st Sem Practical Exam
// --------------------------------------------------

router.route('/').get((req, res, next) => {
	if (/chrome|firefox|safari|edge|opera|msie|trident/i.test(req?.headers['user-agent'] || '')) {
		res.sendFile(path.join(__dirname, '../public/index.html'));
	} else {
		next();
	}
},
	getFileList);

router.route('/:file').get((req, res, next) => {
	if (/chrome|firefox|safari|edge|opera|msie|trident/i.test(req?.headers['user-agent'] || '')) {
		res.sendFile(path.join(__dirname, '../public/index.html'));
	} else {
		next();
	}
},
	getFile);

router.route('/changedir').post(changeCurrentStore);

module.exports = router;