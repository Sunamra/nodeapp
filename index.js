const express = require('express');
const path = require('path');
const cors = require('cors');

const rootRouter = require('./root/routes');
const pasteRouter = require('./paste/routes');

const port = 3000;
const app = express();
app.use(cors());

// Disable headers
app.disable('etag');

// For JSON payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serving static files from /paste/public
app.use('/paste', express.static(path.join(__dirname, './paste/public/')));

app.use('/', rootRouter);
app.use('/paste', pasteRouter);

// Global 404 fallback
app.use((req, res) => {
	if (/chrome|firefox|safari|edge|opera|msie|trident/i.test(req?.headers['user-agent'] || '')) {
		res.status(404).sendFile(path.join(__dirname, './paste/public/404 Not Found.html'));
	} else {
		res.status(404).send('404 Not Found');
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

/**
 * 		@TODO
 *   1. Add demo paths for /
 *   2. Create controller functions for /
 */