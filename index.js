const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');


const pasteRouter = require('./paste/routes');
const rootRouter = require('./root/routes');

const port = 3000;
const app = express();

// Disable headers
app.disable('etag');

// For JSON payloads
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ extended: true , limit: '10mb' }));

app.use(cors());

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
