const express = require('express');
const path = require('path');
const { execSync } = require('child_process');
const WebSocket = require('ws');

// Configuration
const PORT = 3001; // changed from 3000 to avoid collision
const HOST = '127.0.0.1';

// Module-scoped singletons to avoid multiple servers / leaks
let serverInstance = null;
let wssInstance = null;
let started = false;
let installing = false;

// app2 kept local and isolated to avoid mutating main app
const app2 = express();

function cleanupServer() {
	try { if (wssInstance) { wssInstance.clients.forEach((c) => { try { c.terminate(); } catch (e) { } }); wssInstance.close(); wssInstance = null; } } catch (e) { }
	try { if (serverInstance) { serverInstance.close(); serverInstance = null; } } catch (e) { }
	started = false;
}

function launchShell(req, res) {
	// This implementation binds to HOST (may be 0.0.0.0) and uses module-level singletons
	try {
		if (process.platform === 'win32') {
			res.status(500).send('<pre>ERROR: node-pty is not supported on Windows.</pre>');
			return;
		}

		if (started) {
			res.setHeader('Content-Type', 'text/html');
			res.write(`<pre>Shell server already started on http://${HOST}:${PORT}</pre>`);
			res.end();
			return;
		}

		// Ensure we don't race multiple installs/starts
		if (installing) {
			res.setHeader('Content-Type', 'text/html');
			res.write('<pre>Installation in progress, please try again shortly.</pre>');
			res.end();
			return;
		}

		installing = true;

		// Safely require-or-install ws and node-pty. Use require.resolve to check availability.
		let pty;
		try {
			try {
				// require.resolve('node-pty');
				pty = require('node-pty');
			} catch (err) {
				throw new Error(err.message);
			}
		} catch (err) {
			installing = false;
			// If install fails, make sure nothing is left open
			cleanupServer();
			res.status(500).send(`<pre>ERROR during install: ${err.message}</pre>`);
			return;
		}

		// Create server and websocket server (singleton)
		const http = require('http');
		serverInstance = http.createServer(app2);

		wssInstance = new WebSocket.Server({ noServer: true });

		// Wire the server upgrade to the WebSocket server (no network restriction here)
		serverInstance.on('upgrade', (upgradeReq, socket, head) => {
			wssInstance.handleUpgrade(upgradeReq, socket, head, (ws) => {
				wssInstance.emit('connection', ws, upgradeReq);
			});
		});

		// Serve the client from ../client/index.html on app2 root
		app2.get('/', (req_, res_) => {
			res_.sendFile(path.join(__dirname, '../client/index.html'));
		});

		// Connection handler
		wssInstance.on('connection', (ws, connectionReq) => {
			ws.send('[DEBUG] New WebSocket client connected.');

			const shell = process.env.SHELL || '/bin/sh';
			let ptyProcess;
			let cleaned = false;

			function cleanupConnection() {
				if (cleaned) return;
				cleaned = true;
				try { if (ptyProcess) { try { ptyProcess.kill(); } catch (e) { } ptyProcess = null; } } catch (e) { }
				try { if (ws && ws.readyState === WebSocket.OPEN) ws.close(); } catch (e) { }
			}

			try {
				ptyProcess = pty.spawn(shell, [], {
					name: 'xterm-256color',
					cols: 80,
					rows: 24,
					cwd: process.env.HOME || process.cwd(),
					env: process.env,
				});
			} catch (err) {
				try {
					ws.send(`[ERROR] Failed to spawn shell: ${err.message}
`);
				} catch (e) { }
				cleanupConnection();
				return;
			}

			ptyProcess.on('data', (data) => {
				if (ws.readyState === WebSocket.OPEN) ws.send(data);
			});

			ws.on('message', (msg) => {
				// Try parse JSON for control messages; otherwise treat as raw
				let parsed = null;
				if (typeof msg === 'string') {
					try { parsed = JSON.parse(msg); } catch (e) { parsed = null; }
				}

				if (parsed && parsed.type === 'resize') {
					const cols = Number(parsed.cols);
					const rows = Number(parsed.rows);
					// validate
					if (!Number.isInteger(cols) || !Number.isInteger(rows) || cols <= 0 || rows <= 0 || cols > 2000 || rows > 2000) {
						try {
							if (ws.readyState === WebSocket.OPEN) ws.send('[ERROR] Invalid resize parameters.');
						} catch (e) { }
						return;
					}
					try { ptyProcess.resize(cols, rows); } catch (e) {
						try {
							ws.send('[ERROR] Resize failed.');
						} catch (_) { }
					}
				} else {
					// raw input — forward to PTY
					try { ptyProcess.write(msg); } catch (e) {
						try {
							ws.send('[ERROR] Write to PTY failed.');
						} catch (_) { }
					}
				}
			});

			ws.on('close', () => {
				cleanupConnection();
			});

			ws.on('error', () => {
				cleanupConnection();
			});

			ptyProcess.on('exit', (code) => {
				try {
					if (ws.readyState === WebSocket.OPEN) ws.send(`[DEBUG] Shell exited with code ${code}
`);
				} catch (e) { }
				cleanupConnection();
			});

			ptyProcess.on('error', (err) => {
				try {
					if (ws.readyState === WebSocket.OPEN) ws.send(`[ERROR] PTY error: ${err.message}
`);
				} catch (e) { }
				cleanupConnection();
			});
		});

		// Start listening bound to HOST
		serverInstance.listen(PORT, HOST, () => {
			started = true;
			installing = false;
			res.setHeader('Content-Type', 'text/html');
			res.write(`<pre>Shell server started on http://${HOST}:${PORT}</pre>`);
			res.end();
		});

		serverInstance.on('error', (err) => {
			installing = false;
			cleanupServer();
			try { res.status(500).send(`<pre>Server error: ${err.message}</pre>`); } catch (_) { }
		});

		// ensure process exit cleans up
		process.once('exit', cleanupServer);

	} catch (err) {
		installing = false;
		cleanupServer();
		try { res.status(500).send(`<pre>ERROR: ${err.message}</pre>`); } catch (_) { }
	}
}

module.exports = launchShell;
