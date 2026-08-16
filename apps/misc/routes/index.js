const router = require('express').Router();
const { discardUpload, diskinfo, execCommand } = require('../controllers');

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


// #region /api/command
router.route('/execute').get(execCommand);
// #endregion

// #region /api/redirect
router.route('/redirect').get((_,res) => {
    const redirectURL = process.env.MISC_API_REDIRECT_URL || undefined;
    if(redirectURL) res.redirect(redirectURL);
    else res.status(500).type('text').send(`Redirect URL not set`);
});
// #endregion

module.exports = router;


