const path = require('path');

module.exports = (req, res) => {
	if (/chrome|firefox|safari|edge|opera|msie|trident/i.test(req?.headers['user-agent'] || '')) {
		res.status(404).sendFile(path.join(__dirname, '../../public/404-Not-Found.html'));
	} else {
		res.status(404).send('404 Not Found');
	}
};