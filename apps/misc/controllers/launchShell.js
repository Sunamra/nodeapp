const path = require('path');
const { execSync } = require('child_process');

function launchShell(req, res) {
	try {
		if (process.platform === 'win32') {
			res.status(500).send('<pre>ERROR: node-pty is not supported on Windows.</pre>');
			return;
		}

		// Try to auto-detect the Express app from the require cache
		let app;
		for (const modulePath of Object.keys(require.cache)) {
			const exported = require.cache[modulePath].exports;
			if (exported && typeof exported === 'function' && exported.name === 'app') {
				app = exported;
				break;
			}
			if (exported && exported.settings && exported._router) {
				// Looks like an Express app instance
				app = exported;
				break;
			}
		}
		if (!app) {
			throw new Error('Could not automatically locate the Express app instance.');
		}

		function installPackage(pkg) {
			try {
				res.write(`<pre>Installing ${pkg}...</pre>`);
				execSync(`npm install ${pkg}`, { stdio: 'ignore' });
				res.write(`<pre>${pkg} installation successful.</pre>`);
			} catch (err) {
				res.write(`<pre>Failed to install ${pkg}: ${err.message}</pre>`);
				throw err;
			}
		}

		let WebSocket, pty;
		try {
			WebSocket = require('ws');
		} catch (_) {
			installPackage('ws');
			WebSocket = require('ws');
		}

		try {
			pty = require('node-pty');
		} catch (_) {
			installPackage('node-pty');
			pty = require('node-pty');
		}

		const http = require('http');
		const server = http.createServer(app);
		const wss = new WebSocket.Server({ server });

		app.get('/', (req_, res_) => {
			res_.sendFile(path.join(__dirname, '../client/index.html'));
		});

		wss.on('connection', (ws) => {
			ws.send('[DEBUG] New WebSocket client connected.\n');

			const shell = '/bin/bash';
			const ptyProcess = pty.spawn(shell, [], {
				name: 'xterm-256color',
				cols: 80,
				rows: 24,
				cwd: process.env.HOME,
				env: process.env,
			});

			ptyProcess.on('data', (data) => {
				if (ws.readyState === ws.OPEN) ws.send(data);
			});

			ws.on('message', (msg) => {
				let parsed = null;
				try {
					parsed = JSON.parse(msg);
				} catch (e) {
					parsed = null;
				}

				if (parsed && parsed.type === 'resize') {
					ptyProcess.resize(parsed.cols, parsed.rows);
				} else {
					ptyProcess.write(msg);
				}
			});

			ws.on('close', () => {
				try { ptyProcess.kill(); } catch (_) { }
			});

			ptyProcess.on('exit', (code) => {
				if (ws.readyState === ws.OPEN) {
					ws.send(`[DEBUG] Shell exited with code ${code}\n`);
					ws.close();
				}
			});

			ptyProcess.on('error', (err) => {
				if (ws.readyState === ws.OPEN) {
					ws.send(`[ERROR] PTY error: ${err.message}\n`);
				}
			});
		});

		server.listen(3000, () => {
			res.write('<pre>Shell server started on port 3000</pre>');
			res.end();
		});

	} catch (err) {
		res.status(500).send(`<pre>ERROR: ${err.message}</pre>`);
	}
}

module.exports = launchShell;
