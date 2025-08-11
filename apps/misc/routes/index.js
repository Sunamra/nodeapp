const router = require('express').Router();
const { discardUpload, diskinfo, launchShell } = require('../controllers');

// #region /api/upload
router.route('/upload').get((_, res) => {
	res.type('text').send(`
To upload use:
    curl -X POST -F "file=@<file.ext>" sunamra.in/api/upload/ -o nul\n`);
});

router.route('/upload').post(discardUpload);
// #endregion

// #region /api/diskinfo
router.route('/diskinfo').get(diskinfo);
// #endregion


// #region /api/shell
router.route('/shell').get(launchShell);
// #endregion

module.exports = router;


