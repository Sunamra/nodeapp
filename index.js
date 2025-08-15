const express = require('express');
const path = require('path');
require('dotenv').config({ quiet: true });

const app = express();
const port = Number(process.argv.slice(2)[0]) || process.env.PORT || 3000;
app.use(require('cors')());

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

// Only express.static serve*
app.use('/static-assets/', express.static(path.join(__dirname, './public')));

// Defining routes
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

// Global 404 fallback
app.use(require('./common/middleware/404Fallback'));

// Global error handler
app.use(require('./common/middleware/errorHandler'));


app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

/**
 * @ToDo
 * 1. New sharefile/api/v1/storage-stats path
 *    to fetch storage rules before uploading file.
 * 2. If file(s) doesn't comply with rules, reject
 *    those files only.
 * 3. If number of files exceed, upload first
 *    valid number of files.
 */