const express = require('express');
const path = require('path');
const cors = require('cors');

const port = Number(process.argv.slice(2)[0]) || 3000;
const app = express();
// Exporting specifically for apps/misc/controllers/launchShell.js
module.exports = app; 

app.use(cors());

// Disable header
app.disable('etag');
// Show original client’s address in `req.ip` (for GCP deploy)
// app.set('trust proxy', true);

// For JSON payloads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Import site routers
const rootRouter = require('./apps/root/routes');
const pasteRouter = require('./apps/paste/routes');
const sharefileRouter = require('./apps/sharefile/routes');
const miscRouter = require('./apps/misc/routes');

// const diskinfoRouter = require('./apps/details/routes');

// Only express.static serve*
app.use('/static-assets/', express.static(path.join(__dirname, './public')));

// Serving static files
app.use('/', rootRouter);
/**
 * No static serve for '/' as it is intended to work as API.
*/
app.use('/apps/paste', express.static(path.join(__dirname, './apps/paste/public/')));
app.use('/apps/paste', pasteRouter);
app.use('/apps/sharefile', express.static(path.join(__dirname, './apps/sharefile/public/')));
app.use('/apps/sharefile', sharefileRouter);

// Miscellaneous APIs
app.use('/api', miscRouter);


// Global error handler
app.use(require('./common/middleware/errorHandler'));

// Global 404 fallback
app.use((req, res) => {
	if (/chrome|firefox|safari|edge|opera|msie|trident/i.test(req?.headers['user-agent'] || '')) {
		res.status(404).sendFile(path.join(__dirname, './public/404 Not Found.html'));
	} else {
		res.status(404).send('404 Not Found');
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

/**
 * @ToDo
 * 1. Set access-control-allow-origin to *
 * 2. Remove unnecessary routes like diskinfo
 * 3. Check file size before uploading
 * 4. 
 */