const fs = require('fs').promises;
const path = require('path');
const { rootLogDir } = require('../utils/constants');

const writeLog = async (req, timestamp) => {

	await fs.mkdir(rootLogDir, { recursive: true })
		.catch(err => {
			console.error('Log directory creation error:', err);
		});

	const log = `${(new Date(timestamp)).toLocaleString('en-IN', {
		hourCycle: 'h23'
	})}  -  ${req.ip}  -  ${req.method} ${req.url} ${(req.protocol).toUpperCase()}/${req.httpVersion}  -  ${req.headers['user-agent']}\n`;

	await fs.appendFile(path.join(rootLogDir, 'access.log'), log)
		.catch(err => {
			console.error('Logging error:', err);
		});

	// console.log(log);
};

module.exports = (req, _, next) => {

	writeLog(req, Date.now());
	next();
};