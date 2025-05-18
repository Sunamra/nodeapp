const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

chalk.level = 1;

// Return raw text in a human readable format
// Not returning in JSON
module.exports = async (baseDir, res, userAgent) => {
	try {
		const isConsole = /curl|http|python|ruby|perl/i.test(userAgent);
		const isBrowser = /chrome|firefox|safari|edge|opera|msie|trident/i.test(userAgent);

		// Explicitly setting content-type
		res.type('text');

		const files = await fs.readdir(baseDir, 'utf-8');

		if (files.length === 0) {
			return res.status(200).send(
				isConsole ? chalk.yellowBright('Currently no file exists!') :
					isBrowser ? 'Currently no file exists!' : ''
			);
		}

		let result = '\n';

		for (const file of files) {
			try {
				const data = await fs.readFile(path.join(baseDir, file), 'utf-8');

				// For consoles
				if (isConsole) {
					result += ('\u2500'.repeat(51) + '\n');
					result += ('\n' + chalk.gray('\u2022') + ' ' + chalk.whiteBright.bold(file) + '\n\n');
					result += (data + '\n\n');
				}

				// For browsers
				else if (isBrowser) {
					res.type('html');
					result += ('&mdash;'.repeat(20) + '<br>');
					result += ('<br>\u2022 ' + `<b>${file}</b>` + '<br><br>');
					result += (data.replace(/\n/g, '<br>') + '<br><br>');
				}

				else {
					return res.status(403).send('User agent not supported. Try a different client/software.');
				}
			} catch (err) {
				return res.status(500).send(`Error reading file ${file}`);
			}
		}

		// After all files are processed
		if (isConsole) {
			result += ('\u2500'.repeat(24) + ' X ' + '\u2500'.repeat(24) + '\n');
		} else if (isBrowser) {
			result += ('&mdash;'.repeat(9) + '&nbsp;&nbsp;\u2717&nbsp;&nbsp;' + '&mdash;'.repeat(9) + '<br>');
		}

		res.status(200).send(result);

	} catch (err) {
		return res.status(500).send('Error listing files');
	}
};

