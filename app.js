const express = require('express');
const path = require('path');

const app = express();

// Middleware
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

// Assets that are used by multiple client modules
app.use('/static-assets/', express.static(path.join(__dirname, './public')));

// Defining routes
app.use('/', rootRouter);
/**
 * No static serve for '/' as it is intended to work as API.
*/

/**
 * '/apps/paste' is still statocally served 'cuz doing so will need
 * the client scripts to be vastly modified.
 * This project was not initiated with the motive to serve
 * client file(s) using sendFile().
 * The '/apps/sharefile' client scripts were updated to be served
 * via sendFile() and that modification caused several coding
 * "rules to be broken".
 */
app.use('/apps/paste', express.static(path.join(__dirname, './apps/paste/public/')));
app.use('/apps/paste', pasteRouter);
app.use('/apps/sharefile', sharefileRouter);

// Miscellaneous APIs
app.use('/api', miscRouter);

// Global 404 fallback
app.use(require('./common/middleware/404Fallback'));

// Global error handler
app.use(require('./common/middleware/errorHandler'));

module.exports = app;
