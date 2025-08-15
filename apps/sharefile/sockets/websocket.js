const path = require('path');
const WebSocket = require('ws');
const chokidar = require('chokidar');

const dirToWatch = path.join(__dirname, '../storage');

module.exports = (server) => {
	const wss = new WebSocket.Server({ server });

	// Heartbeat interval (ms)
	const HEARTBEAT_INTERVAL = 30000;
	let heartbeatInterval;

	// Setup file watcher
	const watcher = chokidar.watch(dirToWatch, {
		ignoreInitial: true,
		persistent: true
	});

	// Broadcast helper
	const broadcast = (eventType, filePath) => {
		const filename = path.basename(filePath);
		const payload = JSON.stringify({ type: 'fileChange', event: eventType, file: filename });

		wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				try {
					client.send(payload);
				} catch (err) {
					// Protect server from send errors (client may have closed between check and send)
					console.error('Error sending payload to client:', err);
				}
			}
		});
	};

	// Chokidar events -> broadcast
	watcher
		.on('add', filePath => broadcast('add', filePath))
		.on('change', filePath => broadcast('change', filePath))
		.on('unlink', filePath => broadcast('unlink', filePath))
		.on('error', error => console.error('Watcher error:', error));

	// Helper: graceful per-connection close with optional code & reason
	const closeClient = (ws, code = 1000, reason = 'normal closure') => {
		if (ws.readyState === WebSocket.OPEN) {
			try {
				ws.close(code, reason);
			} catch (err) {
				// If close fails, terminate
				ws.terminate();
			}
		}
	}

	// On new connection
	wss.on('connection', (ws, req) => {
		// Optional: store client metadata
		ws.metadata = {
			ip: req.socket.remoteAddress,
			connectedAt: Date.now()
		};

		console.log(`Client connected    | ${ws.metadata.ip} | ${new Date(ws.metadata.connectedAt)
			.toLocaleString('en-IN', { hourCycle: 'h23' })}`);


		// Mark as alive for heartbeat
		ws.isAlive = true;
		ws.on('pong', () => {
			ws.isAlive = true;
		});

		// Send initial message
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({ type: 'init', message: 'Connected to WebSocket server' }));
		}

		// Message handler (handle client requests)
		ws.on('message', (data, isBinary) => {
			let message = data;
			if (!isBinary) {
				// try to parse JSON, fall back to raw string
				try {
					message = JSON.parse(data);
				} catch (e) {
					message = data.toString();
				}
			}

			// Example: client requests a clean close
			if (typeof message === 'object' && message?.type === 'closeRequest') {
				// client requested server-initiated close (optional)
				closeClient(ws, 1000, 'client requested close');
				return;
			}

			// Handle other message types here
			// e.g. { type: 'ping' }, or subscription requests, etc.
			// console.log('Received message from client:', message);
		});

		// Per-connection error handler
		ws.on('error', (err) => {
			console.error('WebSocket error for client', ws.metadata?.ip, err);
		});

		// Per-connection close handler
		ws.on('close', (code, reason) => {
			// Cleanup per-connection resources here (timers, maps, etc.)
			console.log(`Client disconnected | ${ws.metadata?.ip || ''} | ${new Date().toLocaleString('en-IN', { hourCycle: 'h23' })} | code=${code}`, reason.length ? `| reason=${reason?.toString()}` : '');
			// If you keep a Map of clients or subscriptions, remove them here.
		});
	});

	// Server-wide heartbeat to remove dead/half-open connections
	const startHeartbeat = () => {
		heartbeatInterval = setInterval(() => {
			wss.clients.forEach(ws => {
				if (ws.isAlive === false) {
					// No pong received since last ping => terminate
					console.log('Terminating dead client');
					return ws.terminate();
				}
				ws.isAlive = false;
				try {
					ws.ping(() => { }); // ping and wait for pong handler to set isAlive
				} catch (err) {
					console.error('Ping failed, terminating client:', err);
					ws.terminate();
				}
			});
		}, HEARTBEAT_INTERVAL);
	}

	function stopHeartbeat() {
		if (heartbeatInterval) {
			clearInterval(heartbeatInterval);
			heartbeatInterval = null;
		}
	}

	// When the WebSocket server itself closes
	wss.on('close', () => {
		console.log('WebSocket server closed');
		// watcher and heartbeat should be closed/stopped by cleanup below too
	});

	// Graceful cleanup when the parent HTTP server closes
	server.on('close', () => {
		console.log('HTTP server closing — cleaning up WebSocket server and watcher');
		try {
			// close file watcher
			watcher.close().catch(() => { });
		} catch (e) { /* ignore */ }

		// close wss (this will trigger 'close' on wss)
		try {
			wss.clients.forEach(client => {
				// ask clients to close gracefully
				if (client.readyState === WebSocket.OPEN) {
					client.close(1001, 'server shutting down'); // 1001 = going away
				}
			});
			wss.close();
		} catch (e) { /* ignore */ }

		// stop heartbeat
		stopHeartbeat();
	});

	// Optional: also cleanup on process exit signals (useful in dev)
	const onProcessExit = () => {
		try {
			watcher.close().catch(() => { });
		} catch (e) { }
		try { wss.close(); } catch (e) { }
		stopHeartbeat();
		// do NOT call process.exit() here — let the host decide
	};
	process.on('SIGINT', onProcessExit);
	process.on('SIGTERM', onProcessExit);

	// Start heartbeat loop
	startHeartbeat();

	// Return an object if caller wants handles (optional)
	return {
		wss,
		watcher,
		cleanup: () => {
			try { watcher.close().catch(() => { }); } catch (e) { }
			try { wss.close(); } catch (e) { }
			stopHeartbeat();
		}
	};
};
