const fs = require('fs');
const path = require('path');
const { rootLogDir } = require('../utils/constants');

const writeLog = (req, timestamp) => {

	const log = `${(new Date(timestamp)).toLocaleString('en-IN', {
		hour12: false,
	})}  -  ${req.ip}  -  ${req.method} ${req.url} ${(req.protocol).toUpperCase()}/${req.httpVersion}  -  ${req.headers['user-agent']}\n`;

	fs.appendFile(path.join(rootLogDir, 'access.log'), log, (err) => {
		if (err) console.error('Logging error :', err);
	});

	// console.log(log);
};

module.exports = (req, _, next) => {

	fs.mkdir(rootLogDir, { recursive: true });
	writeLog(req, Date.now());
	next();
};